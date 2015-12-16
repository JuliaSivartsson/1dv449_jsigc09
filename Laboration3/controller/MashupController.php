<?php

class MashupController
{
    private $webService;

    public function __construct(){
        $this->webService = new SverigesRadio();
    }

    public function doMashup()
    {
        $result = $this->webService->getTrafficInfo();

        if($result !== null){
            return $result;
        }
    }

}