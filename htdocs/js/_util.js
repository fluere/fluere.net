/*!
 * @fileOverview Utility functions.
 */
(function($) {

  "use strict";

  /**
   * HTML Scroll
   */
  $.getScrollElement = function() {
    var scrollTop = $(window).scrollTop()
      , scrollElement;

    $(window).scrollTop(scrollTop + 1);
    scrollElement = ($('html').scrollTop() > 0) ? 'html' : 'body';
    $(window).scrollTop(scrollTop);

    return scrollElement;
  };

  /**
   * Set smooth scroll.
   * @param {Object} options
   */
  $.fn.smoothScroll = function(options) {
    var o = $.extend({
      selector: null,
      speed : 1300,
      easing : 'easeInOutCubic',
      callback : null,
      highlight: false,
      highlightTime: 2000
    }, options);

    var $scrollBody = $($.getScrollElement());

    $scrollBody.on('mousewheel', function() {
      $scrollBody.stop();
    });

    this.on('click.smoothscroll', o.selector, function() {
      var $target
        , maxOffset = $(document).height() - $(window).height()
        , topOffset;

      $target = this.hash ? $(this.hash.replace(':', '\\:')) : null;
      if (!$target || !$target.length) {
        return;
      }

      topOffset = Math.min(maxOffset, $target.offset().top);

      $scrollBody.animate({
        scrollTop: topOffset
      }, o.speed, o.easing, function() {
        if (o.callback) {
          o.callback();
        }

        if (o.highlight) {
          $target.addClass('is-highlight');
          setTimeout(function() {
            $target.removeClass('is-highlight');
          }, o.highlightTime);
        }
      });

      return false;
    });

    return this;
  };

  /**
   * Popup.
   * @param {object} options
   */
  $.fn.popup = function(options) {
    var o = $.extend({
      width      : 600,
      height     : 500,
      menubar    : 'no',
      toolbar    : 'no',
      location   : 'no',
      status     : 'no',
      resizable  : 'no',
      scrollbars : 'no'
    }, options);
    var popupOptions;

    o.top = Math.floor((window.screen.height - o.height) / 2);
    o.left = Math.floor((window.screen.width - o.width) / 2);
    popupOptions = $.param(o).replace(/&/g,',');

    this.filter('[href]').each(function() {
      $(this).on('click', function() {
        window.open($(this).attr('href'), '', popupOptions);
        return false;
      });
    });

    return this;
  };

}(window.jQuery));
