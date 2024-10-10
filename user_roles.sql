-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 10, 2024 at 09:22 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `user_roles`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL,
  `reset_token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `reset_token`) VALUES
(1, 'dee@gmail.com', '$2a$08$oOqqfEtlEHkIMnG2XLIY4OxHBXiTFotD6OihoO1cMWgHozRdU2v4y', 'admin', NULL),
(3, 'nivi@gmail.com', '$2a$08$pl5htYSzkO3eTPU2zh7PJ.9ibaWLA/B/4a9FTuwhnE6rehX/2RDLq', 'user', NULL),
(4, 'deepika@gmail.com', '$2a$08$dCApVOZy0.GwO8RgIPkmZOlhbsiIhkEbGr1YniW4YddrwG/uVIxfy', 'user', NULL),
(5, 'deena@gmail.com', '$2a$08$Sn1HFlBUyJquuILGrcvkSelBwzdLO3YoKg8XXPL47QYxL7NuPxgga', 'user', NULL),
(6, 'deepikajan1401@gmail.com', '$2a$08$nZQ/EBn/3vd86qnm7.fkF.K/eILQoxRgeLmh3M4XXybMQXFgmdbMK', 'user', 'dc4f90cf2790a635ed8ca09c53b71b846686c5ca');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
