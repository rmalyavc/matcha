-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 07, 2018 at 10:44 AM
-- Server version: 5.7.21
-- PHP Version: 7.1.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `matcha`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(6) NOT NULL,
  `photo` int(6) NOT NULL,
  `author` int(6) NOT NULL,
  `text` varchar(400) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `photo`, `author`, `text`, `time`) VALUES
(2, 7, 4, 'Fire', '2018-11-07 16:57:38'),
(3, 7, 4, 'Test', '2018-11-07 17:08:56');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` int(6) NOT NULL,
  `photo_id` int(6) NOT NULL,
  `author` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `photo_id`, `author`) VALUES
(1, 1, 2),
(2, 2, 2),
(4, 9, 4),
(5, 7, 4);

-- --------------------------------------------------------

--
-- Table structure for table `photo`
--

CREATE TABLE `photo` (
  `id` int(6) NOT NULL,
  `user_id` int(6) NOT NULL,
  `url` varchar(255) NOT NULL,
  `avatar` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `photo`
--

INSERT INTO `photo` (`id`, `user_id`, `url`, `avatar`) VALUES
(1, 2, '/uploads/white_men/2018/11/3/48805039d2bbf8a9b09518bbade5ae78.jpeg', 0),
(2, 2, '/uploads/white_men/2018/11/3/454d3ed6d1b848819f01f88bc94ea67b.jpeg', 0),
(6, 4, '/uploads/root/2018/11/7/d44810af9f2f058a75a1ccb7ebe79e9f.jpeg', 1),
(7, 4, '/uploads/root/2018/11/7/8718a087c8036f4fb7568fe3867d7332.jpeg', 0),
(8, 4, '/uploads/root/2018/11/7/337c047f5916c9b7e13d62b4b415d1b7.jpeg', 0),
(9, 4, '/uploads/root/2018/11/7/f28d073d51b35ec7915207897598209f.jpeg', 0),
(10, 4, '/uploads/root/2018/11/7/88e527ec961e010719b716ebe9bf53d6.jpeg', 0),
(11, 4, '/uploads/root/2018/11/7/fb55c456b1fbc8bb10d3c3bb30e9c19a.jpeg', 0),
(12, 4, '/uploads/root/2018/11/7/9c43f9059fc86eca2e597718094b48d1.jpeg', 0),
(13, 4, '/uploads/root/2018/11/7/a6219a4e2bc57e8fdc5f1938fdd44e69.jpeg', 0),
(14, 4, '/uploads/root/2018/11/7/1955d0423acc6a3de351bb15381a5a3b.jpeg', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(6) NOT NULL,
  `login` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `about` varchar(500) DEFAULT NULL,
  `age` int(3) UNSIGNED DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `login`, `password`, `email`, `first_name`, `last_name`, `admin`, `active`, `about`, `age`, `gender`) VALUES
(2, 'white_men', 'sha256$31587c1a$1$8eb5df5ae1026bc28119893c5f16ff21357e87d40f5efb202cc61c86aeede679', 'white_men@bigmir.net', 'White', '', 1, 1, '', NULL, NULL),
(3, 'test1', 'sha256$d43c0e84$1$83d85884b539f918f401a8da14aff1c9acf5aa3554f15a0fc5a5d1d79d45b270', 'test1@example.com', NULL, NULL, 0, 1, NULL, NULL, NULL),
(4, 'root', 'sha256$3acf68e5$1$5125e220c378c94a1f5d419cf6f5a62cc1c3cfc763e0d965422fddcba5ce6bec', 'root@example.com', '', '', 1, 1, 'Won\'t say anything)', 29, 'Other');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `photo`
--
ALTER TABLE `photo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login` (`login`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `photo`
--
ALTER TABLE `photo`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
