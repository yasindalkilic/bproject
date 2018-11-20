<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class ActiveProject extends database
{
    public $result = array();
    public $db;
    function ADD($pjdata)
    {
        $db = new ActiveProject("root", "", "localhost", "bitirmeproje");
        for ($i = 0; $i < count($pjdata); $i++) {
            $pjid = $pjdata[$i]['pjid'];
            $uid = $pjdata[$i]['uid'];
            $uflag = $pjdata[$i]['uflag'];
            $apperiod = $pjdata[$i]['apperiod'];
            $ActiveProjectRows = $db->ekle("INSERT INTO activeproject (pjid,apuid,uflag,apperiod)
            values('$pjid','$uid','$uflag','$apperiod')");
        }
        if ($ActiveProjectRows) {
            $this->result = array("status" => "SuccesAdd");
            return $this->result;
        } else {
            $this->result = array("status" => "None");
            return $this->result;
        }
    }
    function GET()
    {
        if (isset($_SESSION["UNM"])) {
            $db = new ActiveProject("root", "", "localhost", "bitirmeproje");
            $activeProject = $db->getrows("SELECT  * FROM  activeproject ap INNER JoIN 
            projectall p on p.pjid=ap.pjid INNER JOIN
            user u on u.uid=p.uid 
            ");
            if (count($activeProject) == 0) {
                $this->result = array("status" => "None");
                return $this->result;
            } else {
                for ($i = 0; $i < count($activeProject); $i++) {
                    $this->result[] = array(
                        "status" => "Okey",
                        "pjid" => $activeProject[$i]['pjid'],
                        "pjnm" => $activeProject[$i]['pjnm'],
                        "pjtechnology" => $activeProject[$i]["pjtechnology"],
                        "pjcntn" => $activeProject[$i]["pjcntn"],
                        "pjperiod" => $activeProject[$i]["pjperiod"],
                        "apperiod" => $activeProject[$i]["apperiod"],
                        "uflag" => $activeProject[$i]["uflag"],
                        "apuid" => $activeProject[$i]['apuid'],
                        "uid" => $activeProject[$i]["uid"],
                        "ufnm" => $activeProject[$i]["ufnm"] . " " . $activeProject[$i]["ulnm"],
                        "pjquota" => $activeProject[$i]["pjquota"],
                    );
                }
            }
            return $this->result;
        }
    }
    function GETWHERE($where, $allparam)
    {
        if (isset($_SESSION["UNM"])) {
            $db = new ActiveProject("root", "", "localhost", "bitirmeproje");
            $fparam = array();
            for ($index = 0; $index < count($allparam); $index++) {
                array_push($fparam, $allparam[$index]);
            }
            $activeProjectRow = $db->getrows("SELECT  * FROM  activeproject
                ap INNER JOIN projectall p on ap.pjid=p.pjid
              WHERE $where", $fparam);
            if (count($activeProjectRow) == 0) {
                $this->result = array("status" => "None");
                return $this->result;
            } else {
                for ($i = 0; $i < count($activeProjectRow); $i++) {
                    $this->result[] = array(
                        "status" => "Okey",
                        "pjid" => $activeProjectRow[$i]['pjid'],
                        "pjnm" => $activeProjectRow[$i]['pjnm'],
                        "pjtechnology" => $activeProjectRow[$i]["pjtechnology"],
                        "pjcntn" => $activeProjectRow[$i]["pjcntn"],
                        "pjperiod" => $activeProjectRow[$i]["pjperiod"],
                        "apperiod" => $activeProjectRow[$i]["apperiod"],
                        "uflag" => $activeProjectRow[$i]["uflag"],
                        "apuid" => $activeProjectRow[$i]['apuid'],
                        "pjquota" => $activeProjectRow[$i]["pjquota"],
                    );
                }
                return $this->result;
            }

        }
    }
    function DEL($deldata)
    {
        if (isset($_SESSION["UNM"])) {
            $db = new ActiveProject("root", "", "localhost", "bitirmeproje");
            for ($i = 0; $i < count($deldata); $i++) {
                $delproj = $deldata[$i]['pjid'];
                $delprojrows = $db->delete("DELETE FROM activeproject where pjid=?", array($delproj));
            }
            if ($delprojrows) {
                $this->result = array("status" => "None");
                return $this->result;
            } else {
                $this->result = array("status" => "SuccesDel");
                return $this->result;

            }
        }
    }
}
?>