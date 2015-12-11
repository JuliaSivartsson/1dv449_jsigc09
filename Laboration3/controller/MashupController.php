<?php

class MashupController
{
    private $webService;

    public function __construct(){
        $this->webService = new SverigesRadio();
    }

    public function doMashup()
    {
        $this->webService->getTrafficInfo();
    }

}