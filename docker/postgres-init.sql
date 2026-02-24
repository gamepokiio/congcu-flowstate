-- docker/postgres-init.sql
-- Chạy tự động khi PostgreSQL container khởi động lần đầu

-- Tạo extensions hữu ích
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Full-text search

-- Performance settings
ALTER SYSTEM SET max_connections = '100';
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
