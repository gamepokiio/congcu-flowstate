#!/bin/bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# scripts/init-ssl.sh — Khởi tạo SSL lần đầu
# Chạy DUY NHẤT 1 lần khi deploy lần đầu tiên
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -e
cd /opt/flowstate

GREEN='\033[0;32m'; BLUE='\033[0;34m'; NC='\033[0m'
log()  { echo -e "${GREEN}[✓]${NC} $1"; }
info() { echo -e "${BLUE}[→]${NC} $1"; }

DOMAIN="congcu.co"
EMAIL="${ADMIN_EMAIL:-admin@congcu.co}"

echo ""
echo "🔒 FlowState SSL Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Bước 1: Tạo thư mục cần thiết ─────────────────
info "Tạo thư mục certbot..."
mkdir -p ./certbot/www
mkdir -p ./certbot/conf

# ── Bước 2: Chuyển sang config HTTP-only tạm thời ──
info "Kích hoạt Nginx HTTP-only tạm thời..."
cp nginx/conf.d/flowstate.conf nginx/conf.d/flowstate.conf.ssl-backup
cp nginx/conf.d/flowstate-init.conf nginx/conf.d/flowstate.conf

# ── Bước 3: Restart nginx để dùng config HTTP ──────
info "Restart Nginx (HTTP only)..."
docker compose up -d nginx
sleep 3

# Kiểm tra nginx hoạt động
if ! docker compose exec -T nginx nginx -t 2>/dev/null; then
  echo "❌ Nginx config lỗi!"
  # Khôi phục backup
  cp nginx/conf.d/flowstate.conf.ssl-backup nginx/conf.d/flowstate.conf
  exit 1
fi
log "Nginx HTTP đang chạy"

# ── Bước 4: Xin chứng chỉ SSL từ Let's Encrypt ────
info "Xin chứng chỉ SSL cho ${DOMAIN}..."
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "${EMAIL}" \
  --agree-tos \
  --no-eff-email \
  -d "${DOMAIN}" \
  -d "www.${DOMAIN}"

log "Chứng chỉ SSL đã được tạo!"

# ── Bước 5: Khôi phục config HTTPS đầy đủ ──────────
info "Kích hoạt Nginx HTTPS đầy đủ..."
cp nginx/conf.d/flowstate.conf.ssl-backup nginx/conf.d/flowstate.conf
rm -f nginx/conf.d/flowstate.conf.ssl-backup

# ── Bước 6: Restart nginx với SSL ──────────────────
docker compose restart nginx
sleep 3

# Kiểm tra
if docker compose exec -T nginx nginx -t 2>/dev/null; then
  log "Nginx HTTPS đang hoạt động!"
else
  echo "❌ Có lỗi với config SSL. Kiểm tra: docker compose logs nginx"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "🎉 SSL đã sẵn sàng! Truy cập https://${DOMAIN}"
echo ""
