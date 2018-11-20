<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class Lesson extends database
{

    public $result = array();
    public function GET()
    {
        if (isset($_SESSION["UNM"])) {
            $lessonRows =  $this->getrows("SELECT  * FROM  lesson");
            if (count($lessonRows) == 0) {
                $this->result = array("status" => "None");
                return $this->result;
            } else {
                for ($i = 0; $i < count($lessonRows); $i++) {
                    $this->result[] = array(
                        "status" => "Okey",
                        "lid" => $lessonRows[$i]['lid'],
                        "lnm" => $lessonRows[$i]['lnm'],
                        "lperiod" => $lessonRows[$i]["lperiod"],
                        "lclass" => $lessonRows[$i]["lclass"],
                        "lcntn" => $lessonRows[$i]["lcntn"],
                        "lcode" => $lessonRows[$i]["lcode"],
                    );
                }
                return $this->result;
            }
        }
    }
    public function ADD($lnm, $lperiod, $lclass, $lcntn, $uid,$sid,$lcode)
    {
        if (isset($_SESSION["UNM"])) {
            $addRows =  $this->ekle("INSERT INTO lesson (lnm,lperiod,lclass,lcntn,lcruid,sid,lcode) values('$lnm','$lperiod','$lclass','$lcntn','$uid','$sid','$lcode')");
            if ($addRows) {
                $this->result = array("status" => "SuccesAdd");
                return $this->result;
            } else {
                $this->result = array("status" => "None");
                return $this->result;
            }
        }
    }
    public function GETWHERE($where, $allparam, $field)
    {
        if (isset($_SESSION["UNM"])) {
            $fparam = array();
            for ($index = 0; $index < count($allparam); $index++) {
                array_push($fparam, $allparam[$index]);
            }
            $lessonRows =  $this->getrows("SELECT  * FROM  $field WHERE $where=?", $fparam);
            if (count($lessonRows) == 0) {
                $this->result = array("status" => "None");
                return $this->result;
            } else {
                for ($i = 0; $i < count($lessonRows); $i++) {
                    $this->result[] = array(
                        "status" => "Okey",
                        "where" => "userWhere",
                        "lid" => $lessonRows[$i]['lid'],
                        "lnm" => $lessonRows[$i]['lnm'],
                        "lperiod" => $lessonRows[$i]["lperiod"],
                        "lclass" => $lessonRows[$i]["lclass"],
                        "lcntn" => $lessonRows[$i]["lcntn"],
                        "lcode" => $lessonRows[$i]["lcode"],
                    );
                }
                return $this->result;
            }

        }

    }
    public function DEL($where, $allparam)
    {
        if (isset($_SESSION["UNM"])) {
            $fparam = array();
            for ($index = 0; $index < count($allparam); $index++) {
                array_push($fparam, $allparam[$index]);
            }
            $delete =  $this->delete("DELETE FROM lesson  WHERE $where", $allparam);
            if ($delete) {
                $this->result = array("status" => "None");
                return $this->result;
            } else {
                $this->result = array("status" => "SuccesDel");
                return $this->result;
            }
        }
    }
    public function SET($wparam, $wsetparam)
    {
        if (isset($_SESSION["UNM"])) {
            $fparam = array();
            for ($index = 0; $index < count($wsetparam); $index++) {
                array_push($fparam, $wsetparam[$index]);
            }
            $upP =  $this->update("UPDATE  lesson set 
           lnm=?,lperiod=?,lclass=?,lcntn=?
            WHERE lid IN($wparam)", $wsetparam);
            if ($upP) {
                $this->result = array("status" => "None");
                return $this->result;
            } else {
                $this->result = array("status" => "SuccedUpdate");
                return $this->result;
            }
        }
    }
}
?>