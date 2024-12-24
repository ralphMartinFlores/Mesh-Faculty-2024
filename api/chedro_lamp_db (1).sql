-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mariadb:3306
-- Generation Time: Dec 24, 2024 at 03:57 PM
-- Server version: 10.5.27-MariaDB-ubu2004
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chedro_lamp_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts_tbl`
--

CREATE TABLE `accounts_tbl` (
  `recno_fld` int(11) NOT NULL,
  `studnum_fld` varchar(11) NOT NULL,
  `pword_fld` text NOT NULL,
  `role_fld` tinyint(1) NOT NULL DEFAULT 0,
  `forumrole_fld` tinyint(1) NOT NULL DEFAULT 0,
  `studtype_fld` tinyint(1) NOT NULL DEFAULT 0,
  `isenrolled_fld` tinyint(1) NOT NULL DEFAULT 0,
  `enrolleddate_fld` datetime DEFAULT NULL,
  `withcondition_fld` tinyint(1) NOT NULL DEFAULT 0,
  `acadyear_fld` varchar(9) DEFAULT NULL,
  `sem_fld` tinyint(1) DEFAULT 0,
  `studyrlevel_fld` tinyint(1) NOT NULL DEFAULT 0,
  `block_fld` tinytext DEFAULT NULL,
  `isenlisted_fld` tinyint(1) NOT NULL DEFAULT 0,
  `enlistdate_fld` datetime DEFAULT NULL,
  `enlistreason_fld` text DEFAULT NULL,
  `isregular_fld` tinyint(1) NOT NULL DEFAULT 0,
  `isgraduating_fld` tinyint(1) NOT NULL DEFAULT 0,
  `learningtype_fld` tinyint(1) NOT NULL DEFAULT 0,
  `imgcor_fld` text DEFAULT NULL,
  `imgprospectus_fld` text DEFAULT NULL,
  `imggrades_fld` text DEFAULT NULL,
  `enlistother_fld` text DEFAULT NULL,
  `imgresidencycert_fld` text DEFAULT NULL,
  `imghonordismiss_fld` text DEFAULT NULL,
  `imggoodmoral_fld` text DEFAULT NULL,
  `imgf138ytor_fld` text DEFAULT NULL,
  `imgidcard_fld` text DEFAULT NULL,
  `imghepascreen_fld` text DEFAULT NULL,
  `imgbirthcert_fld` text DEFAULT NULL,
  `deviceid_fld` tinytext DEFAULT NULL,
  `socketid_fld` tinytext DEFAULT NULL,
  `folderid_fld` tinytext DEFAULT NULL,
  `token_fld` text DEFAULT NULL,
  `accept_fld` tinyint(1) NOT NULL DEFAULT 0,
  `issurvey_fld` tinyint(4) NOT NULL DEFAULT 0,
  `surveydate_fld` datetime DEFAULT NULL,
  `ispwordreset_fld` tinyint(1) NOT NULL DEFAULT 0,
  `isdeleted_fld` tinyint(1) NOT NULL DEFAULT 0,
  `iscovax_fld` tinyint(1) NOT NULL DEFAULT 0,
  `covaxtype_fld` tinyint(1) NOT NULL DEFAULT 0,
  `nocovaxreason_fld` text DEFAULT NULL,
  `vacccertpath_fld` text DEFAULT NULL,
  `lasthc_fld` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts_tbl`
--

