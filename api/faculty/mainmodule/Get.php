<?php
class Get
{
	protected $gm, $pdo;

	public function __construct(\PDO $pdo)
	{
		$this->gm = new GlobalMethods($pdo);
		$this->pdo = $pdo;
	}

	# Get References 
	public function getReference($table, $conditions)
	{
		$code = 404;
		$payload = null;
		$remarks = "failed";
		$message = "Unable to retrieve data";

		$sql = "SELECT * FROM $table";
		if ($conditions != null) {
			$sql .= " WHERE " . $conditions;
		}

		$res = $this->gm->executeQuery($sql);
		if ($res['code'] == 200) {
			$code = 200;
			$payload = $res['data'];
			$remarks = "success";
			$message = "Successfully retrieved requested data";
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}
	# End of references

	public function getNotif($userid)
	{
		$payload = null;
		$remarks = "failed";
		$message = "Unable to process data";
		$code = 403;
		$log = "../logs/lampstudent.log";

		$h = fopen($log, "r");

		$payload = [];

		while (($data = fgetcsv($h)) !== FALSE) {

			if (strpos($data[4], $userid) !== FALSE) {

				array_push($payload, array(
					"datetime" => $data[0],
					"module" => $data[2],
					"notification" => $data[3],
					"recipients" => $data[4]
				));
			}
		}
		fclose($h);
		if (count($payload) > 0) {
			$payload = array_slice(array_reverse($payload), 0, 10);
			$remarks = "success";
			$message = "Successfully retrieved requested data";
			$code = 200;
		} else {
			$payload = null;
		}

		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}


	public function ScoreQuiz($receivedPayload)
	{
		$answerJSON = $receivedPayload->answerfile;
		$quizFilepath = $receivedPayload->quizfile;

		$total = 0;
		$quiztotal = 0;

		$code = 403;
		$payload = null;
		$remarks = "failed";
		$message = "failed to score quiz";

		try {
			$quiz = json_decode(file_get_contents("../" . $quizFilepath));
			$answerkey = $quiz->answerkey->content;
			$answer = json_decode($answerJSON);


			foreach ($answer as $key => $value) {

				for ($i = 0; $i < count($answerkey); $i++) {
					if ($value->questionid == $answerkey[$i]->questionid) {
						$var1 = trim($value->answer);
						$var2 = trim($answerkey[$i]->answer);
						if (strcasecmp($var1, $var2) == 0) {
							$answer[$key]->points = $answerkey[$i]->score;
							$answer[$key]->mark = 1;
							// $answer[$key]->correctanswer = $answerkey[$i]->answer; 
							$total += $answerkey[$i]->score;
							$quiztotal += $answerkey[$i]->score;
						} else {
							$answer[$key]->points = 0;
							$answer[$key]->mark = 0;
							$quiztotal += $answerkey[$i]->score;
						}
					}
				}
			}
			$payload = array("result" => $answer, "totalscore" => $total, "quiztotal" => $quiz->quiz->total);
			$code = 200;
			$remarks = "success";
			$message = "succesfully scored quiz";
		} catch (Exception $e) {
		}

		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}

	public function getQuiz($receivedPayload)
	{
		$res = null;
		$filepath = $receivedPayload->filepath;
		$payload = null;
		$code = 404;
		$remarks = "failed";
		$message = "File not found";
		
		$res = json_decode(@file_get_contents("../" . $filepath));
		if ($res != null) {
			$payload = $res;
			$code = 200;
			$remarks = "success";
			$message = "Succesfully retrieved data";
		 }
		
		
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}


	public function getCommon($table, $postcode, $filter)
	{
		$code = 404;
		$payload = null;
		$remarks = "failed";
		$message = "Unable to retrieve data";

		$sql = "SELECT *, 
		IFNULL(
		(SELECT profilepic_fld FROM students_tbl WHERE studnum_fld=$table.authorid_fld),
		(SELECT image_fld FROM personnel_tbl WHERE empcode_fld=$table.authorid_fld)) 
		AS profilepic_fld,
		IFNULL(
		(SELECT CONCAT(fname_fld, ' ', lname_fld) FROM students_tbl WHERE studnum_fld=$table.authorid_fld),
		(SELECT CONCAT(fname_fld, ' ', lname_fld) FROM personnel_tbl WHERE empcode_fld=$table.authorid_fld)) 
		AS fullname_fld ";

		switch ($table) {
			case "classpost_tbl":
				$sql .= ",(SELECT COUNT(commentcode_fld) FROM classcomments_tbl WHERE actioncode_fld = classpost_tbl.postcode_fld AND isdeleted_fld = 0) 
			AS commentcount ";
				break;
			case "forums_tbl":
				$sql .=",(SELECT COUNT(subcode_fld) FROM subforum_tbl WHERE forumcode_fld = forums_tbl.forumcode_fld AND isdeleted_fld = 0) AS discussion ";
				break;
			case "subforum_tbl":
				$sql .=",(SELECT COUNT(contentcode_fld) FROM forumcontent_tbl WHERE subcode_fld = subforum_tbl.subcode_fld AND isdeleted_fld = 0) AS messages ";
				break;
			default:
				break;
		}

	
		$sql .= "FROM $table 
		WHERE $filter='$postcode'
		AND isdeleted_fld = 0 ";
		
		$sql .= "ORDER BY datetime_fld DESC LIMIT 1";

		$res = $this->gm->executeQuery($sql);
		
		if ($res['code'] == 200) {
			$code = 200;
			$payload = $res['data'];
			$remarks = "success";
			$message = "Successfully retrieved requested data";
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}

	# check query

	public function isSuccessQuery($res, $request)
	{
		$code = 404;
		$payload = null;
		$remarks = "Failed";
		$message = "Unable to retrieve $request";

		if ($res['code'] == 200) {
			$code = 200;
			$payload = $res['data'];
			$remarks = "success";
			$message = "Successfully retrieved all records requested";
		} else {
			$payload = null;
			$message = $res['errmsg'];
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}
	# end of check query

	# Get Posted Announcements and News

	public function getAnnouncements($receivedPayload, $role)
	{
		$dept = $receivedPayload->dept;
		$sql = "SELECT * FROM announcements_tbl WHERE isdeleted_fld = 0";
		$sql .= " AND (recipientcode_fld = '$dept' OR recipientcode_fld = 'GC') ORDER BY datetime_fld DESC";
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, 'announcements');
	}
	#End of getAnnouncements

	# Get Class list

	public function getClasslist($receivedPayload)
	{
		$email = $receivedPayload->email;
		$ay = $receivedPayload->acadyear;
		$sem = $receivedPayload->semester;
		$sql = "SELECT *, (SELECT COUNT(studnum_fld) FROM enrolledsubj_tbl WHERE enrolledsubj_tbl.classcode_fld = classes_tbl.classcode_fld) AS slots_fld FROM classes_tbl WHERE email_fld = '$email' AND ay_fld='$ay' AND sem_fld='$sem' GROUP BY classcode_fld";
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, 'classes');
	}

	# End of Get Class list

	# Get ScheduleMeetings based on class
	public function getScheduleMeetingsByClass($receivedPayload)
	{
		$empcode_fld = $receivedPayload->empcode_fld;
		$classcode = $receivedPayload->classCode;
		
		$sql = "SELECT schedulemeetings_tbl.*, personnel_tbl.honorifics_fld, personnel_tbl.fname_fld, personnel_tbl.mname_fld, personnel_tbl.lname_fld FROM `schedulemeetings_tbl` LEFT JOIN `personnel_tbl` ON schedulemeetings_tbl.empcode_fld = personnel_tbl.empcode_fld WHERE schedulemeetings_tbl.empcode_fld = '$empcode_fld' AND schedulemeetings_tbl.classcode_fld = $classcode";
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, 'scheduledMeetings');
	}
	# End

