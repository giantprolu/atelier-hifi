#!/usr/bin/env bash
#
# Préparation d'un VPS Ubuntu 24.04 LTS pour Discourse.
# Testé sur Hetzner CAX21 (ARM64, 4 Go RAM, 40 Go NVMe).
#
# Usage (en root, sur le VPS fraîchement provisionné) :
#   bash setup-vps.sh nathan
#
# Ne fait PAS l'install Discourse : voir RUNBOOK.md §3.
#
set -euo pipefail

ADMIN_USER="${1:?Usage: setup-vps.sh <nom_utilisateur>}"

log() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }

log "Mise à jour du système"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get upgrade -y -qq

log "Paquets de base"
apt-get install -y -qq \
  curl git ufw fail2ban unattended-upgrades \
  ca-certificates gnupg lsb-release

log "Création de l'utilisateur $ADMIN_USER"
if ! id -u "$ADMIN_USER" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" "$ADMIN_USER"
  usermod -aG sudo "$ADMIN_USER"
  mkdir -p "/home/$ADMIN_USER/.ssh"
  # Recopie la clé SSH injectée par Hetzner sur le compte root
  if [ -f /root/.ssh/authorized_keys ]; then
    cp /root/.ssh/authorized_keys "/home/$ADMIN_USER/.ssh/"
  fi
  chown -R "$ADMIN_USER:$ADMIN_USER" "/home/$ADMIN_USER/.ssh"
  chmod 700 "/home/$ADMIN_USER/.ssh"
  chmod 600 "/home/$ADMIN_USER/.ssh/authorized_keys" 2>/dev/null || true
fi

log "Swap 4 Go"
# Discourse idle autour de 1,4-1,8 Go mais les jobs de rebuild d'images
# et les migrations font des pics. Sans swap, l'OOM killer tue Postgres
# au pire moment (pendant un ./launcher rebuild).
if ! swapon --show | grep -q '/swapfile'; then
  fallocate -l 4G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  # Swappiness bas : on veut le swap comme filet, pas comme usage courant.
  sysctl -w vm.swappiness=10
  echo 'vm.swappiness=10' > /etc/sysctl.d/99-swappiness.conf
fi

log "Pare-feu (UFW)"
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp   comment 'SSH'
ufw allow 80/tcp   comment 'HTTP - challenge Let'"'"'s Encrypt'
ufw allow 443/tcp  comment 'HTTPS'
ufw --force enable

log "Durcissement SSH"
sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl reload ssh

log "fail2ban"
systemctl enable --now fail2ban

log "Mises à jour de sécurité automatiques"
dpkg-reconfigure -f noninteractive unattended-upgrades

log "Docker"
if ! command -v docker >/dev/null 2>&1; then
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
    | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update -qq
  apt-get install -y -qq docker-ce docker-ce-cli containerd.io
fi
systemctl enable --now docker

log "Récupération de Discourse"
if [ ! -d /var/discourse ]; then
  git clone --depth 1 https://github.com/discourse/discourse_docker.git /var/discourse
fi

cat <<EOF

────────────────────────────────────────────────────────────
  Serveur prêt.

  Vérifie AVANT de continuer :
    - swapon --show      -> /swapfile 4G
    - ufw status         -> 22, 80, 443 ouverts
    - docker --version   -> présent

  Étape suivante : copier infra/app.yml dans
  /var/discourse/containers/app.yml, remplacer les secrets,
  puis  cd /var/discourse && ./launcher bootstrap app

  Ne coupe pas ta session SSH courante avant d'avoir vérifié
  que tu peux te reconnecter en tant que $ADMIN_USER.
────────────────────────────────────────────────────────────

EOF
