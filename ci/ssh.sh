DEPLOY_ENV="${DEPLOY_ENV:?DEPLOY_ENV is required}"
CONFIG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../config/env/$DEPLOY_ENV" && pwd)"

set -a
source "$CONFIG_DIR/deploy.env"
set +a

KEYFILE=/tmp/_deploy_key
SSH="ssh -i $KEYFILE -o StrictHostKeyChecking=no"
SCP="scp -i $KEYFILE -o StrictHostKeyChecking=no -r"
REMOTE="${DEPLOY_USER:?DEPLOY_USER is required}@${DEPLOY_HOST:?DEPLOY_HOST is required}"
