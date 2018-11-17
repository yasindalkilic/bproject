<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
$result=array();
require 'PHPMailer/PHPMailer/src/Exception.php';
require 'PHPMailer/PHPMailer/src/PHPMailer.php';
require 'PHPMailer/PHPMailer/src/SMTP.php';
header("Content-Type: application/json; charset=UTF-8");
$mail = new PHPMailer(true);     
$result=array();
try {
    $umail=$_POST['mail'];
    $activationKey=$_POST['activationKey'];
    $mail->isSMTP();       
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;                               
    $mail->Username = 'ysndlklc1234@gmail.com';               
    $mail->Password = '13271327';                         
    $mail->SMTPSecure = 'tls';                         
    $mail->Port = 587;                                  
   $mail->CharSet = 'UTF-8';
    $mail->setFrom('ysndlklc1234@gmail.com', 'Kayıt Doğrulama');
    $mail->addAddress($umail, 'Kişisel');    
    $mail->addReplyTo('ysndlklc1234@gmail.com', 'Bilgi');
    $mail->isHTML(true);                                 
    $mail->Subject = 'Kayıt Aktivitasyon Kodu';
    $mail->Body    = "Aktivitasyon kodu :"."\n"."<b>".$activationKey."</b>"."</br>"."<p>"."Kaydınız Onaylandıktan Sonra Size Mail İle Bildirim Yapılacaktır."."</p>";
    $mail->AltBody = ' ';
    			if($mail->Send()) {
                    $result[]=array("status"=>"Succes","umail"=>$umail);
                    echo json_encode($result);
                }
                         }         

catch (Exception $e) {
	if($mail->Send()==false) {
        $result[]=array("status"=>"None");
        echo json_encode($result);
                         }     
                         }          
?>