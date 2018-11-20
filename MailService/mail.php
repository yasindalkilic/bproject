    <?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    include ('../dbclas/pdocls.php');
    $result = array();
    require 'PHPMailer/PHPMailer/src/Exception.php';
    require 'PHPMailer/PHPMailer/src/PHPMailer.php';
    require 'PHPMailer/PHPMailer/src/SMTP.php';
    header("Content-Type: application/json; charset=UTF-8");
    $mail = new PHPMailer(true);
    $db = new database("root", "", "localhost", "bitirmeproje");
    $result = array();
    try {
        $sysrows=$db->getrows("SELECT * FROM systemsettings");
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $maildata = $_POST['maildata'];
        $mail->Username = $sysrows[0]['emailaddres'];
        $mail->Password =  $sysrows[0]['emailpass'];
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;
        $mail->CharSet = 'UTF-8';
        $mail->setFrom('ysndlklc1234@gmail.com', 'Kayıt Doğrulama');
        for ($i = 0; $i < count($maildata); $i++) {
            $umail = $maildata[$i]['mail'];
            $messega = $maildata[$i]['messega'];
            $mail->addAddress($umail, 'Kişisel');
        }
        $mail->addReplyTo('ysndlklc1234@gmail.com', 'Bilgi');
        $mail->isHTML(true);
        $mail->Subject = 'Kayıt Aktivitasyon Kodu';
        $mail->Body = $messega;
        $mail->AltBody = ' ';
        if ($mail->Send()) {
            $result[] = array("status" => "Succes", "umail" => $umail);
            echo json_encode($result);
        }
    } catch (Exception $e) {
        if ($mail->Send() == false) {
            $result[] = array("status" => "None");
            echo json_encode($result);
        }
    }
    ?>