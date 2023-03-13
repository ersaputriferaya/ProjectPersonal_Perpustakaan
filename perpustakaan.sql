-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 26 Jan 2023 pada 04.03
-- Versi server: 10.4.24-MariaDB
-- Versi PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `perpustakaan`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `databuku`
--

CREATE TABLE `databuku` (
  `id_buku` int(11) NOT NULL,
  `judul_buku` varchar(255) NOT NULL,
  `jumlah_halaman_buku` varchar(100) NOT NULL,
  `keterangan_kondisi_buku` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `databuku`
--

INSERT INTO `databuku` (`id_buku`, `judul_buku`, `jumlah_halaman_buku`, `keterangan_kondisi_buku`) VALUES
(1, 'Buku Novel', '250 halaman', 'bagus'),
(3, 'Buku Cerita', '75 halaman', 'rusak');

-- --------------------------------------------------------

--
-- Struktur dari tabel `datasiswa`
--

CREATE TABLE `datasiswa` (
  `id_siswa` int(11) NOT NULL,
  `nama_siswa` varchar(250) NOT NULL,
  `kelas` varchar(100) NOT NULL,
  `noabsen` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `datasiswa`
--

INSERT INTO `datasiswa` (`id_siswa`, `nama_siswa`, `kelas`, `noabsen`) VALUES
(1, 'Ersa', 'XI RPL 8', '10'),
(3, 'yeyen', 'XI RPL 8', '36');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `databuku`
--
ALTER TABLE `databuku`
  ADD PRIMARY KEY (`id_buku`);

--
-- Indeks untuk tabel `datasiswa`
--
ALTER TABLE `datasiswa`
  ADD PRIMARY KEY (`id_siswa`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `databuku`
--
ALTER TABLE `databuku`
  MODIFY `id_buku` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `datasiswa`
--
ALTER TABLE `datasiswa`
  MODIFY `id_siswa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
