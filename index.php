<!DOCTYPE html>
<!--[if lt IE 7 ]><html lang="" class="no-js ie ie6 lte7 lte8 lte9"><![endif]-->
<!--[if IE 7 ]><html lang="" class="no-js ie ie7 lte7 lte8 lte9"><![endif]-->
<!--[if IE 8 ]><html lang="" class="no-js ie ie8 lte8 lte9"><![endif]-->
<!--[if IE 9 ]><html lang="" class="no-js ie ie9 lte9"><![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--><html lang="" class="newbie no-js"><!--<![endif]-->
<head>
  <meta charset="utf-8">
  
  
  <script type="text/javascript" src="js/modernizr.js"></script>
  <script type="text/javascript">
    Modernizr.load([
      { load: ['//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'],
    	  complete: function(){ if(!window.jQuery){ Modernizr.load('js/jquery.js'); } }
    	},
    	{ test: window.JSON, nope: 'js/json2.js' },
    	<?php /* plugins.js & common.js fordevelopment */ ?>
    	<?php /* ?>
    	{ load: 'js/plugins.js' },
    	{ load: 'js/common.js' },
    	<?php */ ?>
    	<?php /* concatenate and optimize seperate script files for deployment using google closure compiler (compiler.jar) in js folder */ ?>
    	{ load : 'js/theme.js' },
    	{ load: '//connect.facebook.net/en_US/all.js#xfbml=1' },
    	{ load: '//platform.twitter.com/widgets.js' }
    ]);
  </script>
	  	<link rel="stylesheet" href="css/main.css" />

		<title>Zipcar + Instagram</title>
		<meta name="description" content="" />
	  <meta name="keywords" content="" />
		<meta name="robots" content="" />
</head>

<body>
<div id="fb-root"></div>

<div id="container">
	<div id="header">
		<h1>
		  <span class="line"></span>
		  <span class="text">zipcar + instagram</span>
		</h1>
		<div class="right">
		  <div class="line"></div>
		  		      <div class="sm">
	      	    <div class="fb-like" data-href="<?php echo $_SERVER['PATH_INFO'] ?>" data-send="false" data-layout="button_count" data-width="60" data-show-faces="false"></div>
	            <a href="https://twitter.com/share" class="twitter-share-button" data-url="<?php echo $_SERVER['PATH_INFO'] ?>">Tweet</a>
	          </div>
		  <div id="nav">
		    <span class="rough">
		      <span class="view">View</span>
          	  <span class="current">zipcar</span>
		    </span>
		    <span class="hashtag">
		      <span class="text">Hashtag</span>
		      <span class="icon"></span>
          <div id="hashSelect"></div>
		    </span>
		  </div>
	  </div>
	</div>

	<div id="map"></div>
	
		
	<div id="footer-wrap">
  	<div id="subfooter">
  	  <div id="carousel">
  	    <div id="carousel-bg">
          <div id="bg-inner"></div>
  	    </div>
  	    <div id="carousel-wrap">
    	    <div class="nav next">
    	      <div class="line"></div>
    	      <div class="icon"></div>
    	    </div>
    	    <div class="nav prev">
    	      <div class="line"></div>
    	      <div class="icon"></div>
    	    </div>
          <div id="carousel-inner">
            <div id="carousel-images"></div>
          </div>
  	    </div>
  	  </div>
    	<div id="zip-logo"></div>
  	</div>
	  
	  <div id="footer">
	    <div class="links">
	      <a href="http://www.zipcar.com" title="Join Zipcar">join zipcar</a>
	      <a href="http://www.zipcar.com/find-cars/" title="Reserve a car with Zipcar">reserve a car</a>
	      <a href="#" id="play-along" title="Play ">play along</a>
	    </div>
	    <div class="copy">Copyright © 2012 Zipcar, Inc. All Rights Reserved.</div>
	  </div>
	</div><!-- Footer -->

  <a id="brand" href="http://www.zipcar.com" title="Zipcar">Zipcar</a>
	
</div>

<div id="hashtag-json"><?php include 'cache/hashtags.json'; ?></div>
<div id="cache-version" style="display:none;"><?php include 'cache/instahash_cache_version_number.json'; ?></div>
<div id="modal-content">
  <article class="insta-wrap modal-wrap">
    <h2>zipsters don't just sit there</h2>
    <h3>we created this nifty page to help you enjoy photographs from zipsters around the world</h3>
    <div class="content">
      <strong>play along:</strong>
      <p>Want to share your photos?  Install the instagram app on your phone. <br />Find and follow @zipcar, then, simply tag your photos with #zipcar. You just be your creative self and we'll take care of the rest.</p>
    </div>
    <button>continue</button>
  </article>
</div>

</body>
</html>