<?php


require_once("config.php");

require_once("src/controller/MashupController.php");

$controller = new controller\MashupController();
$view = new view\HtmlView();

$authenticationLink = $controller->getAuthentication();
$view->render($authenticationLink);