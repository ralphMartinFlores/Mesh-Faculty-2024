<?php
class Post
{	
	protected $gm, $get, $auth, $pdo;

	public function __construct(\PDO $pdo)
	{
		$this->gm = new GlobalMethods($pdo);
		$this->get = new Get($pdo);
		$this->auth = new Auth($pdo);
		$this->pdo = $pdo;
	}

	function log($notif)
	{
		file_put_contents(
			"../logs/lampfaculty.log",
			date("Y-m-d H:i:s") . ',' . $notif->id . ',' . $notif->module . ',' . $notif->message . ',' . $notif->recipient . PHP_EOL,
			FILE_APPEND | LOCK_EX
		);
	}


	public function postCommon($receivedPayload, $table, $field, $code, $request, $notif)
	{
		$res = null;

		switch ($request) {
			case "insert":
				$receivedPayload->datetime_fld = date("Y-m-d H:i:s");
				$res = $this->gm->insert($table, $receivedPayload);
				break;
			case "update":
				$res = $this->gm->update($table, $receivedPayload, "$field = '$code'");
				break;
			case "delete":
				$res = $this->gm->update($table, $receivedPayload, "$field = '$code'");
				if ($res['code'] == 200) {
					return $this->gm->sendPayload(null, "success", "succesfully deleted", $res['code']);
				}
				return $this->gm->sendPayload(null, 'failed', 'failed to delete', $res['code']);
				break;
			default:
				break;
		}


		if ($res['code'] === 200) {
			if($notif!=null){ $this->log($notif); }
			switch ($table) {
				case 'submissions_tbl':
					return $this->get->getReference(
						$table,
						"$field = '$code' AND isdeleted_fld=0 ORDER BY $field DESC LIMIT 1"
					);
					break;

				case 'topic_tbl':
					return $this->get->getReference($table, "$field = '$code' AND isdeleted_fld = 0");
					break;

				case 'personnel_tbl':
					return $this->get->getReference($table, "$field = '$code' AND isdeleted_fld = 0");
					break;
				default:
					return $this->get->getCommon($table, $code, $field);
					break;
			}
		}
		return $this->gm->sendPayload(null, 'failed', "failed to $request", $res['code']);
	}

	public function codeGenerator($code, $table, $filter)
	{
		$y = new DateTime();
		$codestart = $code . $y->format('Y');
		$lastelement = 0;
		$sql = "SELECT * from $table ORDER BY $filter DESC LIMIT 1";
		$res = $this->gm->executeQuery($sql);
		if ($res['code'] == 200) {
			$lastelement = substr($res['data'][0][$filter], -5);
		}
		$newcode = strval(intval($lastelement) + 1);
		$ordercode = $codestart . str_pad($newcode, 5, "0", STR_PAD_LEFT);
		// $val[$filter] = $ordercode;
		return $ordercode;
	}
	# Start of uploadfile
	public function uploadFile($userid)
	{

		$folder = "faculty/$userid/";
		$fileArray = array();
		$success = 0;
		$error = 0;
		$count = 0;

		foreach ($_FILES['file']['tmp_name'] as $key => $tmpname) {
			$target_path = "";
			$fileName = $_FILES['file']["name"][$key];
			$fileTmp = $_FILES['file']["tmp_name"][$key];



			$fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
			$target_path = "uploads/$folder";
			if (!is_dir("../" . $target_path)) {
				mkdir("../" . $target_path, 0755, true);
				fopen("../uploads/$folder/index.php", 'w');
			}

			$newfilename = round(microtime(true)) . '.' . $fileExtension;
			$target_path = $target_path . $newfilename;

			if ($count > 0) {
				$newfilename = round(microtime(true)) + $count . '.' . $fileExtension;
				$target_path = "uploads/$folder" . $newfilename;
			}

			// while (file_exists("../".$target_path)) {
			// 	$newfilename = round(microtime(true)) + 1 . '.' . $fileExtension;
			// 	$target_path = "uploads/$folder" . $newfilename;
			// }

			if (move_uploaded_file($fileTmp, "../" . $target_path)) {
				array_push($fileArray, $fileName . '?' . $target_path);
				$success++;
				$newfilename = "";
			} else {
				$error++;
			}
			$count++;
		}

		$code = 403;
		$payload = null;
		$remarks = "failed";
		$message = "There was an error uploading the file, please try again!";

		if ($error == 0) {
			$filepath = join(':', $fileArray);
			$code = 200;
			$payload = array("filepath" => $filepath);
			$remarks = "success";
			$message = "Successfully uploaded files(s)";
		}

		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}
	# End of upload file

