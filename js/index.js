(function() {
  var timeSince;

  document.querySelector('.nav-switch').onclick = function() {
    if (document.body.className === '') {
      return document.body.className = 'menu-on';
    } else {
      return document.body.className = '';
    }
  };

  document.onscroll = function(e) {
    var title, top;
    document.querySelector('#header-bg').style.cssText += 'top: ' + window.scrollY / 20 + 'px';
    title = document.querySelector('.site-title');
    if (!title) {
      return;
    }
    if (window.scrollY > (document.querySelector('#header').offsetHeight - title.offsetWidth - title.offsetHeight)) {
      top = 96;
    } else {
      top = window.scrollY + 96;
    }
    return document.querySelector('.site-title').style.cssText = 'top: ' + top + 'px';
  };

  timeSince = function(date) {
    var interval, seconds;
    seconds = Math.floor((new Date() - date) / 1000);
    interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " mins ago";
    }
    return Math.floor(seconds) + " seconds ago";
  };

  $(function() {
    $('.date').each(function(idx, item) {
      var $date, date, timeStr, unixTime;
      $date = $(item);
      timeStr = $date.data('time');
      if (timeStr) {
        unixTime = Number(timeStr) * 1000;
        date = new Date(unixTime);
        return $date.prop('title', date).find('.from').text(timeSince(date));
      }
    });
    $('pre code').each(function(i, block) {
      return hljs.highlightBlock(block);
    });
    return $('img').each(function(idx, item) {
      var $item, imageAlt;
      $item = $(item);
      if ($item.attr('data-src')) {
        $item.attr('src', $item.attr('data-src'));
        $item.wrap('<a href="' + $item.attr('data-src') + '" target="_blank"></a>');
        imageAlt = $item.prop('alt');
        if ($.trim(imageAlt)) {
          return $item.parent('a').after('<div class="image-alt">' + imageAlt + '</div>');
        }
      }
    });
  });

}).call(this);
