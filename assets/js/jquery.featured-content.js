(function ($) {

    // Public Properties
    var properties = {
        tags: {},
        total: function () {
            return properties.tags.length;
        },
        activeIndex: 0
    }

    // Create some default options, merged in init
    var settings = {
        repeaterTag: 'img',
        exclude: '.home-callout',
        animation: 'crossFade',
        showPaging: false,
        pagingWidth: 20,
        pagingHeight: 20,
        pagingPlacement: 'bottom-right',
        startIndex: 0,
        speed: 4500
    }

    var methods = {
        init: function (options) {

            // merge the settings with any options that were provided
            settings = $.extend(settings, options);

            return this.each(function () {

                // hold onto "this" for interval
                var self = this;

                // get items
                properties.tags = $(self).children(settings.repeaterTag.toLowerCase()).not(settings.exclude);

                // wait for images to load completely, before initializing
                $(window).bind('load', function () {

                    //console.log('windowloaded');

                    properties.maxSize = getMaximumSize(properties.tags);

                    // set basic css rules
                    $(self)
						.css({
						    position: 'relative',
						    width: properties.maxSize.width,
						    height: properties.maxSize.height,
						    overflow: 'hidden'
						});

                    // other css, and set starting slide to active
                    properties.tags
						.css({
						    position: 'absolute',
						    width: properties.maxSize.width,
						    height: properties.maxSize.height,
						    display: 'none'
						})
							.addClass('featured-content-' + settings.repeaterTag.toLowerCase())
						.eq(settings.startIndex)
							.css({
							    display: 'block'
							})
							.addClass('active');

                    // start timer
                    setInterval(function () {

                        // save active/next indexies
                        properties.activeIndex = $(self).find(settings.repeaterTag + '.active').index();
                        var next = properties.activeIndex + 1;
                        properties.nextIndex = (properties.total() == next) ? 0 : next;
                        //console.log(properties.activeIndex,properties.nextIndex,properties.total());

                        // each animation should position css according to the animation to occur
                        switch (settings.animation) {
                            case 'slide':
                                slideLeft();
                                break;
                            default:
                                crossFade();
                                break;
                        }
                    }, settings.speed);

                    if (settings.showPaging) {
                        generatePaging(self);
                    }


                });

            });

        }
    };
    // animates with a slide effect
    function slideLeft() {
        properties.tags.css('z-index', -1);
        properties.tags.eq(properties.activeIndex).css({ zIndex: 0 }).removeClass('active');
        properties.tags.eq(properties.nextIndex).css({ display: 'block', left: properties.maxSize.width, zIndex: 1 }).animate({ left: 0 }, 750).addClass('active');
        if (settings.showPaging) {
            properties.paging.eq(properties.activeIndex).removeClass('active');
            properties.paging.eq(properties.nextIndex).addClass('active');
        }
    }
    // animates with a crossfade
    function crossFade() {
        properties.tags.eq(properties.activeIndex).fadeOut().removeClass('active');
        properties.tags.eq(properties.nextIndex).fadeIn().addClass('active');
        if (settings.showPaging) {
            properties.paging.eq(properties.activeIndex).removeClass('active');
            properties.paging.eq(properties.nextIndex).addClass('active');
        }
    }
    // loops through the elements set to obtain the greater height
    function getMaximumSize(elemsSet) {
        var maxWidth = 0;
        var maxHeight = 0;
        elemsSet.each(function (index, elem) {
            var item = $(elem);
            maxHeight = Math.max(item.outerHeight(), maxHeight);
            maxWidth = Math.max(item.outerWidth(), maxWidth);
            childItems = getMaximumSize(item.children());
            maxHeight = Math.max(childItems.outerHeight, maxHeight);
            maxWidth = Math.max(childItems.outerWidth, maxWidth);
        });
        return { width: maxWidth, height: maxHeight };
    }
    // loops through the elements and creates the paging icons
    function generatePaging(container) {
    	
        var pageHTML = '<div class="featured-content-paging">';
        properties.tags.each(function (index, elem) {
            pageHTML += '<span class="page" style="width:' + settings.pagingWidth + 'px; height:' + settings.pagingHeight + 'px">&nbsp;</span>';
        });
        pageHTML += '</div>';
        $(container)
            .append(pageHTML)
            .find('.page:eq(' + properties.activeIndex + ')')
            .addClass('active');
        properties.paging = $(container).find('.page');
        return;
    }

    $.fn.featuredContent = function (method) {

        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method: "' + method + '" does not exist on jQuery.featuredContent');
        }

    };

})(jQuery);