<?php

require_once("config.php");

require_once("src/controller/MashupController.php");

$controller = new controller\MashupController();
$view = new view\DefaultView();

$resultFromController = $controller->doMashup();
$resultToView = "";
if($resultFromController != null){
    $resultToView = $resultFromController;
}
$authenticationLink = $controller->doMashup();
$view->render($resultToView);