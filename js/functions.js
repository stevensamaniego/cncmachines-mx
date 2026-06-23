

jQuery(function($) {


    /* Screen size (grid) */
    var screenLarge = 1200,
        screenMedium = 992,
        screenSmall = 768;

    /* Check if on mobile */
    if(/Mobi/.test(navigator.userAgent)) {
        isMobile = true;
    }

    
    /*-----------------------------------------------------------------------------------*/
    /*	Projects
    /*-----------------------------------------------------------------------------------*/

    /* Mobile */

    $('.project-hover .btn').on('click', function(e) {
        if ($(this).parent().css('opacity') !== '1') {
            e.preventDefault();
            return false;
        }
    });

    /* Reset Pagination */

    function resetPagination(items, itemClass, perPage) {
        var pageTemp = 0;

        items.find(itemClass).each(function(item) {
            var tempClass = $(this).attr('class');

            $(this).attr('class', tempClass.replace(/(page-[1-9][0-9]*)/g, ''));
        });

        items.find(itemClass).each(function(index) {
            if (index % perPage === 0) {
                pageTemp += 1;
            }

            items.find(itemClass).eq(index).addClass('page-' + pageTemp);
        });
    }

    /* Main logic */

    window.onload = function() {
        $('.projects').each(function() {
            var items = $(this).find('.projects-content');
            var itemClass = '.projects-item';
            var filter = $(this).find('.filter');
            var initialFilter = '';
            var hash = window.location.hash.replace('#', '');

            if (hash && filter.find('[data-filter="' + hash + '"]').length) {
                initialFilter = '.' + hash;
                filter.find('.selected').removeClass('selected');
                filter.find('[data-filter="' + hash + '"]').addClass('selected');
            }

            if ($(this).find('.projects-pagination').length) {
                var pageNum = 1;
                var perPage = 3;

                if (window.innerWidth < screenSmall) {
                    perPage = 2;
                } else if (window.innerWidth < screenMedium) {
                    perPage = 4;
                } else if (items.find(itemClass).hasClass('col-md-3')) {
                    perPage = 4;
                }

                var numPages = Math.ceil(items.find(itemClass).length / perPage);

                if (numPages < 2) {
                    $('.projects-pagination').css('visibility', 'hidden');
                } else {
                    $('.projects-pagination').css('visibility', 'visible');
                }

                $(window).on('resize', function() {
                    if (window.innerWidth < screenSmall) {
                        perPage = 2;
                    } else if (window.innerWidth < screenMedium) {
                        perPage = 4;
                    } else if (items.find(itemClass).hasClass('col-md-3')) {
                        perPage = 4;
                    } else {
                        perPage = 3;
                    }

                    filter.find('.selected').click();
                });

                resetPagination(items, itemClass, perPage);

                /* Layout */
                items.isotope({
                    itemSelector: itemClass,
                    layoutMode: 'fitRows',
                    filter: '.page-' + pageNum + initialFilter,
                    transitionDuration: '.3s',
                    hiddenStyle: {
                        opacity: 0,
                    },
                    visibleStyle: {
                        opacity: 1,
                    }
                });

                /* Remove empty filter category buttons */
                filter.find('li').each(function() {
                    var className = $(this).children('button').attr('data-filter');

                    if( className === '*' ) {
                        return true;
                    }

                    if (!items.find('.' + className).length) {
                        $(this).remove();
                    }
                });

                /* Filtering */
                filter.find('button').on('click', function(e) {
                    var value = $(this).attr('data-filter');
                    value = (value != '*') ? '.' + value : value;
                    pageNum = 1;

                    numPages = Math.ceil(items.find(itemClass + value).length / perPage);

                    if (numPages < 2) {
                        $('.projects-pagination').css('visibility', 'hidden');
                    } else {
                        $('.projects-pagination').css('visibility', 'visible');
                    }

                    resetPagination(items, itemClass + value, perPage)
                    items.isotope({
                        filter: value + '.page-1'
                    });

                    /* Change select class */
                    filter.find('.selected').removeClass('selected');
                    $(this).addClass('selected');
                });

                $('.projects-pagination button').on('click', function() {
                    var value = $('.filter .selected').attr('data-filter');
                    value = (value != '*') ? '.' + value : value;

                    if ($(this).hasClass('prev')) {
                        if (pageNum - 1 == 0) {
                            pageNum = numPages;
                        } else {
                            pageNum -= 1;
                        }
                    } else {
                        if (pageNum + 1 > numPages) {
                            pageNum = 1;
                        } else {
                            pageNum += 1;
                        }
                    }

                    items.isotope({
                        filter: value + '.page-' + pageNum
                    });
                });
            } else {
                /* Layout */
                items.isotope({
                    itemSelector: itemClass,
                    layoutMode: 'fitRows',
                    filter: initialFilter,
                });

                /* Filtering */
                filter.find('button').on('click', function(e) {
                    var value = $(this).attr('data-filter');
                    value = (value != '*') ? '.' + value : value;

                    items.isotope({
                        filter: value
                    });

                    /* Change select class */
                    filter.find('.selected').removeClass('selected');
                    $(this).addClass('selected');
                });
            }

            /* Add background to parent row */
            $('.projects-recent').parents('.vc_row').addClass('bg-dark');
        });
    }

    /*-----------------------------------------------------------------------------------*/
    /*	Main menu
    /*-----------------------------------------------------------------------------------*/

    /* Add Support for touch devices for desktop menu */
    $('#main-menu').doubleTapToGo();

    function moveNav() {
        /* Create ghost-na-wrap if it doesn't exist */
        if (!$('.ghost-nav-wrap').length) {
            $('body').prepend('<div class="ghost-nav-wrap empty site-navigation"></div>')
        }

        if ((window.innerWidth < screenLarge) && $('.ghost-nav-wrap').hasClass('empty')) {
            /* Mobile */
            $('.header-wrap .logo + *').css('margin-top', '21px'); // reset margin
            $("nav.site-navigation .mobile-wrap").detach().appendTo('.ghost-nav-wrap');
            // Large Above menu
            if ($('.large-above-menu')) {
                $('.large-above-menu').detach().insertAfter('.site-search');
                $('.mini-cart').detach().insertAfter('.site-navigation > .burger');
            } else {
                $('.header-wrap').append($('.mini-cart'));
            }
            $('.ghost-nav-wrap').removeClass('empty');
            $('.main-menu .menu-item-has-children').each(function() {
                $('> ul', this).hide();
                $('.megamenu').hide();
            });
        } else if ((window.innerWidth > screenLarge - 1) && !$('.ghost-nav-wrap').hasClass('empty')) {
            /* Desktop */
            // Large Above menu
            if ($('.large-above-menu')) {
                if ($('.preheader-wrap').length) {
                    $('.large-above-menu').detach().appendTo('.preheader-wrap');
                } else {
                    $('.large-above-menu').detach().insertAfter('.header-wrap .logo');
                }
            }
            $('.ghost-nav-wrap .mobile-wrap').detach().appendTo('nav.site-navigation');
            $('.ghost-nav-wrap').addClass('empty');
            $('.main-menu .menu-item-has-children').each(function() {
                $('> ul', this).show();
                $('.megamenu').show();
            });
            if ($('.widget_anpsminicart').length) {
                $('.widget_anpsminicart').append($('.mini-cart'));
            } else {
                $('.main-menu').append($('.mini-cart'));
            }
        }

        /* Reset if mobile nav is open and window is resized to desktop mode */
        if ((window.innerWidth > screenLarge - 1) && $('html').hasClass('show-menu')) {
            $('.burger').toggleClass('active');
            $('html').removeClass('show-menu');
        }
    }

    moveNav();
    $(window).resize(function() {
        moveNav();
        if ($('body').hasClass('stickyheader') || $('body').hasClass('sticky-mobile')) {
            setSticky();
        }

        if($('html').hasClass('show-menu')) {
            window.menuContentResize = true;
        } else {
            window.menuContentResize = false;
        }
    });

    function mobileMenuToggle() {

        // mobile sticky
        if (!$('html').hasClass('show-menu') && $('.sticky-mobile').length) {
            $('html, body').animate({scrollTop : 0}, 300);
            $('.header-wrap').removeClass('sticky').removeAttr('style');
        }

        $('.burger').toggleClass('active');
        $(this).blur();

        $('html').toggleClass('show-menu');

        if (!$('html').hasClass('show-menu')) {
            window.menuJustClosed = true;

            if(window.menuContentResize) {
                setTimeout(window.vc_fullWidthRow, 400);
            }
        } else {
            window.menuJustOpened = true;
        }
    }

    $('.burger').on('click', mobileMenuToggle);

    $('.main-menu .menu-item-has-children').each(function() {
        $(this).append('<span class="mobile-showchildren"><i class="fa fa-angle-down"></i></span>');
    });

    $(".mobile-showchildren").on('click', function() {
        $(this).siblings("ul, .megamenu").toggle('300');
    });

    window.$stickyEl = $('.site-header');

    window.topbarHeight = 0;
    window.headerHeight = 0;
    window.adminBarHeight = 0;
    window.topOffsetSticky = 0;
    window.stickyOffset = 0;

    window.addSticky = function() {
        $stickyEl.addClass('sticky');

        if (!$stickyEl.hasClass('transparent')) {
            $('.site-main').css('padding-top', headerHeight + 'px');
        }

        var offset = 0;

        if(window.innerWidth > 600) {
            offset = adminBarHeight;
        }

        if (topOffsetSticky != '0') {
            $stickyEl.css({
                top: offset + 'px'
            });
        }
    }

    window.removeSticky = function() {
        $stickyEl.removeClass('sticky');
        $('.site-main').css('padding-top', '0');
        $stickyEl.stop(true).css('top', '');
    }

    function setSticky() {
        if ($('.top-bar').length) {
            topbarHeight = $('.top-bar').outerHeight();
        }

        headerHeight = $('.site-header').outerHeight();

        if ($('.site-header').hasClass('full-width')) {
            headerHeight = $('.header-wrap').outerHeight();
        }

        if ($('#wpadminbar').length) {
            adminBarHeight = $('#wpadminbar').outerHeight();
        }

        stickyOffset = topbarHeight;

        topOffsetSticky = adminBarHeight;

        if ($('header.bottom').length) {
            stickyOffset += $(window).innerHeight();
            stickyOffset -= headerHeight;
        }

        if (stickyOffset <= 0) {
            stickyOffset = 1;
        }

        if ($('.preheader-wrap').length) {
            stickyOffset += $('.preheader-wrap').innerHeight();
        }

        if (typeof Waypoint !== 'undefined') {
            stickyWaypoint();
        }
    }

    function stickyWaypoint() {
        if( typeof(window.headerwaypoint) !== 'undefined' ) {
            window.headerwaypoint.destroy();
        }

        window.headerwaypoint = new Waypoint({
            element: $('body'),
            handler: function(direction) {
                var isStickyDesktop = window.innerWidth >= screenLarge && $('body').hasClass('stickyheader');
                var isStickyMobile = window.innerWidth < screenLarge && $('body').hasClass('sticky-mobile');

                if (direction == 'down' && (isStickyDesktop || isStickyMobile)) {
                    window.addSticky();
                } else if ($stickyEl.hasClass('sticky')) {
                    window.removeSticky();
                }
                verticalCenterHeaderClassic();
            },
            offset: -stickyOffset
        });
    }

    function stickyElChange() {
        window.removeSticky();

        if ($('.preheader-wrap').length && window.innerWidth >= screenLarge) {
            window.$stickyEl = $('.header-wrap');
        } else {
            window.$stickyEl = $('.site-header');
        }
    }
    stickyElChange();

    $(window).on('resize', stickyElChange);

    $(window).on('grid:items:added', stickyWaypoint);
    setSticky();
    $(window).on('load', setSticky);

    /* Menu search */

    $('.menu-search-toggle').on('click', function() {
        $('.menu-search-form').toggleClass('hide');
        $(this).blur();
    });

    /* One page support */

    var onePageLinks = $('.site-navigation a[href*="#"]:not([href="#"]):not([href*="="])');

    if( !$('.home').length ) {
        onePageLinks.each(function() {
            var href = $(this).attr('href');
            if( href.indexOf('#') === 0 ) {
                $(this).attr('href', anps.home_url + href);
            }
        });
    }

    onePageLinks.on('click', function(e) {
        if( window.innerWidth > 1199 ) {
            var href = $(this).attr('href');

            if( !$('.home').length || href.indexOf('#') !== 0 ) {
                window.location = href;
                e.preventDefault();
                return false;
            } else {
                var target = $($(this).attr('href'));
                var offset = 30; /* Desired spacing */

                if( $('#wpadminbar').length ) {
                    offset += $('#wpadminbar').height();
                }

                if( $('.stickyheader').length ) {
                    offset += $('.site-header').height();
                }

                if (target.length) {
                    var targetoffset = target.offset().top - offset;

                    $('html,body').animate({
                        scrollTop: targetoffset
                    }, 1000, function () {
                        history.pushState(null, null, href);
                    });

                    return false;
                }
            }
        } else {
            mobileMenuToggle();
        }
    });

   

  
});
