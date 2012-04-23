<div class="wrap">

  <h2>Pictures</h2>
  <h4>Use the input to search for a picture by name, text, or instagram id.</h4>

  <form id="posts-filter" action="http://localhost:8888/zipstagram_full/wp/wp-admin/admin.php" method="get">

  	<p class="search-box">
  		<label class="screen-reader-text" for="post-search-input">Search:</label>
  		<input type="hidden" name="page" value="mvc_pictures">
  		<input type="text" name="q" value="" placeholder="Find a picture..." class="ui-autocomplete-input" autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true">
  		<input type="submit" value="Search" class="button" style="display: none; ">
  	</p>

  </form>

</div>