	# Get ScheduleMeetings based on recno_fld
	public function getScheduledMeeting($receivedPayload)
	{
		$recno_fld = $receivedPayload->recno_fld;
		$sql = "SELECT recno_fld, title_fld, recurrence_fld, classcode_fld, startdate_fld, meetstarttime_fld, enddate_fld, meetendtime_fld, roomid_fld, desc_fld FROM schedulemeetings_tbl WHERE schedulemeetings_tbl.recno_fld=$recno_fld";
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, 'scheduledMeeting');
	}
	# End

	# Get Class Schedule
	# Get Class Schedule


	public function getPoll($receivedPayload)
	{
		$code = 404;
		$payload = null;
		$remarks = "failed";
		$message = "failed to load poll";
		$result = $receivedPayload->filepath;
		$postcode = $receivedPayload->postcode;
		try {
			for ($i = 0; $i < count($result->options); $i++) {
				$sql = "SELECT studnum_fld, CONCAT(fname_fld, ' ', lname_fld) AS fullname, profilepic_fld FROM pollresponse_tbl  INNER JOIN students_tbl USING(studnum_fld) WHERE postcode_fld = '$postcode' AND response_fld = '$i' AND pollresponse_tbl.isdeleted_fld=0";
				$res = $this->gm->executeQuery($sql);
				if ($res['code'] == 200) {
					$result->options[$i]->respondents = $res['data'];
					$result->options[$i]->votes = count($res['data']);
				}
			}


			$payload = $result;
			$code = 200;
			$remarks = "success";
			$message = "Succesfully retrieved poll";
		} catch (Exception $e) {
			$message = $message || $e->getMessage();
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}

	# Get Posted Classposts
	public function getClassPosts($receivedPayload)
	{

		$ccode = $receivedPayload->classcode;
		$type = $receivedPayload->type;
		$datenow = date("Y-m-d H:i:s");
		//SQL for activity
		$sql = "SELECT *, 
		(SELECT COUNT(commentcode_fld) FROM classcomments_tbl WHERE actioncode_fld = activity_tbl.actcode_fld AND isdeleted_fld = 0)
		AS commentcount FROM activity_tbl";

		if ($type == 'post') {
			//SQL for posts 
			$sql = "SELECT *, 
			IFNULL(
			(SELECT profilepic_fld FROM students_tbl WHERE studnum_fld=classpost_tbl.authorid_fld), 
			(SELECT image_fld FROM personnel_tbl WHERE empcode_fld=classpost_tbl.authorid_fld))
			AS profilepic_fld,
			IFNULL(
			(SELECT CONCAT(fname_fld, ' ', lname_fld) FROM students_tbl WHERE studnum_fld=classpost_tbl.authorid_fld), 
			(SELECT CONCAT(fname_fld, ' ', lname_fld) FROM personnel_tbl WHERE empcode_fld=classpost_tbl.authorid_fld))
			AS fullname_fld,	
			(SELECT COUNT(commentcode_fld) FROM classcomments_tbl WHERE actioncode_fld = classpost_tbl.postcode_fld AND isdeleted_fld = 0) 
			AS commentcount
			FROM classpost_tbl";
		}

		$sql .= " WHERE classcode_fld=$ccode AND isdeleted_fld=0 ORDER BY datetime_fld DESC";

		$res = $this->gm->executeQuery($sql);

		return $this->isSuccessQuery($res, 'classfeed');
	}

	# End of get classposts

	# Get Classroom comments
	public function getClassComments($receivedPayload)
	{
		$payload = array();
		$acode = $receivedPayload->acode;

		$sql = "SELECT *, 
	IFNULL(
	(SELECT profilepic_fld FROM students_tbl WHERE studnum_fld=classcomments_tbl.authorid_fld),
	(SELECT image_fld FROM personnel_tbl WHERE empcode_fld=classcomments_tbl.authorid_fld)) 
	AS profilepic_fld,
	IFNULL(
	(SELECT CONCAT(fname_fld,' ', lname_fld) FROM students_tbl WHERE studnum_fld=classcomments_tbl.authorid_fld),
	(SELECT CONCAT(fname_fld,' ', lname_fld) FROM personnel_tbl WHERE empcode_fld=classcomments_tbl.authorid_fld)) 
	AS fullname_fld
	FROM classcomments_tbl 
	WHERE actioncode_fld='$acode'
	AND isdeleted_fld = 0 
	ORDER BY datetime_fld DESC";

		$res = $this->gm->executeQuery($sql);

		if ($res['code'] == 200) {
			foreach ($res['data'] as $key => $value) {
				$sql = "SELECT *, 
			IFNULL((SELECT profilepic_fld FROM students_tbl WHERE studnum_fld=classcomments_tbl.authorid_fld), 
			(SELECT image_fld FROM personnel_tbl WHERE empcode_fld=classcomments_tbl.authorid_fld)) 
			AS profilepic_fld, 
			IFNULL((SELECT CONCAT(fname_fld, ' ', lname_fld) FROM students_tbl WHERE studnum_fld=classcomments_tbl.authorid_fld), 
			(SELECT CONCAT(fname_fld, ' ', lname_fld) FROM personnel_tbl WHERE empcode_fld=classcomments_tbl.authorid_fld)) 
			AS fullname_fld
			 FROM `classcomments_tbl`
			WHERE actioncode_fld='" . $value['commentcode_fld'] . "' AND isdeleted_fld=0  ORDER BY datetime_fld DESC";
				$resComments = $this->gm->executeQuery($sql);
				if ($resComments['code'] == 200) {
					$comments = $resComments['data'];
					$commentCount = count($comments);
				} else {
					$comments = null;
					$commentCount = 0;
				}
				array_push($payload, array(
					"recno_fld" => $value['recno_fld'], "commentcode_fld" => $value['commentcode_fld'], "classcode_fld" => $value['classcode_fld'], "authorid_fld" => $value['authorid_fld'], "fullname_fld" => $value['fullname_fld'],  "profilepic_fld" => $value['profilepic_fld'], "content_fld" => $value['content_fld'],
					"datetime_fld" => $value['datetime_fld'], "replycount" => $commentCount, "reply" => $comments
				));
			}
			return $this->gm->sendPayload($payload, "success", "successfully retrieved comments", $res['code']);
		}

		return $this->gm->sendPayload(null, "failed", "failed to retrieve comments", $res['code']);
	}

	# End of get comments

	# Get Student Submissions
	public function getClassworkslist($receivedPayload)
	{
		$cc = $receivedPayload->classcode;
		$ac = $receivedPayload->actcode;
		
		$sql = "SELECT fname_fld, lname_fld, submissions_tbl.* FROM submissions_tbl INNER JOIN students_tbl USING (studnum_fld) WHERE submissions_tbl.isdeleted_fld = 0  AND classcode_fld='$cc' AND actcode_fld='$ac'";
	
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, "student works");
	}
	# End of Student Submissions

	# Get Student Profile
	public function getStudentProfile($receivedPayload)
	{
		$userid = $receivedPayload->userid;
		$sql = "SELECT * FROM students_tbl WHERE studnum_fld = '$userid' AND isdeleted_fld = 0 AND isenrolled_fld = 2";
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, "studentinfo");
	}
	# End of Student Profile

	# Get Forum Topic
	public function getForumTopic()
	{
		// $sql = "SELECT COUNT(contentcode_fld) FROM subforum_tbl INNER JOIN forumcontent_tbl USING(subcode_fld) WHERE forumcontent_tbl.isdeleted_fld = 0";		
		$sql = "SELECT *, 
		(SELECT COUNT(subcode_fld) FROM subforum_tbl WHERE forumcode_fld = forums_tbl.forumcode_fld AND isdeleted_fld = 0) AS discussion,
		(SELECT COUNT(contentcode_fld) FROM subforum_tbl INNER JOIN forumcontent_tbl 
		USING(subcode_fld) WHERE forumcode_fld = forums_tbl.forumcode_fld AND forumcontent_tbl.isdeleted_fld = 0) 
		AS messages FROM forums_tbl WHERE isdeleted_fld = 0 AND isapproved_fld = 1";
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, 'forums');
	}
	# End Forum Topic

	# Get Subforum
	public function getSubforum($receivedPayload)
	{
		$fc = $receivedPayload->forumcode;
		$sql = "SELECT *, 
			IFNULL(
			(SELECT CONCAT(fname_fld,' ',lname_fld) FROM students_tbl WHERE studnum_fld=subforum_tbl.authorid_fld), 
			(SELECT CONCAT(fname_fld,' ',lname_fld) FROM personnel_tbl WHERE empcode_fld=subforum_tbl.authorid_fld))
			AS fullname_fld,
			IFNULL(
			(SELECT profilepic_fld FROM students_tbl WHERE studnum_fld=subforum_tbl.authorid_fld), 
			(SELECT image_fld FROM personnel_tbl WHERE empcode_fld=subforum_tbl.authorid_fld))
			AS profilepic_fld,
			(SELECT COUNT(contentcode_fld) FROM forumcontent_tbl WHERE subcode_fld = subforum_tbl.subcode_fld AND isdeleted_fld = 0)
			AS messages	 
		FROM subforum_tbl WHERE forumcode_fld = '$fc' AND isdeleted_fld = 0 AND isapproved_fld = 1";
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, 'subforums');
	}
	# End Subforum

	# Get Subcontent
	public function getSubcontent($receivedPayload)
	{
		$sc = $receivedPayload->subcode;
		$sql = "SELECT *, 
			IFNULL(
			(SELECT CONCAT(fname_fld,' ',lname_fld) FROM students_tbl WHERE studnum_fld=forumcontent_tbl.authorid_fld), 
			(SELECT CONCAT(fname_fld,' ',lname_fld) FROM personnel_tbl WHERE empcode_fld=forumcontent_tbl.authorid_fld))
			AS fullname_fld,
			IFNULL(
			(SELECT profilepic_fld FROM students_tbl WHERE studnum_fld=forumcontent_tbl.authorid_fld), 
			(SELECT image_fld FROM personnel_tbl WHERE empcode_fld=forumcontent_tbl.authorid_fld))
			AS profilepic_fld
		FROM forumcontent_tbl WHERE subcode_fld = '$sc' AND isdeleted_fld = 0";
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, 'forums');
	}
	# End Subcontent

	# Get Classroom resource
	public function getClassResource($receivedPayload)
	{
		$cc = $receivedPayload->classcode;
		$sql = "SELECT * FROM resource_tbl WHERE classcode_fld = '$cc' AND isdeleted_fld=0";
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, 'resources');
	}
	# End of get resource

	# Get Enrolled Class members
	public function getClassmember($receivedPayload)
	{
		$code = 404;
		$payload = null;
		$remarks = "Failed";
		$message = "Unable to retrieve members";
		$student = null;
		$instructor = null;
		$cc = $receivedPayload->classcode;
		$ay = $receivedPayload->acadyear;
		$sem = $receivedPayload->semester;
		$sql = "SELECT  (SELECT learningtype_fld FROM accounts_tbl WHERE studnum_fld = students_tbl.studnum_fld) as learningtype_fld, (SELECT block_fld FROM accounts_tbl WHERE studnum_fld = students_tbl.studnum_fld) as block_fld, studnum_fld, fname_fld, lname_fld, mname_fld, email_fld, extname_fld, sex_fld, dept_fld, program_fld, contactnum_fld, profilepic_fld  
		FROM enrolledsubj_tbl LEFT JOIN students_tbl USING (studnum_fld) LEFT JOIN accounts_tbl USING(studnum_fld) 
		WHERE classcode_fld='$cc' AND enrolledsubj_tbl.ay_fld='$ay' AND enrolledsubj_tbl.sem_fld='$sem' AND isenrolled_fld = 2 ORDER BY lname_fld";

		$sql2 = "SELECT empcode_fld, fname_fld, lname_fld, mname_fld, extname_fld, email_fld, personnel_tbl.dept_fld, image_fld,  email_fld 
	FROM classes_tbl LEFT JOIN personnel_tbl USING(email_fld) WHERE classcode_fld='$cc' AND ay_fld='$ay' AND sem_fld='$sem' LIMIT 1";
		$res = $this->gm->executeQuery($sql);
		$res2 = $this->gm->executeQuery($sql2);
		if ($res['code'] == 200) {
			$code = 200;
			$remarks = "success";
			$message = "Successfully retrieved all records requested";
			$student = $res['data'];			
		}
		
		if ($res2['code'] == 200) {
			$instructor = $res2['data'];
		}

		$payload = array("instructor" => $instructor, "student" => $student);
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}
	# End of Get Enrolled Class members

	public function getClasstopics($receivedPayload)
	{
		$cc = $receivedPayload->classcode;
		$sql = "SELECT * FROM topic_tbl WHERE classcode_fld = '$cc' AND isdeleted_fld = 0";
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, 'topic');
	}

	public function getSummary($receivedPayload)
	{
		$classcode = $receivedPayload->classcode;
		$act = null;
		$sub = null;
		
		$sql = "SELECT * FROM activity_tbl WHERE classcode_fld='$classcode' AND isdeleted_fld=0";
		$res = $this->gm->executeQuery($sql);

		if($res['code']==200){
			
			$subSql = "SELECT * FROM `submissions_tbl` WHERE classcode_fld='$classcode' AND isdeleted_fld = 0";
			$subResult = $this->gm->executeQuery($subSql);
			
			$act = $res['data'];
			if($subResult['code']==200){				
				$sub = $subResult['data'];
			}


		// return $res['data'];
		// if ($res['code'] == 200) {

		// 	foreach ($res['data'] as $key => $value) {
		// 		$recipient = explode('.', $value['recipient_fld']);
		// 		array_push($act, array("actcode" => $value['actcode_fld'], "title" => $value['title_fld'], "totalscore" => $value['totalscore_fld'], "recipient" => $recipient));
		// 	}

		// 	for ($i = 0; $i < count($act); $i++) {
		// 		foreach ($act[$i]['recipient'] as $key => $value) {
		// 			$act[$i]['students'][$value] = array();
		// 			$score = 0;
		// 			$issubmitted = 0;
		// 			$sql = "SELECT * FROM `submissions_tbl` where actcode_fld='" . $act[$i]['actcode'] . "' AND studnum_fld='" . $value . "' AND isdeleted_fld=0";
		// 			$resComments = $this->gm->executeQuery($sql);
		// 			if ($resComments['code'] == 200) {
		// 				$score = $resComments['data'][0]['score_fld'];
		// 				$issubmitted = $resComments['data'][0]['issubmitted_fld'];
		// 			} else {
		// 				$score = 0;
		// 				$issubmitted = 0;
		// 			}

		// 			array_push($act[$i]['students'][$value], array("score" => $score, "issubmitted" => $issubmitted));
		// 		}
		// 		unset($act[$i]['recipient']);
		// 	}

			$payload = array("act"=>$act, "sub"=>$sub);
			$remarks = "success";
			$message = "Successfully retrieved all records requested";
		} else {
			$payload = null;
			$remarks = "failed";
			$message = $res['errmsg'];
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $res['code']);
	}



	public function getRoomlist($userid)
	{
		$sql = "SELECT chatroom_tbl.*, fname_fld, lname_fld FROM chatroom_tbl INNER JOIN students_tbl USING(studnum_fld) WHERE empcode_fld = '$userid'";
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, 'room list');
	}

	public function getMessage($receivedPayload, $messageid)
	{
		$roomcode = $receivedPayload->roomcode;
		$sender = $receivedPayload->sender;
		$receiver = $receivedPayload->receiver;
		$sql = "SELECT *,
			IFNULL(
			(SELECT profilepic_fld FROM students_tbl WHERE studnum_fld=messages_tbl.authorid_fld),
			(SELECT image_fld FROM personnel_tbl WHERE empcode_fld=messages_tbl.authorid_fld)) 
			AS profilepic_fld,
			IFNULL(
			(SELECT CONCAT(fname_fld, ' ', lname_fld) FROM students_tbl WHERE studnum_fld=messages_tbl.authorid_fld),
			(SELECT CONCAT(fname_fld, ' ', lname_fld) FROM personnel_tbl WHERE empcode_fld=messages_tbl.authorid_fld)) 
			AS fullname_fld  FROM messages_tbl WHERE roomcode_fld = '$roomcode' AND (roommember_fld LIKE '$sender - $receiver' OR roommember_fld LIKE '$receiver - $sender')  AND isdeleted_fld = 0";
		if ($messageid !== null) {
			$sql .= " AND messagecode_fld = '$messageid'";
		}
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, 'messages');
	}

	public function getGroups($receivedPayload)
	{
		$cc = $receivedPayload->cc;
		$id = $receivedPayload->id;
		$sql = "SELECT * FROM groups_tbl WHERE classcode_fld = '$cc' AND participants_fld LIKE '%$id%' AND isdeleted_fld = 0";
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, 'groups');
	}

	public function getGroupMessages($receivedPayload)
	{
		$gid = $receivedPayload->gid;
		$sql = "SELECT groupid_fld, sender_fld, sendername_fld, content_fld, datetime_fld FROM groupmessage_tbl WHERE groupid_fld = '$gid'";
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, 'group messages');
	}

	public function getQuizResult($receivedPayload)
	{
		$code = 404;
		$remarks = "failed";
		$message = "faled to load quiz result";
		$filepath = $receivedPayload->filepath;
		$quizpath = $receivedPayload->quizpath;
		$payload = null;
		try {
			$quiz =  json_decode(file_get_contents("../" . $quizpath));
			$studentanswer = json_decode(file_get_contents("../" . $filepath));
			$payload = array("quiz"=>$quiz->quiz, "key"=>$quiz->answerkey, "studentanswer"=>$studentanswer->result);
			return $this->gm->sendPayload($payload, "success", "succesfully retrieved quiz result", 200);
		} catch (Exception $e) {
			return $this->gm->sendPayload($payload, $remarks, $e->getMessage(), $code);
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}

	public function getUnreadMessages($receivedPayload)
	{
		$roomcode = $receivedPayload->roomcode;
		$recipient  = $receivedPayload->recipient;

		$sql = "SELECT * FROM messages_tbl WHERE roommember_fld LIKE '% - $recipient' AND isseen_fld = 0 AND isdeleted_fld = 0 AND roomcode_fld = '$roomcode'";
		$res = $this->gm->executeQuery($sql);

		return $this->isSuccessQuery($res, 'unread messages');
	}
	
	public function evalResult($receivedPayload)
	{
		$classcode = $receivedPayload->classcode;
		$conditions = "classcode_fld='$classcode'";
		$query_fields = "
			ROUND(AVG(p11_fld),0) AS p11_fld, 
			ROUND(AVG(p12_fld),0) AS p12_fld,
			ROUND(AVG(p13_fld),0) AS p13_fld,
			ROUND(AVG(p14_fld),0) AS p14_fld,
			ROUND(AVG(p15_fld),0) AS p15_fld,
			ROUND(AVG(p21_fld),0) AS p21_fld, 
			ROUND(AVG(p22_fld),0) AS p22_fld,
			ROUND(AVG(p23_fld),0) AS p23_fld,
			ROUND(AVG(p24_fld),0) AS p24_fld,
			ROUND(AVG(p31_fld),0) AS p31_fld, 
			ROUND(AVG(p32_fld),0) AS p32_fld,
			ROUND(AVG(p33_fld),0) AS p33_fld,
			ROUND(AVG(p41_fld),0) AS p41_fld, 
			ROUND(AVG(p42_fld),0) AS p42_fld,
			ROUND(AVG(p43_fld),0) AS p43_fld,
			ROUND(AVG(p44_fld),0) AS p44_fld,
			ROUND(AVG(p45_fld),0) AS p45_fld,
			ROUND(AVG(p51_fld),0) AS p51_fld, 
			ROUND(AVG(p52_fld),0) AS p52_fld,
			ROUND(AVG(p53_fld),0) AS p53_fld,
			ROUND(AVG(p54_fld),0) AS p54_fld,
			ROUND(AVG(p55_fld),0) AS p55_fld,
			ROUND(AVG(p61_fld),0) AS p61_fld, 
			ROUND(AVG(p62_fld),0) AS p62_fld,
			ROUND(AVG(p63_fld),0) AS p63_fld,
			ROUND(AVG(p64_fld),0) AS p64_fld,
			ROUND(AVG(p65_fld),0) AS p65_fld
		"; 
		$sql = "SELECT ".$query_fields." FROM evalstudent_tbl WHERE ".$conditions;
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, 'evaluation result');
	}
}
