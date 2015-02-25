(function(){

  // the minimum version of jQuery we want
  var v = "2.0.0";

  // check prior inclusion and version
  if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
    var done = false;
    var script = document.createElement("script");
    script.src = "//ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
    script.onload = script.onreadystatechange = function(){
      if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
        done = true;

        $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'http://localhost:2000/bookmarklet.css') );

        initCollabosphere();
      }
    };
    document.getElementsByTagName("head")[0].appendChild(script);
  } else {
    initCollabosphere();
  }

  function initCollabosphere() {
    (window.collabosphere.init = function() {

      if ($('#collabosphere-modal').length === 0) {

        var modal = '<div id="collabosphere-modal">' +
                      '<div id="collabosphere-modal-content"></div>' +
                    '</div>';
        var $modal = $(modal);
        $('body').append($modal);

      }

      $('#collabosphere-modal').show();

      var addedImages = [];

      var $imgs = $('img');
      $imgs.each(function(index, img) {
        var $img = $(img);
        var src = $img.attr('src');
        if (addedImages.indexOf(src) === -1 && img.naturalHeight > 50 && img.naturalWidth > 50) {
          addedImages.push(src);
          $('#collabosphere-modal-content').append('<div style="display: inline; width: 150px; height: 150px;"><img src="' + src + '" style="height: 150px; width: 150px;"/></div>')
        }
      })

      $bgImgs = $('*').filter(function() {
        if (this.currentStyle)
          return this.currentStyle['backgroundImage'] !== 'none';
        else if (window.getComputedStyle)
          return document.defaultView.getComputedStyle(this,null).getPropertyValue('background-image') !== 'none';
      });
      $bgImgs.each(function(index, img) {
        var url = $(img).css('background-image').replace('url(', '').replace(')', '').replace("'", '').replace('"', '');
        var bgImg = $('<img />');
        bgImg.hide();
        bgImg.bind('load', function()
        {
            var height = this.naturalHeight;
            var width = this.naturalWidth;
            if (addedImages.indexOf(url) === -1 && height > 50 && width > 50) {
              addedImages.push(url);
              $('#collabosphere-modal-content').append('<div style="display: inline; width: 150px; height: 150px;"><img src="' + url + '" style="height: 150px; width: 150px;"/></div>')
            }
        });
        $('body').append(bgImg);
        bgImg.attr('src', url);
      });

    })();
  }

})();