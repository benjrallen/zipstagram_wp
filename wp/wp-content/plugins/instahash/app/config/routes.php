<?php
MvcRouter::public_connect('{:controller}', array('action' => 'index'));
MvcRouter::public_connect('{:controller}/{:id:[\d]+}', array('action' => 'show'));
MvcRouter::public_connect('{:controller}/{:action}/{:id:[\d]+}');

//MvcRouter::admin_ajax_connect(array('controller' => 'admin_pictures', 'action' => 'rebuild_cache'));
MvcRouter::admin_ajax_connect(array('controller' => 'admin_pictures', 'action' => 'admin_picture_search'));

//MvcRouter::admin_ajax_connect(array('controller' => 'admin_questions', 'action' => 'add_json'));


MvcRouter::public_connect('pictures/build', array(
  'controller' => 'Pictures',
  'action' => 'build_cache'
));


?>