<?php

class ZipstagramLoader extends MvcPluginLoader {

	var $db_version = '1.0.4';
	var $tables = array();

	function activate() {
	
		// This call needs to be made to activate this app within WP MVC
		
		$this->activate_app(__FILE__);
		
		// Perform any databases modifications related to plugin activation here, if necessary

		require_once ABSPATH.'wp-admin/includes/upgrade.php';
	
		add_option('zipstagram_db_version', $this->db_version);
		
		// Use dbDelta() to create the tables for the app here
		// $sql = '';
		// dbDelta($sql);
    $sql = '
        CREATE TABLE '.$wpdb->prefix.'pictures (
          id int(11) NOT NULL auto_increment,
          hashtag_id int(11) NOT NULL,
          exclude tinyint(1) NOT NULL default 0,
          instagram_id varchar(255) NOT NULL,
          name varchar(255) NOT NULL,
          json text NOT NULL,
          PRIMARY KEY  (id),
          KEY hashtag_id (hashtag_id),
          KEY instagram_id (instagram_id),
          KEY exclude (exclude),
          KEY name (name)
        )';
    dbDelta($sql);
    
    $sql = '
        CREATE TABLE '.$wpdb->prefix.'hashtags (
          id int(11) NOT NULL auto_increment,
          name varchar(255) NOT NULL,
          PRIMARY KEY  (id)
        )';
    dbDelta($sql);

	}

	function deactivate() {
	
		// This call needs to be made to deactivate this app within WP MVC
		
		$this->deactivate_app(__FILE__);
		
		// Perform any databases modifications related to plugin deactivation here, if necessary
	
	}

}

?>