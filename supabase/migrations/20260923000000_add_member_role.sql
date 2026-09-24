-- Add 'member' to Role enum
-- Member role: default role for new users, can only access main menu (Dashboard, Keuangan, RAB, Laporan Keuangan)

ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'member' AFTER 'pemasaran';
