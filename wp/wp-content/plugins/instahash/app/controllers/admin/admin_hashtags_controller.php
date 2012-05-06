<?php

class AdminHashtagsController extends MvcAdminController {
	
	var $default_columns = array('id', 'name');


  //edit create or save function to reroute to new add page for adding hashtags
	public function create_or_save() {
		if (!empty($this->params['data'][$this->model->name])) {
			$object = $this->params['data'][$this->model->name];
			if (empty($object['id'])) {
				echo 'Creating...<br />';
				$this->model->create($this->params['data']);
				$id = $this->model->insert_id;
				$url = MvcRouter::admin_url(array('controller' => $this->name, 'action' => 'add'));
				$this->flash('notice', 'Successfully created! Add another?');
				$this->redirect($url);
			} else {
				if ($this->model->save($this->params['data'])) {
					$this->flash('notice', 'Successfully saved!');
					$this->refresh();
				} else {
					$this->flash('error', $this->model->validation_error_html);
				}
			}
		}
	}
	
}

?>