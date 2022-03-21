<?php 
require_once("../config/Connection.php");
require_once("./mainmodule/Procedural.php");
require_once("./mainmodule/Global.php");
require_once("./mainmodule/Get.php");
require_once("./mainmodule/Auth.php");
require_once("./mainmodule/Post.php");

$db = new Connection();

$pdo = $db->connect();

$auth = new Auth($pdo);
$get = new Get($pdo);
$post = new Post($pdo);
$gm = new GlobalMethods($pdo);


if (isset($_REQUEST['request'])) {
	$req = explode('/', rtrim(base64_decode($_REQUEST['request']), '/'));
} else {
	$req = array("errorcatcher");
}

switch($_SERVER['REQUEST_METHOD']) {

	case 'POST':
		$d = receivedData(file_get_contents("php://input"));
		// $d = json_decode(file_get_contents("php://input"));

		switch ($req[0]) {

				# faculty Panel -------------------
				case 'facultylogin':
					echo returnData($auth->facultyLogin($d));
				break;

				case "forgotpass":
					echo returnData($auth->forgotPassword(($d)));
				break;

				case 'getacadyear':
					echo returnData($get->getReference("settings_tbl", "isactive_fld=1"));
				break;

				case "download":
					if ($auth->isAuthorized($d->param1, $d->param2, $d->param5)) {
						$filepath = $d->payload->filepath;
						try{
							readfile("../" . $d->payload->filepath);
						}
						catch(Exception $e){
							echo  returnData($gm->sendPayload(null, 'failed', 'file does not exist', 404));
						}
					
					} else {
						echo errmsg(401);
					}
					
					exit;
				break;	



				# Student Profile 	
				case "studentprofile":
					if ($auth->isAuthorized($d->param1, $d->param2, $d->param5)) {
						echo returnData($get->getReference("students_tbl", "studnum_fld = '$req[1]' AND isdeleted_fld = 0 AND isenrolled_fld = 1"));
					} else {
						echo errmsg(401);
					}
				break;	

				case "facultyprofile":
					if ($auth->isAuthorized($d->param1, $d->param2, $d->param5)) {
						echo returnData($get->getReference("personnel_tbl", "empcode_fld = '$req[1]' AND isdeleted_fld = 0"));
					} else {
						echo errmsg(401);
					}
				break;

				case "updateprofile":
					if ($auth->isAuthorized($d->param1, $d->param2, $d->param5)) {
						
						echo returnData($post->postCommon($d->payload->data, 'personnel_tbl', 'empcode_fld', $req[1], 'update', null));
					} else {
						echo errmsg(401);
					}
				break;

				case "uploadpic":
					echo returnData($post->uploadPic($req[1], $req[2]));
				break;

				case "addexcess":
					if ($auth->isAuthorized($d->param1, $d->param2, $d->param5)) {
						echo returnData($post->saveExcess($d->payload));
					} else {
						echo $gm->err(401);
					}
				break;

				case "getpersonneltime":
					if ($auth->isAuthorized($d->param1, $d->param2, $d->param5)) {
						echo returnData($get->getReference('officialtime_tbl', "empcode_fld = '$d->param1' "));
					} else {
						echo $gm->err(401);
					}
				break;
	
				case "editpersonneltime":
					if ($auth->isAuthorized($d->param1, $d->param2, $d->param5)) {
						echo returnData($post->savePersonnelTime($d->payload, $d->param1));
					} else {
						echo $gm->err(401);
					}
				break;

				case "changepass":
					if ($auth->isAuthorized($d->param1, $d->param2, $d->param5)) {
						echo returnData($auth->changeFacultyPassword($d->payload, $req[1]));
					} else {
						echo errmsg(401);
					}
				break;

				case "updatesocket":
					if ($auth->isAuthorized($d->param1, $d->param2, $d->param5)) {
						echo returnData($auth->updateSocket($d->payload, $d->param1));
					} else {
						echo errmsg(401);
					}
				break;
				# End of Student Profile

			
				# Classroom Get 
				case "getact":	break;
					
				case "getclasslist":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->getClasslist($d->payload->data));
					} else{
						echo errmsg(401);
					}
				break;

				case "getcpost":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->getClassPosts($d->payload->data));
					} else{
						echo errmsg(401);
					}
				break;
				
				case "getccomment":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->getClassComments($d->payload->data));
					} else{
						echo errmsg(401);
					}
				break;

				case "getreslist":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->getClassResource($d->payload->data));
					} else{
						echo errmsg(401);
					}
				break;

				case "getmembers":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->getClassmember($d->payload->data));
					} else{
						echo errmsg(401);
					}
				break;

				case "getstudworks":		
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->getClassworkslist($d->payload->data));
					} else{
						echo errmsg(401);
					}
				break;

				case "gettopic":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->getClasstopics($d->payload->data));
					} else{
						echo errmsg(401);
					}
				break;

				case "getsummary": 
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->getSummary($d->payload->data));
					} else{
						echo errmsg(401);
					}
				break;

				case "getquiz":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->getQuiz($d->payload));
					} else{
						echo errmsg(401);
					}
				break;

				case "getquizresult":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->getQuizResult($d->payload));
					} else{
						echo errmsg(401);
					}
				break;

				case "getquizanswer":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->ScoreQuiz($d->payload->data));
					} else{
						echo errmsg(401);
					}
				break;

				case "getpoll":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->getPoll($d->payload->data));
					} else{
						echo errmsg(401);
					}
				break;

				case 'newmeeting':
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($gm->insert("schedulemeetings_tbl", $d->payload));
					} else{
						echo errmsg(401);
					}
					break;
	

				# End of Classroom Get Methods

				# Forum Methods
				case "getforumtopic":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->getForumTopic());
					} else{
						echo errmsg(401);
					}
				break;
				
				case "getsubforum":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->getSubforum($d->payload->data));
					} else{
						echo errmsg(401);
					}
				break;

				case "getsubcontent":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->getSubcontent($d->payload->data));
					} else{
						echo errmsg(401);
					}
				break;

				case "getpollresult":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->getSubcontent($d->payload->data));
					} else{
						echo errmsg(401);
					}
				break;
					
				# End of Forum Methods

				# Announcements Methods
				case "getannounce":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->getAnnouncements($d->payload, $d->param5));
					} else{
						echo errmsg(401);
					}
				break;
	
				# End of Announcements Methods

				case "getroom":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->getRoomlist($d->param1));
					} else{
						echo errmsg(401);
					}
				break;

				case "getmsg":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->getMessage($d->payload, null));
					} else{
						echo errmsg(401);
					}
				break;

				case "getnotif":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->getNotif($d->param1));
					} else{
						echo errmsg(401);
					}
				break;

				case "getunread":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->getUnreadMessages($d->payload));
					} else{
						echo errmsg(401);
					}
				break;

				case "readmsg":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->readMessage($d->payload));
					} else{
						echo errmsg(401);
					}
				break;

				

				

				# Gamification Methods
					
				# End of Gamification Methods

				# Add Methods
				case "upload":
					echo returnData($post->uploadFile($req[1]));
				break;

				case "deletefile":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->deleteFile($d->payload));
					} else{
						echo errmsg(401);
					}
				break;

				case "addstudent":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->addStudent($d->payload->data, $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "addcomment":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->addComment($d->payload->data, $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "addpost":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->addPost($d->payload->data, $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "addactivity":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->addAssignment($d->payload->data, $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "addresource":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->addResource($d->payload->data, $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "addtopic":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->addTopic($d->payload->data));
					} else{
						echo errmsg(401);
					}
				break;

				case "addforumtopic":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->addForumTopic($d->payload->data, $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;
				
				case "addsubforum":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->addDiscussion($d->payload->data, $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "addreply":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->addReply($d->payload->data, $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "addquiz":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->createQuiz($d->payload, $d->param1));
					} else{
						echo errmsg(401);
					}
				break;

				case "editquiz":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->editQuiz($d->payload, $d->param1));
					} else{
						echo errmsg(401);
					}
				break;

				case "editanswer":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->saveAnswer($d->payload));
					} else{
						echo errmsg(401);
					}
				break;

				case "uploadpoll":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->addPoll($d->payload, $d->param1));
					} else{
						echo errmsg(401);
					}
				break;

				case "addpoll":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->savePoll($d->payload->data, $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "draftquiz":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->saveQuizDraft($d->payload, $d->param1));
					} else{
						echo errmsg(401);
					}
				break;

				case "addroom":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->addRoom($d->payload->data));
					} else{
						echo errmsg(401);
					}
				break;

				case "addmsg":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->sendMessage($d->payload));
					} else{
						echo errmsg(401);
					}
				break;
				
				#End of Add Methods

				#Start of Edit Methods

				case "editpost":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->editPost($d->payload->data, $req[1], $req[2], $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "editcomm":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->editComment($d->payload->data, $req[1], $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "editsubmit":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						// echo returnData($post->postCommon($d->payload->data, 'submissions_tbl', 'submitcode_fld', $req[1], 'update', $d->payload->notif));
						echo returnData($post->editSubmission($d->payload->data, $req[1], $req[2], $req[3]));
					} else{
						echo errmsg(401);
					}
				break;

				case "editres":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->editResource($d->payload->data, $req[1], $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "edittopic":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->editTopic($d->payload, $req[1], $req[2], null));
					} else{
						echo errmsg(401);
					}
				break;

			

				case "editdisc":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->editDiscussion($d->payload->data, $req[1], $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "editreply":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->editReply($d->payload->data, $req[1], $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "editforum":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->postCommon($d->payload->data, 'forums_tbl', 'forumcode_fld', $req[1], 'update', $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;


				#End of Edit Methods

				case "delpost":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->postCommon($d->payload->data, 'classpost_tbl', 'postcode_fld', $req[1], 'delete', $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "delact":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->postCommon($d->payload->data, 'activity_tbl', 'actcode_fld', $req[1], 'delete', $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "delres":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->postCommon($d->payload->data, 'resource_tbl', 'rescode_fld', $req[1], 'delete', $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "delcomment":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->postCommon($d->payload->data, 'classcomments_tbl', 'commentcode_fld', $req[1], 'delete', $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "delforumcont":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->postCommon($d->payload->data, 'forumcontent_tbl', 'contentcode_fld', $req[1], 'delete', $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "delsubforum":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->postCommon($d->payload->data, 'subforum_tbl', 'subcode_fld', $req[1], 'delete', $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				# Faculty Evaluation
				case "evalresult":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($get->evalResult($d->payload));
					} else{
						echo errmsg(401);
					}
				break;

				case "updatecovaxinfo":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo returnData($post->updateCovaxInfo($d->payload));
					} else{
						echo errmsg(401);
					}
				break;

				# End Faculty Evaluation
				
				default:
					echo errmsg(403);
				break;
			}	

	break;

	default: 
		echo errmsg(403);
	break;
}

?>