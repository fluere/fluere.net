/*!
 * @fileOverview Soundtrcks functions.
 */
(function($) {

  "use strict";

  /**
   * CONST
   */
  var JSON_URL = 'http://8tracks.com/users/{username}/mixes.jsonp'
    , EMBED_URL = 'http://8tracks.com/mixes/{id}/player_v3_universal/'
    , USER_NAME = 'fluere'
    , PER_PAGE = 100
    , API_KEY = 'c0a25a1aa2e7628c9b2d58ecddcecafe95489012'
    , API_VERSION = 3;

  /**
   * Store objects
   */
  var $html = $('html')
    , $soundtracks = $('#soundtracks')
    , $handle  = $soundtracks.find('.soundtracks__handle')
    , $overlay = $soundtracks.find('.soundtracks__overlay')
    , $content = $soundtracks.find('.soundtracks__content')
    , $embeded = $soundtracks.find('.soundtracks__embeded')
    , $index = $soundtracks.find('.soundtracks__index');

  /**
   * Initialize.
   */
  var initialize = function() {
    loadMixes();

    $soundtracks
      .on('mousewheel', function(e) {
        e.stopPropagation();
      });

    $handle
      .on('click', toggle);

    $overlay
      .hide()
      .on('click', hide);

    $content
      .on('click', function() {
        return false;
      });
  };

  /**
   * Load mixes.
   */
  var loadMixes = function() {
    var code = [];

    $.ajax({
      type: 'GET',
      url: JSON_URL.replace('{username}', USER_NAME),
      dataType: 'jsonp',
      jsonp: 'callback',
      data: {
        'per_page': PER_PAGE,
        'api_key': API_KEY,
        'api_version': API_VERSION
      }
    })
    .done(function(data) {
      $.each(data.mix_set.mixes, function() {
        code.push('<li><a href="https://8tracks.com/' + this.web_path + '" target="_blank" data-mixid="' + this.id + '" title="' + this.description + '">' + this.name + '<span class="tracks-count">(' + this.tracks_count + 'tracks)</span><i class="fa fa-caret-square-o-right"></i></a></li>');
      });

      $index
        .append(code)
        .find('a')
          .on('click', selectMix);
    })
    .fail(function() {
      $soundtracks.remove();
    });
  };

  /**
   * Select mix.
   */
  var selectMix = function() {
    var url = EMBED_URL.replace('{id}', $(this).data('mixid'));

    $embeded.attr('src', url);

    $index.find('.is-current')
      .removeClass('is-current');
    $(this).addClass('is-current');

    return false;
  };

  /**
   * Toggle content.
   */
  var toggle = function() {
    if ($overlay.is(':visible')) {
      hide();
    } else {
      show();
    }
  };

  /**
   * Show content.
   */
  var show = function() {
    $html.addClass('show-overlay');

    $overlay
      .hide()
      .fadeIn(600, 'easeOutExpo');

    $(document).on('keydown.hideoverlay', function(e) {
      /* On hit ESC key. */
      if (e.keyCode === 27) {
        hide();
        return false;
      }
    });
  };

  /**
   * Hide content.
   */
  var hide = function() {
    $html.removeClass('show-overlay');

    $overlay.fadeOut(600, 'easeOutExpo');

    $(document).off('keydown.hideoverlay');
  };

  /* DOMContentLoaded. */
  $(document).ready(initialize);

}(window.jQuery));