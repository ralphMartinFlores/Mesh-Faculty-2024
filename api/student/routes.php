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

if (isset($_REQUEST['request'])) {
	$req = explode('/', rtrim($_REQUEST['request'], '/'));
} else {
	$req = array("errorcatcher");
}


switch($_SERVER['REQUEST_METHOD']) {
	case 'POST':
		// $d = receivedData(file_get_contents("php://input"));
		$d = json_decode(file_get_contents("php://input"));

		switch ($req[0]) {

				# Student Panel -------------------
				case 'studentlogin':
					echo json_encode($auth->studentLogin($d));
				break;

				case "forgotpass":
					echo json_encode($auth->forgotPassword(($d)));
				break;

				case 'getsettings':
					echo json_encode($get->getSetting());
				break;
				
				case "download":
					if ($auth->isAuthorized($d->param1, $d->param2, $d->param5)) {
						$filepath = $d->payload->filepath;
						try{
							readfile("../" . $d->payload->filepath);
						}
						catch(Exception $e){
							echo  json_encode($gm->sendPayload(null, 'failed', 'file does not exist', 404));
						}
					
					} else {
						echo errmsg(401);
					}
					
					exit;
				break;	

				case 'getbooks':
					// echo json_encode($get->getBooks());
					if ($auth->isAuthorized($d->param1, $d->param2, $d->param5)) {
						echo json_encode($get->getBooks($req[1], $req[2]));
						// echo returnData($get->getBooks('ccs', 'bsemc'));

					}
					else {
						echo errmsg(401);
					}
				
				break;

				# Student Profile 	
				case "studentprofile":
					if ($auth->isAuthorized($d->param1, $d->param2, $d->param5)) {
						echo json_encode($get->getStudentProfile($d->param1));
					} else {
						echo errmsg(401);
					}
				break;	

				case "updateprofile":
					if ($auth->isAuthorized($d->param1, $d->param2, $d->param5)) {
						echo json_encode($post->postCommon($d->payload->data, 'students_tbl', 'studnum_fld', $req[1], 'update' ,$d->payload->notif));
					} else {
						echo errmsg(401);
					}
				break;

				case "updateinfo":
					if ($auth->isAuthorized($d->param1, $d->param2, $d->param5)) {
						echo json_encode($post->updateAdditionalInfo($d->payload, $d->param1));
					} else {
						echo errmsg(401);
					}
				break;

				/*Upload Profile Picture --Riejan*/
				case "editProfile":
					echo json_encode($post->editProfile($req[1]));
				break;
				
				case "changepass":
					if ($auth->isAuthorized($d->param1, $d->param2, $d->param5)) {
						echo json_encode($auth->changeStudentPassword($d->payload));
					} else {
						echo errmsg(401);
					}
				break;
				# End of Student Profile

			
				# Classroom Get 
				case "getact":	break;
					
				case "getclasslist":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getClasslist($d->payload));
					} else{
						echo errmsg(401);
					}
				break;

				case "getcpost":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getClassPosts($d->payload, $d->param1));
					} else{
						echo errmsg(401);
					}
				break;
				
				case "getccomment":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getClassComments($d->payload));
					} else{
						echo errmsg(401);
					}
				break;

				case "getreslist":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getClassResource($d->payload));
					} else{
						echo errmsg(401);
					}
				break;

				case "getmembers":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getClassmember($d->payload->data));
					} else{
						echo errmsg(401);
					}
				break;

				case "getstudworks":		
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getClassworkslist($d->payload));
					} else{
						echo errmsg(401);
					}
				break;

				case "gettopic":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getClasstopics($d->payload));
					} else{
						echo errmsg(401);
					}
				break;

				case "getsummary": break;

				case "gettodolist":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getTasksList($d->param1, $req[1], $req[2]));
					} else{
						echo errmsg(401);
					}
				break;

				case "getRegion":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getReference('refregion_tbl',null));
					} else{
						echo errmsg(401);
					}
				break;
				case "getProvince":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getProvince($d->payload->region_id));
					} else{
						echo errmsg(401);
					}
				break;
				case "getCity":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getMunicipality($d->payload->province_id));
					} else{
						echo errmsg(401);
					}
				break;
				case "getBrgy":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getBarangay($d->payload->municipality_id));
					} else{
						echo errmsg(401);
					}
				break;

				case "getgroups":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getGroups($d->payload->data));
					} else{
						echo errmsg(401);
					}
				break;

				case "getgroupmessages":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getGroupMessages($d->payload->data));
					} else{
						echo errmsg(401);
					}
				break;
				# End of Classroom Get Methods

				# Forum Methods
				case "getforumtopic":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getForumTopic());
					} else{
						echo errmsg(401);
					}
				break;
				
				case "getsubforum":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getSubforum($d->payload));
					} else{
						echo errmsg(401);
					}
				break;

				case "getsubcontent":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getSubcontent($d->payload));
					} else{
						echo errmsg(401);
					}
				break;
					
				# End of Forum Methods

				# Announcements Methods
				case "getannounce":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getAnnouncements($d->payload, $d->param5));
					} else{
						echo errmsg(401);
					}
				break;

				case "getpoll":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getPoll($d->payload, $d->param1));
					} else{
						echo errmsg(401);
					}
				break;

				case "getresult":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getQuizResult($d->payload));
					} else{
						echo errmsg(401);
					}
				break;

				case "getroom":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getRoomlist($d->param1));
					} else{
						echo errmsg(401);
					}
				break;

				case "getmsg":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getMessage($d->payload, null));
					} else{
						echo errmsg(401);
					}
				break;

				case "getunread":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getUnreadMessages($d->payload));
					} else{
						echo errmsg(401);
					}
				break;

				case "readmsg":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($post->readMessage($d->payload));
					} else{
						echo errmsg(401);
					}
				break;

				case "getnotif":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getNotif($d->param1));
					} else{
						echo errmsg(401);
					}
				break;

				case "getquiz":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($get->getQuiz($d->payload));
					} else{
						echo errmsg(401);
					}
				break;
	
				# End of Announcements Methods

				# Gamification Methods
					
				# End of Gamification Methods
				
				# Add Methods

				case "upload":
					echo json_encode($post->uploadFile($req[1], $req[2], $req[3]));
				break;

				case "deletefile":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($post->deleteFile($d->payload, $d->param1));
					} else{
						echo errmsg(401);
					}
				break;

				case "answerpoll":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($post->responsePoll($d->payload->data, $d->payload->filepath, $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "addcomment":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($post->addComment($d->payload->data, $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "addpost":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($post->addPost($d->payload->data, $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "gameprogress":
					if ($auth->isAuthorized($d->param1, $d->param2, $d->param5)) {
						echo json_encode($get->getGameProgress($d->param1));
					} else {
						echo errmsg(401);
					}
				break;

				case "updategameprogress":
					if ($auth->isAuthorized($d->param1, $d->param2, $d->param5)) {
						echo json_encode($post->updateGameProgress($d->payload, $d->param1));
					} else {
						echo errmsg(401);
					}
				break;

				

				case "addwork":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($post->addSubmission($d->payload->data, $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "addsubforum":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($post->addDiscussion($d->payload->data, $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "addreply":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($post->addReply($d->payload->data, $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "addanswer":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($post->saveAnswer($d->payload->data, $d->param1, $d->payload->notif, $req[1], $req[2]));
					} else{
						echo errmsg(401);
					}
				break;

				case "addroom":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($post->addRoom($d->payload->data));
					} else{
						echo errmsg(401);
					}
				break;

				case "addmsg":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($post->sendMessage($d->payload));
					} else{
						echo errmsg(401);
					}
				break;
				
				// ADD GROUP MESSAGE
				case "addgrpmsg":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($post->addGroupMessage($d->payload));
					} else{
						echo errmsg(401);
					}
				break;
				#End of Add Methods

				#Start of Edit Methods

				case "deletefile":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($post->deleteFile($d->payload->data, $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "editpost":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($post->editPost($d->payload->data, $req[1], $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "editcomm":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($post->editComment($d->payload->data, $req[1], $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "editsubmit":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						// echo returnData($post->postCommon($d->payload->data, 'submissions_tbl', 'submitcode_fld', $req[1], 'update', $d->payload->notif));
						echo json_encode($post->editSubmission($d->payload->data, $req[1], $d->param1, $req[2], $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "editdisc":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($post->editDiscussion($d->payload->data, $req[1], $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				case "editreply":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($post->editReply($d->payload->data, $req[1], $d->payload->notif));
					} else{
						echo errmsg(401);
					}
				break;

				// case "editanswer":
				// 	if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
				// 		echo returnData($post->saveAnswer($d->payload));
				// 	} else{
				// 		echo errmsg(401);
				// 	}
				// break;


				#End of edit methods

				case "submiteval":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($post->submitEval($d->payload));
					} else{
						echo errmsg(401);
					}
				break;

				case "updatecovaxinfo":
					if($auth->isAuthorized($d->param1, $d->param2, $d->param5)){
						echo json_encode($post->updateCovaxInfo($d->payload));
					} else{
						echo errmsg(401);
					}
				break;



				default:
					echo errmsg(403);
				break;
			}	

	break;

	default: 
		echo errmsg(403);
	break;
}
