<?php
/**
 * Created by PhpStorm.
 * User: julia
 * Date: 2015-11-11
 * Time: 11:38
 */

namespace model;


class MovieModel
{
    private $movieName;
    private $movieTime;
    private $movieDay;

    public function __construct($name, $time,  $day){
        $this->movieName = $name;
        $this->movieTime = $time;
        $this->movieDay = $day;
    }

    public function getName(){
        return $this->movieName;
    }

    public function getTime(){
        return $this->movieTime;
    }

    public function getDay(){
        return $this->movieDay;
    }

}