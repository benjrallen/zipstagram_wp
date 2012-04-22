<?php
/*
Plugin Name: Zipstagram
Plugin URI: 
Description: 
Author: 
Version: 
Author URI: 
*/

register_activation_hook(__FILE__, 'zipstagram_activate');
register_deactivation_hook(__FILE__, 'zipstagram_deactivate');

function zipstagram_activate() {
	require_once dirname(__FILE__).'/zipstagram_loader.php';
	$loader = new ZipstagramLoader();
	$loader->activate();
}

function zipstagram_deactivate() {
	require_once dirname(__FILE__).'/zipstagram_loader.php';
	$loader = new ZipstagramLoader();
	$loader->deactivate();
}

?>