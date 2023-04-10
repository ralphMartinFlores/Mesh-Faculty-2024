<?php
	header("Access-Control-Allow-Origin: *");
	header("Content-Type: application/json; charset=utf-8");
	header("Access-Control-Allow-Methods: POST");
	header("Access-Control-Max-Age: 3600");
	header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-REquested-With, X-Auth-User");
	// ini_set('display_errors', '0');
	date_default_timezone_set("Asia/Manila");
	set_time_limit(1000);

	// require_once("./vendor/autoload.php");

	// $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
	// $dotenv->load();

	define("SERVER", "localhost");
	define("DBASE", "chedro_lamp_db");
	define("USER", "root");
	define("PASSWORD", "");
	define("ENCRYPT_KEY", "gc_Developers_2020");
	define("TOKEN_KEY", "9f0124bf5124b4e1140b70f070806120d2e8e44d43f926f88681db3f2aa98d59");
	define("HAYSTACK", "AvengersRockzWithZontheRocks");
	define("SECRET", base64_encode("www.gordoncollege.edu.ph"));

	// define("SERVER", "localhost");
	// define("DBASE", "gordoncollegeccs_central");
	// define("USER", "gordoncollegeccs_webadmin");
	// define("PASSWORD", "/IronInfinity4477");
	// define("ENCRYPT_KEY", "gc_Developers_2020");
	// define("TOKEN_KEY", "9f0124bf5124b4e1140b70f070806120d2e8e44d43f926f88681db3f2aa98d59");
	// define("HAYSTACK", "AvengersRockzWithZontheRocks");
	// define("SECRET", base64_encode("www.gordoncollege.edu.ph"));

	// define("SERVER", "$_ENV['__SERVER_']");
	// define("DBASE", $_ENV['__DBASE_']);
	// define("USER", $_ENV['__USER_']);
	// define("PASSWORD", $_ENV['__PASSWORD_']);
	// define("ENCRYPT_KEY", $_ENV['__ENCRYPT_KEY_']);
	// define("TOKEN_KEY", $_ENV['__TOKEN_KEY_']);
	// define("HAYSTACK", $_ENV['__HAYSTACK_']);
	// define("SECRET", base64_encode("www.gordoncollege.edu.ph"));

	class Connection {
		protected $conString = "mysql:host=".SERVER.";dbname=".DBASE."; charset=utf8mb4";
		protected $options = [
			\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
			\PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
			\PDO::ATTR_EMULATE_PREPARES => false
		];

		public function connect() {
			return new \PDO($this->conString, USER, PASSWORD, $this->options);
		}
	}
	
?>