INSERT INTO `accounts_tbl` (`recno_fld`, `studnum_fld`, `pword_fld`, `role_fld`, `forumrole_fld`, `studtype_fld`, `isenrolled_fld`, `enrolleddate_fld`, `withcondition_fld`, `acadyear_fld`, `sem_fld`, `studyrlevel_fld`, `block_fld`, `isenlisted_fld`, `enlistdate_fld`, `enlistreason_fld`, `isregular_fld`, `isgraduating_fld`, `learningtype_fld`, `imgcor_fld`, `imgprospectus_fld`, `imggrades_fld`, `enlistother_fld`, `imgresidencycert_fld`, `imghonordismiss_fld`, `imggoodmoral_fld`, `imgf138ytor_fld`, `imgidcard_fld`, `imghepascreen_fld`, `imgbirthcert_fld`, `deviceid_fld`, `socketid_fld`, `folderid_fld`, `token_fld`, `accept_fld`, `issurvey_fld`, `surveydate_fld`, `ispwordreset_fld`, `isdeleted_fld`, `iscovax_fld`, `covaxtype_fld`, `nocovaxreason_fld`, `vacccertpath_fld`, `lasthc_fld`) VALUES
(7711, '290010001', '$2b$12$exlKhjEJIuJNBesS8uPNcuqUVdSRN./HBT5OzU9zgMpTT.MUpvAMq', 0, 0, 2, 2, '2021-08-02 07:08:08', 1, '2024-2025', 1, 2, 'BSIT 3A', 2, '2021-07-16 08:08:04', '0', 1, 0, 2, '', '', '', '', '', '', '', '', '', '', '', '', '0', '', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImFwcCI6IkdDIFN5c3RlbXMiLCJkZXYiOiJHQyBEZXZlbG9wZXJzIn0=.eyJ1YyI6IjI5MDAxMDAwMSIsInVlIjoidGVzdGFjY291bnRAZ29yZG9uY29sbGVnZS5lZHUucGgiLCJpdG8iOiJBdXN0aW4gUmF5IEFyYW5kYSIsImlieSI6IkdDIERldmVsb3BlcnMiLCJpZSI6ImdjZGV2ZWxvcGVyc0Bnb3Jkb25jb2xsZWdlLmVkdS5waCIsImlkYXRlIjp7ImRhdGUiOiIyMDI0LTEyLTI0IDIzOjUxOjQ2LjU0MzE1MyIsInRpbWV6b25lX3R5cGUiOjMsInRpbWV6b25lIjoiQXNpYVwvTWFuaWxhIn0sImV4cCI6IjIwMjQtMTItMjQgMjM6NTE6NDYifQ==.ZWI0OWYzNjhhNmM4YWFjZmVmMTBlNTdhOTg1ZDRlNDY0ZTYyNjBjNzNhOGEyNTZlOGU4YjVlMDUxMmZmODE3Yw==', 1, 1, NULL, 1, 0, 1, 1, NULL, NULL, '2022-03-25'),
(7718, '290010002', '$2y$10$YzY5MjA0ZDZhZDVhOTYzNeJErjGMWZgK.I7NAc9J.w7y0EgbzjdZa', 0, 0, 2, 2, '2021-08-02 07:08:08', 1, '2024-2025', 1, 2, 'BSIT 3A', 2, '2021-07-16 08:08:04', '0', 1, 0, 2, '', '', '', '', '', '', '', '', '', '', '', '', '0', '', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImFwcCI6IkdDIFN5c3RlbXMiLCJkZXYiOiJHQyBEZXZlbG9wZXJzIn0=.eyJ1YyI6IjI5MDAxMDAwMiIsInVlIjoidGVzdGFjY291bnQxQGdvcmRvbmNvbGxlZ2UuZWR1LnBoIiwiaXRvIjoiQmVybmllIEpyIElub2NpZXRlIiwiaWJ5IjoiR0MgRGV2ZWxvcGVycyIsImllIjoiZ2NkZXZlbG9wZXJzQGdvcmRvbmNvbGxlZ2UuZWR1LnBoIiwiaWRhdGUiOnsiZGF0ZSI6IjIwMjItMDctMjIgMTk6MDM6NDMuMDY2ODg5IiwidGltZXpvbmVfdHlwZSI6MywidGltZXpvbmUiOiJBc2lhXC9NYW5pbGEifSwiZXhwIjoiMjAyMi0wNy0yMiAxOTowMzo0MyJ9.YmE3ZGJlYzBkZDJiNDNlNWI3Y2RjM2FlMWYzMDlhZTFmYmE4MTRhNzllNTI3MzFiOTBlOTg0YjBhNTkzZTcxOQ==', 1, 1, NULL, 1, 0, 1, 1, NULL, NULL, '2022-03-25'),
(7719, '290010003', '$2b$12$exlKhjEJIuJNBesS8uPNcuqUVdSRN./HBT5OzU9zgMpTT.MUpvAMq', 0, 0, 2, 2, '2021-08-02 07:08:08', 1, '2024-2025', 1, 2, 'BSIT 3A', 2, '2021-07-16 08:08:04', '0', 1, 0, 2, '', '', '', '', '', '', '', '', '', '', '', '', '0', '', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImFwcCI6IkdDIFN5c3RlbXMiLCJkZXYiOiJHQyBEZXZlbG9wZXJzIn0=.eyJ1YyI6IjI5MDAxMDAwMyIsInVlIjoidGVzdGFjY291bnQyQGdvcmRvbmNvbGxlZ2UuZWR1LnBoIiwiaXRvIjoiUmFscGggTWFydGluIEZsb3JlcyIsImlieSI6IkdDIERldmVsb3BlcnMiLCJpZSI6ImdjZGV2ZWxvcGVyc0Bnb3Jkb25jb2xsZWdlLmVkdS5waCIsImlkYXRlIjp7ImRhdGUiOiIyMDIyLTA3LTIyIDE5OjA1OjA2Ljk3MjcwMyIsInRpbWV6b25lX3R5cGUiOjMsInRpbWV6b25lIjoiQXNpYVwvTWFuaWxhIn0sImV4cCI6IjIwMjItMDctMjIgMTk6MDU6MDYifQ==.MjE2NmRjM2QwMzMyNmQ0NjkwMGY4YjkyNDFhODQ2ZTA3YTI2NTM5YzFlNWU2NjgyY2ZjZGQ0OWEyNjQ3OGIyMA==', 1, 1, NULL, 1, 0, 1, 4, NULL, NULL, '2022-03-25'),
(7720, '290010004', '$2b$12$exlKhjEJIuJNBesS8uPNcuqUVdSRN./HBT5OzU9zgMpTT.MUpvAMq', 0, 0, 2, 2, '2021-08-02 07:08:08', 1, '2024-2025', 1, 2, 'BSIT 3A', 2, '2021-07-16 08:08:04', '0', 1, 0, 2, '', '', '', '', '', '', '', '', '', '', '', '', '0', '', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImFwcCI6IkdDIFN5c3RlbXMiLCJkZXYiOiJHQyBEZXZlbG9wZXJzIn0=.eyJ1YyI6IjI5MDAxMDAwNCIsInVlIjoidGVzdGFjY291bnQzQGdvcmRvbmNvbGxlZ2UuZWR1LnBoIiwiaXRvIjoiQ2hyaXN0aWFuIEFsaXAiLCJpYnkiOiJHQyBEZXZlbG9wZXJzIiwiaWUiOiJnY2RldmVsb3BlcnNAZ29yZG9uY29sbGVnZS5lZHUucGgiLCJpZGF0ZSI6eyJkYXRlIjoiMjAyMi0wNy0yMiAxOTowMTozMi43NTkyNjgiLCJ0aW1lem9uZV90eXBlIjozLCJ0aW1lem9uZSI6IkFzaWFcL01hbmlsYSJ9LCJleHAiOiIyMDIyLTA3LTIyIDE5OjAxOjMyIn0=.YjUzMjFhMTA0MGVmZTI2ZmU0ZjQwZmE1NTUyZGRjMTcxY2YxNmEzZGQyNGFlN2NlNjJiZjI2MmY0MTIwMTY0ZA==', 1, 1, NULL, 1, 0, 1, 2, NULL, NULL, '2022-03-25'),
(7721, '290010005', '$2b$12$exlKhjEJIuJNBesS8uPNcuqUVdSRN./HBT5OzU9zgMpTT.MUpvAMq', 0, 0, 2, 2, '2021-08-02 07:08:08', 1, '2024-2025', 1, 2, 'BSIT 3A', 2, '2021-07-16 08:08:04', '0', 1, 0, 2, '', '', '', '', '', '', '', '', '', '', '', '', '0', '', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImFwcCI6IkdDIFN5c3RlbXMiLCJkZXYiOiJHQyBEZXZlbG9wZXJzIn0=.eyJ1YyI6IjI5MDAxMDAwNSIsInVlIjoidGVzdGFjY291bnQ0QGdvcmRvbmNvbGxlZ2UuZWR1LnBoIiwiaXRvIjoiQWxsZW4gRWR1YXJkIFV5IiwiaWJ5IjoiR0MgRGV2ZWxvcGVycyIsImllIjoiZ2NkZXZlbG9wZXJzQGdvcmRvbmNvbGxlZ2UuZWR1LnBoIiwiaWRhdGUiOnsiZGF0ZSI6IjIwMjItMDctMjIgMTk6MDE6NDYuOTY2MDA1IiwidGltZXpvbmVfdHlwZSI6MywidGltZXpvbmUiOiJBc2lhXC9NYW5pbGEifSwiZXhwIjoiMjAyMi0wNy0yMiAxOTowMTo0NiJ9.MTEzYWMzYjQ4ODI1YTNjYjJjNTkzNWYyYjBiODE1Zjg2OTM5M2I0NGYyNDc2ZGZlNGNhMjE1YTdhMWQxZjY0Yw==', 1, 1, NULL, 1, 0, 3, 4, NULL, NULL, '2022-03-25'),
(7722, '290010006', '$2b$12$exlKhjEJIuJNBesS8uPNcuqUVdSRN./HBT5OzU9zgMpTT.MUpvAMq', 0, 0, 2, 2, '2021-08-02 07:08:08', 1, '2024-2025', 1, 2, 'BSIT 3A', 2, '2021-07-16 08:08:04', '0', 1, 0, 2, '', '', '', '', '', '', '', '', '', '', '', '', '0', '', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImFwcCI6IkdDIFN5c3RlbXMiLCJkZXYiOiJHQyBEZXZlbG9wZXJzIn0=.eyJ1YyI6IjI5MDAxMDAwNiIsInVlIjoidGVzdGFjY291bnQ1QGdvcmRvbmNvbGxlZ2UuZWR1LnBoIiwiaXRvIjoiTWljdGhlbGwgRXZhbnMgQWxvcCIsImlieSI6IkdDIERldmVsb3BlcnMiLCJpZSI6ImdjZGV2ZWxvcGVyc0Bnb3Jkb25jb2xsZWdlLmVkdS5waCIsImlkYXRlIjp7ImRhdGUiOiIyMDIzLTA0LTI0IDIyOjA0OjA2LjQ3OTkzOCIsInRpbWV6b25lX3R5cGUiOjMsInRpbWV6b25lIjoiQXNpYVwvTWFuaWxhIn0sImV4cCI6IjIwMjMtMDQtMjQgMjI6MDQ6MDYifQ==.ZTNhYzMzOTdmNTA5OGZhYzg3MzhjZGY1MDFkMjViZWJjYzMzYzUzMjllZWZiMjA1ZTEyYmY5MWMxNWU5YWIwOA==', 1, 1, NULL, 1, 0, 1, 6, NULL, NULL, '2022-03-25'),
(7723, '290010007', '$2b$12$exlKhjEJIuJNBesS8uPNcuqUVdSRN./HBT5OzU9zgMpTT.MUpvAMq', 0, 0, 2, 2, '2021-08-02 07:08:08', 1, '2024-2025', 1, 2, 'BSIT 3A', 2, '2021-07-16 08:08:04', '0', 1, 0, 2, '', '', '', '', '', '', '', '', '', '', '', '', '0', '', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImFwcCI6IkdDIFN5c3RlbXMiLCJkZXYiOiJHQyBEZXZlbG9wZXJzIn0=.eyJ1YyI6IjI5MDAxMDAwNyIsInVlIjoidGVzdGFjY291bnQ2QGdvcmRvbmNvbGxlZ2UuZWR1LnBoIiwiaXRvIjoiTmljb2xlIE1hcmNpYWwiLCJpYnkiOiJHQyBEZXZlbG9wZXJzIiwiaWUiOiJnY2RldmVsb3BlcnNAZ29yZG9uY29sbGVnZS5lZHUucGgiLCJpZGF0ZSI6eyJkYXRlIjoiMjAyMi0wNy0yMiAxODozOTozNC45MTA0MTAiLCJ0aW1lem9uZV90eXBlIjozLCJ0aW1lem9uZSI6IkFzaWFcL01hbmlsYSJ9LCJleHAiOiIyMDIyLTA3LTIyIDE4OjM5OjM0In0=.YTEyNzFiMWQwYWM1NGEyNTYwY2Y2NzE5ZGY0MGQ4MGEzZWMzMzBjYTAzNWQxNGE3YmJmZjczMTFjNjY1ZDZmZQ==', 1, 1, NULL, 1, 0, 1, 5, NULL, NULL, '2022-03-25');

-- --------------------------------------------------------

--
-- Table structure for table `activity_tbl`
--

CREATE TABLE `activity_tbl` (
  `recno_fld` int(11) NOT NULL,
  `actcode_fld` text NOT NULL,
  `authorid_fld` text DEFAULT NULL,
  `type_fld` tinyint(1) NOT NULL DEFAULT 0,
  `recipient_fld` text DEFAULT NULL,
  `topiccode_fld` text DEFAULT NULL,
  `title_fld` text DEFAULT NULL,
  `desc_fld` text DEFAULT NULL,
  `totalscore_fld` int(3) NOT NULL DEFAULT 0,
  `classcode_fld` varchar(10) DEFAULT NULL,
  `withfile_fld` tinyint(1) NOT NULL DEFAULT 0,
  `quizoptions_fld` tinyint(1) NOT NULL DEFAULT 0,
  `isquizrandom_fld` tinyint(1) NOT NULL DEFAULT 0,
  `filedir_fld` text DEFAULT NULL,
  `datetime_fld` datetime DEFAULT NULL,
  `deadline_fld` datetime DEFAULT NULL,
  `datesched_fld` datetime DEFAULT NULL,
  `isedited_fld` tinyint(1) NOT NULL DEFAULT 0,
  `dtedit_fld` datetime DEFAULT NULL,
  `isdeleted_fld` tinyint(1) NOT NULL DEFAULT 0,
  `ispinned_fld` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `announcements_tbl`
--

CREATE TABLE `announcements_tbl` (
  `recno_fld` int(11) NOT NULL,
  `recipientcode_fld` text NOT NULL,
  `announcecode_fld` text NOT NULL,
  `title_fld` text NOT NULL,
  `content_fld` text NOT NULL,
  `withimg_fld` tinyint(1) NOT NULL DEFAULT 0,
  `imgdir_fld` text NOT NULL,
  `datetime_fld` datetime DEFAULT NULL,
  `isedited_fld` tinyint(1) NOT NULL DEFAULT 0,
  `dtedit_fld` datetime DEFAULT NULL,
  `isdeleted_fld` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classcomments_tbl`
--

CREATE TABLE `classcomments_tbl` (
  `recno_fld` int(11) NOT NULL,
  `commentcode_fld` text NOT NULL,
  `classcode_fld` text NOT NULL,
  `actioncode_fld` text NOT NULL,
  `authorid_fld` text NOT NULL,
  `content_fld` text NOT NULL,
  `withfile_fld` tinyint(1) NOT NULL DEFAULT 0,
  `dir_fld` text NOT NULL,
  `datetime_fld` datetime DEFAULT NULL,
  `isedited_fld` tinyint(1) NOT NULL DEFAULT 0,
  `dtedit_fld` datetime DEFAULT NULL,
  `isdeleted_fld` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classes_tbl`
--

CREATE TABLE `classes_tbl` (
  `recno_fld` int(11) NOT NULL,
  `classcode_fld` varchar(10) NOT NULL,
  `subjcode_fld` text NOT NULL,
  `day_fld` text NOT NULL,
  `starttime_fld` text NOT NULL,
  `endtime_fld` text NOT NULL,
  `room_fld` text NOT NULL,
  `block_fld` text NOT NULL,
  `ay_fld` text NOT NULL,
  `sem_fld` tinyint(1) NOT NULL,
  `subjdesc_fld` text NOT NULL,
  `lecunits_fld` decimal(2,1) NOT NULL DEFAULT 0.0,
  `labunits_fld` decimal(2,1) NOT NULL DEFAULT 0.0,
  `rleunits_fld` decimal(2,1) NOT NULL DEFAULT 0.0,
  `contacthours_fld` decimal(4,1) NOT NULL DEFAULT 0.0,
  `dept_fld` text NOT NULL,
  `program_fld` text NOT NULL,
  `yrlevel_fld` tinyint(1) NOT NULL,
  `email_fld` text NOT NULL,
  `isexcess_fld` tinyint(1) NOT NULL DEFAULT 0,
  `slots_fld` tinyint(3) NOT NULL,
  `slotlimit_fld` tinyint(3) NOT NULL,
  `isdeleted_fld` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes_tbl`
--

INSERT INTO `classes_tbl` (`recno_fld`, `classcode_fld`, `subjcode_fld`, `day_fld`, `starttime_fld`, `endtime_fld`, `room_fld`, `block_fld`, `ay_fld`, `sem_fld`, `subjdesc_fld`, `lecunits_fld`, `labunits_fld`, `rleunits_fld`, `contacthours_fld`, `dept_fld`, `program_fld`, `yrlevel_fld`, `email_fld`, `isexcess_fld`, `slots_fld`, `slotlimit_fld`, `isdeleted_fld`) VALUES
(2319, '31748', 'CSP131', 'Mon,Wed,Fri', '9:00 AM', '12:00 PM', 'Online', 'ACT 1A', '2024-2025', 2, 'CT Practicum I', 3.0, 0.0, 0.0, 9.0, 'CCS', 'ACT', 1, 'balce.melner@gordoncollege.edu.ph', 0, 31, 35, 0),
(2320, '31749', 'CSP131', 'Mon,Wed,Fri', '9:00 AM', '12:00 PM', 'Online', 'BSCS 1A', '2024-2025', 2, 'CT Practicum I', 3.0, 0.0, 0.0, 9.0, 'CCS', 'BSCS', 1, 'balce.melner@gordoncollege.edu.ph', 0, 28, 35, 0),
(2321, '31750', 'CSP131', 'Mon,Wed,Fri', '9:00 AM', '12:00 PM', 'Online', 'BSCS 1B', '2024-2025', 2, 'CT Practicum I', 3.0, 0.0, 0.0, 9.0, 'CCS', 'BSCS', 1, 'balce.melner@gordoncollege.edu.ph', 0, 27, 35, 0),
(2322, '31751', 'EMC131', 'Mon,Wed,Fri', '9:00 AM', '12:00 PM', 'Online', 'BSEMC 1A', '2024-2025', 2, 'EMC PRACTICUM 1', 3.0, 0.0, 0.0, 9.0, 'CCS', 'BSEMC', 1, 'balce.melner@gordoncollege.edu.ph', 0, 40, 40, 0);

-- --------------------------------------------------------

--
-- Table structure for table `classpost_tbl`
--

CREATE TABLE `classpost_tbl` (
  `recno_fld` int(11) NOT NULL,
  `postcode_fld` text NOT NULL,
  `classcode_fld` text NOT NULL,
  `authorid_fld` text NOT NULL,
  `content_fld` text NOT NULL,
  `withfile_fld` tinyint(1) NOT NULL DEFAULT 0,
  `dir_fld` text DEFAULT NULL,
  `datetime_fld` datetime DEFAULT NULL,
  `isedited_fld` tinyint(1) DEFAULT 0,
  `dtedit_fld` datetime DEFAULT NULL,
  `isdeleted_fld` tinyint(1) NOT NULL DEFAULT 0,
  `dtarchived_fld` datetime DEFAULT NULL,
  `ispinned_fld` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `courses_tbl`
--

CREATE TABLE `courses_tbl` (
  `recno_fld` int(11) NOT NULL,
  `dept_fld` text NOT NULL,
  `program_fld` text NOT NULL,
  `desc_fld` text NOT NULL,
  `slots_fld` int(2) NOT NULL,
  `status_fld` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `department_tbl`
--

CREATE TABLE `department_tbl` (
  `recno_fld` int(11) NOT NULL,
  `dept_fld` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `disapprove_tbl`
--

CREATE TABLE `disapprove_tbl` (
  `recno_fld` int(11) NOT NULL,
  `studnum_fld` text NOT NULL,
  `requestedby_fld` text NOT NULL,
  `dept_fld` text NOT NULL,
  `program_fld` text NOT NULL,
  `reason_fld` text NOT NULL,
  `retentionstatus_fld` tinyint(1) NOT NULL,
  `deanremarks_fld` text DEFAULT NULL,
  `daterequested_fld` datetime DEFAULT NULL,
  `dateapproved_fld` datetime DEFAULT NULL,
  `ay_fld` text NOT NULL,
  `sem_fld` tinyint(1) NOT NULL DEFAULT 0,
  `isdeleted_fld` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `enrolledsubj_tbl`
--

CREATE TABLE `enrolledsubj_tbl` (
  `recno_fld` int(11) NOT NULL,
  `studnum_fld` varchar(11) NOT NULL,
  `classcode_fld` varchar(10) NOT NULL,
  `subjcode_fld` text NOT NULL,
  `block_fld` varchar(15) NOT NULL,
  `mgrade_fld` tinyint(1) NOT NULL DEFAULT 0,
  `fgrade_fld` tinyint(1) NOT NULL DEFAULT 0,
  `ay_fld` varchar(9) NOT NULL,
  `sem_fld` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=COMPACT;

--
-- Dumping data for table `enrolledsubj_tbl`
--

INSERT INTO `enrolledsubj_tbl` (`recno_fld`, `studnum_fld`, `classcode_fld`, `subjcode_fld`, `block_fld`, `mgrade_fld`, `fgrade_fld`, `ay_fld`, `sem_fld`) VALUES
(1, '290010001', '31748', 'CSP131', 'ACT 1A', 1, 1, '2024-2025', 2),
(2, '290010002', '31748', 'CSP131', 'ACT 1A', 1, 1, '2024-2025', 2),
(3, '290010003', '31748', 'CSP131', 'ACT 1A', 1, 1, '2024-2025', 2),
(4, '290010004', '31748', 'CSP131', 'ACT 1A', 1, 1, '2024-2025', 2),
(5, '290010005', '31748', 'CSP131', 'ACT 1A', 1, 1, '2024-2025', 2),
(6, '290010006', '31748', 'CSP131', 'ACT 1A', 1, 1, '2024-2025', 2),
(7, '290010007', '31748', 'CSP131', 'ACT 1A', 1, 1, '2024-2025', 2);

-- --------------------------------------------------------

--
-- Table structure for table `enrollstatus_tbl`
--

CREATE TABLE `enrollstatus_tbl` (
  `recno_fld` int(11) NOT NULL,
  `studnum_fld` varchar(11) NOT NULL,
  `isenrolled_fld` tinyint(1) NOT NULL DEFAULT 0,
  `enlistdate_fld` datetime DEFAULT NULL,
  `enrolleddate_fld` datetime DEFAULT NULL,
  `enlistreason_fld` text DEFAULT NULL,
  `block_fld` varchar(15) DEFAULT NULL,
  `acadyear_fld` varchar(9) DEFAULT NULL,
  `sem_fld` tinyint(1) NOT NULL DEFAULT 0,
  `studtype_fld` tinyint(4) NOT NULL DEFAULT 0,
  `withcondition_fld` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollstatus_tbl`
--

INSERT INTO `enrollstatus_tbl` (`recno_fld`, `studnum_fld`, `isenrolled_fld`, `enlistdate_fld`, `enrolleddate_fld`, `enlistreason_fld`, `block_fld`, `acadyear_fld`, `sem_fld`, `studtype_fld`, `withcondition_fld`) VALUES
(14529, '290010001', 4, '2024-07-16 08:08:04', '2024-07-16 08:08:04', '0', 'BSIT 3A', '2024-2025', 2, 2, 0),
(19728, '290010002', 4, '2024-07-16 08:08:04', '2024-07-16 08:08:04', '0', 'BSIT 3A', '2024-2025', 2, 2, 0),
(19729, '290010003', 4, '2024-07-16 08:08:04', '2024-07-16 08:08:04', '0', 'BSIT 3A', '2024-2025', 2, 2, 0),
(19730, '290010004', 4, '2024-07-16 08:08:04', '2024-07-16 08:08:04', '0', 'BSIT 3A', '2024-2025', 2, 2, 0),
(19731, '290010005', 4, '2024-07-16 08:08:04', '2024-07-16 08:08:04', '0', 'BSIT 3A', '2024-2025', 2, 2, 0),
(19732, '290010006', 4, '2024-07-16 08:08:04', '2024-07-16 08:08:04', '0', 'BSIT 3A', '2024-2025', 2, 2, 0),
(19733, '290010007', 4, '2024-07-16 08:08:04', '2024-07-16 08:08:04', '0', 'BSIT 3A', '2024-2025', 2, 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `forumcontent_tbl`
--

CREATE TABLE `forumcontent_tbl` (
  `recno_fld` int(11) NOT NULL,
  `subcode_fld` text NOT NULL,
  `contentcode_fld` text NOT NULL,
  `authorid_fld` text NOT NULL,
  `content_fld` text NOT NULL,
  `withfile_fld` tinyint(1) NOT NULL,
  `dir_fld` text NOT NULL,
  `datetime_fld` datetime DEFAULT NULL,
  `isedited_fld` tinyint(1) NOT NULL,
  `dtedit_fld` datetime DEFAULT NULL,
  `isdeleted_fld` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `forums_tbl`
--

CREATE TABLE `forums_tbl` (
  `recno_fld` int(11) NOT NULL,
  `forumcode_fld` text NOT NULL,
  `authorid_fld` text NOT NULL,
  `forumtitle_fld` text NOT NULL,
  `forumdesc_fld` text NOT NULL,
  `datetime_fld` datetime DEFAULT NULL,
  `isapproved_fld` tinyint(1) NOT NULL DEFAULT 0,
  `isdeleted_fld` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `game_tbl`
--

CREATE TABLE `game_tbl` (
  `studnum_fld` varchar(12) DEFAULT NULL,
  `recno_fld` int(11) NOT NULL,
  `taskcnt_fld` smallint(6) NOT NULL DEFAULT 0,
  `ftcnt_fld` smallint(6) NOT NULL DEFAULT 0,
  `cifcnt_fld` smallint(6) NOT NULL DEFAULT 0,
  `ciccnt_fld` smallint(6) NOT NULL DEFAULT 0,
  `piccnt_fld` smallint(6) NOT NULL DEFAULT 0,
  `pscorecnt_fld` smallint(6) NOT NULL DEFAULT 0,
  `class_on_time_fld` smallint(6) NOT NULL DEFAULT 0,
  `init_top_forum_fld` smallint(6) NOT NULL DEFAULT 0,
  `perfect_att_cnt_fld` smallint(6) NOT NULL DEFAULT 0,
  `experience_fld` smallint(6) NOT NULL DEFAULT 0,
  `points_fld` smallint(6) NOT NULL DEFAULT 0,
  `badges_acquired_fld` varchar(255) NOT NULL,
  `items_acquired_fld` varchar(255) NOT NULL,
  `taskcnt_fld_limit` int(2) NOT NULL DEFAULT 5,
  `reset_date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `game_tbl`
--

INSERT INTO `game_tbl` (`studnum_fld`, `recno_fld`, `taskcnt_fld`, `ftcnt_fld`, `cifcnt_fld`, `ciccnt_fld`, `piccnt_fld`, `pscorecnt_fld`, `class_on_time_fld`, `init_top_forum_fld`, `perfect_att_cnt_fld`, `experience_fld`, `points_fld`, `badges_acquired_fld`, `items_acquired_fld`, `taskcnt_fld_limit`, `reset_date`) VALUES
('290010001', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', 5, '2022-06-29'),
('290010002', 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', 5, '2022-07-22'),
('290010003', 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', 5, '2022-07-22'),
('290010004', 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', 5, '2022-07-22'),
('290010005', 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', 5, '2022-07-22'),
('290010006', 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', 5, '2022-07-22'),
('290010007', 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', 5, '2022-07-22');

-- --------------------------------------------------------

--
-- Table structure for table `groupmessage_tbl`
--

CREATE TABLE `groupmessage_tbl` (
  `messageid_fld` int(11) NOT NULL,
  `groupid_fld` int(11) NOT NULL,
  `sender_fld` text NOT NULL,
  `sendername_fld` text NOT NULL,
  `content_fld` varchar(255) NOT NULL,
  `attachment_fld` text NOT NULL,
  `datetime_fld` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `groupmessage_tbl`
--

INSERT INTO `groupmessage_tbl` (`messageid_fld`, `groupid_fld`, `sender_fld`, `sendername_fld`, `content_fld`, `attachment_fld`, `datetime_fld`) VALUES
(19, 17, 'balce.melner', 'Melner Balce', 'asdasd', '', '2022-06-21 06:49:32'),
(20, 17, 'balce.melner', 'Melner Balce', 'hello', '', '2022-06-21 06:49:56'),
(21, 18, 'balce.melner', 'Melner Balce', 'HELLO UNIFY', '', '2022-06-21 06:51:05'),
(22, 17, 'balce.melner', 'Melner Balce', 'HI', '', '2022-06-21 06:51:20'),
(23, 17, 'balce.melner', 'Melner Balce', 'asd', '', '2022-06-23 13:01:43'),
(24, 17, 'balce.melner', 'Melner Balce', 'hello', '', '2022-06-23 21:50:41'),
(25, 17, '201811259', 'Bernie Jr.', '123', '', '2022-06-23 21:57:03'),
(26, 17, 'balce.melner', 'Melner Balce', '1', '', '2022-06-23 21:57:09'),
(27, 17, '201811259', 'Bernie Jr.', 'hi', '', '2022-06-23 21:57:41'),
(28, 17, 'balce.melner', 'Melner Balce', 'hello', '', '2022-06-23 21:57:45'),
(29, 17, '201811259', 'Bernie Jr.', 'hi\\', '', '2022-06-23 22:02:06'),
(30, 17, '201811259', 'Bernie Jr.', 'hello', '', '2022-06-23 22:12:05'),
(31, 17, '201811259', 'Bernie Jr.', 'hi', '', '2022-06-23 22:13:41'),
(32, 17, '201811259', 'Bernie Jr.', 'hello', '', '2022-06-23 22:18:10'),
(33, 17, 'balce.melner', 'undefined', 'hi', '', '2022-06-26 14:16:54'),
(34, 17, '201811259', 'Bernie Jr.', 'hi', '', '2022-06-26 14:20:55'),
(35, 17, 'balce.melner', 'undefined', '1', '', '2022-06-26 14:23:12'),
(36, 17, 'balce.melner', 'undefined', '2', '', '2022-06-26 14:26:55'),
(37, 17, 'balce.melner', 'undefined', '1', '', '2022-06-26 14:28:27'),
(38, 19, 'balce.melner', 'Melner Balce', 'Hello', '', '2022-07-08 08:52:33'),
(39, 19, 'balce.melner', 'Melner Balce', 'Hiii', '', '2022-07-08 08:52:36'),
(40, 20, 'balce.melner', 'Melner Balce', 'Helllloooo', '', '2022-07-08 08:52:46'),
(41, 19, 'testaccount', 'Juan Dela Cruz', 'Hello', '', '2022-07-08 09:00:18'),
(42, 19, 'balce.melner', 'Melner Balce', 'Hiiii', '', '2022-07-08 14:58:36'),
(43, 20, 'balce.melner', 'Melner Balce', 'Hiiii', '', '2022-07-08 14:58:53'),
(44, 19, 'balce.melner', 'Melner Balce', 'Hellooo', '', '2022-07-08 14:58:59'),
(45, 20, 'balce.melner', 'Melner Balce', 'Hello', '', '2022-07-08 14:59:14'),
(46, 20, 'balce.melner', 'Melner Balce', 'dasdasdsd', '', '2022-07-08 14:59:50'),
(47, 20, 'balce.melner', 'Melner Balce', 'kdasl;dkasl;kdals;d', '', '2022-07-08 15:00:43'),
(48, 19, 'testaccount', 'Juan Dela Cruz', 'kdjakljdklsjd', '', '2022-07-09 04:27:05'),
(49, 20, 'balce.melner', 'Melner Balce', 'jdasl;kdjklasjd', '', '2022-07-09 04:27:10'),
(50, 20, 'balce.melner', 'Melner Balce', 'Hello guys!', '', '2022-07-09 04:27:21'),
(51, 20, 'testaccount', 'Juan Dela Cruz', 'Hehehe', '', '2022-07-09 04:27:24'),
(52, 20, 'balce.melner', 'Melner Balce', 'Hello Juan!', '', '2022-07-09 04:27:30'),
(53, 20, 'testaccount', 'Juan Dela Cruz', 'Hii sir', '', '2022-07-09 04:27:34'),
(54, 20, 'testaccount', 'Juan Dela Cruz', 'how are you', '', '2022-07-09 04:27:43'),
(55, 20, 'testaccount', 'Juan Dela Cruz', '???', '', '2022-07-09 04:27:45'),
(56, 20, 'balce.melner', 'Melner Balce', 'okay naman po sir', '', '2022-07-09 04:27:49'),
(57, 20, 'balce.melner', 'Melner Balce', ':))', '', '2022-07-09 04:27:50'),
(58, 20, 'testaccount', 'Juan Dela Cruz', 'dkas;lk;slkd', '', '2022-07-09 04:27:53'),
(59, 20, 'balce.melner', 'Melner Balce', 'kda;lkd;aslkd', '', '2022-07-09 04:27:55'),
(60, 20, 'testaccount', 'Juan Dela Cruz', 'kdas;l\'dk;laskdl', '', '2022-07-09 04:27:58'),
(61, 20, 'testaccount', 'Juan Dela Cruz', 'heheeh', '', '2022-07-09 04:28:06'),
(62, 20, 'balce.melner', 'Melner Balce', 'Helllo', '', '2022-07-09 04:28:12'),
(63, 20, 'balce.melner', 'Melner Balce', 'adl;askd', '', '2022-07-09 04:28:14'),
(64, 20, 'balce.melner', 'Melner Balce', 'adklasjdkljasd', '', '2022-07-09 04:28:15'),
(65, 20, 'testaccount', 'Juan Dela Cruz', 'kdal;skd;laskd;askd', '', '2022-07-09 04:28:19'),
(66, 20, 'testaccount', 'Juan Dela Cruz', 'jdaslkjd', '', '2022-07-09 04:28:21'),
(67, 20, 'testaccount', 'Juan Dela Cruz', 'dlas\';l;\'ald', '', '2022-07-09 04:28:28'),
(68, 19, 'testaccount', 'Juan Dela Cruz', ' ', '', '2022-07-09 04:29:42'),
(69, 19, 'balce.melner', 'Melner Balce', ' ', '', '2022-07-09 04:29:46'),
(70, 19, 'testaccount', 'Juan Dela Cruz', 'dasdasdsad', '', '2022-07-09 04:29:50'),
(71, 20, 'testaccount', 'Juan Dela Cruz', 'dkas;lkd;alskd', '', '2022-07-09 04:30:03'),
(72, 20, 'testaccount', 'Juan Dela Cruz', 'dasdasdasd', '', '2022-07-09 04:30:12'),
(73, 19, 'balce.melner', 'Melner Balce', 'Hello', '', '2022-07-09 04:30:48'),
(74, 19, 'balce.melner', 'Melner Balce', 'dasdasda', '', '2022-07-09 04:31:58'),
(75, 20, 'balce.melner', 'Melner Balce', 'kdlak;sdkasd', '', '2022-07-09 04:34:43'),
(76, 19, 'balce.melner', 'Melner Balce', 'da;ldkaslkd', '', '2022-07-09 04:35:50'),
(77, 19, 'balce.melner', 'Melner Balce', 'akjdhasjkdhaskjhdas', '', '2022-07-09 04:35:54'),
(78, 19, 'balce.melner', 'Melner Balce', 'dasdsdsad', '', '2022-07-09 04:37:15'),
(79, 19, 'balce.melner', 'Melner Balce', 'dasdsd', '', '2022-07-09 04:38:22'),
(80, 19, 'balce.melner', 'Melner Balce', 'dasdasdsd', '', '2022-07-09 04:39:32'),
(81, 19, 'balce.melner', 'Melner Balce', '', '', '2022-07-09 04:41:59'),
(82, 19, 'balce.melner', 'Melner Balce', 'dasdasd', '', '2022-07-09 04:43:33'),
(83, 19, 'balce.melner', 'Melner Balce', 'dasdsad', '', '2022-07-09 04:45:16'),
(84, 20, 'balce.melner', 'Melner Balce', 'daskdaskld', '', '2022-07-09 04:52:14'),
(85, 19, 'testaccount', 'Juan Dela Cruz', 'dasdsd', '', '2022-07-10 02:18:01'),
(86, 19, 'testaccount', 'Juan Dela Cruz', 'd;kasjd;lajskd', '', '2022-07-10 02:18:03'),
(87, 21, 'balce.melner', 'Melner Balce', 'Hello ', '', '2022-07-20 08:42:49'),
(88, 21, 'balce.melner', 'Melner Balce', 'Hi everyone', '', '2022-07-20 08:42:53'),
(89, 21, 'balce.melner', 'Melner Balce', 'Noice', '', '2022-07-20 08:43:02'),
(90, 21, 'balce.melner', 'Melner Balce', 'dasdsd', '', '2022-07-20 10:46:52'),
(91, 23, 'balce.melner', 'Melner Balce', 'hello', '', '2022-07-22 11:00:49'),
(92, 25, 'balce.melner', 'Melner Balce', 'shesh', '', '2023-04-24 14:11:50'),
(93, 26, 'balce.melner', 'Melner Balce', 'Another one Shesh', '', '2023-04-24 14:12:25');

-- --------------------------------------------------------

--
-- Table structure for table `groups_tbl`
--

CREATE TABLE `groups_tbl` (
  `groupid_fld` int(11) NOT NULL,
  `groupname_fld` text NOT NULL,
  `roomid_fld` text NOT NULL,
  `classcode_fld` text NOT NULL,
  `participants_fld` text NOT NULL,
  `createdate_fld` timestamp NOT NULL DEFAULT current_timestamp(),
  `isdeleted_fld` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `groups_tbl`
--

INSERT INTO `groups_tbl` (`groupid_fld`, `groupname_fld`, `roomid_fld`, `classcode_fld`, `participants_fld`, `createdate_fld`, `isdeleted_fld`) VALUES
(23, 'Flash Coders', '943227f6-4ba1-4e90-b602-53b3599d9da7', '31748', 'balce.melner, 290010004, 290010001, 290010003, 290010002', '2022-07-22 11:00:46', 0),
(24, 'Flash 2023', '24b2c087-7056-4abf-914b-cc7afe7e1e41', '31748', 'balce.melner, 290010006, 290010001, 290010003, 290010002', '2023-04-24 14:06:32', 0),
(25, 'Test Group', '951d7b3e-81c1-4450-a998-b69275a3676b', '31748', 'balce.melner, 290010004, 290010006, 290010001, 290010003', '2023-04-24 14:11:45', 0),
(26, 'Another One', 'c8a32c38-2e6e-4316-8b9d-f4454b8241e6', '31748', 'balce.melner, 290010004, 290010006, 290010001, 290010003', '2023-04-24 14:12:17', 0);

-- --------------------------------------------------------

--
-- Table structure for table `messages_tbl`
--

CREATE TABLE `messages_tbl` (
  `recno_fld` int(11) NOT NULL,
  `messagecode_fld` varchar(11) NOT NULL,
  `roomcode_fld` text NOT NULL,
  `roommember_fld` text NOT NULL,
  `authorid_fld` varchar(11) NOT NULL,
  `content_fld` text NOT NULL,
  `datetime_fld` datetime DEFAULT NULL,
  `isseen_fld` tinyint(1) NOT NULL DEFAULT 0,
  `isdeleted_fld` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mission_tbl`
--

CREATE TABLE `mission_tbl` (
  `recno_fld` int(11) NOT NULL,
  `mcode_fld` text NOT NULL,
  `taskcount_fld` int(6) NOT NULL,
  `taskcontent_fld` text NOT NULL,
  `tasktitle_fld` text NOT NULL,
  `badgedir_fld` text NOT NULL,
  `taskpoints_fld` tinyint(3) NOT NULL,
  `isdeleted_fld` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personnel_tbl`
--

CREATE TABLE `personnel_tbl` (
  `recno_fld` int(11) NOT NULL,
  `empcode_fld` varchar(10) NOT NULL,
  `honorifics_fld` varchar(5) NOT NULL,
  `fname_fld` text NOT NULL,
  `mname_fld` text NOT NULL,
  `lname_fld` text NOT NULL,
  `extname_fld` text NOT NULL,
  `bdate_fld` date DEFAULT NULL,
  `sex_fld` tinyint(1) NOT NULL DEFAULT 0,
  `dept_fld` text NOT NULL,
  `teachdept_fld` text NOT NULL,
  `program_fld` text NOT NULL,
  `position_fld` text NOT NULL,
  `empstatus_fld` tinyint(1) NOT NULL,
  `specialization_fld` text NOT NULL,
  `educ_fld` text NOT NULL,
  `assignment_fld` text NOT NULL,
  `effectivity_fld` date DEFAULT NULL,
  `email_fld` varchar(200) NOT NULL,
  `pword_fld` text NOT NULL,
  `token_fld` text NOT NULL,
  `role_fld` tinyint(2) NOT NULL DEFAULT 0,
  `forumrole_fld` tinyint(1) NOT NULL,
  `accesspanel_fld` tinyint(2) NOT NULL,
  `folderid_fld` tinytext NOT NULL,
  `numpreps_fld` tinyint(2) NOT NULL,
  `image_fld` text NOT NULL,
  `esign_fld` text NOT NULL,
  `approvedifl_fld` tinyint(1) NOT NULL DEFAULT 0,
  `socketid_fld` int(5) NOT NULL,
  `ispwordtochange` tinyint(1) NOT NULL DEFAULT 0,
  `isiflapproved_fld` tinyint(1) NOT NULL DEFAULT 0,
  `isdeleted_fld` tinyint(1) NOT NULL DEFAULT 0,
  `iscovax_fld` tinyint(1) NOT NULL DEFAULT 0,
  `covaxtype_fld` tinyint(1) NOT NULL DEFAULT 0,
  `nocovaxreason_fld` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personnel_tbl`
--

INSERT INTO `personnel_tbl` (`recno_fld`, `empcode_fld`, `honorifics_fld`, `fname_fld`, `mname_fld`, `lname_fld`, `extname_fld`, `bdate_fld`, `sex_fld`, `dept_fld`, `teachdept_fld`, `program_fld`, `position_fld`, `empstatus_fld`, `specialization_fld`, `educ_fld`, `assignment_fld`, `effectivity_fld`, `email_fld`, `pword_fld`, `token_fld`, `role_fld`, `forumrole_fld`, `accesspanel_fld`, `folderid_fld`, `numpreps_fld`, `image_fld`, `esign_fld`, `approvedifl_fld`, `socketid_fld`, `ispwordtochange`, `isiflapproved_fld`, `isdeleted_fld`, `iscovax_fld`, `covaxtype_fld`, `nocovaxreason_fld`) VALUES
(40, 'GC1', 'Mr', 'Melner', '', 'Balce', '', '1985-04-04', 1, 'OVPAF - MIS Unit', 'CCS', 'BSCS', 'Admin Assistant II', 1, 'Computer Science', 'BSCS, MBM (36units)', 'Web Administrator, Lead Developer', '2022-01-24', 'balce.melner@gordoncollege.edu.ph', '$2b$12$exlKhjEJIuJNBesS8uPNcuqUVdSRN./HBT5OzU9zgMpTT.MUpvAMq', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImFwcCI6IkdDIFN5c3RlbXMiLCJkZXYiOiJHQyBEZXZlbG9wZXJzIn0=.eyJ1YyI6IkdDMSIsInVlIjoiYmFsY2UubWVsbmVyQGdvcmRvbmNvbGxlZ2UuZWR1LnBoIiwiaXRvIjoiTWVsbmVyIEJhbGNlIiwiaWJ5IjoiR0MgRGV2ZWxvcGVycyIsImllIjoiZ2NkZXZlbG9wZXJzQGdvcmRvbmNvbGxlZ2UuZWR1LnBoIiwiaWRhdGUiOnsiZGF0ZSI6IjIwMjQtMTItMjQgMjI6MzA6MjYuNjY1MDczIiwidGltZXpvbmVfdHlwZSI6MywidGltZXpvbmUiOiJBc2lhXC9NYW5pbGEifSwiZXhwIjoiMjAyNC0xMi0yNCAyMjozMDoyNiJ9.ZGM3YjBlOGFhYmJkYjAzMDZmNzMyMGNjZDk5MjZhNzNmMjU0ZDg2OTEwYjUzMWFlZTUyYjhkMmU3NWE2MzM3MQ==', 2, 0, 0, '', 3, 'gcesuploads/GC20200036/2x2Photo1.png', 'gcesuploads/GC20200036/Signature.png', 0, 0, 1, 0, 0, 1, 4, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pollresponse_tbl`
--

CREATE TABLE `pollresponse_tbl` (
  `recno_fld` int(11) NOT NULL,
  `respcode_fld` text NOT NULL,
  `postcode_fld` text NOT NULL,
  `studnum_fld` text NOT NULL,
  `response_fld` tinyint(2) NOT NULL,
  `datetime_fld` datetime DEFAULT NULL,
  `isdeleted_fld` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `resource_tbl`
--

CREATE TABLE `resource_tbl` (
  `recno_fld` int(11) NOT NULL,
  `rescode_fld` text NOT NULL,
  `topiccode_fld` varchar(20) NOT NULL DEFAULT '0',
  `classcode_fld` text NOT NULL,
  `authorid_fld` text NOT NULL,
  `title_fld` text NOT NULL,
  `desc_fld` text NOT NULL,
  `filedir_fld` text NOT NULL,
  `withfile_fld` tinyint(4) NOT NULL,
  `datetime_fld` datetime DEFAULT NULL,
  `datesched_fld` datetime DEFAULT NULL,
  `isedited_fld` tinyint(1) NOT NULL DEFAULT 0,
  `dtedit_fld` datetime DEFAULT NULL,
  `isdeleted_fld` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings_tbl`
--

CREATE TABLE `settings_tbl` (
  `recno_fld` int(11) NOT NULL,
  `start_fld` date NOT NULL,
  `end_fld` date NOT NULL,
  `acadyear_fld` varchar(9) NOT NULL,
  `sem_fld` tinyint(1) NOT NULL,
  `enstart_fld` date NOT NULL,
  `enend_fld` date NOT NULL,
  `isactive_fld` tinyint(1) NOT NULL,
  `year_fld` tinytext NOT NULL,
  `studnumseq_fld` int(11) NOT NULL,
  `facultyseq_fld` int(4) NOT NULL,
  `activeterm_fld` tinyint(1) NOT NULL DEFAULT 1,
  `evalopen_fld` tinyint(1) NOT NULL DEFAULT 0,
  `activeenlistment_fld` tinyint(1) NOT NULL DEFAULT 0,
  `activeevaluation_fld` tinyint(1) NOT NULL DEFAULT 0,
  `isadddropopen_fld` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings_tbl`
--

INSERT INTO `settings_tbl` (`recno_fld`, `start_fld`, `end_fld`, `acadyear_fld`, `sem_fld`, `enstart_fld`, `enend_fld`, `isactive_fld`, `year_fld`, `studnumseq_fld`, `facultyseq_fld`, `activeterm_fld`, `evalopen_fld`, `activeenlistment_fld`, `activeevaluation_fld`, `isadddropopen_fld`) VALUES
(4, '2022-07-01', '2022-07-30', '2021-2022', 1, '2022-04-01', '2022-04-30', 0, '2021', 1331, 34, 2, 0, 0, 0, 0),
(5, '2021-12-06', '2022-01-17', '2021-2022', 2, '2022-04-01', '2022-04-30', 0, '2022', 1331, 22, 2, 0, 0, 1, 0),
(6, '2022-08-21', '2022-12-30', '2021-2022', 3, '2022-05-30', '2022-08-30', 0, '2022', 1331, 22, 2, 0, 0, 0, 1),
(7, '2022-07-01', '2022-07-30', '2021-2022', 1, '2022-04-01', '2022-04-30', 0, '2021', 1331, 34, 2, 0, 0, 0, 0),
(8, '2024-12-04', '2025-01-10', '2024-2025', 2, '2024-10-07', '2024-11-07', 1, '2024', 1331, 22, 1, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `slots_tbl`
--

CREATE TABLE `slots_tbl` (
  `recno_fld` int(11) NOT NULL,
  `dept_fld` varchar(10) NOT NULL,
  `program_fld` varchar(20) NOT NULL,
  `block_fld` varchar(20) NOT NULL,
  `taken_fld` int(11) NOT NULL,
  `limit_fld` int(11) NOT NULL,
  `ay_fld` varchar(9) NOT NULL,
  `sem_fld` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students_tbl`
--

CREATE TABLE `students_tbl` (
  `recno_fld` int(11) NOT NULL,
  `studnum_fld` varchar(10) NOT NULL,
  `fname_fld` text NOT NULL,
  `mname_fld` text DEFAULT NULL,
  `lname_fld` text NOT NULL,
  `extname_fld` varchar(4) DEFAULT NULL,
  `sex_fld` tinyint(1) NOT NULL DEFAULT 0,
  `sexorient_fld` tinyint(1) NOT NULL DEFAULT 0,
  `gender_fld` tinyint(1) NOT NULL DEFAULT 0,
  `civilstatus_fld` tinyint(1) NOT NULL DEFAULT 0,
  `religion_fld` text DEFAULT NULL,
  `nationality_fld` text DEFAULT NULL,
  `birthdate_fld` date DEFAULT NULL,
  `birthplace_fld` text DEFAULT NULL,
  `profilepic_fld` text DEFAULT NULL,
  `email_fld` text NOT NULL,
  `contactnum_fld` varchar(11) DEFAULT NULL,
  `region_fld` text DEFAULT NULL,
  `province_fld` text DEFAULT NULL,
  `city_fld` text DEFAULT NULL,
  `brgy_fld` text DEFAULT NULL,
  `house_fld` text DEFAULT NULL,
  `zipcode_fld` varchar(8) DEFAULT NULL,
  `region2_fld` text DEFAULT NULL,
  `province2_fld` text DEFAULT NULL,
  `city2_fld` text DEFAULT NULL,
  `brgy2_fld` text DEFAULT NULL,
  `house2_fld` text DEFAULT NULL,
  `zipcode2_fld` varchar(8) DEFAULT NULL,
  `siblings_fld` tinyint(2) DEFAULT 0,
  `father_fld` text DEFAULT NULL,
  `fatherbdate_fld` date DEFAULT NULL,
  `isfatherdeceased` tinyint(1) NOT NULL DEFAULT 0,
  `fatherjob_fld` text DEFAULT NULL,
  `fathercontactno_fld` varchar(11) DEFAULT NULL,
  `mother_fld` text DEFAULT NULL,
  `motherbdate_fld` date DEFAULT NULL,
  `ismotherdeceased` tinyint(1) NOT NULL DEFAULT 0,
  `motherjob_fld` text DEFAULT NULL,
  `mothercontactno_fld` varchar(11) DEFAULT NULL,
  `emergencycontact_fld` text DEFAULT NULL,
  `emergencynum_fld` varchar(11) DEFAULT NULL,
  `emergencyrelation_fld` text DEFAULT NULL,
  `emergencyaddress_fld` text DEFAULT NULL,
  `famincome_fld` tinyint(1) NOT NULL DEFAULT 0,
  `dept_fld` text DEFAULT NULL,
  `program_fld` text DEFAULT NULL,
  `choice1_fld` text DEFAULT NULL,
  `choice2_fld` text DEFAULT NULL,
  `choice3_fld` text DEFAULT NULL,
  `coursereason_fld` text DEFAULT NULL,
  `scholartype_fld` text DEFAULT NULL,
  `istransferee_fld` tinyint(1) NOT NULL DEFAULT 0,
  `transschool_fld` text DEFAULT NULL,
  `transcourse_fld` text DEFAULT NULL,
  `transyearlevel_fld` tinyint(1) NOT NULL DEFAULT 0,
  `shs_fld` text DEFAULT NULL,
  `shsclass_fld` tinyint(1) NOT NULL DEFAULT 0,
  `shsstrand_fld` varchar(15) DEFAULT NULL,
  `shsgrade` decimal(4,2) NOT NULL DEFAULT 0.00,
  `lrn_fld` text DEFAULT NULL,
  `awards_fld` text DEFAULT NULL,
  `org_fld` text DEFAULT NULL,
  `orgposition_fld` text DEFAULT NULL,
  `interest_fld` text DEFAULT NULL,
  `talent_fld` text DEFAULT NULL,
  `competition_fld` text DEFAULT NULL,
  `support_fld` text DEFAULT NULL,
  `supporoccupation_fld` text DEFAULT NULL,
  `gcreason_fld` text DEFAULT NULL,
  `entrancerating_fld` text DEFAULT NULL,
  `havedesktop_fld` tinyint(1) NOT NULL DEFAULT 0,
  `havelaptop_fld` tinyint(1) NOT NULL DEFAULT 0,
  `havesmartphone_fld` tinyint(1) NOT NULL DEFAULT 0,
  `haveios_fld` tinyint(1) NOT NULL DEFAULT 0,
  `remarks_fld` text DEFAULT NULL,
  `govtmember_fld` text DEFAULT NULL,
  `iptype_fld` text DEFAULT NULL,
  `govthouseholdno_fld` varchar(15) DEFAULT NULL,
  `govtmemberothers_fld` text DEFAULT NULL,
  `ispwd_fld` tinyint(1) NOT NULL DEFAULT 0,
  `pwd_fld` text DEFAULT NULL,
  `ethnicity_fld` text DEFAULT NULL,
  `iswithparents_fld` tinyint(1) NOT NULL DEFAULT 0,
  `familymembers_fld` tinyint(2) NOT NULL DEFAULT 0,
  `homeown_fld` text DEFAULT NULL,
  `incomesource_fld` text DEFAULT NULL,
  `employstatus_fld` text DEFAULT NULL,
  `worksched_fld` tinyint(1) NOT NULL DEFAULT 0,
  `employparents_fld` text DEFAULT NULL,
  `empcatparents_fld` text DEFAULT NULL,
  `cursourceincome_fld` text DEFAULT NULL,
  `philhealthnum_fld` text DEFAULT NULL,
  `healthcondition_fld` tinyint(1) NOT NULL DEFAULT 0,
  `lastupdated_fld` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students_tbl`
--

INSERT INTO `students_tbl` (`recno_fld`, `studnum_fld`, `fname_fld`, `mname_fld`, `lname_fld`, `extname_fld`, `sex_fld`, `sexorient_fld`, `gender_fld`, `civilstatus_fld`, `religion_fld`, `nationality_fld`, `birthdate_fld`, `birthplace_fld`, `profilepic_fld`, `email_fld`, `contactnum_fld`, `region_fld`, `province_fld`, `city_fld`, `brgy_fld`, `house_fld`, `zipcode_fld`, `region2_fld`, `province2_fld`, `city2_fld`, `brgy2_fld`, `house2_fld`, `zipcode2_fld`, `siblings_fld`, `father_fld`, `fatherbdate_fld`, `isfatherdeceased`, `fatherjob_fld`, `fathercontactno_fld`, `mother_fld`, `motherbdate_fld`, `ismotherdeceased`, `motherjob_fld`, `mothercontactno_fld`, `emergencycontact_fld`, `emergencynum_fld`, `emergencyrelation_fld`, `emergencyaddress_fld`, `famincome_fld`, `dept_fld`, `program_fld`, `choice1_fld`, `choice2_fld`, `choice3_fld`, `coursereason_fld`, `scholartype_fld`, `istransferee_fld`, `transschool_fld`, `transcourse_fld`, `transyearlevel_fld`, `shs_fld`, `shsclass_fld`, `shsstrand_fld`, `shsgrade`, `lrn_fld`, `awards_fld`, `org_fld`, `orgposition_fld`, `interest_fld`, `talent_fld`, `competition_fld`, `support_fld`, `supporoccupation_fld`, `gcreason_fld`, `entrancerating_fld`, `havedesktop_fld`, `havelaptop_fld`, `havesmartphone_fld`, `haveios_fld`, `remarks_fld`, `govtmember_fld`, `iptype_fld`, `govthouseholdno_fld`, `govtmemberothers_fld`, `ispwd_fld`, `pwd_fld`, `ethnicity_fld`, `iswithparents_fld`, `familymembers_fld`, `homeown_fld`, `incomesource_fld`, `employstatus_fld`, `worksched_fld`, `employparents_fld`, `empcatparents_fld`, `cursourceincome_fld`, `philhealthnum_fld`, `healthcondition_fld`, `lastupdated_fld`) VALUES
(7711, '290010001', 'Austin Ray', 'Reyes', 'Aranda', '', 1, 2, 2, 2, 'ROMAN CATHOLIC', 'FILIPINO', '2001-07-03', 'DINALUPIHAN BATAAN', 'gcesuploads/201910941/Profile/2x2Photo1.png', 'testaccount@gordoncollege.edu.ph', '09202020202', 'REGION II (CAGAYAN VALLEY)', 'CAGAYAN', 'ABULUG', 'Bagu', 'Elicaño Street', '2200', 'REGION III (CENTRAL LUZON)', 'BATAAN', 'DINALUPIHAN', 'Roosevelt', '19 PUROK 2A ', '2110', 4, 'ERWIN LIMQUE ABABAN', '1966-04-13', 0, 'VENDOR', '09151375031', '123 123 123', '1971-10-24', 0, 'VENDOR', '', 'Erwin limque Ababan', '09151375031', 'Father', '19 purok 2a Roosevelt dinalupihan bataan', 2, 'CCS', 'BSIT', '', '', '', '', 'FHE', 0, '', '', 0, 'COLUMBAN COLLEGE INC', 0, 'ABM', 0.00, '', '', '', '', 'false,false,false,true,false,', 'false,false,false,false,false,', '', 'FATHER AND MOTHER', 'VENDOR', '', '', 0, 0, 1, 0, '', 'false,false,false,false,false,false,false', '', '', '', 2, '', 'Tagalog', 2, 6, 'Mortgage', 'Pension', 'Working Student', 1, 'Employed', 'Self-Employed', 'Salary', '', 1, '2022-07-22 10:30:50'),
(7718, '290010002', 'Bernie Jr', 'Legua', 'Inociete', '', 1, 2, 2, 2, 'ROMAN CATHOLIC', 'FILIPINO', '2001-07-03', 'DINALUPIHAN BATAAN', 'gcesuploads/201910941/Profile/2x2Photo1.png', 'testaccount1@gordoncollege.edu.ph', '09202020202', 'REGION II (CAGAYAN VALLEY)', 'CAGAYAN', 'ABULUG', 'Bagu', 'Elicaño Street', '2200', 'REGION III (CENTRAL LUZON)', 'BATAAN', 'DINALUPIHAN', 'Roosevelt', '19 PUROK 2A ', '2110', 4, 'ERWIN LIMQUE ABABAN', '1966-04-13', 0, 'VENDOR', '09151375031', 'dasdasd asdasdasd asdasdasd', '1971-10-24', 0, 'VENDOR', '', 'Erwin limque Ababan', '09151375031', 'Father', '19 purok 2a Roosevelt dinalupihan bataan', 2, 'CCS', 'BSIT', '', '', '', '', 'FHE', 0, '', '', 0, 'COLUMBAN COLLEGE INC', 0, 'ABM', 0.00, '', '', '', '', 'false,false,false,true,false,', 'false,false,false,false,false,', '', 'FATHER AND MOTHER', 'VENDOR', '', '', 0, 0, 1, 0, '', 'false,false,false,false,false,false,false', '', '', '', 2, '', 'Tagalog', 2, 6, 'Mortgage', 'Pension', 'Working Student', 1, 'Employed', 'Self-Employed', 'Salary', '', 1, '2022-07-22 10:33:42'),
(7789, '290010003', 'Ralph Martin', 'Primero', 'Flores', '', 1, 2, 2, 2, 'ROMAN CATHOLIC', 'FILIPINO', '2001-07-03', 'DINALUPIHAN BATAAN', 'gcesuploads/201910941/Profile/2x2Photo1.png', 'testaccount2@gordoncollege.edu.ph', '09202020202', 'REGION II (CAGAYAN VALLEY)', 'CAGAYAN', 'ABULUG', 'Bagu', 'Elicaño Street', '2200', 'REGION III (CENTRAL LUZON)', 'BATAAN', 'DINALUPIHAN', 'Roosevelt', '19 PUROK 2A ', '2110', 4, 'ERWIN LIMQUE ABABAN', '1966-04-13', 0, 'VENDOR', '09151375031', 'dadasd sdasd sdasdasd', '1971-10-24', 0, 'VENDOR', '', 'Erwin limque Ababan', '09151375031', 'Father', '19 purok 2a Roosevelt dinalupihan bataan', 2, 'CCS', 'BSIT', '', '', '', '', 'FHE', 0, '', '', 0, 'COLUMBAN COLLEGE INC', 0, 'ABM', 0.00, '', '', '', '', 'false,false,false,true,false,', 'false,false,false,false,false,', '', 'FATHER AND MOTHER', 'VENDOR', '', '', 0, 0, 1, 0, '', 'false,false,false,false,false,false,false', '', '', '', 2, '', 'Tagalog', 2, 6, 'Mortgage', 'Pension', 'Working Student', 1, 'Employed', 'Self-Employed', 'Salary', '', 1, '2022-07-22 10:34:35'),
(7790, '290010004', 'Christian', 'Victoria', 'Alip', '', 1, 2, 2, 2, 'ROMAN CATHOLIC', 'FILIPINO', '2001-07-03', 'DINALUPIHAN BATAAN', 'gcesuploads/201910941/Profile/2x2Photo1.png', 'testaccount3@gordoncollege.edu.ph', '09202020202', 'REGION II (CAGAYAN VALLEY)', 'CAGAYAN', 'ABULUG', 'Bagu', 'Elicaño Street', '2200', 'REGION III (CENTRAL LUZON)', 'BATAAN', 'DINALUPIHAN', 'Roosevelt', '19 PUROK 2A ', '2110', 4, 'ERWIN LIMQUE ABABAN', '1966-04-13', 0, 'VENDOR', '09151375031', 'asdasdas dasd sdasdasd', '1971-10-24', 0, 'VENDOR', '', 'Erwin limque Ababan', '09151375031', 'Father', '19 purok 2a Roosevelt dinalupihan bataan', 2, 'CCS', 'BSIT', '', '', '', '', 'FHE', 0, '', '', 0, 'COLUMBAN COLLEGE INC', 0, 'ABM', 0.00, '', '', '', '', 'false,false,false,true,false,', 'false,false,false,false,false,', '', 'FATHER AND MOTHER', 'VENDOR', '', '', 0, 0, 1, 0, '', 'false,false,false,false,false,false,false', '', '', '', 2, '', 'Tagalog', 2, 6, 'Mortgage', 'Pension', 'Working Student', 1, 'Employed', 'Self-Employed', 'Salary', '', 1, '2022-07-22 10:35:03'),
(7791, '290010005', 'Allen Eduard', 'Santos', 'Uy', '', 1, 2, 2, 2, 'ROMAN CATHOLIC', 'FILIPINO', '2001-07-03', 'DINALUPIHAN BATAAN', 'gcesuploads/201910941/Profile/2x2Photo1.png', 'testaccount4@gordoncollege.edu.ph', '09202020202', 'REGION II (CAGAYAN VALLEY)', 'CAGAYAN', 'ABULUG', 'Bagu', 'Elicaño Street', '2200', 'REGION III (CENTRAL LUZON)', 'BATAAN', 'DINALUPIHAN', 'Roosevelt', '19 PUROK 2A ', '2110', 4, 'ERWIN LIMQUE ABABAN', '1966-04-13', 0, 'VENDOR', '09151375031', 'asdasd asda sdasdasd', '1971-10-24', 0, 'VENDOR', '', 'Erwin limque Ababan', '09151375031', 'Father', '19 purok 2a Roosevelt dinalupihan bataan', 2, 'CCS', 'BSIT', '', '', '', '', 'FHE', 0, '', '', 0, 'COLUMBAN COLLEGE INC', 0, 'ABM', 0.00, '', '', '', '', 'false,false,false,true,false,', 'false,false,false,false,false,', '', 'FATHER AND MOTHER', 'VENDOR', '', '', 0, 0, 1, 0, '', 'false,false,false,false,false,false,false', '', '', '', 2, '', 'Tagalog', 2, 6, 'Mortgage', 'Pension', 'Working Student', 1, 'Employed', 'Self-Employed', 'Salary', '', 1, '2022-07-22 10:35:17'),
(7792, '290010006', 'Micthell Evans', 'Bautista', 'Alop', '', 1, 2, 2, 2, 'ROMAN CATHOLIC', 'FILIPINO', '2001-07-03', 'DINALUPIHAN BATAAN', 'gcesuploads/201910941/Profile/2x2Photo1.png', 'testaccount5@gordoncollege.edu.ph', '09202020202', 'REGION II (CAGAYAN VALLEY)', 'CAGAYAN', 'ABULUG', 'Bagu', 'Elicaño Street', '2200', 'REGION III (CENTRAL LUZON)', 'BATAAN', 'DINALUPIHAN', 'Roosevelt', '19 PUROK 2A ', '2110', 4, 'ERWIN LIMQUE ABABAN', '1966-04-13', 0, 'VENDOR', '09151375031', 'asdasd asdasd asdasd', '1971-10-24', 0, 'VENDOR', '', 'Erwin limque Ababan', '09151375031', 'Father', '19 purok 2a Roosevelt dinalupihan bataan', 2, 'CCS', 'BSIT', '', '', '', '', 'FHE', 0, '', '', 0, 'COLUMBAN COLLEGE INC', 0, 'ABM', 0.00, '', '', '', '', 'false,false,false,true,false,', 'false,false,false,false,false,', '', 'FATHER AND MOTHER', 'VENDOR', '', '', 0, 0, 1, 0, '', 'false,false,false,false,false,false,false', '', '', '', 2, '', 'Tagalog', 2, 6, 'Mortgage', 'Pension', 'Working Student', 1, 'Employed', 'Self-Employed', 'Salary', '', 1, '2022-07-22 10:36:30'),
(7793, '290010007', 'Nicole', 'Bernal', 'Marcial', '', 1, 2, 2, 2, 'ROMAN CATHOLIC', 'FILIPINO', '2001-07-03', 'DINALUPIHAN BATAAN', 'gcesuploads/201910941/Profile/2x2Photo1.png', 'testaccount6@gordoncollege.edu.ph', '09202020202', 'REGION II (CAGAYAN VALLEY)', 'CAGAYAN', 'ABULUG', 'Bagu', 'Elicaño Street', '2200', 'REGION III (CENTRAL LUZON)', 'BATAAN', 'DINALUPIHAN', 'Roosevelt', '19 PUROK 2A ', '2110', 4, 'ERWIN LIMQUE ABABAN', '1966-04-13', 0, 'VENDOR', '09151375031', 'asdasdasd asdasdasd asdasd', '1971-10-24', 0, 'VENDOR', '', 'Erwin limque Ababan', '09151375031', 'Father', '19 purok 2a Roosevelt dinalupihan bataan', 2, 'CCS', 'BSIT', '', '', '', '', 'FHE', 0, '', '', 0, 'COLUMBAN COLLEGE INC', 0, 'ABM', 0.00, '', '', '', '', 'false,false,false,true,false,', 'false,false,false,false,false,', '', 'FATHER AND MOTHER', 'VENDOR', '', '', 0, 0, 1, 0, '', 'false,false,false,false,false,false,false', '', '', '', 2, '', 'Tagalog', 2, 6, 'Mortgage', 'Pension', 'Working Student', 1, 'Employed', 'Self-Employed', 'Salary', '', 1, '2022-07-22 10:39:22');

-- --------------------------------------------------------

--
-- Table structure for table `subforum_tbl`
--

CREATE TABLE `subforum_tbl` (
  `recno_fld` int(11) NOT NULL,
  `subcode_fld` text NOT NULL,
  `authorid_fld` text NOT NULL,
  `forumcode_fld` text NOT NULL,
  `subtitle_fld` text NOT NULL,
  `subdesc_fld` text NOT NULL,
  `datetime_fld` datetime DEFAULT NULL,
  `isapproved_fld` tinyint(1) NOT NULL DEFAULT 0,
  `views_fld` tinyint(1) NOT NULL DEFAULT 0,
  `type_fld` tinyint(1) NOT NULL DEFAULT 0,
  `isedited_fld` tinyint(1) NOT NULL DEFAULT 0,
  `dtedit_fld` datetime DEFAULT NULL,
  `isdeleted_fld` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subjects_tbl`
--

CREATE TABLE `subjects_tbl` (
  `recno_fld` int(11) NOT NULL,
  `subjcode_fld` text NOT NULL,
  `subjdesc_fld` text NOT NULL,
  `lecunits_fld` tinyint(1) NOT NULL,
  `labunits_fld` tinyint(1) NOT NULL,
  `rleunits_fld` tinyint(1) NOT NULL,
  `prereq_fld` text NOT NULL,
  `sem_fld` tinyint(1) NOT NULL,
  `yrlevel_fld` tinyint(1) NOT NULL,
  `curryear_fld` text NOT NULL,
  `dept_fld` text NOT NULL,
  `program_fld` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `submissions_tbl`
--

CREATE TABLE `submissions_tbl` (
  `recno_fld` int(11) NOT NULL,
  `submitcode_fld` text NOT NULL,
  `classcode_fld` text NOT NULL,
  `actcode_fld` text NOT NULL,
  `studnum_fld` text NOT NULL,
  `type_fld` tinyint(1) NOT NULL DEFAULT 0,
  `score_fld` smallint(3) NOT NULL DEFAULT 0,
  `dir_fld` text NOT NULL,
  `issubmitted_fld` tinyint(1) NOT NULL DEFAULT 0,
  `datetime_fld` datetime DEFAULT NULL,
  `isscored_fld` tinyint(1) NOT NULL DEFAULT 0,
  `dtscored_fld` datetime DEFAULT NULL,
  `comment_fld` text DEFAULT NULL,
  `isdeleted_fld` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `topic_tbl`
--

CREATE TABLE `topic_tbl` (
  `recno_fld` int(11) NOT NULL,
  `topiccode_fld` text NOT NULL,
  `classcode_fld` text NOT NULL,
  `topicname_fld` text NOT NULL,
  `isdeleted_fld` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts_tbl`
--
ALTER TABLE `accounts_tbl`
  ADD PRIMARY KEY (`recno_fld`),
  ADD UNIQUE KEY `studnum_fld` (`studnum_fld`);

--
-- Indexes for table `activity_tbl`
--
ALTER TABLE `activity_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- Indexes for table `announcements_tbl`
--
ALTER TABLE `announcements_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- Indexes for table `classcomments_tbl`
--
ALTER TABLE `classcomments_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- Indexes for table `classes_tbl`
--
ALTER TABLE `classes_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- Indexes for table `classpost_tbl`
--
ALTER TABLE `classpost_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- Indexes for table `courses_tbl`
--
ALTER TABLE `courses_tbl`
  ADD PRIMARY KEY (`recno_fld`),
  ADD KEY `name_fld` (`program_fld`(3072));

--
-- Indexes for table `department_tbl`
--
ALTER TABLE `department_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- Indexes for table `disapprove_tbl`
--
ALTER TABLE `disapprove_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- Indexes for table `enrolledsubj_tbl`
--
ALTER TABLE `enrolledsubj_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- Indexes for table `enrollstatus_tbl`
--
ALTER TABLE `enrollstatus_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- Indexes for table `forumcontent_tbl`
--
ALTER TABLE `forumcontent_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- Indexes for table `forums_tbl`
--
ALTER TABLE `forums_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- Indexes for table `game_tbl`
--
ALTER TABLE `game_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- Indexes for table `groupmessage_tbl`
--
ALTER TABLE `groupmessage_tbl`
  ADD PRIMARY KEY (`messageid_fld`);

--
-- Indexes for table `groups_tbl`
--
ALTER TABLE `groups_tbl`
  ADD PRIMARY KEY (`groupid_fld`);

--
-- Indexes for table `messages_tbl`
--
ALTER TABLE `messages_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- Indexes for table `mission_tbl`
--
ALTER TABLE `mission_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- Indexes for table `personnel_tbl`
--
ALTER TABLE `personnel_tbl`
  ADD PRIMARY KEY (`recno_fld`),
  ADD UNIQUE KEY `empcode_fld` (`empcode_fld`),
  ADD UNIQUE KEY `email_fld` (`email_fld`);

--
-- Indexes for table `pollresponse_tbl`
--
ALTER TABLE `pollresponse_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- Indexes for table `resource_tbl`
--
ALTER TABLE `resource_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- Indexes for table `settings_tbl`
--
ALTER TABLE `settings_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- Indexes for table `slots_tbl`
--
ALTER TABLE `slots_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- Indexes for table `students_tbl`
--
ALTER TABLE `students_tbl`
  ADD PRIMARY KEY (`recno_fld`),
  ADD UNIQUE KEY `studnum_fld` (`studnum_fld`);

--
-- Indexes for table `subforum_tbl`
--
ALTER TABLE `subforum_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- Indexes for table `subjects_tbl`
--
ALTER TABLE `subjects_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- Indexes for table `submissions_tbl`
--
ALTER TABLE `submissions_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- Indexes for table `topic_tbl`
--
ALTER TABLE `topic_tbl`
  ADD PRIMARY KEY (`recno_fld`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts_tbl`
--
ALTER TABLE `accounts_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7724;

--
-- AUTO_INCREMENT for table `activity_tbl`
--
ALTER TABLE `activity_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `announcements_tbl`
--
ALTER TABLE `announcements_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `classcomments_tbl`
--
ALTER TABLE `classcomments_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `classes_tbl`
--
ALTER TABLE `classes_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2481;

--
-- AUTO_INCREMENT for table `classpost_tbl`
--
ALTER TABLE `classpost_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `courses_tbl`
--
ALTER TABLE `courses_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `department_tbl`
--
ALTER TABLE `department_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `disapprove_tbl`
--
ALTER TABLE `disapprove_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enrolledsubj_tbl`
--
ALTER TABLE `enrolledsubj_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `enrollstatus_tbl`
--
ALTER TABLE `enrollstatus_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19734;

--
-- AUTO_INCREMENT for table `forumcontent_tbl`
--
ALTER TABLE `forumcontent_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `forums_tbl`
--
ALTER TABLE `forums_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `game_tbl`
--
ALTER TABLE `game_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `groupmessage_tbl`
--
ALTER TABLE `groupmessage_tbl`
  MODIFY `messageid_fld` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `groups_tbl`
--
ALTER TABLE `groups_tbl`
  MODIFY `groupid_fld` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `messages_tbl`
--
ALTER TABLE `messages_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mission_tbl`
--
ALTER TABLE `mission_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personnel_tbl`
--
ALTER TABLE `personnel_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=419;

--
-- AUTO_INCREMENT for table `pollresponse_tbl`
--
ALTER TABLE `pollresponse_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `resource_tbl`
--
ALTER TABLE `resource_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings_tbl`
--
ALTER TABLE `settings_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `slots_tbl`
--
ALTER TABLE `slots_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `students_tbl`
--
ALTER TABLE `students_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7794;

--
-- AUTO_INCREMENT for table `subforum_tbl`
--
ALTER TABLE `subforum_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subjects_tbl`
--
ALTER TABLE `subjects_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `submissions_tbl`
--
ALTER TABLE `submissions_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `topic_tbl`
--
ALTER TABLE `topic_tbl`
  MODIFY `recno_fld` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