	public function deleteFile($receivedPayload)
	{
		$path = $receivedPayload->dir_fld;
		$code = 403;
		$remarks = "failed";
		$message = "failed to message";
		$payload = null;
		if(file_exists("../" . $path)){
			if (unlink("../" . $path)) {
				$code = 200;
				$remarks = "success";
				$message = "Successfully deleted file";
			}
		}
		else{
			$code = 200;
			$remarks = "success";
			$message = "File does not exists";
		}

		
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}


	#Update Faculty Profile
	public function updateProfile($dt, $userid)
	{
		$code = 401;
		$payload = null;
		$remarks = "failed";
		$message = "Unable to save data";

		$instructor = $dt->instructor;

		$res = $this->gm->update('personnel_tbl', $instructor, "empcode_fld=" . $userid);
		if ($res['code'] == 200) {
			// return $this->get->getCompleteStudentInfo(json_decode(json_encode(array("userid" => $userid))));
		} else {
			#insert log here..
			return $this->gm->sendPayload($payload, $remarks, $message, $res['code']);
		}
	}
	# End Faculty Profile

	public function uploadPic($type, $userid){
		
		$path = "../../requests/";
		$code = 403;
		$payload = null;
		$remarks = "failed";
		$message = "There was an error uploading the file, please try again!";

		$target_path = "";
		$fileName = $_FILES['file']["name"][0];
		$fileTmp = $_FILES['file']["tmp_name"][0];

		$fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
		$target_path = "gcesuploads/$userid/";

		if (!is_dir($path . $target_path)) {
			mkdir($path . $target_path, 0755, true);
		}
		
		$name = "Signature"; 
		if($type==="profile"){
			$name = "2x2Photo1";
		} 

		$newfilename = $name . '.' . strtolower($fileExtension);
		$target_path = $target_path . $newfilename;

		if (move_uploaded_file($fileTmp, $path . $target_path)) {
			$code = 200;
			$payload = array("filepath" => $target_path);
			$remarks = "success";
			$message = "Successfully uploaded files(s)";
		}
		
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}

	public function savePoll($receivedPayload, $notif)
	{
		$receivedPayload->pollcode_fld = $this->codeGenerator('CP', 'classpost_tbl', 'pollcode_fld');
		return $this->postCommon($receivedPayload, 'classpost_tbl', 'postcode_fld', $receivedPayload->postcode_fld, 'insert', $notif);
	}

	public function addComment($receivedPayload, $notif)
	{
		$receivedPayload->commentcode_fld = $this->codeGenerator('CC', 'classcomments_tbl', 'commentcode_fld');
		return $this->postCommon($receivedPayload, 'classcomments_tbl', 'commentcode_fld', $receivedPayload->commentcode_fld, 'insert', $notif);
	}

	public function addPost($receivedPayload, $notif)
	{

		$receivedPayload->postcode_fld = $this->codeGenerator('CP', 'classpost_tbl', 'postcode_fld');
		return $this->postCommon($receivedPayload, 'classpost_tbl', 'postcode_fld', $receivedPayload->postcode_fld, 'insert', $notif);
	}

	public function addResource($receivedPayload, $notif)
	{
		$receivedPayload->rescode_fld = $this->codeGenerator('RS', 'resource_tbl', 'rescode_fld');
		return $this->postCommon($receivedPayload, 'resource_tbl', 'rescode_fld', $receivedPayload->rescode_fld, 'insert', $notif);
	}

	public function addAssignment($receivedPayload, $notif)
	{
		$receivedPayload->actcode_fld = $this->codeGenerator('AC', 'activity_tbl', 'actcode_fld');
		return $this->postCommon($receivedPayload, 'activity_tbl', 'actcode_fld', $receivedPayload->actcode_fld, 'insert', $notif);
	}

