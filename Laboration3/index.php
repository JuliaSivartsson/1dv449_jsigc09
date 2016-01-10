<?php

require_once("view/HtmlView.php");
require_once("controller/MashupController.php");
require_once("model/SverigesRadio.php");

$controller = new MashupController();
$view = new HtmlView();

$resultFromController = $controller->doMashup();
$resultToView = "";
if($resultFromController != null){
    $resultToView = $resultFromController;
}
$view->render($resultToView);