$(function() {
  //Tooltip
  var xOffset = 10,
    yOffset = 20;
  $('.tooltip').hover(function(e) {
    this.t = this.title;
    this.title = '';
    $('body').append('<p id="tooltip">' + this.t + '</p>');
    $('#tooltip').css('top', (e.pageY - xOffset) + 'px').css('left', (e.pageX + yOffset) + 'px').fadeIn('fast');
  }, function() {
    this.title = this.t;
    $('#tooltip').remove();
  });
  $('.tooltip').mousemove(function(e) {
    $('#tooltip').css('top', (e.pageY - xOffset) + 'px').css('left', (e.pageX + yOffset) + 'px');
  });

  //tabbed blog comments
  $('#blog-comment-tabs li').click(function(e) {
    var $this = $(this);
    var tab = $this.closest('#blog-comment'),
      i = $this.index();
    $this.addClass('tab-active').siblings('li').removeClass('tab-active');
    tab.find('#blog-comment-tab-content > .blog-comment-tab-item:eq(' + i + ')').show().siblings('.blog-comment-tab-item').hide();
    e.preventDefault();
  });

  // Scrolling within page, Scroll to Top
  $('a.internal-link').click(function(e) {
    $('html,body').animate({
      scrollTop: $(this.hash).offset().top
    }, 900);
    e.preventDefault();
  });

  placegoTopBackground();
  $(window).scroll(function() {
    ($(window).scrollTop() > 100) ?
    $('.goTop').stop().css('display', 'block').animate({
        'bottom': '20px'
      }, 100):
      $('.goTop').stop().animate({
        'bottom': '-10px'
      }, 100, function() {
        $(this).css('display', 'none');
      });
    placegoTopBackground();
  });

  function placegoTopBackground() {
    var d = $(document).height(),
      c = $(window).height(),
      s = $(window).scrollTop();
    var position = (1 - (s / (d - c))) * 100;
    $('#goTopBackground').css('top', position + '%');
  }

  getNextPrev($('a.blog-pager-newer-link'));
  getNextPrev($('a.blog-pager-older-link'));

  function getNextPrev(p) {
    $.get(p.attr('href'), function(e) {
      var Title = $(e).find('.post .post-title').text();
      var Img = $(e).find('.post-banner img').attr('src').replace('s1600', 's150');
      p.find('.blog-pager-title').text(Title);
      p.find('.blog-pager-img').html('<img src="' + Img + '" />');
    }, 'html');
  }

  //social locker
  var post_url = 'http://bloganalyzer.blogspot.com' + $(location).attr('pathname');
  $('.blr-social-lock .blr-locked-content').sociallocker({

    buttons: {
      order: ["facebook-like", "facebook-share", "google-plus"]
    },
    //twitter: {url:"http://twitter.com/menightfury"},
    facebook: {
      like: {
        url: "https://www.facebook.com/bloganalyzer.nightfury/"
      },
      share: {
        appId: 330523163812543,
        url: post_url
      },
    },
    google: {
      url: "https://plus.google.com/+BloganalyzerBlogspot"
    },
    text: {
      header: "Like us To Unlock This Content",
      message: "This content is locked. Like us on Twitter, Facebook or Google plus to unlock it."
    },
    theme: "secrets",
  });
});

//hide and show
function hideandshow(i) {
  var elem = $('#' + i);
  elem.is(':hidden') ? elem.slideDown(300) : elem.slideUp(300);
  return false;
}

//Related posts
var post = {
  Titles: new Array(), //all titles
  Urls: new Array(), //all urls
  Contents: new Array(), //all summary
  Imgs: new Array(), //all thumbimage

  nothumb: 'https://3.bp.blogspot.com/-PpjfsStySz0/UF91FE7rxfI/AAAAAAAACl8/092MmUHSFQ0/s1600/no_image.jpg',
  maxchar: 200, //maximum no of chars under each post
  maxshown: 3 //maximum no of posts visible
};

function relatedposts(json) {
  for (var i = 0; i < json.feed.entry.length; i++) {
    var entry = json.feed.entry[i];

    //get post url
    for (var j = 0; j < entry.link.length; j++) {
      if (entry.link[j].rel == 'alternate') {
        post.Urls[i] = entry.link[j].href;
        break;
      }
    }

    //get post title
    post.Titles[i] = entry.title.$t;

    //get thumb image
    post.Imgs[i] = post.nothumb;
    if ("media$thumbnail" in entry) {
      post.Imgs[i] = entry.media$thumbnail.url;

      //enlarge image size to 230*230 pixel
      post.Imgs[i] = post.Imgs[i].replace("s72-c", "s230-c");
    }

    //get post content
    post.Contents[i] = "";
    if ("content" in entry) {
      post.Contents[i] = entry.content.$t;
    } else if ("summary" in entry) {
      post.Contents[i] = entry.summary.$t;
    }

    //remove tags from post content
    var re = /<\S[^>]*>/g;
    post.Contents[i] = post.Contents[i].replace(re, "");

    //limit max char
    if (post.Contents[i].length > post.maxchar) {
      post.Contents[i] = post.Contents[i].substring(0, post.maxchar) + "...";
    }
  }
}

function showrelatedposts() {
  var noofPosts = 0;
  var rand = Math.floor((post.Titles.length - 1) * Math.random());
  var temprand = rand;

  var dirURL = document.URL;
  var ind = dirURL.indexOf('#.');
  dirURL = dirURL.substring(0, ind);

  //generate output
  while (noofPosts < post.maxshown) {
    if (post.Urls[rand] != dirURL) {
      var out = '<div class="related-post">';
      out += '<a href="' + post.Urls[rand] + '" rel="nofollow" title="' + post.Titles[rand] + '">';
      out += '<div class="related-post-title">' + post.Titles[rand] + '</div>';
      out += '<img src="' + post.Imgs[rand] + '" />';
      out += '<div class="related-post-content">' + post.Contents[rand] + '</div>';
      out += '</a>';
      out += '</div>';
      document.write(out);

      noofPosts++;
      if (noofPosts == post.maxshown) {
        break;
      }
    }
    if (rand < post.Titles.length - 1) {
      rand++;
    } else {
      rand = 0;
    }
    if (rand == temprand) {
      break;
    }
  }
}
