<?php
class AllGet
{
    public $result;
    public function get($tablename, $where="")
    {
        $this->result = "SELECT * FROM $tablename";
        return $this->result;
    }
}
?>