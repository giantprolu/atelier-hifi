# Runbook — mise en production

Ordre strict. Chaque étape suppose la précédente validée.
Compte environ 3 h de bout en bout, dont 30 min d'attente incompressible
(propagation DNS, bootstrap Discourse).

---

## 0. Avant de commencer

Le domaine est arrêté : **`atelierhifi.fr`**. Il est déjà câblé partout
dans le dépôt — `astro.config.mjs`, `robots.txt`, `app.yml`,
`.env.example`, `check-backups.sh`. Rien à remplacer.

Il reste à le **déposer** (§1). S'il s'avérait pris, un seul passage
suffit à tout rebasculer :

```bash
grep -rl 'atelierhifi' . | xargs sed -i 's/atelierhifi/AUTRE-DOMAINE/g'
```

Le nom respecte les contraintes qui comptent : prononçable au téléphone,
sans tiret, et sans marque déposée (Cabasse, Elipson, Focal…).

---

## 1. Domaine et DNS

1. Achète le domaine (Gandi, OVH, Porkbun).
2. Délègue les NS à Cloudflare (gratuit).
3. Crée les enregistrements :

| Type | Nom | Valeur | Proxy |
| --- | --- | --- | --- |
| A | `forum` | IP du VPS | **DNS only** (nuage gris) |
| CNAME | `@` | cible Vercel/Pages | Proxied |
| CNAME | `www` | cible Vercel/Pages | Proxied |
| CNAME | `cdn` | domaine public du bucket R2 | Proxied |

> **Le piège.** Le sous-domaine `forum` doit rester en **DNS only**.
> Si tu l'actives en proxy Cloudflare, le challenge HTTP-01 de Let's
> Encrypt échoue et le conteneur Discourse boucle au démarrage sans
> message explicite. C'est plusieurs heures de debug pour une case
> cochée.

---

## 2. Email transactionnel (Brevo)

À faire **avant** l'installation, pas après : sans SMTP fonctionnel,
personne ne peut créer de compte, pas même toi.

1. Compte Brevo, puis *Expéditeurs & domaines* → ajoute `atelierhifi.fr`.
2. Pose les enregistrements DKIM, SPF et DMARC fournis dans Cloudflare.
3. Attends la validation du domaine (quelques minutes à quelques heures).
4. Récupère le login et la clé SMTP dans *SMTP & API → SMTP*.

Le login SMTP n'est pas ton adresse de compte. C'est une valeur distincte
affichée dans cet écran.

---

## 3. Stockage objet (Cloudflare R2)

1. Crée deux buckets : `atelierhifi-uploads` et `atelierhifi-backups`.
2. Sur le bucket *uploads* : *Settings → Public access → Connect domain*,
   branche `cdn.atelierhifi.fr`.
3. Laisse le bucket *backups* strictement privé.
4. Crée un token API R2 en lecture/écriture, note la clé et le secret.
5. Note ton *Account ID* (visible dans l'URL du dashboard Cloudflare).

---

## 4. Provisionnement du VPS

Hetzner CAX21 (ARM64, 4 Go, 40 Go NVMe), image Ubuntu 24.04, datacenter
Falkenstein ou Nuremberg. Ajoute ta clé SSH à la création.

```bash
scp infra/setup-vps.sh root@<IP>:/tmp/
ssh root@<IP> 'bash /tmp/setup-vps.sh nathan'
```

Puis **avant de fermer la session root**, ouvre un second terminal et
vérifie que `ssh nathan@<IP>` fonctionne. Le script désactive le login
root : si ta clé n'a pas été recopiée, tu es dehors.

---

## 5. Installation de Discourse

```bash
ssh nathan@<IP>
sudo cp /chemin/app.yml /var/discourse/containers/app.yml
sudo nano /var/discourse/containers/app.yml   # remplace les REMPLACER_*
cd /var/discourse
sudo ./launcher bootstrap app                  # 10 à 20 min sur ARM
sudo ./launcher start app
```

Ne mets jamais les secrets réels dans le dépôt git. Le fichier versionné
garde les marqueurs `REMPLACER_*` ; seule la copie sur le serveur est
complétée.

---

## 6. Vérifier l'email — étape bloquante

```bash
cd /var/discourse
sudo ./launcher enter app
rails c
```

```ruby
TestMailer.send_test("ton.adresse@exemple.fr").deliver_now
```

Si le mail n'arrive pas, **arrête-toi ici** et corrige. Tout le reste est
inutile tant que ce point n'est pas réglé. Consulte
`/var/discourse/shared/standalone/log/rails/production.log`.

---

## 7. Configuration initiale

Dans l'interface d'admin :

- `login_required` → **activé** pendant toute la phase d'amorçage. Tu
  écris tes 30 premiers sujets à l'abri des regards et des crawlers.
- Locale et fuseau en français / Europe-Paris
- *Sauvegardes* → fréquence quotidienne, destination S3, 7 versions
- *Akismet* → renseigne la clé API
- Thème → pose `infra/theme-discourse/` (procédure dans son README).
  À faire avant d'écrire les 30 sujets : relire ses propres textes dans
  la typographie définitive évite de tout reprendre ensuite.
- Crée l'arborescence de catégories (voir `CATEGORIES.md`)

---

## 8. Sauvegardes — vérification externe

Configure `check-backups.sh` en cron hebdomadaire sur ton poste ou un
runner GitHub Actions. Pas sur le VPS : un vérificateur qui tombe avec la
machine qu'il surveille ne sert à rien.

Une fois par trimestre, restaure une sauvegarde sur le staging Azure.
Une sauvegarde jamais restaurée n'est pas une sauvegarde.

---

## 9. Ouverture publique

Uniquement quand les 30 sujets d'amorçage sont en ligne :

1. `login_required` → désactivé
2. Search Console : ajoute `forum.` **et** le domaine racine comme deux
   propriétés distinctes
3. Soumets les deux sitemaps (`/sitemap.xml` côté Discourse,
   `/sitemap-index.xml` côté Astro)
4. Croise les liens : chaque guide pointe vers son fil, chaque fil pointe
   vers son guide

---

## Exploitation courante

| Quand | Quoi |
| --- | --- |
| Hebdo | `./launcher rebuild app` si mise à jour dispo, après test sur staging |
| Hebdo | Vérifier les alertes de `check-backups.sh` |
| Mensuel | `docker system prune -a` — le disque se remplit d'images obsolètes |
| Trimestriel | Restauration de test sur le staging Azure |

En cas de 502 après un rebuild : neuf fois sur dix c'est l'OOM killer
pendant les migrations. Vérifie `swapon --show` et `dmesg | tail`.
