<?php


require_once("config.php");

$controller = new controller\MashupController();
$view = new view\HtmlView();

$authenticationLink = $controller->getAuthentication();
$view->render($authenticationLink);