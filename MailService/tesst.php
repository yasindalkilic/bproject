<?php
include ('../dbclas/pdocls.php');
include ('abc.php');
$a=new AllGet();
$query=$a->get("user");
echo $query;
$db = new database("root", "", "localhost", "bitirmeproje");
// header("Content-Type: application/json; charset=UTF-8");
 $result = array ();
// $db = new database("root", "", "localhost", "bitirmeproje");
// // if ($mn == "GETP") {
// $where = "pjid=?";
// $param = array ('21');
// $id="11";
// // $wparam = array ($_POST['wparam']);
 $lessonRows = $db->getrows($query);
echo json_encode($lessonRows);

// date_default_timezone_set('Europe/Istanbul');
// $info = getdate();
// $year = $info['year'];
// echo date($year);
// $now = new DateTime(null, new DateTimeZone('Europe/Istanbul'));
// $now->setTimezone(new DateTimeZone('Europe/Istanbul'));    // Another way
// echo $now->format("Y")

?>