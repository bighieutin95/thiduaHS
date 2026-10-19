-- 20231019_add_username_to_nguoidung.sql
ALTER TABLE td_nguoidung ADD COLUMN username VARCHAR(255) NOT NULL;
UPDATE td_nguoidung SET username = 'big_hieu' WHERE email = 'admin@thiduahs.com';
ALTER TABLE td_nguoidung ADD CONSTRAINT uq_nguoidung_username UNIQUE (username);
