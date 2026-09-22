-- =============================================================================
-- Seed Data - Master Tables (NevBank)
-- Jalankan di Supabase SQL Editor
-- =============================================================================

-- ============================================
-- KATEGORI TRANSAKSI
-- ============================================
INSERT INTO "categories" ("name", "emoji", "color", "bg_color", "type") VALUES
  -- Pemasukan
  ('Gaji',           '💰', '#22c55e', '#f0fdf4', 'PEMASUKAN'),
  ('Freelance',      '💻', '#3b82f6', '#eff6ff', 'PEMASUKAN'),
  ('Bonus',          '🎉', '#eab308', '#fefce8', 'PEMASUKAN'),
  ('Investasi',      '📈', '#8b5cf6', '#f5f3ff', 'PEMASUKAN'),
  ('Hadiah',         '🎁', '#ec4899', '#fdf2f8', 'PEMASUKAN'),
  ('Penjualan',      '🛒', '#f97316', '#fff7ed', 'PEMASUKAN'),

  -- Pengeluaran
  ('Makanan',        '🍜', '#ef4444', '#fef2f2', 'PENGELUARAN'),
  ('Minuman',        '☕', '#f97316', '#fff7ed', 'PENGELUARAN'),
  ('Transportasi',   '🚗', '#3b82f6', '#eff6ff', 'PENGELUARAN'),
  ('Kuliah',         '🎓', '#8b5cf6', '#f5f3ff', 'PENGELUARAN'),
  ('Kost/Kontrakan', '🏠', '#06b6d4', '#ecfeff', 'PENGELUARAN'),
  ('Listrik & Air',  '💡', '#eab308', '#fefce8', 'PENGELUARAN'),
  ('Pulsa & Paket',  '📱', '#14b8a6', '#f0fdfa', 'PENGELUARAN'),
  ('Hiburan',        '🎮', '#ec4899', '#fdf2f8', 'PENGELUARAN'),
  ('Shopping',       '🛍️', '#f43f5e', '#fff1f2', 'PENGELUARAN'),
  ('Kesehatan',      '🏥', '#22c55e', '#f0fdf4', 'PENGELUARAN'),
  ('Olahraga',       '🏋️', '#6366f1', '#eef2ff', 'PENGELUARAN'),
  ('Donasi',         '🤲', '#0ea5e9', '#f0f9ff', 'PENGELUARAN'),
  ('Pajak',          '📋', '#64748b', '#f8fafc', 'PENGELUARAN'),
  ('Lainnya',        '📦', '#94a3b8', '#f1f5f9', 'PENGELUARAN');

-- ============================================
-- METODE PEMBAYARAN
-- ============================================
INSERT INTO "payment_methods" ("name", "type", "is_active") VALUES
  ('GoPay',          'E-Wallet',  true),
  ('OVO',            'E-Wallet',  true),
  ('ShopeePay',      'E-Wallet',  true),
  ('DANA',            'E-Wallet',  true),
  ('LinkAja',         'E-Wallet',  true),
  ('QRIS',            'QRIS',      true),
  ('BCA Transfer',    'Bank',      true),
  ('Mandiri Transfer','Bank',      true),
  ('BRI Transfer',    'Bank',      true),
  ('BNI Transfer',    'Bank',      true),
  ('BSI Transfer',    'Bank',      true),
  ('Tunai',           'Cash',      true),
  ('Kartu Kredit',    'Kartu',     true),
  ('Kartu Debit',     'Kartu',     true);
