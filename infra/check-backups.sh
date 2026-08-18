#!/usr/bin/env bash
#
# Vérifie qu'une sauvegarde Discourse récente existe bien sur R2.
#
# Discourse sait faire ses backups tout seul (Admin > Sauvegardes >
# sauvegardes automatiques). Ce que Discourse ne fait PAS : te prévenir
# quand elles ont silencieusement arrêté de partir. C'est le mode de
# panne classique — on découvre le problème le jour où on en a besoin.
#
# À poser en cron hebdomadaire sur une machine AUTRE que le VPS
# (ton poste, un runner GitHub Actions) : un script de vérification
# qui tourne sur la machine qu'il surveille ne sert à rien.
#
# Prérequis : awscli v2 configuré avec un profil R2.
#   aws configure --profile r2
#     access key / secret key R2, region = auto
#
# Usage :
#   ./check-backups.sh
#   ./check-backups.sh --max-age-hours 48
#
set -euo pipefail

BUCKET="${BACKUP_BUCKET:-atelierhifi-backups}"
ENDPOINT="${R2_ENDPOINT:?Définis R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com}"
PROFILE="${AWS_PROFILE:-r2}"
MAX_AGE_HOURS=36

while [ $# -gt 0 ]; do
  case "$1" in
    --max-age-hours) MAX_AGE_HOURS="$2"; shift 2 ;;
    *) echo "Option inconnue : $1" >&2; exit 2 ;;
  esac
done

echo "Bucket    : $BUCKET"
echo "Fraîcheur : < ${MAX_AGE_HOURS} h"
echo

LATEST=$(aws s3api list-objects-v2 \
  --profile "$PROFILE" \
  --endpoint-url "$ENDPOINT" \
  --bucket "$BUCKET" \
  --query 'sort_by(Contents, &LastModified)[-1].[Key,LastModified,Size]' \
  --output text 2>/dev/null || true)

if [ -z "$LATEST" ] || [ "$LATEST" = "None" ]; then
  echo "ÉCHEC : aucune sauvegarde trouvée dans $BUCKET."
  echo "Vérifie Admin > Sauvegardes > Journaux dans Discourse."
  exit 1
fi

KEY=$(echo "$LATEST" | cut -f1)
MODIFIED=$(echo "$LATEST" | cut -f2)
SIZE=$(echo "$LATEST" | cut -f3)

AGE_SECONDS=$(( $(date -u +%s) - $(date -u -d "$MODIFIED" +%s) ))
AGE_HOURS=$(( AGE_SECONDS / 3600 ))
SIZE_MB=$(( SIZE / 1024 / 1024 ))

echo "Dernière  : $KEY"
echo "Datée de  : ${AGE_HOURS} h"
echo "Taille    : ${SIZE_MB} Mo"
echo

FAIL=0

if [ "$AGE_HOURS" -gt "$MAX_AGE_HOURS" ]; then
  echo "ÉCHEC : sauvegarde trop ancienne (${AGE_HOURS} h > ${MAX_AGE_HOURS} h)."
  FAIL=1
fi

# Une sauvegarde de quelques Ko = un dump vide ou tronqué. Ça arrive quand
# Postgres refuse la connexion pendant le job : le fichier part quand même.
if [ "$SIZE_MB" -lt 1 ]; then
  echo "ÉCHEC : sauvegarde suspecte (${SIZE_MB} Mo). Dump probablement vide."
  FAIL=1
fi

if [ "$FAIL" -eq 0 ]; then
  echo "OK."
fi

# Rappel : une sauvegarde jamais restaurée n'est pas une sauvegarde.
# Restaure-la sur le staging Azure une fois par trimestre (RUNBOOK §8).
exit "$FAIL"
