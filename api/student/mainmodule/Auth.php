<?php
	class Auth {
		protected $gm, $pdo;

		public function __construct(\PDO $pdo)
		{
			$this->gm = new GlobalMethods($pdo);
			$this->pdo = $pdo;
		}

		################################################################

		# check Authorized User
		public function checkAuthorization($sql, $signature)
		{	
			$res = $this->gm->executeQuery($sql);
			if ($res['code'] == 200) {
				$token_arr = explode('.', $res['data'][0]['token_fld']);
				if ($token_arr[2] == $signature) {
					return true;
				}
			}
			return false;
		} #end of checkAuthorization

		protected function generateHeader()
		{
			$h = [
				"typ" => "JWT",
				"alg" => 'HS256',
				"app" => "GC Systems",
				"dev" => "GC Developers"
			];
			return base64_encode(json_encode($h));
		} #end of generateHeader

		protected function generatePayload($uc, $ue, $ito)
		{
			$p = [
				'uc' => $uc,
				'ue' => $ue,
				'ito' => $ito,
				'iby' => 'GC Developers',
				'ie' => 'gcdevelopers@gordoncollege.edu.ph',
				'idate' => date_create(),
				'exp' => date("Y-m-d H:i:s")
			];
			return base64_encode(json_encode($p));
		} #end of generatePayload

		protected function generateToken($usercode, $useremail, $fullname)
		{
			$header = $this->generateHeader();
			$payload = $this->generatePayload($usercode, $useremail, $fullname);
			$signature = hash_hmac('sha256', "$header.$payload", TOKEN_KEY);
			return "$header.$payload." . base64_encode($signature);
		} #end of generateToken

		################################################################

		protected function checkPassword($pword, $existingHash)
		{
			$hash = crypt($pword, $existingHash);
			if ($hash === $existingHash) {
				return true;
			}
			return false;
		} #end of checkPassword

		public function encryptPassword($pword)
		{
			$hashFormat = "$2y$10$";
			$saltLength = 22;
			$salt = $this->generateSalt($saltLength);
			return crypt($pword, $hashFormat . $salt);
		}

		protected function generateSalt($len)
		{
			$urs = md5(uniqid(mt_rand(), true));
			$b64String = base64_encode($urs);
			$mb64String = str_replace('+', '.', $b64String);
			return substr($mb64String, 0, $len);
		}

		################################################################

		public function isAuthorized($userid, $token, $role)
		{
			$sql = "";
			switch ($role) {
				case 0:
					$sql = "SELECT token_fld FROM accounts_tbl WHERE studnum_fld='$userid'";
				break;
					
				default:
					# code...
				break;
			}
			return $this->checkAuthorization($sql, $token);
		}

		################################################################
		# USER DEFINED METHODS
		################################################################

		public function studentLogin($param)
	{
		$un = $param->param1;
		$pw = $param->param2;
		$panel = $param->param3;
		$device = $param->param4;
		$panelString = "";
		$code = 403;
		$isPwordToChange = 0;
		$payload = "";
		$remarks = "";
		$message = "";

		
		switch ($panel) {
			case 1:
				$panelString = "LAMP - Student Panel";
				break;

			default: # code... 
				break;
		}

		$sql = "SELECT students_tbl.studnum_fld, students_tbl.fname_fld, students_tbl.lname_fld, students_tbl.email_fld, students_tbl.dept_fld, students_tbl.program_fld, students_tbl.profilepic_fld, accounts_tbl.ispwordreset_fld, accounts_tbl.role_fld,accounts_tbl.forumrole_fld, accounts_tbl.pword_fld, accounts_tbl.iscovax_fld, accounts_tbl.covaxtype_fld, accounts_tbl.nocovaxreason_fld, accounts_tbl.issurvey_fld, accounts_tbl.lasthc_fld FROM students_tbl INNER JOIN accounts_tbl USING(studnum_fld) LEFT JOIN enrollstatus_tbl ON enrollstatus_tbl.studnum_fld=accounts_tbl.studnum_fld AND enrollstatus_tbl.acadyear_fld='2021-2022' AND enrollstatus_tbl.sem_fld=2 WHERE students_tbl.email_fld=?";

		if($panel==1) {
			$sql.=" AND enrollstatus_tbl.isenrolled_fld=4";
		}
		$sql.=" AND accounts_tbl.isdeleted_fld=0 LIMIT 1";
		$stmt = $this->pdo->prepare($sql);
		
		try {
			$stmt->execute([$un]);
			if ($stmt->rowCount() > 0) {
				$res = $stmt->fetchAll()[0];
				if ($this->checkPassword($pw, $res['pword_fld'])) {
					$uc = $res['studnum_fld'];
					$ue = $res['email_fld'];
					$fn = $res['fname_fld'] . ' ' . $res['lname_fld'];
					$ur = $res['role_fld'];
					$fr = $res['forumrole_fld'];
					$dept = $res['dept_fld'];
					$program = $res['program_fld'];
					$profilepic = $res['profilepic_fld'];
					$tk = $this->generateToken($uc, $ue, $fn);
					$reset = $res['ispwordreset_fld'];
					$iscovax = $res['iscovax_fld'];
					$covaxtype = $res['covaxtype_fld'];
					$nocovaxreason_fld = $res['nocovaxreason_fld'];
					$issurvey = $res['issurvey_fld'];
					$lasthc = $res['lasthc_fld'];

					$token_arr = explode('.', $tk);

					$sql = "UPDATE accounts_tbl SET token_fld='$tk' WHERE studnum_fld='$uc'";
					$this->gm->executeQuery($sql);

					$code = 200;
					$remarks = "success";
					$message = "Logged in successfully";
					$payload = array("id" => $uc, "fullname" => $fn, "key" => $token_arr[2], "role" => $ur,"forumrole" => $fr, "emailadd" => $ue, "dept" => $dept, "program" => $program, "img" => $profilepic, "reset"=>$reset, "iscovax"=>$iscovax, "covaxtype"=>$covaxtype, "nocovaxreason"=>$nocovaxreason_fld, "issurvey"=>$issurvey, "lasthc"=>$lasthc);
				
					#Record Log
					file_put_contents(
						"../logs/student.log",
						date("Y-m-d H:i:s") . ',' . $un . ',' . $fn . ',' . $dept . ',' . $program . ',' . $panelString . ',Logged In,' . $device . PHP_EOL,
						FILE_APPEND | LOCK_EX
					);
				} else {
					$code = 401;
					$remarks = "failed";
					$message = "Incorrect Username or Password";
					$payload = null;
					#Record Log
					
					file_put_contents(
						"../logs/student.log",
						date("Y-m-d H:i:s") . ',' . $un . ',' . ' ' . ',' . ' ' . ',' . ' ' . ',' . $panelString . ',Attempted to Log In,' . $device . PHP_EOL,
						FILE_APPEND | LOCK_EX
					);
				}
			} else {
				$code = 401;
				$remarks = "failed";
				$message = "Incorrect Username or Password";
				$payload = null;
				#Record Log
				file_put_contents(
					"../logs/student.log",
					date("Y-m-d H:i:s") . ',' . $un . ',' . ' ' . ',' . ' ' . ',' . ' ' . ',' . $panelString . ',Attempted to Log In,' . $device . PHP_EOL,
					FILE_APPEND | LOCK_EX
				);
			}
		} catch (\PDOException $e) {
			$code = 401;
			$remarks = "failed";
			$message = "Incorrect Username or Password";
			$payload = null;
			#Record Log
			file_put_contents(
				"../logs/student.log",
				date("Y-m-d H:i:s") . ',' . $un . ',' . ' ' . ',' . ' ' . ',' . ' ' . ',' . $panelString . ',Attempted to Log In,' . $device . PHP_EOL,
				FILE_APPEND | LOCK_EX
			);
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}

	public function changeStudentPassword($receivedPayload) {
		$un = $receivedPayload->id;
		$oldpass = $receivedPayload->param1;
		$newpass = $receivedPayload->param2;
		$code = 403;
		$payload = null; 
		$remarks = "failed"; 
		$message = "Incorrect username or password";
		$panelString = "LAMP - Student Panel";
		$sql = "SELECT * FROM students_tbl INNER JOIN accounts_tbl USING(studnum_fld) WHERE studnum_fld='$un' AND accounts_tbl.isdeleted_fld=0 LIMIT 1";
		$res = $this->gm->executeQuery($sql);
		if($res['code']==200) {
			if ($this->checkPassword($oldpass, $res['data'][0]['pword_fld'])) {
				$newpass = $this->encryptPassword($newpass);
				$data = $this->gm->update('accounts_tbl', array("pword_fld"=>$newpass, "ispwordreset_fld"=>1), "studnum_fld='$un'");

				if ($data['code']==200) {
					$code = 200;
					$remarks = "success";
					$message = "Password changed successfully";
					$payload = null;
					# Student Log Here
					file_put_contents(
						"../logs/student.log",
						date("Y-m-d H:i:s") . ',' . $res['data'][0]['studnum_fld'] . ',' . $res['data'][0]['fname_fld'].' '.$res['data'][0]['lname_fld'] . ',' . $res['data'][0]['dept_fld'] . ',' . $res['data'][0]['program_fld'] . ',' . $panelString . ',Change Password,' .' ' . PHP_EOL,
						FILE_APPEND | LOCK_EX
					);
			
				}
			}
		} else {
			# #Error Log Here
			file_put_contents(
				"../logs/student.log",
				date("Y-m-d H:i:s") . ',' . $un . ',' . ' ' . ',' . ' ' . ',' . ' ' . ',' . $panelString . ',Failed Change Password,' .' ' . PHP_EOL,
				FILE_APPEND | LOCK_EX
			);
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}

	public function forgotPassword($param)
	{
		$un = $param->param1;
		$bd = $param->param2;
		$em = $param->param3;
		$ln = $param->param4;
		$panelString = "LAMP - Student Panel";
		
		$sql = "SELECT * FROM students_tbl WHERE studnum_fld='$un' AND birthdate_fld ='$bd' AND email_fld='$em' AND lname_fld='$ln' LIMIT 1";
		$res = $this->gm->executeQuery($sql);
		if ($res['code'] == 200) {
			$strpass = $this->generatepass(9);
			$npw = $this->encryptPassword($strpass);
			$sql = "UPDATE accounts_tbl SET ispwordreset_fld = 0, pword_fld='$npw' WHERE studnum_fld=$un";
			
			$this->gm->executeQuery($sql);

			$code = 200;
			$remarks = "success";
			$message = "Success Request Password";
			$payload = array("pass"=>$strpass);

			file_put_contents(
				"../logs/student.log",
				date("Y-m-d H:i:s") . ',' . $res['data'][0]['studnum_fld'] . ',' . $res['data'][0]['fname_fld'].' '.$res['data'][0]['lname_fld'] . ',' . $res['data'][0]['dept_fld'] . ',' . $res['data'][0]['program_fld'] . ',' . $panelString . ',Forgot Password,' .' ' . PHP_EOL,
				FILE_APPEND | LOCK_EX
			);
	
		} else {
			$payload = null;
			$remarks = "Failed";
			$message = $res['errmsg'];
		}

	
		return $this->gm->sendPayload($payload, $remarks, $message, $res['code']);
	}

	private function generatepass($size){
			$base = str_split('abcdefghijklmnopqrstuvwxyz'
				 .'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
				 .'0123456789!@#$%^&*()'); 
			shuffle($base); 
			$rand = '';
			foreach (array_rand($base, $size) as $k) $rand .= $base[$k];
	
			return $rand;
		}

	}

	
?>