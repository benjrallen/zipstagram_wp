<?php
MvcRouter::public_connect('{:controller}', array('action' => 'index'));
MvcRouter::public_connect('{:controller}/{:id:[\d]+}', array('action' => 'show'));
MvcRouter::public_connect('{:controller}/{:action}/{:id:[\d]+}');

MvcRouter::admin_ajax_connect(array('controller' => 'admin_picturess', 'action' => 'rebuild_cache'));

MvcRouter::public_connect('pictures/build', array(
  'controller' => 'Pictures',
  'action' => 'build_cache'
));

//MvcRouter::admin_ajax_connect(array('controller' => 'admin_documentation_nodes', 'action' => 'update_tree'));



?>