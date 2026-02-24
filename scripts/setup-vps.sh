#!/bin/bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# scripts/setup-vps.sh
# Chạy lần đầu trên VPS mới để cài đặt mọi thứ
# Cách dùng: bash setup-vps.sh
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -e  # Dừng ngay khi có lỗi

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
info() { echo -e "${BLUE}[i]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

echo ""
echo "🌿 FlowState VPS Setup Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── 1. Cập nhật hệ thống ────────────────────────────
info "Cập nhật system packages..."
apt-get update -qq && apt-get upgrade -y -qq
log "System updated"

# ── 2. Cài Docker ───────────────────────────────────
if ! command -v docker &> /dev/null; then
  info "Cài Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  rm get-docker.sh
  systemctl enable docker
  systemctl start docker
  log "Docker installed: $(docker --version)"
else
  log "Docker đã có: $(docker --version)"
fi

# ── 3. Cài Docker Compose ──────────────────────────
if ! command -v docker-compose &> /dev/null; then
  info "Cài Docker Compose..."
  curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
  log "Docker Compose installed: $(docker-compose --version)"
else
  log "Docker Compose đã có"
fi

# ── 4. Cài Git ──────────────────────────────────────
if ! command -v git &> /dev/null; then
  apt-get install -y git
fi
log "Git: $(git --version)"

# ── 5. Tường lửa (UFW) ─────────────────────────────
info "Cấu hình firewall..."
apt-get install -y ufw -qq
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh        # Port 22 — SSH
ufw allow http       # Port 80 — HTTP
ufw allow https      # Port 443 — HTTPS
ufw --force enable
log "Firewall configured (22, 80, 443)"

# ── 6. Tạo thư mục project ─────────────────────────
info "Tạo thư mục..."
mkdir -p /opt/flowstate
mkdir -p /opt/flowstate/backups
mkdir -p /opt/flowstate/logs
log "Directory /opt/flowstate created"

# ── 7. Tạo script backup tự động ──────────────────
cat > /opt/flowstate/backup.sh << 'BACKUP_SCRIPT'
#!/bin/bash
# Backup database hàng ngày
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="/opt/flowstate/backups/db_backup_$DATE.sql"

docker exec flowstate_db pg_dump -U flowstate flowstate > "$BACKUP_FILE"
gzip "$BACKUP_FILE"

# Giữ lại 7 ngày gần nhất
find /opt/flowstate/backups -name "*.gz" -mtime +7 -delete

echo "✓ Backup completed: ${BACKUP_FILE}.gz"
BACKUP_SCRIPT

chmod +x /opt/flowstate/backup.sh

# Cron job backup lúc 2am hàng ngày
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/flowstate/backup.sh >> /opt/flowstate/logs/backup.log 2>&1") | crontab -
log "Auto-backup scheduled (2am daily)"

# ── 8. Swap file (nếu VPS ít RAM) ─────────────────
RAM_MB=$(free -m | awk '/^Mem:/{print $2}')
if [ "$RAM_MB" -lt 2048 ]; then
  warn "RAM thấp ($RAM_MB MB) — Tạo 2GB swap..."
  if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
  fi
  log "Swap 2GB created"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "VPS setup hoàn thành!"
echo ""
echo "Bước tiếp theo:"
echo "  1. cd /opt/flowstate"
echo "  2. git clone https://github.com/YOUR_USERNAME/flowstate.git ."
echo "  3. cp .env.example .env && nano .env   # Điền thông tin"
echo "  4. bash scripts/deploy.sh              # Deploy!"
echo ""
