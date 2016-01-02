<?php

namespace controller;
use model;

class MashupController
{

    private $settings;

    private $instagram;
    private static $authenticationUrl = "https://api.instagram.com/oauth/authorize/?client_id=a5a0e5b2d28147fcbc5c95fc6fdf54fc&redirect_uri=http://project1dv449.node365.se/authenticated.php&response_type=token&scope=basic+public_content";

    public function __construct()
    {
        $this->settings = new \Settings();
        $this->tags = $this->settings->getTags();
        $this->instagram = new model\InstagramAPI();
    }

    public function getAuthentication()
    {
        return self::$authenticationUrl;
    }

    public function doMashup()
    {
        foreach ($this->tags as $tag) {
            $overallResult = $this->instagram->getNumberOfTimesTagIsUsed($tag);
            $resentResult = $this->instagram->getRecentTags($tag);

            if ($overallResult !== "") {
                return $overallResult;
            }
            else if ($resentResult !== "") {
                return $resentResult;
            }
        }

    }
}