<?php

/**
 * Created by PhpStorm.
 * User: julia
 * Date: 2015-12-14
 * Time: 21:57
 */
class Settings
{
    public static $tags = ["supernatural", "doctorwho", "sherlock", "harrypotter", "lotr"];
    public static $clientId = "CLIENTID";
    public static $accessToken = "ACCESSTOKEN";
    
    public function getTags(){
        return self::$tags;
    }
    public function getClientId(){
        return self::$clientId;
    }

    public function getAccessToken(){
        return self::$accessToken;
    }
}