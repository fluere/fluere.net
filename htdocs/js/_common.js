/*!
 * @fileOverview Common functions.
 */
(function($) {

  "use strict";

  /**
   * Store objects.
   */
  var $window = $(window)
    , $html = $('html')
    , $header = $('header.page-header')
    , $mainContent = $('#main-content');

  /**
   * For state management.
   */
  var isMobile = $html.hasClass('mobile');

  /**
   * Initialize.
   */
  var initialize = function() {
    setUpUtility();
    setUpPjax();
    setUpCustomScroll();
    setUpBackground();
    pageLoadComplete();
  };

  /**
   * Page load start.
   */
  var pageLoadStart = function() {
    $mainContent.addClass('is-loading');
    window.scrollTo(0, $mainContent.offset().top);
  };

  /**
   * Page load complete.
   */
  var pageLoadComplete = function() {
    /* Links */
    $('a')
      /* External link. */
      .filter('[href^="http"]:not([href*="' + location.hostname + '"]):not([target])')
        .attr('target', '_blank')
      .end()
      /* Smooth scroll */
      .filter('[href^="#"]:not([href="#"]):not([rel="footnote"])')
        .smoothScroll()
      .end()
      .filter('[rel="footnote"]')
        .smoothScroll({ highlight: true });

    /* Gist embed. */
    if ($mainContent.find('code[data-gist-id]').length) {
      window.gistEmbed();
    }

    /* Disqus */
    if ($('#disqus_thread').length) {
      $mainContent.append('<script src="//fluere.disqus.com/embed.js" async></script>');
    }

    /* Set up tag page. */
    setUpTagPage();

    /* Show main content */
    $mainContent.filter('.is-loading')
      .removeClass('is-loading')
      .find('.archive__title, .archive__item, .entry__header, .entry__body>*, .entry__comment, .pagination, .return-home')
        .fadeTo(0, 0)
        .each(function(i) {
          $(this)
            .stop(true, true)
            .delay(100 * (i + 1) + 100)
            .fadeTo(400, 1);
        });

    /* Tracking pageview. */
    if ('ga' in window) {
      window.ga('send', 'pageview', window.location.pathname + window.location.search);
    }
  };

  /**
   * Set up utility.
   */
  var setUpUtility = function() {
    $window
      .on('load resize orientationchange scroll', function() {
        $header.css('minHeight', $window.height());
        $mainContent.css('minHeight', $window.height());
      })
      .trigger('resize');
  };

  /**
   * Set up pjax.
   */
  var setUpPjax = function() {
    var linkSelector = 'a:not([target]):not([href^="#"])';

    if (isMobile) {
      $(linkSelector).not('[href*="#"]').each(function() {
        $(this).attr('href', $(this).attr('href') + '#main-content');
      });
    } else {
      $.pjax({
        area: '#main-content',
        link: linkSelector,
        load: { script: true },
        callback: pageLoadComplete,
        callbacks: { before: pageLoadStart },
        scrollTop: false,
        scrollLeft: false
      });
    }
  };

  /**
   * Set up custom scroll.
   */
  var setUpCustomScroll = function() {
    if (isMobile) {
      return;
    }

    $html.niceScroll({
      cursoropacitymax: 0.4,
      cursorwidth: 7,
      mousescrollstep: 20
    });
  };

  /**
   * Set up background.
   */
  var setUpBackground = function() {
    var $background = $('div.background');

    if (!$background.is(':visible')) {
      return;
    }

    $window
      .on('scroll.swapbg', function() {
        var height = $window.height()
          , scrollTop = $window.scrollTop();

        if (scrollTop <= height) {
          $background.css('opacity', Math.max(0, 1-(scrollTop/height)));
        } else {
          $background.css('opacity', 0);
        }
      })
      .trigger('scroll.swapbg');
  };

  /**
   * Set up tag page.
   */
  var setUpTagPage = function() {
    var path = location.pathname.split('/');

    if (path[0] !== 'tag' || path.length < 2) {
      return;
    }

    $('title').text($('html').text().replace(/^archive/, path[1]));
    $('h1.archive__title').text(path[1]);
  };

  /* DOMContentLoaded. */
  $(document).ready(initialize);

  /* On loaded. */
  $window.on('load', function() {
    $('html').addClass('is-ready');
  });

}(window.jQuery));