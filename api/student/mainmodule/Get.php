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
	#End of Get reference

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
				$sql .= ",(SELECT COUNT(subcode_fld) FROM subforum_tbl WHERE forumcode_fld = forums_tbl.forumcode_fld AND isdeleted_fld = 0) AS discussion ";
				break;
			case "subforum_tbl":
				$sql .= ",(SELECT COUNT(contentcode_fld) FROM forumcontent_tbl WHERE subcode_fld = subforum_tbl.subcode_fld AND isdeleted_fld = 0) AS messages ";
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

	#check query	
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
	#end check query

	#Get Settings
	public function getSetting()
	{
		$sql = "SELECT * FROM settings_tbl WHERE isactive_fld=1";
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, 'settings');
	}
	#End of Setting

	public function ScoreQuiz($answerJSON, $quizFilepath)
	{
		$total = 0;
		$quiztotal = 0;

		$code = 404;
		$payload = null;
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
							// $quiztotal += $answerkey[$i]->score;
						} else {
							$answer[$key]->points = 0;
							$answer[$key]->mark = 0;
							// $quiztotal += $answerkey[$i]->score;
						}
					}
				}
			}
			$payload = array("result" => $answer, "totalscore" => $total, "quiztotal" => $quiz->quiz->total);
			$code = 200;
		} catch (Exception $e) {
		}

		return array("data" => $payload, "code" => $code);
	}

	public function getQuizResult($receivedPayload)
	{
		$code = 404;
		$remarks = "failed";
		$message = "faled to load quiz result";
		$filepath = $receivedPayload->filepath;
		$payload = null;
		try {
			$payload = json_decode(file_get_contents("../" . $filepath));
			return $this->gm->sendPayload($payload, "success", "succesfully retrieved quiz result", 200);
		} catch (Exception $e) {
			return $this->gm->sendPayload($payload, $remarks, $e->getMessage(), $code);
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}

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

	public function getPoll($receivedPayload, $userid)
	{
		$code = 404;
		$payload = null;
		$remarks = "failed";
		$message = "failed to load poll";
		$result = $receivedPayload->filepath;
		$postcode = $receivedPayload->postcode;
		try{
				$sql = "SELECT respcode_fld, response_fld as choice FROM pollresponse_tbl WHERE studnum_fld = '$userid' AND postcode_fld = '$postcode' AND isdeleted_fld = 0 LIMIT 1";
				$choice = $this->gm->executeQuery($sql);
			
				if($choice['code']==200){
					$result->response = $choice['data']['0']['choice'];
					$result->respcode = $choice['data']['0']['respcode_fld'];
				}
				else{
					$result->choice = null;
					$result->respcode = null;
				}

				for($i = 0; $i<count($result->options); $i++){
					$sql = "SELECT studnum_fld, CONCAT(fname_fld, ' ', lname_fld) AS fullname, profilepic_fld FROM pollresponse_tbl  INNER JOIN students_tbl USING(studnum_fld) WHERE postcode_fld = '$postcode' AND response_fld = '$i' AND pollresponse_tbl.isdeleted_fld=0";
					$res = $this->gm->executeQuery($sql);
					if($res['code']==200){
						$result->options[$i]->respondents = $res['data'];
						$result->options[$i]->votes = count($res['data']);
					}
				}
			
			
			$payload = $result;
			$code = 200;
			$remarks = "success";
			$message = "Succesfully retrieved poll";
		}
		catch(Exception $e){
			$message = $message || $e->getMessage();
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}


	# Get Enrolled Classes

	public function getClasslist($receivedPayload)
	{
		$userid = $receivedPayload->userid;
		$ay = $receivedPayload->acadyear;
		$sem = $receivedPayload->semester;
		$sql = "SELECT *,
		(SELECT empcode_fld from personnel_tbl WHERE email_fld=classes_tbl.email_fld) AS empcode_fld,
		(SELECT honorifics_fld from personnel_tbl WHERE email_fld=classes_tbl.email_fld) AS honorifics_fld,
		(SELECT fname_fld from personnel_tbl WHERE email_fld=classes_tbl.email_fld) AS fname_fld, 
		(SELECT lname_fld from personnel_tbl WHERE email_fld=classes_tbl.email_fld) AS lname_fld, 
		(SELECT image_fld from personnel_tbl WHERE email_fld=classes_tbl.email_fld) AS profilepic_fld  
		FROM enrolledsubj_tbl INNER JOIN classes_tbl USING(classcode_fld) 
		WHERE studnum_fld = $userid AND enrolledsubj_tbl.ay_fld='$ay' AND enrolledsubj_tbl.sem_fld='$sem' GROUP BY enrolledsubj_tbl.classcode_fld";
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, 'classes');
	}

	# End of Get Enrolled Classes

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
		// $sql = "SELECT (SELECT socketid_fld FROM accounts_tbl WHERE studnum_fld = enrolledsubj_tbl.studnum_fld) AS socketid_fld, studnum_fld, fname_fld, lname_fld, mname_fld, email_fld, extname_fld, sex_fld, dept_fld, program_fld, contactnum_fld, profilepic_fld 
		// FROM enrolledsubj_tbl LEFT JOIN students_tbl USING(studnum_fld) LEFT JOIN accounts_tbl USING(studnum_fld)
		// WHERE classcode_fld='$cc' AND enrolledsubj_tbl.ay_fld='$ay' AND enrolledsubj_tbl.sem_fld='$sem' AND isenrolled_fld = 2 ORDER BY lname_fld";

		// $sql = "SELECT accounts_tbl.learningtype_fld, enrollstatus_tbl.block_fld, students_tbl.studnum_fld, students_tbl.fname_fld, students_tbl.lname_fld, students_tbl.mname_fld, students_tbl.email_fld, students_tbl.extname_fld, students_tbl.sex_fld, students_tbl.dept_fld, students_tbl.program_fld, students_tbl.contactnum_fld, students_tbl.profilepic_fld FROM enrolledsubj_tbl LEFT JOIN students_tbl USING (studnum_fld) LEFT JOIN accounts_tbl USING (studnum_fld) LEFT JOIN enrollstatus_tbl ON enrollstatus_tbl.studnum_fld=enrolledsubj_tbl.studnum_fld AND enrolledsubj_tbl.ay_fld='$ay' AND enrolledsubj_tbl.sem_fld=$sem WHERE classcode_fld='$cc' AND enrollstatus_tbl.acadyear_fld='$ay' AND enrollstatus_tbl.sem_fld=$sem AND enrollstatus_tbl.isenrolled_fld=4 ORDER BY lname_fld";

		$sql = "SELECT 
		(SELECT learningtype_fld FROM accounts_tbl WHERE accounts_tbl.studnum_fld = students_tbl.studnum_fld LIMIT 1) AS learningtype_fld, 
		enrollstatus_tbl.block_fld, 
		students_tbl.studnum_fld, 
		students_tbl.fname_fld, 
		students_tbl.lname_fld, 
		students_tbl.mname_fld, 
		students_tbl.email_fld, 
		students_tbl.extname_fld, 
		students_tbl.sex_fld, 
		students_tbl.dept_fld, 
		students_tbl.program_fld, 
		students_tbl.contactnum_fld, 
		students_tbl.profilepic_fld 
		FROM enrolledsubj_tbl 
	    INNER JOIN students_tbl 
		USING (studnum_fld) 
		INNER JOIN enrollstatus_tbl 
		ON enrollstatus_tbl.studnum_fld=enrolledsubj_tbl.studnum_fld 
		AND enrolledsubj_tbl.ay_fld='$ay' 
		AND enrolledsubj_tbl.sem_fld=$sem
		WHERE classcode_fld='$cc' 
		AND enrollstatus_tbl.acadyear_fld='$ay' 
		AND enrollstatus_tbl.sem_fld='$sem' 
		AND enrollstatus_tbl.isenrolled_fld=4 
		ORDER BY lname_fld";



		$sql2 = "SELECT socketid_fld, empcode_fld, fname_fld, lname_fld, mname_fld, extname_fld, email_fld, personnel_tbl.dept_fld, image_fld,  email_fld 
		FROM classes_tbl LEFT JOIN personnel_tbl USING(email_fld) WHERE classcode_fld='$cc' AND ay_fld='$ay' AND sem_fld='$sem' LIMIT 1";
		$res = $this->gm->executeQuery($sql);

		if ($res['code'] == 200) {
			$code = 200;
			$remarks = "success";
			$message = "Successfully retrieved all records requested";
			$student = $res['data'];
			$res2 = $this->gm->executeQuery($sql2);

			if ($res2['code'] == 200) {
				$instructor = $res2['data'];
			}
			$payload = array("instructor" => $instructor, "student" => $student);
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}
	# End of Get Enrolled Class members

	
	public function getTasksList($userid, $ay, $sem)
	{

		$todo = array();
		$class = array();
		$act = array();	
		$sub = array();
		$datenow = date("Y-m-d H:i:s");



		$sql = "SELECT enrolledsubj_tbl.classcode_fld, classes_tbl.subjdesc_fld FROM enrolledsubj_tbl INNER JOIN classes_tbl USING(classcode_fld) WHERE studnum_fld=$userid AND enrolledsubj_tbl.ay_fld='$ay' AND enrolledsubj_tbl.sem_fld = '$sem' GROUP BY classcode_fld";
		$res = $this->gm->executeQuery($sql);
	
		



		if ($res['code'] == 200) {
			$class = $res['data'];
			$actsql = "SELECT *, (SELECT TIMESTAMPDIFF(SECOND, '$datenow', deadline_fld)/(60*60*24)) AS difdays FROM activity_tbl WHERE recipient_fld LIKE '%$userid%' AND isdeleted_fld=0";
			$resAct = $this->gm->executeQuery($actsql);
			if($resAct['code']==200){
				$act  = $resAct['data'];
				$subsql = "SELECT actcode_fld, classcode_fld, studnum_fld, issubmitted_fld,
				datetime_fld AS datesubmitted_fld, dir_fld, isscored_fld, score_fld FROM submissions_tbl WHERE studnum_fld = '$userid' AND isdeleted_fld = 0";
				$resSub = $this->gm->executeQuery($subsql);
				if($resSub['code']==200){
					$sub = $resSub['data'];
				}
				else{
					$sub = [];
				}
			}
			else{
				return $this->gm->sendPayload('null', 'failed', 'failed to process data', $resAct['code']);
			}	

			$payload = array("act"=>$act, "class"=>$class, "sub"=>$sub);
			$remarks = "success";
			$message = "Successfully retrieved all records requested";
		} else {
			$payload = null;
			$remarks = "failed";
			$message = $res['errmsg'];
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $res['code']);
	}
	# End of todo list

	# Get Posted Classposts
	public function getClassPosts($receivedPayload, $studid)
	{

		$ccode = $receivedPayload->classcode;
		$type = $receivedPayload->type;
		$datenow = date("Y-m-d H:i:s");

		//SQL for activity
		$sql = "SELECT *, 
		(SELECT COUNT(commentcode_fld) FROM classcomments_tbl WHERE actioncode_fld = activity_tbl.actcode_fld AND isdeleted_fld = 0)
		AS commentcount  FROM activity_tbl WHERE recipient_fld LIKE '%$studid%' AND ";
		// datesched_fld <= '$datenow' AND 

		if ($type == 'post') {
			//SQL for posts 
			$sql = "SELECT *, 
			IFNULL(
			(SELECT profilepic_fld FROM students_tbl WHERE studnum_fld=classpost_tbl.authorid_fld), 
			(SELECT image_fld FROM personnel_tbl WHERE empcode_fld=classpost_tbl.authorid_fld))
			AS profilepic_fld,
			IFNULL(
			(SELECT CONCAT(fname_fld,' ',lname_fld) FROM students_tbl WHERE studnum_fld=classpost_tbl.authorid_fld), 
			(SELECT CONCAT(fname_fld,' ',lname_fld) FROM personnel_tbl WHERE empcode_fld=classpost_tbl.authorid_fld))
			AS fullname_fld,	
			(SELECT COUNT(commentcode_fld) FROM classcomments_tbl WHERE actioncode_fld = classpost_tbl.postcode_fld AND isdeleted_fld = 0) 
			AS commentcount
			FROM classpost_tbl WHERE ";
		}

		$sql .= " classcode_fld=$ccode AND isdeleted_fld=0 ORDER BY ispinned_fld DESC, ispinned_fld < 1, datetime_fld DESC";

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

	# Get Classroom resource
	public function getClassResource($receivedPayload)
	{
		$cc = $receivedPayload->classcode;
		$sql = "SELECT * FROM resource_tbl WHERE classcode_fld = '$cc' AND isdeleted_fld=0";
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, 'resources');
	}
	# End of get resource

	# Get Student Submissions
	public function getClassworkslist($receivedPayload)
	{
		$userid = $receivedPayload->userid;
		$cc = $receivedPayload->classcode;
		$ac = $receivedPayload->actcode;
		$type = $receivedPayload->type;
		$sql = "SELECT title_fld, deadline_fld, submitcode_fld, submissions_tbl.classcode_fld, actcode_fld, studnum_fld, submissions_tbl.type_fld, score_fld, dir_fld, issubmitted_fld, activity_tbl.totalscore_fld, activity_tbl.withfile_fld, activity_tbl.quizoptions_fld, submissions_tbl.datetime_fld,isscored_fld, 
		(SELECT COUNT(commentcode_fld) FROM classcomments_tbl WHERE actioncode_fld = submissions_tbl.submitcode_fld AND isdeleted_fld = 0) 
		AS commentcount FROM submissions_tbl INNER JOIN activity_tbl USING(actcode_fld) WHERE submissions_tbl.isdeleted_fld = 0  AND studnum_fld='$userid' AND submissions_tbl.classcode_fld='$cc'";
		if ($type === 'act') {
			$sql .= " AND actcode_fld='$ac'";
		}
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, 'submission');
	}
	# End of Student Submissions

	# Get Class Topic
	public function getClasstopics($receivedPayload)
	{
		$cc = $receivedPayload->classcode;
		$sql = "SELECT * FROM topic_tbl WHERE classcode_fld = '$cc' AND isdeleted_fld = 0";
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, 'topic');
	}
	# End of Class Topic

	# Get Student Profile
	public function getStudentProfile($userid)
	{
		$sql = "SELECT * FROM accounts_tbl INNER JOIN students_tbl USING(studnum_fld) WHERE studnum_fld = '$userid'";
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
			AS replies	 
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

	public function getRoomlist($userid)
	{
		$sql = "SELECT *, 
			(SELECT profilepic_fld FROM students_tbl WHERE studnum_fld=chatroom_tbl.studnum_fld) AS studentpic,
			(SELECT image_fld FROM personnel_tbl WHERE empcode_fld=chatroom_tbl.empcode_fld) AS facultypic,
			(SELECT CONCAT(fname_fld,' ',lname_fld) FROM students_tbl WHERE studnum_fld=chatroom_tbl.studnum_fld) AS studentname, 
			(SELECT CONCAT(fname_fld,' ',lname_fld) FROM personnel_tbl WHERE empcode_fld=chatroom_tbl.empcode_fld) AS facultyname 
			FROM chatroom_tbl  WHERE studnum_fld = '$userid' AND chatroom_tbl.isdeleted_fld = 0";
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
		$sql = "SELECT sender_fld, sendername_fld, content_fld, datetime_fld FROM groupmessage_tbl WHERE groupid_fld = '$gid'";
		$res = $this->gm->executeQuery($sql);
		return $this->isSuccessQuery($res, 'group messages');
	}

	public function getNotif($userid)
	{
		$payload = null;
		$remarks = "failed";
		$message = "Unable to process data";
		$code = 404;
		$log = "../logs/lampfaculty.log";

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
			$payload = array_reverse($payload);
			$remarks = "success";
			$message = "Successfully retrieved requested data";
			$code = 200;
		} else {
			$payload = null;
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
		$message = "Unable to process data";

		$res = json_decode(@file_get_contents("../" . $filepath));

		if ($res != null) {
			$payload = $res;
			$code = 200;
			$remarks = "success";
			$message = "Succesfully retrieved data";
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

	public function getProvince($region_id)
	{
		$sql = "SELECT * FROM `refprovince_tbl` WHERE regCode = '$region_id'";
		$res = $this->gm->executeQuery($sql);
		if ($res['code'] == 200) {
			return $this->gm->sendPayload($res['data'], "success", "successfully retrieved data", 200);
		}
		return $this->gm->sendPayload(null, "failed" , "failed to pull data", 404);
	}

	public function getMunicipality($province_id)
	{
		$sql = "SELECT * FROM `refcitymun_tbl` WHERE provCode = '$province_id'";
		$res = $this->gm->executeQuery($sql);
		if ($res['code'] == 200) {
			return $this->gm->sendPayload($res['data'], "success", "successfully retrieved data", 200);
		}
		return $this->gm->sendPayload(null, "failed" , "failed to pull data", 404);
	}

	public function getBarangay($municipality_id)
	{
		$sql = "SELECT * FROM `refbrgy_tbl` WHERE citymunCode = '$municipality_id'";
		$res = $this->gm->executeQuery($sql);
		if ($res['code'] == 200) {
			return $this->gm->sendPayload($res['data'], "success", "successfully retrieved data", 200);
		}
		return $this->gm->sendPayload(null, "failed" , "failed to pull data", 404);
	}

	public function getGameProgress($userid){
		$sql = "SELECT * FROM game_tbl WHERE studnum_fld = '$userid'";
		$res = $this->gm->executeQuery($sql);
		if($res['code']==200){
			return $this->gm->sendPayload($res['data'], "success", "successfully retrieved data", 200);
		}
		else
		{
			$result = $this->gm->insert('game_tbl', array("studnum_fld"=>$userid));
			if($result['code']==200){
				return $this->getReference('game_tbl', "studnum_fld = '$userid'");
			}
		}
		return $this->gm->sendPayload(null, "failed", "failed to pull data", 404);
	}

	public function getBooks($dept = '', $prog = ''){
		$books = [];
		$path = '../../downloads/books';
		if($dept != '' && $prog != ''){
			$path .= "/$dept/$prog";
		}
		if ($handle = opendir($path)) {

			while (false !== ($entry = readdir($handle))) {
				$path_parts = pathinfo($entry);	
				if ($entry != "." && $entry != ".." && strtolower($path_parts['extension']=='pdf') ) {
						array_push($books, array("file"=>$entry, "title_fld"=>$path_parts['filename'], "author_fld"=>""));
				}
			}
					
				closedir($handle);
		return $this->gm->sendPayload($books, 'success', 'Successfully Retrieved booklist', 200);

		}
		return $this->gm->sendPayload(null, 'failed', 'Something wrong happened', 404);
	}
}
