<?php

require_once("config.php");

require_once("src/controller/MashupController.php");

$controller = new controller\MashupController();
$view = new view\DefaultView();

$authenticationLink = $controller->doMashup();
$view->render();