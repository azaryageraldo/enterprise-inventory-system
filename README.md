# Enterprise Inventory & Financial Management System

Sistem manajemen inventaris dan keuangan perusahaan yang komprehensif, dirancang untuk mengelola stok, pengajuan pengeluaran, dan pelaporan keuangan dengan berbagai role pengguna.

## 🛠️ Tech Stack

- **Frontend**: React (TypeScript), Tailwind CSS, Vite
- **Backend**: Java Spring Boot, Hibernate/JPA
- **Database**: PostgreSQL

## 🚀 Fitur Utama

Sistem ini mendukung 5 role pengguna dengan hak akses spesifik:

### 1. Admin

- Manajemen Pengguna (Tambah, Ubah, Nonaktifkan, Reset Password)
- Pengaturan Hak Akses & Data Awal (Kategori, Satuan, Divisi)
- Konfigurasi Alur Persetujuan & Monitoring Log Aktivitas

### 2. Pegawai

- Kelola Data Barang (CRUD)
- Pencatatan Stok Masuk & Keluar
- Pengajuan Pengeluaran Dana

### 3. Atasan

- Persetujuan/Penolakan Pengajuan Pengeluaran
- Monitoring Stok & Laporan Ringkas

### 4. Keuangan

- Proses Pembayaran Pengajuan yang Disetujui
- Pencatatan Transaksi ke Buku Kas
- Pembuatan Laporan Keuangan (Harian, Bulanan, Per Divisi)

### 5. Pimpinan

- Akses Laporan Eksekutif (Stok, Pengeluaran, Grafik Ringkasan)

## 📦 Cara Menjalankan Project

### Prasyarat

- Node.js & NPM
- Java JDK 17+
- PostgreSQL (Buat database: `db_inventory`)

### 1. Backend Setup

1.  Pastikan Database `db_inventory` sudah dibuat.
2.  Konfigurasi password database di `backend/src/main/resources/application.properties`.
3.  Jalankan server:
    ```bash
    cd backend
    ./mvnw spring-boot:run
    ```
    Server berjalan di `http://localhost:8080`.

### 2. Frontend Setup

1.  Install dependencies dan jalankan development server:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    Aplikasi berjalan di `http://localhost:5173`.

## 📂 Struktur Project

- `/frontend` - Source code aplikasi web (React)
- `/backend` - Source code API server (Spring Boot)
