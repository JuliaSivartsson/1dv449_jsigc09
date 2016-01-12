<?php

namespace controller;
use model;

class MashupController
{

    private $settings;

    private $instagram;

    public function __construct()
    {
        $this->settings = new \Settings();
        $this->tags = $this->settings->getTags();
        $this->instagram = new model\InstagramAPI();
    }

    public function getAuthentication()
    {
        $clientId = $this->settings->getClientId();
        $authenticationUrl = "https://api.instagram.com/oauth/authorize/?client_id=$clientId&redirect_uri=https://juliasivartsson.one/authenticated.php&response_type=token&scope=basic+public_content";
        return $authenticationUrl;
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