	public function addTopic($receivedPayload)
	{
		$receivedPayload->topiccode_fld = $this->codeGenerator('TP', 'topic_tbl', 'topiccode_fld');
		$res = $this->gm->insert('topic_tbl', $receivedPayload);
		// return $this->gm->sendPayload($receivedPayload, 'succes', 'succesfully added topic', 200);
		if ($res['code'] === 200) {
			return $this->get->getReference(
				'topic_tbl',
				"topiccode_fld = '$receivedPayload->topiccode_fld' AND isdeleted_fld=0 ORDER BY topiccode_fld DESC LIMIT 1"
			);
		}
		return $this->gm->sendPayload(null, 'failed', 'failed to insert', $res['code']);
	}

	public function addForumTopic($receivedPayload, $notif)
	{
		$receivedPayload->forumcode_fld = $this->codeGenerator('FR', 'forums_tbl', 'forumcode_fld');
		return $this->postCommon($receivedPayload, 'forums_tbl', 'forumcode_fld', $receivedPayload->forumcode_fld, 'insert', $notif);
	}

	public function addDiscussion($receivedPayload, $notif)
	{
		$receivedPayload->subcode_fld = $this->codeGenerator('SF', 'subforum_tbl', 'subcode_fld');
		return $this->postCommon($receivedPayload, 'subforum_tbl', 'subcode_fld', $receivedPayload->subcode_fld, 'insert', $notif);
	}

	public function addReply($receivedPayload, $notif)
	{
		$receivedPayload->contentcode_fld = $this->codeGenerator('FC', 'forumcontent_tbl', 'contentcode_fld');
		return $this->postCommon($receivedPayload, 'forumcontent_tbl', 'contentcode_fld', $receivedPayload->contentcode_fld, 'insert', $notif);
	}

