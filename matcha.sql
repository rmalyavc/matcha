-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 06, 2018 at 11:32 AM
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
(3, 7, 4, 'Test', '2018-11-07 17:08:56'),
(5, 7, 4, 'fijewfjew9f9', '2018-11-10 16:53:50'),
(6, 8, 4, 'Test', '2018-11-15 15:46:33'),
(7, 8, 4, 'frogoreoagrk', '2018-11-19 16:41:28'),
(8, 8, 4, 'fwjifwjiejwf', '2018-11-22 18:42:38'),
(9, 12, 4, 'kdwokdwokdekw', '2018-11-27 18:36:45');

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE `friends` (
  `id1` int(6) NOT NULL,
  `id2` int(6) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `friends`
--

INSERT INTO `friends` (`id1`, `id2`, `active`) VALUES
(3, 2, 1),
(3, 4, 1);

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
(6, 7, 4),
(7, 14, 4),
(8, 10, 4),
(9, 8, 2),
(11, 12, 4);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `author` int(6) NOT NULL,
  `dest_user` int(6) DEFAULT NULL,
  `text` varchar(500) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `room_id` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `author`, `dest_user`, `text`, `time`, `room_id`) VALUES
(61, 3, NULL, 'Hi, white_men! How are you?', '2018-12-06 17:55:09', 7),
(62, 2, NULL, 'Hi test! I\'m great I\'ve just fixed this fucking bug!!!!', '2018-12-06 18:18:08', 7),
(63, 3, NULL, 'Oh! very well. Now create normal chat then. It should work on sockets! It\'s mandatory', '2018-12-06 18:43:14', 7),
(64, 3, NULL, 'This is test', '2018-12-06 18:47:56', 7),
(65, 3, NULL, 'One more test', '2018-12-06 18:48:13', 7),
(66, 3, NULL, 'Testing sockets', '2018-12-06 19:01:08', 7),
(67, 3, NULL, 'Sockets', '2018-12-06 19:01:43', 7),
(68, 3, NULL, 'This is a test', '2018-12-06 19:02:00', 7),
(69, 3, NULL, 'Chat', '2018-12-06 19:03:13', 7),
(70, 3, NULL, 'This is my chat!', '2018-12-06 19:03:38', 7),
(71, 3, NULL, 'Winter is coming', '2018-12-06 19:04:58', 7);

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
(2, 2, '/uploads/white_men/2018/11/3/454d3ed6d1b848819f01f88bc94ea67b.jpeg', 1),
(6, 4, '/uploads/root/2018/11/7/d44810af9f2f058a75a1ccb7ebe79e9f.jpeg', 1),
(7, 4, '/uploads/root/2018/11/7/8718a087c8036f4fb7568fe3867d7332.jpeg', 0),
(8, 4, '/uploads/root/2018/11/7/337c047f5916c9b7e13d62b4b415d1b7.jpeg', 0),
(9, 4, '/uploads/root/2018/11/7/f28d073d51b35ec7915207897598209f.jpeg', 0),
(10, 4, '/uploads/root/2018/11/7/88e527ec961e010719b716ebe9bf53d6.jpeg', 0),
(11, 4, '/uploads/root/2018/11/7/fb55c456b1fbc8bb10d3c3bb30e9c19a.jpeg', 0),
(12, 4, '/uploads/root/2018/11/7/9c43f9059fc86eca2e597718094b48d1.jpeg', 0),
(14, 4, '/uploads/root/2018/11/7/1955d0423acc6a3de351bb15381a5a3b.jpeg', 0),
(15, 3, '/uploads/test1/2018/11/15/fb6a792d8db5a5ba763a1dd6cd0527d8.jpeg', 1),
(16, 3, '/uploads/test1/2018/11/15/d0b53c2eec81b7c5ff1ef3f195be9417.jpeg', 0),
(17, 5, '/uploads/Stanly/2018/11/15/119ffdb79a6a4bff6ee585efc8a99797.jpeg', 0),
(18, 6, '/uploads/Roman/2018/11/15/257ee8b97c5400a85aa8f24ab51f048d.jpeg', 1),
(19, 6, '/uploads/Roman/2018/11/15/cad088c6ec17bb7eba39067370b64df4.jpeg', 0);

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` int(6) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `private` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `active`, `private`) VALUES
(6, 1, 1),
(7, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `room_user`
--

CREATE TABLE `room_user` (
  `room_id` int(6) NOT NULL,
  `user_id` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `room_user`
--

INSERT INTO `room_user` (`room_id`, `user_id`) VALUES
(6, 4),
(6, 3),
(7, 2),
(7, 3);

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
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `orientation` enum('Heterosexual','Homosexual','Bisexual','Asexual','Other') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `login`, `password`, `email`, `first_name`, `last_name`, `admin`, `active`, `about`, `age`, `gender`, `orientation`) VALUES
(2, 'white_men', 'sha256$31587c1a$1$8eb5df5ae1026bc28119893c5f16ff21357e87d40f5efb202cc61c86aeede679', 'white_men@bigmir.net', 'Stanly', 'White', 1, 1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Excepteur sint occaecat cupidatat non proident oidento', 29, 'Male', 'Heterosexual'),
(3, 'test1', 'sha256$d43c0e84$1$83d85884b539f918f401a8da14aff1c9acf5aa3554f15a0fc5a5d1d79d45b270', 'test1@example.com', 'Testing', 'Tester', 0, 1, 'I am just a test user. I like testing very much)', NULL, 'Female', 'Other'),
(4, 'root', 'sha256$3acf68e5$1$5125e220c378c94a1f5d419cf6f5a62cc1c3cfc763e0d965422fddcba5ce6bec', 'root@example.com', '', '', 1, 1, 'Won\'t say anything)', 29, 'Male', 'Heterosexual'),
(5, 'Stanly', 'sha256$794be04a$1$b2772c8bafb16ea1e3ff510d0eba864fdb38a04bd4c303d2821ff00c923eec1a', 'test@example.com', NULL, NULL, 0, 1, NULL, NULL, NULL, NULL),
(6, 'Roman', 'sha256$28a129c9$1$7825ba9139a1b775c0bb1ab192742e4163983a3ada624d6de4f976fddd1d284c', 'roman@beakon.com.au', '', '', 0, 1, 'vaeuihuieahuivhuaevuuiavujiVJROVKWiokfkoFKEWk[peflkef0i0f3g o3gko 3 k35o k4o5 o54k o54k 45 ok45 oyko koy koky wwp05ti0i50it450i0 . 0i5 0i0yi0iy0i0irlfgkfkhos', NULL, 'Male', 'Heterosexual');

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
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `photo`
--
ALTER TABLE `photo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
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
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `photo`
--
ALTER TABLE `photo`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
