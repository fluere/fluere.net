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
    setUpLink('.page-header, .page-footer');
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
    setUpLink('#main-content');

    /* Set up tag page. */
    setUpTagPage();

    /* Gist embed. */
    if ($mainContent.find('code[data-gist-id]').length) {
      window.gistEmbed();
    }

    /* Tracking pageview. */
    if ('ga' in window) {
      window.ga('send', 'pageview', window.location.pathname + window.location.search);
    }

    /* Show main content */
    $mainContent.filter('.is-loading')
      .removeClass('is-loading')
      .find('.archive__title, .archive__item, .entry__header, .entry__body>*, .entry__comment, .pagination, .return-home')
        .fadeTo(0, 0)
        .each(function(i) {
          $(this)
            .stop(true, true)
            .delay(70 * (i + 1) + 100)
            .fadeTo(300, 1);
        });
  };

  /**
   * Set up utility.
   */
  var setUpUtility = function() {
    /* Keep Height. */
    $window
      .on('load resize' + (isMobile ? 'orientationchange scroll' : ''), function() {
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
   * Set up link.
   */
  var setUpLink = function(selector) {
    $(selector).find('a')
      /* External link. */
      .filter('[href^="http"]:not([href*="' + location.hostname + '"]):not([target])')
        .attr('target', '_blank')
      .end()
      /* Smooth scroll */
      .filter('[href^="#"]:not([href="#"]):not([rel="footnote"])')
        .smoothScroll()
      .end()
      .filter('[rel="footnote"]')
        .smoothScroll({ highlight: true })
      .end()
      .filter('.popup')
        .popup();
  };

  /**
   * Set up tag page.
   */
  var setUpTagPage = function() {
    var path = location.pathname.split('/');

    if (path[1] !== 'tag' || path.length < 3) {
      return;
    }

    $('title').text($('title').text().replace(/^archive/, '#' + path[2]));
    $('h1.archive__title').text('#' + path[2]);
  };

  /* DOMContentLoaded. */
  $(document).ready(initialize);

  /* On loaded. */
  $window.on('load', function() {
    $('html').addClass('is-ready');
  });

}(window.jQuery));