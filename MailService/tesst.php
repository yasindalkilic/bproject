<?php
include ('../dbclas/pdocls.php');
include ('abc.php');
$a=new AllGet();
$query=$a->get("user");
// echo $query;
$db = new database("root", "", "localhost", "bitirmeproje");
// header("Content-Type: application/json; charset=UTF-8");
$activeProject =  $db->getrows("SELECT  * FROM  activeproject ap INNER JoIN 
            projectall p on p.pjid=ap.pjid INNER JOIN
            user u on u.uid=p.uid INNER JOIN projectonlesson pl on pl.pjid=p.pjid 
            INNER JOIN lesson l on l.lid=pl.lid
            ");
            // for ($i=0; $i <count($activeProject) ; $i++) { 
            //     if(isset($activeProject[$i-1])){
            //         // echo $i;
            //     }else{
            //         if($activeProject[$i]['pjid']==$activeProject[$i-1]['pjid']){
            //             $activeProject[$i]['lnm'].=$activeProject[$i-1]['lnm'];
            //         }
            //     }
            //     print_r($activeProject);
                // print_r($activeProject[$i-1]);
                // if($activeProject[$i-1])
                // if($activeProject[$i]["pjid"]==$activeProject[$i-1]["pjid"]){
                //     echo $activeProject[$i]['pjid'];
                // }
                // if($i-($i-1)!=-1){
                //     echo $i;
                // }
                // if($i - ($i-1)<0){
                // echo "test";
                // }else{
                // $result[] = array("Status" => "Okey");
                    
                // }
            }
 
// $db = new database("root", "", "localhost", "bitirmeproje");
// // if ($mn == "GETP") {
// $where = "pjid=?";
// $param = array ('21');
// $id="11";
// // $wparam = array ($_POST['wparam']);
// echo json_encode($result);

// date_default_timezone_set('Europe/Istanbul');
// $info = getdate();
// $year = $info['year'];
// echo date($year);
// $now = new DateTime(null, new DateTimeZone('Europe/Istanbul'));
// $now->setTimezone(new DateTimeZone('Europe/Istanbul'));    // Another way
// echo $now->format("Y")

?>