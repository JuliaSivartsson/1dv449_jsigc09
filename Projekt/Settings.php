<?php

/**
 * Created by PhpStorm.
 * User: julia
 * Date: 2015-12-14
 * Time: 21:57
 */
class Settings
{
    public function getTags(){
        return self::$tags;
    }
    public static $tags = ["supernatural", "doctorwho", "lotr", "anubis"];
}