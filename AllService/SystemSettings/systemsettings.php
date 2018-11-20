<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class SystemSettings extends database
{
    public $result = array();
    function GETSYS()
    {
        if (isset($_SESSION["UNM"])) {
            $sysrows = $this->getrows("SELECT * FROM systemsettings");
            if (count($sysrows) == 0) {
                $this->result = array("status" => "None");
                return $this->result;
            } else {
                for ($i = 0; $i < count($sysrows); $i++) {
                    $this->result[] = array("status" => "Okey", "ssid" => $sysrows[$i]['ssid'], "pjscontenjan" => $sysrows[$i]['pjscontenjan'], "emailaddres" => $sysrows[$i]["emailaddres"], "emailpass" => $sysrows[$i]["emailpass"], );
                }
                return $this->result;
            }
        }
    }
    function SETSYS($param, $wset)
    {
        if (isset($_SESSION["UNM"])) {
            $fparam = array();
            for ($index = 0; $index < count($param); $index++) {
                array_push($fparam, $param[$index]);
            }
            $updatesys = $this->update("UPDATE   systemsettings set $wset WHERE ssid=?", $fparam);
            if ($updatesys) {
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