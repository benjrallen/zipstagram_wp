var Zip = Zip || {};

(function($){
	
	Zip.cache_folder = '../cache/';
	Zip.cache_all = 'zipstagram_all.json';
	Zip.wp_url = window.location.protocol+'//'+window.location.host + userSettings.url
	Zip.cache_path =  Zip.wp_url + Zip.cache_folder + Zip.cache_all;
	
	Zip.Autosearch = function(){
		console.log( Zip.cache_path );
		
		this.data = null;
		this.$form = null;
		this.$input = null;
		this.$button = null;
		
		
		var that = this;
		
		return $.getJSON( Zip.cache_path, function( data, status, obj){
			return that.init.apply( that, arguments );
		});
		
	};
	
	Zip.Autosearch.prototype.init = function( data, status, obj ){
		
		//find the search form and use the crap out of it.
		this.$form = $('#posts-filter');
		if( !this.$form.length )
			return false;
		
		this.data = this.processData( data );
		
		this.$input = this.$form.find('[name="q"]');
		this.$button = this.$form.find('[type="submit"]');
				
		//do some stuff to the form
		this.$button.hide(0);
		this.$input.attr('placeholder', 'Find a picture...');
		this.$form.submit(function(e){
			e.preventDefault();
			e.stopPropagation();
		});
		
		var that = this;
		
		this.$input.autocomplete({
			minLength: 1,
			source: this.data,
			select: function( event, ui ){
				//console.log( 'SELECT', $(this), event, ui );
				
				window.location.href = that.getEditPath( ui.item.value );
				
				return false;
			}
		})
		.data( "autocomplete" )._renderItem = this.renderItem;
		
		console.log('init!', this.data, this.$form, this.$input, this.$button );

	};
	
	Zip.Autosearch.prototype.getEditPath = function(id){
		return Zip.wp_url + 'wp-admin/admin.php?page=mvc_pictures-edit&id='+id;
		//http://localhost:8888/zipstagram_full/wp/wp-admin/admin.php?page=mvc_pictures-edit&id=276
	};
	
	Zip.Autosearch.prototype.renderItem = function( ul, item ){
		//console.log( '_renderItem', item, item.exclude );
		var block = '<a>'+
						'<div class="pic">'+
							'<img src="'+item.data.images.thumbnail.url+'" />'+
						'</div>'+
						'<div class="info">'+
							( item.exclude > 0 ? '<span class="exclude">Excluded</span>' : '' )+
							'<span class="user">'+item.data.user.username+'</span>'+
							'<span class="text">'+item.data.caption.text+'</span>'+
							'<span class="id">'+item.data.id+'</span>'+
						'</div>'+
						'<div class="clearfix"></div>'+
					'</a>';
		
		return $( "<li></li>" )
						//.addClass('ui-menu-item')
						.data( "item.autocomplete", item )
						.append( block )
						.appendTo( ul );
	};
	
	Zip.Autosearch.prototype.processData = function( data ){
		var processed = [];
		
		$.each( data, function(i){
			//build out the name string
			var json = JSON.parse( this.json ),
				label = json.user.username+': '+json.caption.text+' - '+json.id
				//label = json.user.username+': '+json.caption.text+' - '+json.tags.join(', ')+'; '+json.id
			
			console.log( json );
			
			processed.push({
				value: this.id,
				label: label,
				exclude: this.exclude,
				data: json
			});

		});
		
		return processed;
	};
	
	$(document).ready(function(){
		
		var as = new Zip.Autosearch();
		
		console.log( Zip );
	});
	
	
})(jQuery);