	public function addPoll($receivedPayload, $userid)
	{
		$code = 403;
		$remarks = "failed";
		$message = "failed to process data";
		$payload = null;
		$dt = json_encode($receivedPayload);


		$folder = "uploads/faculty/$userid/poll/";
		if (!is_dir("../" . $folder)) {
			mkdir("../" . $folder, 0755, true);
			fopen("../$folder/index.php", 'w');
			fopen("../uploads/faculty/$userid/index.php", 'w');
		}

		$filename = round(microtime(true)) . '.json';
		$filepath = $folder . $filename;

		if (file_put_contents("../" . $filepath, $dt)) {
			$code = 200;
			$payload = array("filepath" => $filepath,  "poll" => $receivedPayload);
			$message = "succesfully generatred poll";
			$remarks = "sucess";
		} else {
			$message = "failed to generate poll";
			$remarks = "failed";
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}

	public function addStudent($receivedPayload, $notif)
	{
		$res = $this->gm->insert("enrolledsubj_tbl", $receivedPayload);

		if ($res['code'] == 200) {
			return $this->get->getClassmember((object)array("classcode" => $receivedPayload->classcode_fld, "acadyear" => $receivedPayload->ay_fld, "semester" => $receivedPayload->sem_fld));
		}
		return $this->gm->sendPayload(null, "failed", "failed to add student", 401);
	}



	public function createQuiz($receivedPayload, $userid)
	{

		$code = 403;
		$remarks = "failed";
		$message = "failed to process data";
		$payload = null;

		$dt = json_encode($receivedPayload->data);

		$folder = "uploads/faculty/$userid/quiz/";
		if (!is_dir("../" . $folder)) {
			mkdir("../" . $folder, 0755, true);
			fopen("../$folder/index.php", 'w');
			fopen("../uploads/faculty/$userid/index.php", 'w');
		}
		$filename = round(microtime(true)) . '.json';
		$filepath = $folder . $filename;


		if (file_put_contents("../" . $filepath, $dt)) {
			unlink("../uploads/faculty/$userid/temp/$receivedPayload->classcode" . '.json');
			$code = 200;
			$payload = array("filepath" => $filepath, "quiz" => $receivedPayload);
			$message = "Succesfully generated quiz";
			$remarks = "sucess";
		} else {
			$message = "failed to generate quiz";
			$remarks = "failed";
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}

	public function editQuiz($receivedPayload, $userid)
	{
		$filepath = $receivedPayload->filepath;
		$classcode = $receivedPayload->classcode;
		$dt = json_encode($receivedPayload->data);
		$code = 403;
		$remarks = "failed";
		$message = "failed to process data";
		$payload = null;

		if (file_put_contents("../" . $filepath, $dt)) {
			if(file_exists("../uploads/faculty/$userid/temp/$classcode" . '.json')){
				unlink("../uploads/faculty/$userid/temp/$classcode" . '.json');
			}	
			$code = 200;
			$payload = array("filepath" => $filepath, "quiz" => $receivedPayload);
			$message = "Succesfully edited quiz";
			$remarks = "sucess";
		} else {
			$message = "failed to edit quiz";
			$remarks = "failed";
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}


	public function saveQuizDraft($receivedPayload, $userid)
	{
		$dt = json_encode($receivedPayload->data);
		$classcode = $receivedPayload->data->classcode;

		$folder = "uploads/faculty/$userid/temp/";
		if (!is_dir("../" . $folder)) {
			mkdir("../" . $folder, 0755, true);
			fopen("../$folder/index.php", 'w');
			fopen("../uploads/faculty/$userid/index.php", 'w');
		}
		$filename = $classcode . '.json';
		$filepath = "../" . $folder . $filename;
		if (file_put_contents($filepath, $dt)) {
			return $this->gm->sendPayload(null, "success", "succesfully saved draft quiz", 200);
		}
		return $this->gm->sendPayload(null, "failed", "failed to save draft quiz", 403);
	}


	#Start of edit methods

	public function editComment($receivedPayload, $code, $notif)
	{
		$receivedPayload->isedited_fld = 1;
		$receivedPayload->dtedit_fld = date("Y-m-d H:i:s");
		return $this->postCommon($receivedPayload, 'classcomments_tbl', 'commentcode_fld', $code, 'update', $notif);
	}

	public function editPost($receivedPayload, $code, $type, $notif)
	{
		$receivedPayload->isedited_fld = 1;
		$receivedPayload->dtedit_fld = date("Y-m-d H:i:s");
		if ($type == 'act') {
			return $this->postCommon($receivedPayload, 'activity_tbl', 'actcode_fld', $code, 'update', $notif);
		}
		return $this->postCommon($receivedPayload, 'classpost_tbl', 'postcode_fld', $code, 'update', $notif);
	}


	public function editDiscussion($receivedPayload, $code, $notif)
	{
		$receivedPayload->isedited_fld = 1;
		$receivedPayload->dtedit_fld = date("Y-m-d H:i:s");
		return $this->postCommon($receivedPayload, 'subforum_tbl', 'subcode_fld', $code, 'update', $notif);
	}

	public function editReply($receivedPayload, $code, $notif)
	{
		$receivedPayload->isedited_fld = 1;
		$receivedPayload->dtedit_fld = date("Y-m-d H:i:s");
		return $this->postCommon($receivedPayload, 'forumcontent_tbl', 'contentcode_fld', $code, 'update', $notif);
	}

	public function editResource($receivedPayload, $code, $notif)
	{
		$receivedPayload->isedited_fld = 1;
		$receivedPayload->dtedit_fld = date("Y-m-d H:i:s");
		return $this->postCommon($receivedPayload, 'resource_tbl', 'rescode_fld', $code, 'update', $notif);
	}

	public function editTopic($receivedPayload, $code, $type, $notif)
	{
		if ($type == 'del') {
			$res = $this->gm->update('topic_tbl', $receivedPayload, "topiccode_fld = '$code'");

			if ($res['code'] == 200) {
				$resource = $this->gm->update('resource_tbl', array("topiccode_fld" => 0), "topiccode_fld='$code'");
				$activity = $this->gm->update('activity_tbl', array("topiccode_fld" => 0), "topiccode_fld='$code'");
				return $this->gm->sendPayload(null, "success", "Successfully deleted topic", 200);
			}
		}
		return $this->postCommon($receivedPayload, 'topic_tbl', 'topiccode_fld', $code, 'update', $notif);
	}

	public function sendMessage($receivedPayload)
	{
		$receivedPayload->messagecode_fld = $this->codeGenerator('MS', 'messages_tbl', 'messagecode_fld');
		$receivedPayload->datetime_fld = date("Y-m-d H:i:s");
		$res = $this->gm->insert('messages_tbl', $receivedPayload);
		if ($res['code'] == 200) {
			$sql = "SELECT *, (SELECT CONCAT(fname_fld,' ',lname_fld) FROM personnel_tbl WHERE empcode_fld=authorid_fld) AS fullname_fld,
			(SELECT image_fld FROM personnel_tbl WHERE empcode_fld=authorid_fld) AS profilepic_fld
			 FROM messages_tbl WHERE messagecode_fld = '$receivedPayload->messagecode_fld' AND isdeleted_fld = 0";
			$resMsg = $this->gm->executeQuery($sql);
			if ($resMsg['code'] == 200) {
				return $this->gm->sendPayload($resMsg['data'], 'success', 'Succesfully retrieved message', 200);
			}
		}
		return $this->gm->sendPayload(null, "failed", "failed to add message", 404);
	}

	public function addRoom($receivedPayload)
	{
		$receivedPayload->roomcode_fld = $this->codeGenerator('CR', 'chatroom_tbl', 'roomcode_fld');
		$receivedPayload->datetime_fld = date("Y-m-d H:i:s");
		$res = $this->gm->insert('chatroom_tbl', $receivedPayload);
		if ($res['code'] == 200) {
			return $this->get->getRoomlist($receivedPayload->studnum_fld);
		}
		return $this->gm->sendPayload(null, "failed", "failed to add message", 401);
	}

	
	public function saveExcess($receivedPayload)
	{
		$classes = $receivedPayload->data;
		$email = $receivedPayload->email;
		foreach ($classes as $value) {
			$sql = $this->pdo->prepare("UPDATE classes_tbl SET isexcess_fld=? WHERE classcode_fld=? AND email_fld = '$email'");
			$sql->execute([$value->isexcess_fld, $value->classcode_fld]);
			$sql = null;
		}
		return $this->gm->sendPayload(null, "success", "successfully saved excess", 200);
	}

	public function savePersonnelTime($receivedPayload, $userid)
	{
		$payload = null;
		$remarks = 'Failed';
		$message = 'Unable to process data';
		$res = $this->gm->update('officialtime_tbl', $receivedPayload, "empcode_fld = '$userid'");

		if ($res['code'] == 200) {
			return $this->get->getReference('officialtime_tbl', "empcode_fld = '$userid' ");
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $res['code']);
	}

	public function saveAnswer($receivedPayload)
	{
		$code = 403;
		$remarks = "failed";
		$message = "failed to process data";
		$payload = null;
		$dt = $receivedPayload->answer;
		$filepath = $receivedPayload->filepath;
		
		try{
			if(file_exists("../".$filepath)){
				file_put_contents("../".$filepath, json_encode($dt));
			}
			$payload = $dt;
			$code = 200;
			$remarks = "success";
			$message = "succesfully updated answer json"; 
		}
		catch(Exception $e){
			$message = $e->getMessage();
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}

	public function readMessage($receivedPayload)
	{
		$roomcode = $receivedPayload->roomcode;
		$receiver = $receivedPayload->recipient;
		$sender = $receivedPayload->authorid;
		$condition = "isseen_fld = 0 AND isdeleted_fld = 0 AND roomcode_fld = '$roomcode' AND roommember_fld LIKE '$sender - $receiver'";	
		$res = $this->gm->update("messages_tbl", array("isseen_fld"=>1), $condition);
		if ($res['code'] == 200) {
			return $this->get->getUnreadMessages($receivedPayload);
		}
		return $this->gm->sendPayload(null, "failed", "failed to mark message as seen", 401);
	}	

	public function editSubmission($receivedPayload, $submitcode, $studnum, $actcode){
		$res = $this->gm->update('submissions_tbl', $receivedPayload, "submitcode_fld = '$submitcode' AND studnum_fld = '$studnum' AND actcode_fld = '$actcode' AND isdeleted_fld = 0");
		// if($notif!=null){
		// 	$this->log($notif);
		// }
		if($res['code']==200){
			return $this->get->getReference('submissions_tbl', "submitcode_fld = '$submitcode' AND studnum_fld = '$studnum'");
		}
		return $this->gm->sendPayload(null, 'failed', 'failed to edit submission', $res['code']);
	}

	public function updateCovaxInfo($receivedPayload) {
		$code = 401;
		$payload = null;
		$remarks = "failed";
		$message = "Unable to save data";
		$res = [];

		$data = $receivedPayload->data;


		// print_r($receivedPayload);

		$res = $this->gm->update("personnel_tbl", $data, "empcode_fld='".$receivedPayload->empcode."'");
		if ($res['code'] == 200) {
			$code = 200;
			$payload = null;
			$remarks = "success";
			$message = "Evaluation response saved";
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}

}
