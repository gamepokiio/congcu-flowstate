#!/bin/bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# scripts/setup-ssl.sh — Lấy SSL certificate từ Let's Encrypt
# Chạy sau khi domain đã trỏ về IP VPS
# Cách dùng: bash scripts/setup-ssl.sh yourdomain.com
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -e
DOMAIN=${1:-""}
EMAIL=${2:-""}

if [ -z "$DOMAIN" ]; then
  echo "❌ Cần truyền domain!"
  echo "   Cách dùng: bash scripts/setup-ssl.sh yourdomain.com your@email.com"
  exit 1
fi

if [ -z "$EMAIL" ]; then
  echo "❌ Cần truyền email để đăng ký Let\'s Encrypt!"
  echo "   Cách dùng: bash scripts/setup-ssl.sh yourdomain.com your@email.com"
  exit 1
fi

echo "🔒 Lấy SSL cho domain: $DOMAIN (email: $EMAIL)"

# ── Bước 1: Cập nhật nginx.conf với domain thực ──
echo "→ Cập nhật domain trong nginx config..."
sed -i "s/YOURDOMAIN.COM/$DOMAIN/g" nginx/conf.d/flowstate.conf
echo "✓ Domain updated: $DOMAIN"

# ── Bước 2: Khởi động nginx với HTTP (chỉ cần port 80 trước) ──
echo "→ Khởi động nginx (HTTP mode)..."

# Tạm thời dùng config đơn giản chỉ HTTP để verify domain
cat > /tmp/nginx-temp.conf << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    location / {
        return 200 'OK';
        add_header Content-Type text/plain;
    }
}
EOF

# Tạo volumes với đúng tên Docker Compose sẽ dùng (project name = flowstate)
# docker-compose.yml volumes: certbot_webroot, certbot_certs
# → Docker tạo: flowstate_certbot_webroot, flowstate_certbot_certs
docker volume create flowstate_certbot_webroot 2>/dev/null || true
docker volume create flowstate_certbot_certs 2>/dev/null || true

docker run -d --name nginx_temp \
  -p 80:80 \
  -v /tmp/nginx-temp.conf:/etc/nginx/conf.d/default.conf \
  -v flowstate_certbot_webroot:/var/www/certbot \
  nginx:alpine

sleep 3

# ── Bước 3: Lấy certificate ────────────────────────
echo "→ Lấy SSL certificate từ Let's Encrypt..."
docker run --rm \
  -v flowstate_certbot_certs:/etc/letsencrypt \
  -v flowstate_certbot_webroot:/var/www/certbot \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  -d $DOMAIN \
  -d www.$DOMAIN

# ── Bước 4: Dọn dẹp và khởi động thật ─────────────
docker stop nginx_temp && docker rm nginx_temp

echo ""
echo "✅ SSL certificate đã lấy thành công!"
echo ""
echo "Bước tiếp theo:"
echo "  bash scripts/deploy.sh   # Deploy với HTTPS"
