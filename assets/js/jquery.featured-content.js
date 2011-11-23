(function( $ ){
	
	$.fn.featuredContent = function( options ) {  

		// Create some defaults, extending them with any options that were provided
		var settings = $.extend( {
			showPaging			: true,
			pagingPlacement		: 'bottom-right'
		}, options);
		
		var methods = {
			rotate: function( obj ) {
				console.log(obj);
			}
		};
	
		return this.each(function(){
			// hide other images
			var self = this;
			$(self).css({
					position	:'relative'
				})
				.find('img').css({
					position	:'absolute'
				}).end()
				.find('img:gt(0)').hide();
			
			setInterval(function(){ 
				$(self).find('img:eq(0)')
					.addClass('touched')
					.fadeOut()
					.next('img')
					.fadeIn()
					.end()
					.appendTo($(self));
			}, 3000);
		}); 

	};
	
})( jQuery );