-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 15, 2019 at 11:42 AM
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
-- Table structure for table `black_list`
--

CREATE TABLE `black_list` (
  `id` int(6) NOT NULL,
  `blocker` int(6) NOT NULL,
  `blocked` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
(9, 12, 4, 'kdwokdwokdekw', '2018-11-27 18:36:45'),
(10, 21, 4, 'Nice avatar you have)', '2019-02-15 18:28:07'),
(11, 21, 11, 'Agree)', '2019-02-15 18:28:31');

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
(6, 2, 1),
(4, 6, 1),
(2, 4, 1),
(11, 6, 1),
(13, 4, 1),
(13, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `hashtags`
--

CREATE TABLE `hashtags` (
  `id` int(10) NOT NULL,
  `name` varchar(30) NOT NULL,
  `user_id` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `hashtags`
--

INSERT INTO `hashtags` (`id`, `name`, `user_id`) VALUES
(2, '#TestTag', 6),
(3, '#NewHashTag', 4),
(4, '#HashTagIsWorkingNow', 4),
(5, '#oekgokr', 4),
(6, '#grlegplrglerg', 4),
(7, '#ekekkek', 4),
(8, '#NEWTAG', 4),
(10, '#ad', 4),
(17, '#igjfirgirjgigr', 4),
(18, '#rkkkgr', 4),
(19, '#TestTag', 4),
(20, '#NewHashTag', 2),
(21, '#NEWTAG', 2),
(22, '#TestTag', 2),
(24, '#fqeffeqfeqf', 2),
(25, '#HashTagIsWorkingNow', 2),
(26, '#fqeffeqfeqf', 4),
(27, '#likeme', 13);

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE `history` (
  `id` int(11) NOT NULL,
  `owner` int(6) NOT NULL,
  `visitor` int(6) NOT NULL,
  `type` enum('visit','request','block','remove') NOT NULL,
  `confirm` tinyint(1) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `history`
--

INSERT INTO `history` (`id`, `owner`, `visitor`, `type`, `confirm`, `time`, `reviewed`) VALUES
(1, 11, 4, 'visit', 0, '2019-02-13 18:24:17', 1),
(2, 4, 11, 'visit', 0, '2019-02-13 18:24:30', 1),
(3, 4, 11, 'visit', 0, '2019-02-13 18:24:39', 1),
(4, 4, 11, 'visit', 0, '2019-02-13 18:30:42', 1),
(5, 4, 11, 'visit', 0, '2019-02-13 18:33:17', 1),
(6, 4, 11, 'visit', 0, '2019-02-13 18:35:11', 1),
(7, 11, 4, 'request', 0, '2019-02-13 18:40:06', 1),
(8, 11, 4, 'request', 1, '2019-02-13 18:40:57', 1),
(9, 4, 11, 'visit', 0, '2019-02-13 18:44:53', 1),
(10, 4, 11, 'visit', 0, '2019-02-13 18:48:11', 1),
(11, 11, 4, 'request', 1, '2019-02-13 18:48:29', 1),
(12, 4, 11, 'visit', 0, '2019-02-13 18:48:46', 1),
(13, 4, 11, 'visit', 0, '2019-02-13 18:50:04', 1),
(14, 4, 11, 'visit', 0, '2019-02-13 18:50:32', 1),
(15, 11, 4, 'request', 1, '2019-02-13 18:50:51', 1),
(16, 4, 11, 'visit', 0, '2019-02-13 18:50:59', 1),
(17, 4, 11, 'visit', 0, '2019-02-13 18:52:11', 1),
(18, 11, 4, 'request', 1, '2019-02-13 18:52:22', 1),
(19, 4, 11, 'visit', 0, '2019-02-13 18:52:28', 1),
(20, 4, 11, 'remove', 0, '2019-02-13 18:52:33', 1),
(21, 4, 11, 'visit', 0, '2019-02-13 18:56:07', 1),
(22, 11, 4, 'request', 1, '2019-02-13 18:56:13', 1),
(23, 4, 11, 'visit', 0, '2019-02-13 18:56:24', 1),
(24, 4, 11, 'remove', 0, '2019-02-13 18:56:27', 1),
(25, 4, 11, 'visit', 0, '2019-02-13 18:56:43', 1),
(26, 11, 4, 'request', 0, '2019-02-13 18:56:53', 1),
(27, 4, 11, 'block', 0, '2019-02-13 18:57:06', 1),
(28, 4, 11, 'visit', 0, '2019-02-15 18:24:49', 1),
(29, 4, 11, 'visit', 0, '2019-02-15 18:26:07', 1),
(30, 11, 4, 'visit', 0, '2019-02-15 18:26:36', 1),
(31, 4, 11, 'request', 1, '2019-02-15 18:27:34', 1),
(32, 11, 4, 'visit', 0, '2019-02-15 18:27:50', 1),
(33, 4, 11, 'visit', 0, '2019-02-15 18:34:23', 1),
(34, 4, 11, 'remove', 0, '2019-02-15 18:34:30', 1),
(35, 11, 4, 'visit', 0, '2019-02-15 18:34:55', 1),
(36, 11, 4, 'block', 0, '2019-02-15 18:35:43', 1),
(37, 11, 4, 'visit', 0, '2019-02-15 18:35:56', 1),
(38, 4, 11, 'visit', 0, '2019-02-15 18:52:32', 1),
(39, 4, 11, 'visit', 0, '2019-02-15 18:52:39', 1),
(40, 4, 11, 'visit', 0, '2019-02-15 19:09:27', 1),
(41, 4, 11, 'visit', 0, '2019-02-15 19:10:16', 1),
(42, 11, 4, 'visit', 0, '2019-02-15 19:10:24', 1),
(43, 11, 4, 'visit', 0, '2019-02-15 19:17:12', 1),
(44, 4, 11, 'visit', 0, '2019-02-15 19:17:19', 1),
(45, 4, 2, 'visit', 0, '2019-02-15 19:17:45', 1);

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
(11, 12, 4),
(14, 15, 4),
(15, 21, 4),
(16, 21, 11);

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(6) NOT NULL,
  `user_id` int(6) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `approved` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `user_id`, `latitude`, `longitude`, `approved`) VALUES
(2, 12, 50.4642, 30.4665, 1),
(5, 5, 50.4642, 30.4665, 1),
(6, 4, 50.4242, 30.4242, 1),
(7, 11, 50.4642, 30.4665, 1),
(8, 13, 50.4684, 30.4519, 1);

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
(71, 3, NULL, 'Winter is coming', '2018-12-06 19:04:58', 7),
(72, 3, NULL, 'What will happen?', '2018-12-06 19:44:12', 7),
(73, 3, NULL, 'fkoekgokeokrgp4qr[glq[l[glq3[;g[3q;g34', '2018-12-06 19:44:53', 7),
(74, 3, NULL, 'cwmceimcTETETETTETETECYCBEHCBEBNUEKOPE', '2018-12-06 19:45:52', 7),
(75, 3, NULL, 'blabla', '2018-12-06 19:48:40', 7),
(76, 3, NULL, 'BLABLABLA', '2018-12-06 19:50:03', 7),
(77, 3, NULL, 'ETETETTETETECETETETTETETECETETETTETETECETETETTETETECETETETTETETECETETETTETETECETETETTETETECETETETTETETECETETETTETETECETETETTETETECETETETTETETECETETETTETETECETETETTETETECETETETTETETECETETETTETETECETETETTETETECETETETTETETECETETETTETETECETETETTETETECETETETTETETEC', '2018-12-06 19:50:26', 7),
(78, 3, NULL, 'Test', '2018-12-06 19:51:13', 7),
(79, 3, NULL, 'My test', '2018-12-06 19:51:50', 7),
(80, 3, NULL, 'rsetgrwhw5', '2018-12-06 19:52:25', 7),
(81, 2, NULL, 'Test', '2018-12-06 19:52:49', 7),
(82, 2, NULL, 'covmoerkogerrffr', '2018-12-06 19:53:05', 7),
(83, 3, NULL, 'egrgperlgperl', '2018-12-06 19:55:34', 7),
(84, 3, NULL, 'fefeprlfelrf', '2018-12-06 19:57:00', 7),
(85, 3, NULL, 'Try again', '2018-12-06 19:58:54', 7),
(86, 3, NULL, 'Please work! I want to go home!', '2018-12-06 20:00:49', 7),
(87, 3, NULL, 'Fuck', '2018-12-06 20:01:33', 7),
(88, 3, NULL, 'gergerg', '2018-12-06 20:03:47', 7),
(89, 3, NULL, 'ergpergperpger', '2018-12-06 20:04:33', 7),
(90, 4, NULL, 'This is a test', '2018-12-07 18:34:27', 6),
(91, 4, NULL, 'etgrtg', '2018-12-07 18:44:44', 6),
(92, 4, NULL, 'ttt', '2018-12-07 19:01:21', 6),
(93, 3, NULL, 'Hi root!', '2018-12-07 19:10:29', 6),
(94, 4, NULL, 'Hi, test! How are you?', '2018-12-07 19:11:37', 6),
(95, 3, NULL, 'This is test. Root should not get this message! Hahahaha!', '2018-12-07 19:12:29', 7),
(96, 3, NULL, 'Root should not get this message! Hahahaha!', '2018-12-07 19:13:54', 7),
(97, 3, NULL, 'My test', '2018-12-07 19:15:03', 7),
(98, 3, NULL, 'Hope this time i did everything right!', '2018-12-07 19:17:27', 7),
(99, 3, NULL, 'A', '2018-12-07 19:17:39', 6),
(100, 3, NULL, 'I\'m very well! I\'ve just send message to white_men, and you haven\'t got it!!! Ha-ha-ha! But you should get this message this time!', '2018-12-07 19:18:28', 6),
(101, 3, NULL, 'What\'s happening?', '2018-12-07 19:20:05', 6),
(102, 3, NULL, 'Root won\'t get this message.', '2018-12-07 19:20:29', 7),
(103, 3, NULL, 'everfgre', '2018-12-07 19:20:49', 7),
(104, 3, NULL, 'test', '2018-12-07 19:21:02', 6),
(105, 3, NULL, 'Do you see it?', '2018-12-07 19:26:27', 6),
(106, 4, NULL, 'Yeah! Hurrraaay!!!!!', '2018-12-07 19:26:44', 6),
(107, 4, NULL, 'Hi test', '2018-12-07 19:38:15', 6),
(108, 4, NULL, 'Hi there', '2018-12-07 19:39:04', 6),
(109, 4, NULL, 'Hi one more time!', '2018-12-07 19:39:54', 6),
(110, 4, NULL, 'You still don\'t see my messages?', '2018-12-07 19:41:42', 6),
(111, 4, NULL, 'Hi test! Now you should see it', '2018-12-07 19:47:03', 6),
(112, 2, NULL, 'Try me', '2018-12-07 19:47:36', 7),
(113, 2, NULL, 'again', '2018-12-07 19:47:38', 7),
(114, 2, NULL, 'Hahahahahaha', '2018-12-07 19:47:42', 7),
(115, 3, NULL, 'Hi white men!', '2018-12-10 17:35:33', 7),
(116, 2, NULL, 'Hi test1!', '2018-12-10 17:35:56', 7),
(117, 4, NULL, 'Hi Roman, test)', '2018-12-13 17:07:57', 9),
(118, 4, NULL, 'Hi Roman!', '2018-12-13 17:27:45', 8),
(119, 4, NULL, 'Hi test', '2018-12-13 17:28:14', 9),
(120, 4, NULL, 'Hi', '2018-12-13 17:29:06', 9),
(121, 4, NULL, 'Test', '2018-12-13 17:29:08', 9),
(122, 4, NULL, 'Test message', '2019-02-06 17:29:14', 13),
(123, 6, NULL, 'Hey root?', '2019-02-06 17:30:05', 13),
(124, 6, NULL, 'Is chat still working?', '2019-02-06 17:30:16', 13),
(125, 4, NULL, 'Almost', '2019-02-06 17:30:34', 13),
(126, 4, NULL, 'It posts my messages like I\'m not their autor =(', '2019-02-06 17:30:55', 13),
(127, 6, NULL, 'Same shit mate)', '2019-02-06 17:31:07', 13),
(128, 4, NULL, 'Test', '2019-02-06 17:32:24', 13),
(129, 6, NULL, 'Test', '2019-02-06 17:32:46', 13),
(130, 6, NULL, 'Now we are going to try and test this shit)', '2019-02-08 20:06:43', 13),
(131, 6, NULL, 'Try again)', '2019-02-08 20:06:59', 13),
(132, 4, NULL, 'This is a test', '2019-02-11 17:30:16', 6),
(133, 13, NULL, 'This is a test', '2019-02-11 18:03:36', 19),
(134, 3, NULL, 'Hey root', '2019-02-11 18:05:08', 6),
(135, 3, NULL, 'Let\'s try group chat', '2019-02-11 18:05:23', 20),
(136, 3, NULL, 'My test again)', '2019-02-11 18:05:56', 20),
(137, 3, NULL, 'Let\'s try one more test', '2019-02-11 18:06:02', 20),
(138, 3, NULL, 'It should work this time)', '2019-02-11 18:06:11', 20),
(139, 4, NULL, 'This is a test', '2019-02-11 18:07:56', 21),
(140, 4, NULL, 'Hey Girl, whats\'s new?', '2019-02-11 18:08:08', 21),
(141, 3, NULL, 'Ok, let\'s get it started', '2019-02-11 18:09:12', 20),
(142, 2, NULL, 'Hey Girl!', '2019-02-11 18:10:25', 21),
(143, 2, NULL, 'Glad to see ya)', '2019-02-11 18:10:31', 21),
(144, 13, NULL, 'I\'m very well!', '2019-02-11 18:11:19', 21),
(145, 13, NULL, 'Nice to meet you, guys)', '2019-02-11 18:11:29', 21),
(146, 13, NULL, 'What are your names?', '2019-02-11 18:11:42', 21),
(147, 2, NULL, 'Let\'s try to test live notifications', '2019-02-11 18:14:15', 21),
(148, 13, NULL, 'Wow! That\'s great! I saw the message from another page!', '2019-02-11 18:14:44', 21),
(149, 13, NULL, 'Really fantastic!', '2019-02-11 18:14:54', 21),
(150, 13, NULL, 'Awesome)', '2019-02-11 18:14:58', 21),
(151, 13, NULL, 'Let\'s try again. Seems to be some bug =(', '2019-02-11 18:15:45', 21),
(152, 2, NULL, 'It\'s ok but I\'m not sure what happened...', '2019-02-11 18:16:07', 21),
(153, 13, NULL, 'Ok, I think I see what\'s the problem', '2019-02-11 18:18:01', 21),
(154, 2, NULL, 'Yeah, me too)', '2019-02-11 18:18:24', 21),
(155, 2, NULL, 'solved', '2019-02-11 18:18:28', 21),
(156, 2, NULL, 'And now...', '2019-02-11 18:18:38', 21),
(157, 13, NULL, 'Wow! Owner messages style is fixed!', '2019-02-11 18:21:17', 21),
(158, 4, NULL, 'Wow, guys! You posted a lot of messages!', '2019-02-11 18:22:57', 21),
(159, 4, NULL, 'Don\'t flood here, I\'m admin!)', '2019-02-11 18:23:10', 21),
(160, 13, NULL, 'Aha, You still didn\'t implement block logic))', '2019-02-11 18:23:49', 21),
(161, 13, NULL, 'Hahahaha)', '2019-02-11 18:23:52', 21),
(162, 4, NULL, 'You got me =)', '2019-02-11 18:24:03', 21),
(163, 13, NULL, 'Test', '2019-02-11 18:36:21', 21),
(164, 4, NULL, 'This is a test', '2019-02-11 18:48:52', 21),
(165, 4, NULL, 'One more test', '2019-02-11 18:49:36', 6),
(166, 4, NULL, 'One more test', '2019-02-11 18:50:12', 21),
(167, 2, NULL, 'Ha ha! it worked', '2019-02-11 18:50:25', 21),
(168, 4, NULL, 'iweav', '2019-02-11 18:50:38', 21),
(169, 4, NULL, 'friwejfijer', '2019-02-11 18:50:39', 21),
(170, 4, NULL, 'ferwjfr8j8rjf3', '2019-02-11 18:50:41', 21),
(171, 4, NULL, 'cejiejwij', '2019-02-11 18:50:42', 21),
(172, 4, NULL, 'fprlpelrf', '2019-02-11 18:51:07', 15),
(173, 4, NULL, 'Hi, let\'s talk privately', '2019-02-11 18:51:17', 15),
(174, 4, NULL, 'HAHAHA', '2019-02-11 18:51:53', 21),
(175, 4, NULL, 'test', '2019-02-11 18:55:42', 21),
(176, 4, NULL, 'rest', '2019-02-11 18:55:43', 21),
(177, 4, NULL, 'one more', '2019-02-11 18:55:46', 21),
(178, 4, NULL, 'Test', '2019-02-11 18:59:45', 15),
(179, 4, NULL, 'This is a test', '2019-02-11 18:59:52', 21),
(180, 4, NULL, 'one more test', '2019-02-11 18:59:58', 21);

-- --------------------------------------------------------

--
-- Table structure for table `message_user`
--

CREATE TABLE `message_user` (
  `id` int(11) NOT NULL,
  `message_id` int(6) NOT NULL,
  `user_id` int(6) NOT NULL,
  `read_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `message_user`
--

INSERT INTO `message_user` (`id`, `message_id`, `user_id`, `read_date`) VALUES
(403, 90, 4, '2019-02-11 17:28:02'),
(404, 91, 4, '2019-02-11 17:28:02'),
(405, 92, 4, '2019-02-11 17:28:02'),
(406, 93, 4, '2019-02-11 17:28:02'),
(407, 94, 4, '2019-02-11 17:28:02'),
(408, 99, 4, '2019-02-11 17:28:02'),
(409, 100, 4, '2019-02-11 17:28:02'),
(410, 101, 4, '2019-02-11 17:28:02'),
(411, 104, 4, '2019-02-11 17:28:02'),
(412, 105, 4, '2019-02-11 17:28:02'),
(413, 106, 4, '2019-02-11 17:28:02'),
(414, 107, 4, '2019-02-11 17:28:02'),
(415, 108, 4, '2019-02-11 17:28:02'),
(416, 109, 4, '2019-02-11 17:28:02'),
(417, 110, 4, '2019-02-11 17:28:02'),
(418, 111, 4, '2019-02-11 17:28:02'),
(434, 132, 4, '2019-02-11 17:30:16'),
(435, 122, 4, '2019-02-11 17:43:26'),
(436, 123, 4, '2019-02-11 17:43:26'),
(437, 124, 4, '2019-02-11 17:43:26'),
(438, 125, 4, '2019-02-11 17:43:26'),
(439, 126, 4, '2019-02-11 17:43:26'),
(440, 127, 4, '2019-02-11 17:43:26'),
(441, 128, 4, '2019-02-11 17:43:26'),
(442, 129, 4, '2019-02-11 17:43:26'),
(443, 130, 4, '2019-02-11 17:43:26'),
(444, 131, 4, '2019-02-11 17:43:26'),
(450, 133, 13, '2019-02-11 18:03:36'),
(451, 90, 3, '2019-02-11 18:04:40'),
(452, 91, 3, '2019-02-11 18:04:40'),
(453, 92, 3, '2019-02-11 18:04:40'),
(454, 93, 3, '2019-02-11 18:04:40'),
(455, 94, 3, '2019-02-11 18:04:40'),
(456, 99, 3, '2019-02-11 18:04:40'),
(457, 100, 3, '2019-02-11 18:04:40'),
(458, 101, 3, '2019-02-11 18:04:40'),
(459, 104, 3, '2019-02-11 18:04:40'),
(460, 105, 3, '2019-02-11 18:04:40'),
(461, 106, 3, '2019-02-11 18:04:40'),
(462, 107, 3, '2019-02-11 18:04:40'),
(463, 108, 3, '2019-02-11 18:04:40'),
(464, 109, 3, '2019-02-11 18:04:40'),
(465, 110, 3, '2019-02-11 18:04:40'),
(466, 111, 3, '2019-02-11 18:04:40'),
(467, 132, 3, '2019-02-11 18:04:40'),
(482, 134, 3, '2019-02-11 18:05:08'),
(483, 135, 3, '2019-02-11 18:05:24'),
(484, 136, 3, '2019-02-11 18:05:56'),
(485, 137, 3, '2019-02-11 18:06:02'),
(486, 138, 3, '2019-02-11 18:06:11'),
(487, 133, 4, '2019-02-11 18:07:34'),
(488, 139, 4, '2019-02-11 18:07:56'),
(489, 140, 4, '2019-02-11 18:08:08'),
(490, 61, 3, '2019-02-11 18:08:49'),
(491, 62, 3, '2019-02-11 18:08:49'),
(492, 63, 3, '2019-02-11 18:08:49'),
(493, 64, 3, '2019-02-11 18:08:49'),
(494, 65, 3, '2019-02-11 18:08:49'),
(495, 66, 3, '2019-02-11 18:08:49'),
(496, 67, 3, '2019-02-11 18:08:49'),
(497, 68, 3, '2019-02-11 18:08:49'),
(498, 69, 3, '2019-02-11 18:08:49'),
(499, 70, 3, '2019-02-11 18:08:49'),
(500, 71, 3, '2019-02-11 18:08:49'),
(501, 72, 3, '2019-02-11 18:08:49'),
(502, 73, 3, '2019-02-11 18:08:49'),
(503, 74, 3, '2019-02-11 18:08:49'),
(504, 75, 3, '2019-02-11 18:08:49'),
(505, 76, 3, '2019-02-11 18:08:49'),
(506, 77, 3, '2019-02-11 18:08:49'),
(507, 78, 3, '2019-02-11 18:08:49'),
(508, 79, 3, '2019-02-11 18:08:49'),
(509, 80, 3, '2019-02-11 18:08:49'),
(510, 81, 3, '2019-02-11 18:08:49'),
(511, 82, 3, '2019-02-11 18:08:49'),
(512, 83, 3, '2019-02-11 18:08:49'),
(513, 84, 3, '2019-02-11 18:08:49'),
(514, 85, 3, '2019-02-11 18:08:49'),
(515, 86, 3, '2019-02-11 18:08:49'),
(516, 87, 3, '2019-02-11 18:08:49'),
(517, 88, 3, '2019-02-11 18:08:49'),
(518, 89, 3, '2019-02-11 18:08:49'),
(519, 95, 3, '2019-02-11 18:08:49'),
(520, 96, 3, '2019-02-11 18:08:49'),
(521, 97, 3, '2019-02-11 18:08:49'),
(522, 98, 3, '2019-02-11 18:08:49'),
(523, 102, 3, '2019-02-11 18:08:49'),
(524, 103, 3, '2019-02-11 18:08:49'),
(525, 112, 3, '2019-02-11 18:08:49'),
(526, 113, 3, '2019-02-11 18:08:49'),
(527, 114, 3, '2019-02-11 18:08:49'),
(528, 115, 3, '2019-02-11 18:08:49'),
(529, 116, 3, '2019-02-11 18:08:49'),
(553, 141, 3, '2019-02-11 18:09:12'),
(554, 135, 2, '2019-02-11 18:10:17'),
(555, 136, 2, '2019-02-11 18:10:17'),
(556, 137, 2, '2019-02-11 18:10:17'),
(557, 138, 2, '2019-02-11 18:10:17'),
(558, 141, 2, '2019-02-11 18:10:17'),
(561, 139, 2, '2019-02-11 18:10:19'),
(562, 140, 2, '2019-02-11 18:10:19'),
(564, 142, 2, '2019-02-11 18:10:25'),
(565, 143, 2, '2019-02-11 18:10:31'),
(566, 139, 13, '2019-02-11 18:10:58'),
(567, 140, 13, '2019-02-11 18:10:58'),
(568, 142, 13, '2019-02-11 18:10:58'),
(569, 143, 13, '2019-02-11 18:10:58'),
(573, 144, 2, '2019-02-11 18:11:19'),
(574, 144, 13, '2019-02-11 18:11:19'),
(575, 145, 13, '2019-02-11 18:11:29'),
(576, 145, 2, '2019-02-11 18:11:29'),
(577, 146, 13, '2019-02-11 18:11:42'),
(578, 146, 2, '2019-02-11 18:11:42'),
(579, 147, 2, '2019-02-11 18:14:15'),
(580, 147, 13, '2019-02-11 18:14:21'),
(581, 148, 13, '2019-02-11 18:14:44'),
(582, 148, 2, '2019-02-11 18:14:44'),
(583, 149, 13, '2019-02-11 18:14:54'),
(584, 149, 2, '2019-02-11 18:14:54'),
(585, 150, 13, '2019-02-11 18:14:58'),
(586, 150, 2, '2019-02-11 18:14:58'),
(587, 61, 2, '2019-02-11 18:15:05'),
(588, 62, 2, '2019-02-11 18:15:05'),
(589, 63, 2, '2019-02-11 18:15:05'),
(590, 64, 2, '2019-02-11 18:15:05'),
(591, 65, 2, '2019-02-11 18:15:05'),
(592, 66, 2, '2019-02-11 18:15:05'),
(593, 67, 2, '2019-02-11 18:15:05'),
(594, 68, 2, '2019-02-11 18:15:05'),
(595, 69, 2, '2019-02-11 18:15:05'),
(596, 70, 2, '2019-02-11 18:15:05'),
(597, 71, 2, '2019-02-11 18:15:05'),
(598, 72, 2, '2019-02-11 18:15:05'),
(599, 73, 2, '2019-02-11 18:15:05'),
(600, 74, 2, '2019-02-11 18:15:05'),
(601, 75, 2, '2019-02-11 18:15:05'),
(602, 76, 2, '2019-02-11 18:15:05'),
(603, 77, 2, '2019-02-11 18:15:05'),
(604, 78, 2, '2019-02-11 18:15:05'),
(605, 79, 2, '2019-02-11 18:15:05'),
(606, 80, 2, '2019-02-11 18:15:05'),
(607, 81, 2, '2019-02-11 18:15:05'),
(608, 82, 2, '2019-02-11 18:15:05'),
(609, 83, 2, '2019-02-11 18:15:05'),
(610, 84, 2, '2019-02-11 18:15:05'),
(611, 85, 2, '2019-02-11 18:15:05'),
(612, 86, 2, '2019-02-11 18:15:05'),
(613, 87, 2, '2019-02-11 18:15:05'),
(614, 88, 2, '2019-02-11 18:15:05'),
(615, 89, 2, '2019-02-11 18:15:05'),
(616, 95, 2, '2019-02-11 18:15:05'),
(617, 96, 2, '2019-02-11 18:15:05'),
(618, 97, 2, '2019-02-11 18:15:05'),
(619, 98, 2, '2019-02-11 18:15:05'),
(620, 102, 2, '2019-02-11 18:15:05'),
(621, 103, 2, '2019-02-11 18:15:05'),
(622, 112, 2, '2019-02-11 18:15:05'),
(623, 113, 2, '2019-02-11 18:15:05'),
(624, 114, 2, '2019-02-11 18:15:05'),
(625, 115, 2, '2019-02-11 18:15:05'),
(626, 116, 2, '2019-02-11 18:15:05'),
(650, 151, 13, '2019-02-11 18:15:45'),
(651, 151, 2, '2019-02-11 18:15:50'),
(652, 152, 2, '2019-02-11 18:16:08'),
(653, 152, 13, '2019-02-11 18:16:08'),
(654, 153, 13, '2019-02-11 18:18:01'),
(655, 153, 2, '2019-02-11 18:18:01'),
(656, 154, 2, '2019-02-11 18:18:24'),
(657, 154, 13, '2019-02-11 18:18:24'),
(658, 155, 2, '2019-02-11 18:18:28'),
(659, 155, 13, '2019-02-11 18:18:28'),
(660, 156, 2, '2019-02-11 18:18:38'),
(661, 156, 13, '2019-02-11 18:18:45'),
(662, 157, 13, '2019-02-11 18:21:17'),
(663, 157, 2, '2019-02-11 18:21:17'),
(664, 134, 4, '2019-02-11 18:21:48'),
(665, 135, 4, '2019-02-11 18:22:18'),
(666, 136, 4, '2019-02-11 18:22:18'),
(667, 137, 4, '2019-02-11 18:22:18'),
(668, 138, 4, '2019-02-11 18:22:18'),
(669, 141, 4, '2019-02-11 18:22:18'),
(672, 142, 4, '2019-02-11 18:22:38'),
(673, 143, 4, '2019-02-11 18:22:38'),
(674, 144, 4, '2019-02-11 18:22:38'),
(675, 145, 4, '2019-02-11 18:22:38'),
(676, 146, 4, '2019-02-11 18:22:38'),
(677, 147, 4, '2019-02-11 18:22:38'),
(678, 148, 4, '2019-02-11 18:22:38'),
(679, 149, 4, '2019-02-11 18:22:38'),
(680, 150, 4, '2019-02-11 18:22:38'),
(681, 151, 4, '2019-02-11 18:22:38'),
(682, 152, 4, '2019-02-11 18:22:38'),
(683, 153, 4, '2019-02-11 18:22:38'),
(684, 154, 4, '2019-02-11 18:22:38'),
(685, 155, 4, '2019-02-11 18:22:38'),
(686, 156, 4, '2019-02-11 18:22:38'),
(687, 157, 4, '2019-02-11 18:22:38'),
(703, 158, 4, '2019-02-11 18:22:57'),
(704, 159, 4, '2019-02-11 18:23:10'),
(705, 158, 13, '2019-02-11 18:23:19'),
(706, 159, 13, '2019-02-11 18:23:19'),
(708, 160, 13, '2019-02-11 18:23:49'),
(709, 160, 4, '2019-02-11 18:23:49'),
(710, 161, 13, '2019-02-11 18:23:52'),
(711, 161, 4, '2019-02-11 18:23:52'),
(712, 162, 4, '2019-02-11 18:24:03'),
(713, 162, 13, '2019-02-11 18:36:17'),
(714, 163, 13, '2019-02-11 18:36:21'),
(715, 158, 2, '2019-02-11 18:47:02'),
(716, 159, 2, '2019-02-11 18:47:02'),
(717, 160, 2, '2019-02-11 18:47:02'),
(718, 161, 2, '2019-02-11 18:47:02'),
(719, 162, 2, '2019-02-11 18:47:02'),
(720, 163, 2, '2019-02-11 18:47:02'),
(722, 163, 4, '2019-02-11 18:48:25'),
(723, 164, 4, '2019-02-11 18:48:52'),
(724, 164, 2, '2019-02-11 18:48:58'),
(725, 165, 4, '2019-02-11 18:49:36'),
(726, 166, 4, '2019-02-11 18:50:12'),
(727, 166, 2, '2019-02-11 18:50:16'),
(728, 167, 2, '2019-02-11 18:50:25'),
(729, 167, 4, '2019-02-11 18:50:25'),
(730, 168, 4, '2019-02-11 18:50:38'),
(731, 169, 4, '2019-02-11 18:50:39'),
(732, 170, 4, '2019-02-11 18:50:41'),
(733, 171, 4, '2019-02-11 18:50:42'),
(734, 172, 4, '2019-02-11 18:51:07'),
(735, 173, 4, '2019-02-11 18:51:17'),
(736, 168, 2, '2019-02-11 18:51:32'),
(737, 169, 2, '2019-02-11 18:51:32'),
(738, 170, 2, '2019-02-11 18:51:32'),
(739, 171, 2, '2019-02-11 18:51:32'),
(743, 172, 2, '2019-02-11 18:51:35'),
(744, 173, 2, '2019-02-11 18:51:35'),
(746, 174, 4, '2019-02-11 18:51:54'),
(747, 174, 2, '2019-02-11 18:53:38'),
(748, 175, 4, '2019-02-11 18:55:42'),
(749, 176, 4, '2019-02-11 18:55:43'),
(750, 177, 4, '2019-02-11 18:55:46'),
(751, 175, 2, '2019-02-11 18:55:52'),
(752, 176, 2, '2019-02-11 18:55:52'),
(753, 177, 2, '2019-02-11 18:55:52'),
(754, 164, 13, '2019-02-11 18:56:29'),
(755, 166, 13, '2019-02-11 18:56:29'),
(756, 167, 13, '2019-02-11 18:56:29'),
(757, 168, 13, '2019-02-11 18:56:29'),
(758, 169, 13, '2019-02-11 18:56:29'),
(759, 170, 13, '2019-02-11 18:56:29'),
(760, 171, 13, '2019-02-11 18:56:29'),
(761, 174, 13, '2019-02-11 18:56:29'),
(762, 175, 13, '2019-02-11 18:56:29'),
(763, 176, 13, '2019-02-11 18:56:29'),
(764, 177, 13, '2019-02-11 18:56:29'),
(769, 178, 4, '2019-02-11 18:59:45'),
(770, 179, 4, '2019-02-11 18:59:52'),
(771, 180, 4, '2019-02-11 18:59:58'),
(772, 178, 2, '2019-02-11 19:01:40'),
(773, 179, 2, '2019-02-11 19:01:43'),
(774, 180, 2, '2019-02-11 19:01:43');

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
(19, 6, '/uploads/Roman/2018/11/15/cad088c6ec17bb7eba39067370b64df4.jpeg', 0),
(20, 13, '/uploads/girl/2019/2/2/9ebb9a299fb0b2397f9215f2f1d6a5fa.jpeg', 1),
(21, 11, '/uploads/location/2019/2/15/795291ba78f72a9c4200a875c425f193.jpeg', 1),
(22, 11, '/uploads/location/2019/2/15/b3c80a92679b34e3d09ea12c8815f986.jpeg', 0),
(23, 11, '/uploads/location/2019/2/15/6fb17ff48d2500c0e902b4abc46677c4.png', 0),
(24, 11, '/uploads/location/2019/2/15/253a042675864642f4e668c053c79f0a.png', 0),
(25, 11, '/uploads/location/2019/2/15/5fe247309e6d4ee72495af62183b092e.png', 0);

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
(6, 0, 1),
(7, 1, 1),
(10, 0, 1),
(11, 0, 1),
(12, 0, 1),
(13, 1, 1),
(14, 1, 1),
(15, 1, 1),
(16, 1, 1),
(17, 0, 1),
(18, 0, 1),
(19, 1, 1),
(20, 1, 0),
(21, 1, 0),
(22, 0, 1),
(23, 1, 1),
(24, 0, 1),
(25, 0, 1),
(26, 0, 1),
(27, 0, 1),
(28, 0, 1),
(29, 0, 1),
(30, 0, 1),
(31, 0, 1),
(32, 0, 1),
(33, 0, 1),
(34, 0, 1),
(35, 0, 1),
(36, 0, 1),
(37, 0, 1),
(38, 0, 1),
(39, 0, 1),
(40, 0, 1),
(41, 0, 1),
(42, 0, 1);

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
(7, 2),
(7, 3),
(13, 6),
(13, 4),
(14, 2),
(14, 6),
(15, 4),
(15, 2),
(16, 6),
(16, 11),
(19, 4),
(19, 13),
(20, 2),
(20, 4),
(20, 3),
(21, 2),
(21, 4),
(21, 13),
(23, 2),
(23, 13);

-- --------------------------------------------------------

--
-- Table structure for table `tmp_cont`
--

CREATE TABLE `tmp_cont` (
  `id` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  `orientation` enum('Heterosexual','Homosexual','Bisexual','Asexual','Other') DEFAULT NULL,
  `last_seen` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `connected` tinyint(1) NOT NULL DEFAULT '0',
  `rating` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `login`, `password`, `email`, `first_name`, `last_name`, `admin`, `active`, `about`, `age`, `gender`, `orientation`, `last_seen`, `connected`, `rating`) VALUES
(2, 'white_men', 'sha256$31587c1a$1$8eb5df5ae1026bc28119893c5f16ff21357e87d40f5efb202cc61c86aeede679', 'white_men@bigmir.net', 'Stanly', 'White', 1, 1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Excepteur sint occaecat cupidatat non proident oidento', 29, 'Male', 'Heterosexual', '2019-02-15 21:19:33', 0, 0),
(3, 'test1', 'sha256$d43c0e84$1$83d85884b539f918f401a8da14aff1c9acf5aa3554f15a0fc5a5d1d79d45b270', 'test1@example.com', 'Testing', 'Tester', 0, 1, 'I am just a test user. I like testing very much)', NULL, 'Female', 'Other', '2019-02-12 21:18:35', 0, -5),
(4, 'root', 'sha256$3acf68e5$1$5125e220c378c94a1f5d419cf6f5a62cc1c3cfc763e0d965422fddcba5ce6bec', 'root@example.com', '', '', 1, 1, 'Won\'t say anything) Hahaha', 29, 'Male', 'Heterosexual', '2019-02-15 21:40:50', 1, 25),
(5, 'Stanly', 'sha256$794be04a$1$b2772c8bafb16ea1e3ff510d0eba864fdb38a04bd4c303d2821ff00c923eec1a', 'test@example.com', NULL, NULL, 0, 1, NULL, 27, 'Male', 'Asexual', '2019-02-06 19:05:31', 0, 0),
(6, 'Roman', 'sha256$28a129c9$1$7825ba9139a1b775c0bb1ab192742e4163983a3ada624d6de4f976fddd1d284c', 'roman@beakon.com.au', '', '', 0, 1, 'vaeuihuieahuivhuaevuuiavujiVJROVKWiokfkoFKEWk[peflkef0i0f3g o3gko 3 k35o k4o5 o54k o54k 45 ok45 oyko koy koky wwp05ti0i50it450i0 . 0i5 0i0yi0iy0i0irlfgkfkhos', 18, 'Male', 'Bisexual', '2019-02-08 22:06:25', 1, 15),
(11, 'location', 'sha256$3666f3e8$1$0887134d2d8ba30613bdcbf2c51e28dc5b47bdc153ba3be73f393e640e696bd0', 'loc@test.com', NULL, NULL, 0, 1, NULL, 42, 'Female', 'Heterosexual', '2019-02-15 21:17:26', 0, -3),
(12, 'location_tester', 'sha256$b4e6109c$1$c1de63ef4385626fce71419ba98c785a03208cad4f7a747c40521514f18350c6', 'loc_test@test.com', NULL, NULL, 0, 1, NULL, 48, 'Female', 'Heterosexual', '2019-02-06 19:05:31', 0, 0),
(13, 'girl', 'sha256$8c166a20$1$1bf8fcf17cee9639b4c4abe094d1b040d330b6df4d1e4fab5a4d0e88825037e9', 'girl@gmail.co', '', '', 0, 1, '', 22, 'Female', 'Bisexual', '2019-02-11 21:06:23', 0, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `black_list`
--
ALTER TABLE `black_list`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hashtags`
--
ALTER TABLE `hashtags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `message_user`
--
ALTER TABLE `message_user`
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
-- AUTO_INCREMENT for table `black_list`
--
ALTER TABLE `black_list`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `hashtags`
--
ALTER TABLE `hashtags`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=181;

--
-- AUTO_INCREMENT for table `message_user`
--
ALTER TABLE `message_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=775;

--
-- AUTO_INCREMENT for table `photo`
--
ALTER TABLE `photo`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
