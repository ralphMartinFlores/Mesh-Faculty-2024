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
			"../logs/lampstudent.log",
			date("Y-m-d H:i:s") . ',' . $notif->id . ',' . $notif->module . ',' . $notif->message . ',' . $notif->recipient . PHP_EOL,
			FILE_APPEND | LOCK_EX
		);
	}



	public function postCommon($receivedPayload, $table, $field, $code, $request, $notif)
	{
		$res = null;

		if ($request === 'insert') {
			$receivedPayload->datetime_fld = date("Y-m-d H:i:s");
			$res = $this->gm->insert($table, $receivedPayload);
			
		} else {
			$res = $this->gm->update($table, $receivedPayload, "$field = '$code'");
			
		}


		if ($res['code'] === 200) {
			if($notif!=null){
				$this->log($notif);
			}
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
				case 'students_tbl':
					return $this->get->getReference($table, "$field = '$code'");
					break;
				case "pollresponse_tbl":
					return $res;
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
				   $lastelement = 0;
				if(strlen($res['data'][0][$filter])==11){
				   $lastelement = substr($res['data'][0][$filter], -5);
				}
				else{
					$lastelement = substr($res['data'][0][$filter], -12);
				}
				// return array($lastelement, $res['data'][0][$filter]);
		}
		if($lastelement == 99999){
			$ordercode = $codestart . str_pad($lastelement, 12, "0", STR_PAD_RIGHT);
		}
		elseif ($lastelement > 99999) {
			// code...
			$newcode = strval(intval($lastelement) + 1);
			$ordercode = $codestart . $newcode;
		}
		else{
			$newcode = strval(intval($lastelement) + 1);
			$ordercode = $codestart . str_pad($newcode, 5, "0", STR_PAD_LEFT);
		}
		
		// $val[$filter] = $ordercode;
		return $ordercode;
	}

	public function uploadFile($userid, $ay, $sem)
	{
		$aysem = $ay.$sem;
		$folder = "$aysem/student/$userid/";
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

			// if(!is_dir("../uploads/$aysem/student")){
			// 	fopen("../uploads/$aysem/student/index.php", 'w');
			// }

			if (!is_dir("../" . $target_path)) {
				mkdir("../" . $target_path, 0755, true);
				fopen("../uploads/$folder/index.php", 'w');
			}

			$newfilename = round(microtime(true)) . '.' . strtolower($fileExtension);
			$target_path = $target_path . $newfilename;

			if ($count > 0) {
				$newfilename = round(microtime(true)) + $count . '.' . strtolower($fileExtension);
				$target_path = "uploads/$folder" . $newfilename;
			}

			// while (file_exists($target_path)) {
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
			$filepath = "";
		}

		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}


	#Update Students Profile
	public function updateProfile($dt, $studid)
	{
		$code = 401;
		$payload = null;
		$remarks = "failed";
		$message = "Unable to save data";

		$student = $dt->student;

		$res = $this->gm->update('students_tbl', $student, "studnum_fld=" . $studid);
		if ($res['code'] == 200) {
			// return $this->get->getCompleteStudentInfo(json_decode(json_encode(array("userid" => $studid))));
		} else {
			#insert log here..
			return $this->gm->sendPayload($payload, $remarks, $message, $res['code']);
		}
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

	public function addSubmission($receivedPayload, $notif)
	{

		
		$receivedPayload->submitcode_fld = $this->codeGenerator('SB', 'submissions_tbl', 'submitcode_fld');
		return $this->postCommon($receivedPayload, 'submissions_tbl', 'submitcode_fld', $receivedPayload->submitcode_fld, 'insert', $notif);
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


	public function saveAnswer($receivedPayload, $userid, $notif, $ay, $sem)
	{
		$aysem = $ay.$sem;
		$code = 403;
		$remarks = "failed";
		$message = "failed to process data";
		$payload = null;

		$dt = $receivedPayload->answer;
		$quizpath = $receivedPayload->filepath;

		$folder = "uploads/$aysem/student/$userid/quiz/";
		if (!is_dir("../" . $folder)) {
			mkdir("../" . $folder, 0755, true);
			fopen("../$folder/index.php", 'w');
		}

		$filename = round(microtime(true)) . '.json';
		$filepath = $folder . $filename;

		// print_r()
		// $res = $this->get->ScoreQuiz($dt, $quizpath);

	
		if (file_put_contents("../" . $filepath, json_encode($dt))) {

				$payload = array("result" => $dt, "filepath" => $filepath);
				$code = 200;
				$remarks = "success";
				$message = "succesfully processed data";
		}
		
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}

	#Start of edit methods

	public function editComment($receivedPayload, $code, $notif)
	{
		$receivedPayload->isedited_fld = 1;
		$receivedPayload->dtedit_fld = date("Y-m-d H:i:s");
		return $this->postCommon($receivedPayload, 'classcomments_tbl', 'commentcode_fld', $code, 'update', $notif);
	}

	public function editPost($receivedPayload, $code, $notif)
	{
		$receivedPayload->isedited_fld = 1;
		$receivedPayload->dtedit_fld = date("Y-m-d H:i:s");
		return $this->postCommon($receivedPayload, 'classpost_tbl', 'postcode_fld', $code, 'update', $notif);
	}

	public function editSubmission($receivedPayload, $submitcode, $studnum, $actcode, $notif){
		$res = $this->gm->update('submissions_tbl', $receivedPayload, "submitcode_fld = '$submitcode' AND studnum_fld = '$studnum' AND actcode_fld = '$actcode' AND isdeleted_fld = 0");
		if($notif!=null){
			$this->log($notif);
		}
		if($res['code']==200){
			return $this->get->getReference('submissions_tbl', "submitcode_fld = '$submitcode' AND studnum_fld = '$studnum'");
		}
		return $this->gm->sendPayload(null, 'failed', 'failed to edit submission', $res['code']);
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

	public function deleteFile($receivedPayload, $studnum)
	{
		$path = $receivedPayload->dir_fld;
		$code = 403;
		$remarks = "failed";
		$message = "failed to delete file";
		$payload = null;

	
		if(strpos($path, $studnum) !== false ){
			if(file_exists("../" . $path)){
				if (unlink("../" . $path)) {
					$code = 200;
					$remarks = "success";
					$message = "Successfully deleted file";
				}
			}
			else{
				$code = 200;
				$message = "File does not exists";
				$remarks = "success";
			}
		}
		else{
			$code = 200;
			$remarks = "success";
			$message = "Duplicate upload file";
		}
		

		
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}

	public function responsePoll($receivedPayload,$filepath, $notif)
	{
		$sql = "SELECT * FROM pollresponse_tbl WHERE studnum_fld = $receivedPayload->studnum_fld AND postcode_fld = '$receivedPayload->postcode_fld' AND isdeleted_fld = 0 LIMIT 1";
		$choice = $this->gm->executeQuery($sql);
		if ($choice['code'] == 200) {
			// $res = $this->postCommon($receivedPayload, 'pollresponse_tbl', 'respcode_fld', $receivedPayload->respcode_fld, 'update', $notif);
			$update_res = $this->gm->update('pollresponse_tbl', array("response_fld" => $receivedPayload->response_fld), "postcode_fld = '$receivedPayload->postcode_fld' AND studnum_fld = '$receivedPayload->studnum_fld'");
			return $this->gm->sendPayload(null, "success", "succesfully edited poll response", 200);
		}
		$receivedPayload->respcode_fld = $this->codeGenerator('PR', 'pollresponse_tbl', 'respcode_fld');
		$res = $this->postCommon($receivedPayload, 'pollresponse_tbl', 'respcode_fld', $receivedPayload->respcode_fld, 'insert', $notif);
		return $this->get->getPoll((object)array("postcode" => $receivedPayload->postcode_fld, "filepath"=>$filepath), $receivedPayload->studnum_fld);
	}


	public function sendMessage($receivedPayload){
		$receivedPayload->messagecode_fld = $this->codeGenerator('MS', 'messages_tbl', 'messagecode_fld');
		$receivedPayload->datetime_fld = date("Y-m-d H:i:s");
		$res = $this->gm->insert('messages_tbl', $receivedPayload);
		if($res['code']==200){
			$sql = "SELECT *, (SELECT CONCAT(fname_fld,' ',lname_fld) FROM students_tbl WHERE studnum_fld=authorid_fld) AS fullname_fld,
			(SELECT profilepic_fld FROM students_tbl WHERE studnum_fld=authorid_fld) AS profilepic_fld
			 FROM messages_tbl WHERE messagecode_fld = '$receivedPayload->messagecode_fld' AND isdeleted_fld = 0";
			$resMsg = $this->gm->executeQuery($sql);
			if ($resMsg['code'] == 200) {
				return $this->gm->sendPayload($resMsg['data'], 'success', 'Succesfully retrieved message', 200);
			}
		}
		return $this->gm->sendPayload(null, "failed", "failed to add message", 404);
	}

	
	public function addGroupMessage($receivedPayload)
	{
		$res = $this->gm->insert("groupmessage_tbl", $receivedPayload);

		if ($res['code'] == 200) {
			return $this->gm->sendPayload(null, 'success', 'Succesfully added message', 200);
		}
		return $this->gm->sendPayload(null, "failed", "failed to add message", 401);
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

	public function editProfile($userid){
		
		$path = "../../requests/";
		$code = 403;
		$payload = null;
		$remarks = "failed";
		$message = "There was an error uploading the file, please try again!";

		$target_path = "";
		$fileName = $_FILES['file']["name"][0];
		$fileTmp = $_FILES['file']["tmp_name"][0];

		$fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
		$target_path = "gcesuploads/Profile/$userid/";

		if (!is_dir($path . $target_path)) {
			mkdir($path . $target_path, 0755, true);
		}
		
		$name = "2x2Photo1"; 

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


	public function submitEval($receivedPayload)
	{
		$code = 401;
		$payload = null;
		$remarks = "failed";
		$message = "Unable to save data";
		$res = [];

		$classinfo = $receivedPayload->classinfo;
		$response = $receivedPayload->request;
		$termvalues = $receivedPayload->termvalues;
		$studnum = $classinfo->studnum_fld;
		$classcode = $classinfo->classcode_fld;

		$condition="classcode_fld='$classcode' AND studnum_fld='$studnum'";
		// $condition = "isseen_fld = 0 AND isdeleted_fld = 0 AND roomcode_fld = '$roomcode' AND roommember_fld LIKE '$sender - $receiver'";
		$sql = "SELECT * FROM evalstudent_tbl WHERE ".$condition;
		$checker = $this->gm->executeQuery($sql);
		if ($checker['code'] != 200) {
			$res = $this->gm->insert("evalstudent_tbl", $response);
		} else {
			$res = $this->gm->update("evalstudent_tbl", $response, $condition);
		}
		// $res = $this->gm->insert("evalstudent_tbl", $response);
		if ($res['code'] == 200) {
			$res = $this->gm->update("enrolledsubj_tbl", $termvalues,$condition);
			$code = 200;
			$payload = null;
			$remarks = "success";
			$message = "Evaluation response saved";
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}

	public function updateCovaxInfo($receivedPayload) {
		$code = 401;
		$payload = null;
		$remarks = "failed";
		$message = "Unable to save data";
		$res = [];

		$data = $receivedPayload->data;


		// print_r($receivedPayload);

		$res = $this->gm->update("accounts_tbl", $data, "studnum_fld='".$receivedPayload->studnum."'");
		if ($res['code'] == 200) {
			$code = 200;
			$payload = null;
			$remarks = "success";
			$message = "Evaluation response saved";
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}

	public function updateGameProgress($receivedPayload, $userid){
		$res = $this->gm->update('game_tbl', $receivedPayload, "studnum_fld = '$userid'");
		if($res['code']==200){
			return $this->gm->sendPayload(null, "success", "successfully updated game progress", 200);	
		}
		return $this->gm->sendPayload(null, "failed", "failed to update game progress", $res['code']);	
		
	}

	public function updateAdditionalInfo($receivedPayload, $userid){
		$code = 401;
		$payload = null;
		$remarks = "failed";
		$message = "Unable to save data";

		$updateProfileResult = $this->gm->update('students_tbl', $receivedPayload, "studnum_fld='$userid'");

		if($updateProfileResult['code']==200){
			$updateAccountResult = $this->gm->update('accounts_tbl', array("issurvey_fld"=>1), "studnum_fld='$userid'");

			if($updateAccountResult['code']==200){

				return $this->gm->sendPayload($payload, "success", "Additional Info response saved.", 200);
			}
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}
}
