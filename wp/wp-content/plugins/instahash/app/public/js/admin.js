var Ease = Ease || {};

(function($){
	
	//Ease.cache_folder = '../cache/';
	//Ease.cache_all = 'instahash_all.json';
	Ease.wp_url = window.location.protocol+'//'+window.location.host + userSettings.url
	//Ease.cache_path =  Ease.wp_url + Ease.cache_folder + Ease.cache_all;
	
	Ease.Autosearch = function(){
		//console.log( Ease.cache_path );
		
		this.data = null;
		this.$form = null;
		this.$input = null;
		this.$button = null;
		
		//cache the responses
		this.cache = {};
		//track the xhr call
		this.lastXhr = null;
		
		var that = this;
		
		//return $.getJSON( Ease.cache_path, function( data, status, obj){
			return that.init.apply( that, arguments );
		//});
		
	};
	
	Ease.Autosearch.prototype.init = function( data, status, obj ){
		
		//find the search form and use the crap out of it.
		this.$form = $('#posts-filter');
		if( !this.$form.length )
			return false;
		
		//this.data = this.processData( data );
		
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
		
		// this.$input.autocomplete({
		// 	minLength: 1,
		// 	source: this.data,
		// 	select: function( event, ui ){
		// 		//console.log( 'SELECT', $(this), event, ui );
		// 		
		// 		window.location.href = that.getEditPath( ui.item.value );
		// 		
		// 		return false;
		// 	}
		// })
		// .data( "autocomplete" )._renderItem = this.renderItem;

		this.$input.autocomplete({
			minLength: 1,
			source: function( request, response ) {
				var term = request.term;
				
				if ( term in that.cache ) {
					response( that.cache[ term ] );
					return;
				}

				var requestVars = {
					action: 'admin_pictures_admin_picture_search',
					term: term
				};

				that.lastXhr = $.getJSON( ajaxurl, requestVars, function( data, status, xhr ) {
					//console.log( 'gotten', data, status, xhr)
					
					data = that.processData( data );
					
					that.cache[ term ] = data;
					if ( xhr === that.lastXhr ) {
						response( data );
					}
				});

			},
			select: function( event, ui ){
				//console.log( 'SELECT', $(this), event, ui );
				
				window.location.href = that.getEditPath( ui.item.value );
				
				return false;
			}
		})
		.data( "autocomplete" )._renderItem = this.renderItem;

		
		//console.log('init!', this.data, this.$form, this.$input, this.$button );

	};
	
	Ease.Autosearch.prototype.getEditPath = function(id){
		return Ease.wp_url + 'wp-admin/admin.php?page=mvc_pictures-edit&id='+id;
	};
	
	Ease.Autosearch.prototype.renderItem = function( ul, item ){
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
	
	Ease.Autosearch.prototype.processData = function( data ){
		var processed = [];
		
		$.each( data, function(i){
			//build out the name string
			var json = JSON.parse( this.json ),
				label = json.user.username+': '+(json.caption && json.caption.text ? json.caption.text : '')+' - '+json.id
				//label = json.user.username+': '+json.caption.text+' - '+json.tags.join(', ')+'; '+json.id
			
			//console.log( json );
			
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
		
		var as = new Ease.Autosearch();
		
		//console.log( Ease );
	});
	
	
})(jQuery);


//admin_surveys

/*
var postVars = {
	action: this.controller+'_edit_json',
	data: {}
};

//set the model info
postVars.data[this.model] = this.data;

//console.log( 'postVars', postVars );
if( this.data.id ){
	//set up paths
	postVars.id = this.data.id;
} else {
	//set up paths
	delete this.data.id;
	postVars.action = this.controller+'_add_json';
}

var that = this;

$.post( ajaxurl, postVars, function(data, status, obj){
	that.saveCallback.apply( that, arguments );
});
*/
