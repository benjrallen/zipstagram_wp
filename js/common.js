(function($){

	var hashSelect = null,
		hashtags = null,
		geoJsonLayer = null,
		map = null,
		pic_popup = new Popup( 'popup', 'popunder' ),
		cachePath = 'cache/';
	
	$(document).ready(function() {
				
		//create the hashtag select list
		makeHashtagList();
		//make the map
		makeMap();
		
	});

	function makeMap(){
		map = new L.Map('map').on('popupopen', function(e){
			console.log('mappopupopened', e, this);
			
			
			var content = e.popup._content;
			
			pic_popup.setContent( content ).show();
			
			
			return e.popup._close();
		});

		//body gets a click handler to hide the popup
		$('body').click(function(e){
			pic_popup.close();
		});

		//var alldata = null;

		var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/cfc96afd35bc4c12b3f06893fff79e8c/60666/256/{z}/{x}/{y}.png',
			cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 12});


		map.setView(new L.LatLng(46, -52), 3).addLayer(cloudmade);

		//trigger a click on the first hashtag in the list
		return loadMapData( hashSelect.children().first().attr('hash') );

	}

	var currentData = {};

	function loadMapData( hashName ){
		
		$.getJSON( cachePath+hashName+'.json', function( data ){
			
			if( !geoJsonLayer ){
				geoJsonLayer = new L.GeoJSON( { type: "FeatureCollection", features: [] }, {
					pointToLayer: function ( latlng ){
						
						//console.log( latlng, 'pointtolayer', this );
						
						return new L.CircleMarker(latlng, {
							radius: 8,
							fillColor: "#fecb00",
							color: "#fecb00",
							weight: 1,
							opacity: 1,
							fillOpacity: 0.9,
							//bindPopup: Whazza
						// }).on('click', function(e){
						// 	console.log('MARKER CLICK!', e, this);
						});	
					}
				}).on('featureparse', function(e){
					
					//console.log('featureparse', e, this, e.properties);
					
					var block = makeBlockContent(e.properties);
					
					e.layer.bindPopup( block, { autoPan: false });
					
					return;

				});

/*
{
"type":"FeatureCollection","features":[
*/
				map.addLayer(geoJsonLayer); //Add layer to map 

			} else {
			}
			
			geoJsonLayer.clearLayers();
			geoJsonLayer.addGeoJSON( data );
			
		});
		
	};

	function makeBlockContent( data ){
		console.log( 'makeBlockContent', data );
		
		var block = '<div class="insta-wrap">'+
						makeImageBlock( data.images.low_resolution )+
						'<div class="info">'+
							makeUserBlock( data.profile_picture, data.user )+
							'<div class="description">'+
								data.description+
							'</div>'+
							makeWhereZip( data.latitude, data.longitude )+
						'</div>'+
					'</div>';
		
		return block;
	}

	function makeWhereZip( lat, lng ){
		return '<div lat="'+lat+'" lng="'+lng+'" class="where">'+
					'<span class="title">Where I Zip</span>'+
					'<span class="location"></span>'+
				'</div>';
	}

	function makeUserBlock( pic, name ){
		return '<div class="user">'+
					'<span class="user-pic"><img src="'+pic+'" /></span>'+
					'<span class="user-name">'+name+'</span>'+
				'</div>';
	}

	function makeImageBlock( img ){
		return '<div class="pic">'+
					'<img src="'+img.url+'" />'+
				'</div>'
	}

	function makeHashtagList(){
		//grab the hashtags
		hashtags = JSON.parse( $('#hashtag-json').text() );
		
		hashSelect = $('#hashSelect');
		
		$('#nav .hashtag').click(function(e){
			e.stopPropagation();
			hashSelect.toggle();
		});
		
		$('body').click(function(e){
			hashSelect.hide();
		});
		
		return $.each( hashtags, function(i){			
			for ( var key in this ){
				$('<div />',{
					text: '#'+this[key],
					hash: this[key]
				}).addClass('hashOption')
				.click( onHashClick )
				.appendTo( hashSelect );
			}
		});		
	}
		
	function onHashClick(e){
		console.log( 'HASHCLICK!', $(this).attr('hash') );
		
		return loadMapData( $(this).attr('hash') );
		
	}
	
})(jQuery);

function Popup( id, popunderId ){
	
	this.popup = null;
	this.under = null;
	this.time = 250;
	this.timeout = null;
	this.timeoutTime = 1500;
	
	
	if( !$('#'+id).length ){
		this.popup = $('<div />', { id: id }).prependTo('body');
	} else {
		this.popup = $(id);
	}
	
	
	
	this.popup.click(function(e){
		e.stopPropagation();
	});
	
	var that = this;
	
	$(window).resize(function(e){
		that.position();
	});
	
	if( popunderId ){
		if( !$('#'+popunderId).length ){
			this.under = $('<div />', { id: popunderId }).prependTo('body');
		} else {
			this.popup = $(popunderId);
		}
	}

	return this;
}

Popup.prototype.setContent = function( block ){
	this.popup.html( block );
	return this;
}

Popup.prototype.show = function(){
	this.position();
	
	this.popup.css({ zIndex: 1000000 }).show( this.time );
	if( this.under )
		this.under.show( 0 );
	return this;
}

Popup.prototype.close = function(){
	clearTimeout( this.timeout );
	
	this.popup.hide( 0, function(){
		$(this).css({ zIndex: 0 });
	});
	if( this.under )
		this.under.hide( this.time );
	return this;
}

Popup.prototype.position = function(){
	var left = Math.floor( ($(window).width() - this.popup.outerWidth()) / 2 );
	
	if( left < 0 )
		left = 0;
	
	var top = Math.floor( ($(window).height() - this.popup.outerHeight()) / 2 );
	if( top < 0 )
		top = 0;
	
	this.popup.css({
		top: top,
		left: left
	});
	
	var that = this;
	
	return this.timeout = setTimeout( that.position, that.timeoutTime );
}