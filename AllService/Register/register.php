<?php
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class Register extends database
{
    public $result = array();
    public $db;
    public $activationKey;
    public function ADD($ufnm, $ulnm, $unm, $tc, $emial, $sid, $uphone)
    {
        $db = new Register("root", "", "localhost", "bitirmeproje");
        $activationKey = bin2hex(openssl_random_pseudo_bytes(2));
        $addRows = $db->ekle("INSERT INTO registertemp 
    (rtnm,rtlnm,rtsno,rttcno,rtemail,rtrcode,phone,sid,uaccept) values('$ufnm','$ulnm','$unm','$tc','$emial','$activationKey','$uphone','$sid','X')");
        if ($addRows) {
            $this->result[] = array("status" => "SuccesAdd", "activationkey" => $activationKey);
            return $this->result;
        } else {
            $this->result = array("status" => "None");
            return $this->result;
        }
    }
    public function GET($where, $param)
    {
        $db = new Register("root", "", "localhost", "bitirmeproje");
        $fparam = array();
        for ($index = 0; $index < count($param); $index++) {
            array_push($fparam, $param[$index]);
        }
        $getRegisterRows = $db->getrows("SELECT  * FROM registertemp WHERE $where", $fparam);
        if (count($getRegisterRows) == 0) {
            $this->result = array("status" => "None");
            return $this->result;
        } else {
            for ($i = 0; $i < count($getRegisterRows); $i++) {
                $this->result[] = array("status" => "Okey", "rtid" => $getRegisterRows[$i]['rtid'], "rtnm" => $getRegisterRows[$i]['rtnm'], "rtlnm" => $getRegisterRows[$i]["rtlnm"], "rtsno" => $getRegisterRows[$i]["rtsno"], "rttcno" => $getRegisterRows[$i]["rttcno"], "rtemail" => $getRegisterRows[$i]["rtemail"], "rtrcode" => $getRegisterRows[$i]['rtrcode'], "phone" => $getRegisterRows[$i]['phone'], "sid" => $getRegisterRows[$i]['sid'], "uaccept" => $getRegisterRows[$i]['uaccept']);
            }
            return $this->result;
        }
    }
    public function DEL($where, $param)
    {
        $db = new Register("root", "", "localhost", "bitirmeproje");
        $fparam = array();
        for ($index = 0; $index < count($param); $index++) {
            array_push($fparam, $param[$index]);
        }
        $delete = $db->delete("DELETE FROM registertemp  WHERE $where", $fparam);
        if ($delete) {
            $this->result = array("status" => "None");
            return $this->result;
        } else {
            $this->result = array("status" => "SuccesDel");
            return $this->result;
        }
    }
    public function DELALL()
    {
        $db = new Register("root", "", "localhost", "bitirmeproje");
        $delete = $db->delete("DELETE FROM registertemp  ");
        if ($delete) {
            $this->result = array("status" => "None");
            return $this->result;
        } else {
            $this->result = array("status" => "SuccesDel");
            return $this->result;
        }
    }
} ?>