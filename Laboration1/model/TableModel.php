<?php
/**
 * Created by PhpStorm.
 * User: julia
 * Date: 2015-11-12
 * Time: 12:23
 */

namespace model;


class TableModel
{
    private $tableValue;
    private $startTime;
    private $tableDay;

    public function __construct($value, $time,  $day){
        $this->tableValue = $value;
        $this->startTime = $time;
        $this->tableDay = $day;
    }

    public function getValue(){
        return $this->tableValue;
    }

    public function getStartTime(){
        return $this->startTime;
    }

    public function getDay(){
        return $this->tableDay;
    }

}