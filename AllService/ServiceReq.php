<?php
header("Content-Type: application/json; charset=UTF-8");
$SN = $_POST['SN'];
$MN = $_POST['MN'];
$result = "";
if ($SN == "Project") {
    include("/Project/project.php");
    $pj = new $SN();
    if ($MN == "GET") {
        $result = $pj->$MN();
    } else
        if ($MN == "GETWHERE") {
        $result = $pj->$MN($_POST['where'], $_POST['allparam']);
    } else
        if ($MN == "SET") {
        $result = $pj->$MN($_POST['wparam'], $_POST['operation'], $_POST['wset'], $_POST['wsetparam'], $_POST['setfield']);
    } else
        if ($MN == "ADD") {
        $result = $pj->$MN($_POST["lessondata"], $_POST['projectdata']);
    } else
        if ($MN == "DEL") {
        $result = $pj->$MN($_POST['pjid'], $_POST['where']);
    }
    echo json_encode($result);
}
if ($SN == "Lesson") {
    include("/Lesson/lesson.php");
    $ls = new $SN();
    if ($MN == "GET") {
        $result = $ls->$MN();
    } else
        if ($MN == "ADD") {
        $result = $ls->$MN($_POST['lnm'], $_POST['lperiod'], $_POST['lclass'], $_POST['lcntn'], $_POST['uid'], $_POST['sid'], $_POST['lcode']);
    } else
        if ($MN == "GETWHERE") {
        $result = $ls->$MN($_POST['where'], $_POST['allparam'], $_POST['field']);
    } else
        if ($MN == "DEL") {
        $result = $ls->$MN($_POST['where'], $_POST['allparam']);
    } else
        if ($MN == "SET") {
        $result = $ls->$MN($_POST['wparam'], $_POST['wsetparam']);
    }
    echo json_encode($result);
}
if ($SN == "Sections") {
    include("/Sections/sections.php");
    $sc = new $SN();
    if ($MN == "GETWHERE") {
        $result = $sc->$MN($_POST['where'], $_POST['allparam'], $_POST['field']);
    } else
        if ($MN == "GET") {
        $result = $sc->$MN();
    } else if ($MN == "GETUS") {
        $result = $sc->$MN($_POST['sid']);
    }
    echo json_encode($result);
}
if ($SN == "Servicetime") {
    include("/Servicetime/servicetime.php");
    $st = new Servicetime();
    $result = $st->getTime();
    echo json_encode($result);
}
if ($SN == "ActiveProject") {
    include("/ActiveProject/activeproject.php");
    $ap = new $SN();
    if ($MN == "ADD") {
        $result = $ap->$MN($_POST['pjdata']);
    } else if ($MN == "GET") {
        $result = $ap->$MN();
    } else if ($MN == "GETWHERE") {
        $result = $ap->$MN($_POST['where'], $_POST['allparam']);
    } else if ($MN == "DEL") {
        $result = $ap->$MN($_POST['deldata']);
    }
    echo json_encode($result);
}
if ($SN == "ProjectOnLesson") {
    include("/ProjectOnLesson/projectonlesson.php");
    $pol = new $SN();
    if ($MN == "GETP") {
        $result = $pol->$MN($_POST['where'], $_POST['param']);
    } else if ($MN == "GETU") {
        $result = $pol->$MN($_POST['where'], $_POST['param']);
    } else if ($MN == "DPL") {
        $result = $pol->$MN($_POST['lessondata']);
    } else if ($MN == "APL") {
        $result = $pol->$MN($_POST['lessondata']);
    }
    echo json_encode($result);
}
if ($SN == "LessonOnProject") {
    include("/LessonOnProject/lessononproject.php");
    $lop = new $SN();
    if ($MN == "GETP") {
        $result = $lop->$MN($_POST['where'], $_POST['wparam']);
    } else if ($MN == "GETU") {
        $result = $lop->$MN($_POST['where'], $_POST['wparam']);
    }
    echo json_encode($result);
}
if ($SN == "Title") {
    include("/Title/title.php");
    $title = new $SN();
    $result = $title->$MN();
    echo json_encode($result);
}
if ($SN == "Authority") {
    include("/Authority/authority.php");
    $authority = new $SN();
    $result = $authority->$MN();
    echo json_encode($result);
}
if ($SN == "Session") {
    include("/Session/session.php");
    $session = new $SN();
    $result = $session->$MN();
    echo json_encode($result);
}
if ($SN == "User") {
    include("/User/user.php");
    $user = new $SN();
    if ($MN == "GETUL") {
        $result = $user->$MN($_POST['tid']);
    } else if ($MN == "GET") {
        $result = $user->$MN($_POST['name']);
    } else if ($MN == "ADD") {
        $result = $user->$MN($_POST['ufnm'], $_POST['ulnm'], $_POST['unm'], $_POST['utel'], $_POST['upnt'], $_POST['usno'], $_POST['upass'], $_POST['sid'], $_POST['tid'], $_POST['uauthr'], $_POST['email']);
    } else if ($MN == "GAUW") {
        $result = $user->$MN($_POST['uwhere'], $_POST['uparam'], $_POST['mwhere'], $_POST['mparam'], $_POST['pwhere'], $_POST['pparam']);
    } else if ($MN == "ADDRU") {
        $result = $user->$MN($_POST['userdata']);
    }
    echo json_encode($result);
}
if ($SN == "Login") {
    include("/Login/login.php");
    $login = new $SN();
    $result = $login->$MN($_POST['name'], $_POST['pass']);
    echo json_encode($result);
}
if ($SN == "Register") {
    include("/Register/register.php");
    $register = new $SN();
    if ($MN == "ADD") {
        $result = $register->$MN($_POST['ad'], $_POST['soyad'], $_POST['ogrno'], $_POST['tcno'], $_POST['email'], $_POST['sid'], $_POST['tel']);
    } else if ($MN == "GET") {
        $result = $register->$MN($_POST['where'], $_POST['param']);
    } else if ($MN == "DEL") {
        $result = $register->$MN($_POST['where'], $_POST['param']);
    } else if ($MN == "DELALL") {
        $result = $register->$MN();
    }
    echo json_encode($result);
}
?>