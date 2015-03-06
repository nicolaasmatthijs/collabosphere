(function(){

  var MIN_DIMENSIONS = 150;

  alert(JSON.stringify(window.parent.collabosphere));

  /**
   * TODO
   */
  var setUpModal = function() {
    $.ajax({
      'url': 'http://localhost:2000/bookmarklet.html',
      'success': function(response) {
        $(document.body).append(response);
        renderModal();
      }
    })
  };

  /**
   * TODO
   */
  var renderModal = function() {
    // TODO
    $('#collabosphere-modal').modal();
    // TODO
    showPane('overview');
  };

  /**
   * TODO
   */
  var showPane = function(pane) {
    // Hide the currenty active pane
    $('.collabosphere-pane').addClass('hide');
    // Show the requested pane
    $('#collabosphere-' + pane).removeClass('hide');
    // TODO
    $('.modal-dialog').removeClass('modal-sm modal-lg');
    if (pane === 'overview') {
      $('.modal-dialog').addClass('modal-sm');
    } else if (pane === 'items') {
      $('.modal-dialog').addClass('modal-lg');
    }
  };

  /**
   * TODO
   */
  var handleOverviewNext = function() {
    var selected = $('input[name=collabosphere-overview-options]:checked').val();
    if (selected === 'bookmark') {

    } else if (selected === 'items') {
      renderPageItems();
    }
  };

  /**
   * TODO
   */
  var renderPageItems = function() {
    // TODO
    $('#collabosphere-items-list').empty();

    // TODO
    var images = [];

    var imageCallback = function(img) {
      if (images.indexOf(img) === -1) {
        images.push(img);
        // TODO
        $('#collabosphere-items-list').append('<li class="collabosphere-item-container">' +
                                                '<div class="collabosphere-item" style="background-image: url(\'' + img + '\')"></div>' +
                                                '<input type="checkbox" />' +
                                              '</li>');
      }
    };

    // TODO
    collectImages(imageCallback);
    // TODO
    collectBackgroundImages(imageCallback);

    // TODO
    showPane('items');
  };

  /**
   * TODO
   */
  var addBinding = function() {
    $(document).on('click', '#collabosphere-overview-next', handleOverviewNext);
  };

  addBinding();
  setUpModal();

  /*    var addedImages = [];



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
              //$('#collabosphere-modal-content').append('<div style="display: inline; width: 150px; height: 150px;"><img src="' + url + '" style="height: 150px; width: 150px;"/></div>')
            }
        });
        $('body').append(bgImg);
        bgImg.attr('src', url);
      });
  };*/

  /**
   * TODO
   */
  var collectImages = function(callback) {
    var $imgs = $('img', window.parent.document);
    $imgs.each(function(index, img) {
      var $img = $(img);
      if (img.naturalHeight > MIN_DIMENSIONS && img.naturalWidth > MIN_DIMENSIONS) {
        callback($img.attr('src'));
      }
    });
  };

  /**
   * TODO
   */
  var collectBackgroundImages = function() {

  };

})();