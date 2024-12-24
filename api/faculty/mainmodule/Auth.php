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
			$signature = hash_hmac('sha256', "$header.$payload", "TOKEN_KEY");
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
				
				case 2 || 3 || 4:
					$sql = "SELECT token_fld FROM personnel_tbl WHERE empcode_fld = '$userid'";
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

		public function facultyLogin($param)
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
			case 5:
				$panelString = "LAMP - Faculty Panel";
				break;
			default: # code... 
				break;
		}

		$sql = "SELECT ispwordtochange, role_fld, empcode_fld, fname_fld, lname_fld, email_fld, dept_fld, program_fld, image_fld, pword_fld, iscovax_fld, covaxtype_fld, nocovaxreason_fld FROM personnel_tbl WHERE email_fld =? AND role_fld > 0 ";
	
		$sql.=" AND isdeleted_fld=0 LIMIT 1";
		$stmt = $this->pdo->prepare($sql);
	
		try {
			$stmt->execute([$un]);
			if ($stmt->rowCount() > 0) {
				$res = $stmt->fetchAll()[0];
				
				if ($this->checkPassword($pw, $res['pword_fld'])) {
					$uc = $res['empcode_fld'];
					$ue = $res['email_fld'];
					$fn = $res['fname_fld'] . ' ' . $res['lname_fld'];
					$ur = $res['role_fld'];
					$dept = $res['dept_fld'];
					$program = $res['program_fld'];
					$profilepic = $res['image_fld'];
					$reset = $res['ispwordtochange'];
					$iscovax = $res['iscovax_fld'];
					$covaxtype = $res['covaxtype_fld'];
					$nocovaxreason_fld = $res['nocovaxreason_fld'];
					$tk = $this->generateToken($uc, $ue, $fn);

					$token_arr = explode('.', $tk);

					$sql = "UPDATE personnel_tbl SET token_fld='$tk' WHERE empcode_fld='$uc'";
					$this->gm->executeQuery($sql);

					$code = 200;
					$remarks = "success";
					$message = "Logged in successfully";
					$payload = array("id" => $uc, "fullname" => $fn, "key" => $token_arr[2], "role" => $ur, "emailadd" => $ue, "dept" => $dept, "program" => $program, "img" => $profilepic, "reset"=>$reset, "iscovax"=>$iscovax, "covaxtype"=>$covaxtype, "nocovaxreason"=>$nocovaxreason_fld);

					#Record Log
					file_put_contents(
						"../logs/faculty.log",
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
						"../logs/faculty.log",
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
					"../logs/faculty.log",
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
				"../logs/faculty.log",
				date("Y-m-d H:i:s") . ',' . $un . ',' . ' ' . ',' . ' ' . ',' . ' ' . ',' . $panelString . ',Attempted to Log In,' . $device . PHP_EOL,
				FILE_APPEND | LOCK_EX
			);
		}
		return $this->gm->sendPayload($payload, $remarks, $message, $code);
	}

	public function changeFacultyPassword($receivedPayload, $empcode) {
		$un = $empcode;
		$oldpass = $receivedPayload->param1;
		$newpass = $receivedPayload->param2;
		$bdate = $receivedPayload->param4;
		$code = 403;
		$payload = null; 
		$remarks = "failed"; 
		$message = "Incorrect password or birthday";
		$panelString = "LAMP - Faculty Panel";

		$sql = "SELECT * FROM personnel_tbl  WHERE empcode_fld='$un' AND isdeleted_fld=0 LIMIT 1";
		$res = $this->gm->executeQuery($sql);
	
		if($res['code']==200) {
			if ($this->checkPassword($oldpass, $res['data'][0]['pword_fld'])) {
				$newpass = $this->encryptPassword($newpass);
				$result = null;
				if($res['data'][0]['ispwordtochange']==0){
					$result = $this->gm->update('personnel_tbl', array("pword_fld"=>$newpass, "ispwordtochange"=>1), "empcode_fld='$un'");
				}
				else{
					$result = $this->gm->update('personnel_tbl', array("pword_fld"=>$newpass), "empcode_fld='$un'");
				}
			

				if ($result['code']==200) {
					$code = 200;
					$remarks = "success";
					$message = "Password changed successfully";
					$payload = null;
					# Faculty Log Here
					file_put_contents(
						"../logs/faculty.log",
						date("Y-m-d H:i:s") . ',' . $res['data'][0]['empcode_fld'] . ',' . $res['data'][0]['fname_fld'].' '.$res['data'][0]['lname_fld'] . ',' . $res['data'][0]['dept_fld'] . ',' . $res['data'][0]['program_fld'] . ',' . $panelString . ',Change Password,' .' ' . PHP_EOL,
						FILE_APPEND | LOCK_EX
					);
			

				}
			}
		} else {
			# #Error Log Here
			file_put_contents(
				"../logs/faculty.log",
				date("Y-m-d H:i:s") . ',' . $empcode . ',' . ' ' . ',' . ' ' . ',' . ' ' . ',' . $panelString . ',Failed Change Password,' .' ' . PHP_EOL,
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
		$panelString = "LAMP - Faculty Panel";

		$sql = "SELECT * FROM personnel_tbl WHERE empcode_fld='$un' AND bdate_fld ='$bd' AND email_fld='$em' AND isdeleted_fld=0 LIMIT 1";
		$res = $this->gm->executeQuery($sql);
	
		if ($res['code'] == 200) {
			$strpass = $this->generatepass(9);
			print_r($strpass);
			$npw = $this->encryptPassword($strpass);
			$sql = "UPDATE personnel_tbl SET ispwordtochange = '1', pword_fld='$npw' WHERE empcode_fld='$un'";
			$this->gm->executeQuery($sql);

			$code = 200;
			$remarks = "success";
			$message = "Success Request Password";
			$payload = array("pass"=>$strpass);
			file_put_contents(
				"../logs/faculty.log",
				date("Y-m-d H:i:s") . ',' . $res['data'][0]['empcode_fld'] . ',' . $res['data'][0]['fname_fld'].' '.$res['data'][0]['lname_fld'] . ',' . $res['data'][0]['dept_fld'] . ',' . $res['data'][0]['program_fld'] . ',' . $panelString . ',Forgot Password,' .' ' . PHP_EOL,
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

	public function updateSocket($receivedPayload, $userId){
		$socket = $receivedPayload->socketid;
		$sql = "UPDATE personnel_tbl SET socketid_fld = '$socket' WHERE empcode_fld = '$userId' AND isdeleted_fld = 0";
		$res = $this->gm->executeQuery($sql);
		return $this->gm->sendPayload(array("socketid"=>$socket), "success", "Succesfully updated socketid.", 200);

	}	

	}

	
?>