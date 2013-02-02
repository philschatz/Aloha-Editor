// Generated by CoffeeScript 1.3.3
(function() {

  define(['aloha', 'jquery', 'popover', 'ui/ui', 'css!assorted/css/image.css'], function(Aloha, jQuery, Popover, UI) {
    var VIDEO_DIALOG_HTML, IMAGE_DIALOG_HTML, WARNING_IMAGE_PATH, populator, selector, showModalDialog, uploadImage, showModalVideoDialog;
    WARNING_IMAGE_PATH = '/../plugins/oerpub/image/img/warning.png';
    IMAGE_DIALOG_HTML = '<form class="plugin image modal hide fade" id="linkModal" tabindex="-1" role="dialog" aria-labelledby="linkModalLabel" aria-hidden="true" data-backdrop="false">\n  <div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n    <h3>Insert image</h3>\n  </div>\n  <div class="modal-body">\n    <div class="image-options">\n        <a class="upload-image-link">Choose a file</a> OR <a class="upload-url-link">get file from the Web</a>\n        <div class="placeholder preview hide">\n          <h4>Preview</h4>\n          <img class="preview-image"/>\n        </div>\n        <input type="file" class="upload-image-input" />\n        <input type="url" class="upload-url-input" placeholder="Enter URL of image ..."/>\n    </div>\n    <div class="image-alt">\n      <div class="forminfo">\n        Please provide a description of this image for the visually impaired.\n      </div>\n      <div>\n        <textarea name="alt" type="text" required="required" placeholder="Enter description ..."></textarea>\n      </div>\n    </div>\n  </div>\n  <div class="modal-footer">\n    <button type="submit" class="btn btn-primary action insert">Save</button>\n    <button class="btn action cancel">Cancel</button>\n  </div>\n</form>';
    VIDEO_DIALOG_HTML = '<form class="plugin image modal hide fade" id="linkModal" tabindex="-1" role="dialog" aria-labelledby="linkModalLabel" aria-hidden="true" data-backdrop="false">\n  <div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n    <h3>Insert video</h3>\n  </div>\n  <div class="modal-body">\n    <div class="image-options">\n        <input type="url" class="upload-url-input" placeholder="Enter URL of video ..."/>\n    </div>\n    <div class="image-alt">\n      <div class="forminfo">\n        Please provide a description of this video for the visually impaired.\n      </div>\n      <div>\n        <textarea name="alt" type="text" required="required" placeholder="Enter description ..."></textarea>\n      </div>\n    </div>\n  </div>\n  <div class="modal-footer">\n    <button type="submit" class="btn btn-primary action insert">Save</button>\n    <button class="btn action cancel">Cancel</button>\n  </div>\n</form>';
    showModalDialog = function($el, DIALOG_HTML) {
      var $placeholder, $submit, $uploadImage, $uploadUrl, deferred, dialog, imageAltText, imageSource, loadLocalFile, root, setImageSource, settings,
        _this = this;
      settings = Aloha.require('assorted/assorted-plugin').settings;
      root = Aloha.activeEditable.obj;
      dialog = jQuery(DIALOG_HTML);
      $placeholder = dialog.find('.placeholder.preview');
      $uploadUrl = dialog.find('.upload-url-input');
      $submit = dialog.find('.action.insert');
      if ($el.is('img')) {
        imageSource = $el.attr('src');
        imageAltText = $el.attr('alt');
      } else {
        imageSource = '';
        imageAltText = '';
      }
      dialog.find('[name=alt]').val(imageAltText);
      if (/^https?:\/\//.test(imageSource)) {
        $uploadUrl.val(imageSource);
        $uploadUrl.show();
      }
      setImageSource = function(href) {
        imageSource = href;
        return $submit.removeClass('disabled');
      };
      loadLocalFile = function(file, $img, callback) {
        var reader;
        reader = new FileReader();
        reader.onloadend = function() {
          if ($img) {
            $img.attr('src', reader.result);
          }
          setImageSource(reader.result);
          if (callback) {
            return callback(reader.result);
          }
        };
        return reader.readAsDataURL(file);
      };
      dialog.find('.upload-url-link').on('click', function(evt) {
        evt.preventDefault();
        $placeholder.hide();
        return $uploadUrl.show();
      });
      $uploadUrl.on('change', function() {
        var $previewImg, url;
        $previewImg = $placeholder.find('img');
        url = $uploadUrl.val();
        setImageSource(url);
        if (settings.image.preview) {
          $previewImg.attr('src', url);
          return $placeholder.show();
        }
      });
      deferred = $.Deferred();
      dialog.on('submit', function(evt) {
        var img;
        evt.preventDefault();
        if ($el.is('img')) {
          $el.attr('src', imageSource);
          $el.attr('alt', dialog.find('[name=alt]').val());
        } else {
          img = jQuery('<img/>');
          img.attr('src', imageSource);
          img.attr('alt', dialog.find('[name=alt]').val());
          $el.replaceWith(img);
          $el = img;
        }
        return dialog.modal('hide');
      });
      dialog.on('click', '.btn.action.cancel', function(evt) {
        evt.preventDefault();
        deferred.reject({
          target: $el[0]
        });
        return dialog.modal('hide');
      });
      dialog.on('hidden', function(event) {
        if (deferred.state() === 'pending') {
          deferred.reject({
            target: $el[0]
          });
        }
        return dialog.remove();
      });
      return jQuery.extend(true, deferred.promise(), {
        show: function(title) {
          if (title) {
            dialog.find('.modal-header h3').text(title);
          }
          return dialog.modal('show');
        }
      });
    };
    selector = 'img';
    populator = function($el, pover) {
      var $bubble, editable, href;
      editable = Aloha.activeEditable;
      $bubble = jQuery('<div class="link-popover-details">\n    <a class="change">\n      <img src="' + Aloha.settings.baseUrl + '/../plugins/oerpub/assorted/img/edit-link-03.png" />\n  <span title="Change the image\'s properties">Edit image...</span>\n</a>\n&nbsp; | &nbsp;\n<a class="remove">\n  <img src="' + Aloha.settings.baseUrl + '/../plugins/oerpub/assorted/img/unlink-link-02.png" />\n      <span title="Delete the image">Delete</span>\n    </a>\n</div>');
      href = $el.attr('src');
      $bubble.find('.change').on('click', function() {
        var promise;
        Aloha.activeEditable = editable;
        promise = showModalDialog($el, IMAGE_DIALOG_HTML);
        promise.done(function(data) {
          if (data.files.length) {
            jQuery(data.target).addClass('aloha-image-uploading');
            return uploadImage(data.files[0], function(url) {
              return jQuery(data.target).attr('src', url).removeClass('aloha-image-uploading');
            });
          }
        });
        return promise.show('Edit image');
      });
      $bubble.find('.remove').on('click', function() {
        pover.stopOne($el);
        return $el.remove();
      });
      return $bubble.contents();
    };
    uploadImage = function(file, callback) {
      var f, plugin, settings, xhr;
      plugin = this;
      settings = Aloha.require('assorted/assorted-plugin').settings;
      xhr = new XMLHttpRequest();
      if (xhr.upload) {
        if (!settings.image.uploadurl) {
          throw new Error("uploadurl not defined");
        }
        xhr.onload = function() {
          var url;
          if (settings.image.parseresponse) {
            url = parseresponse(xhr);
          } else {
            url = JSON.parse(xhr.response).url;
          }
          return callback(url);
        };
        xhr.open("POST", settings.image.uploadurl, true);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        f = new FormData();
        f.append(settings.image.uploadfield || 'upload', file, file.name);
        return xhr.send(f);
      }
    };
    Aloha.bind('aloha-image-selected', function(event, target) {
      var $el, nodes;
      $el = jQuery(target);
      nodes = jQuery(Aloha.activeEditable.obj).find(selector);
      nodes = nodes.not($el);
      nodes.trigger('hide');
      $el.trigger('show');
      $el.data('aloha-bubble-selected', true);
      return $el.off('.bubble');
    });
    UI.adopt('insertImage-oer', null, {
      click: function() {
        var newEl, promise;
        newEl = jQuery('<span class="aloha-ephemera image-placeholder"> </span>');
        GENTICS.Utils.Dom.insertIntoDOM(newEl, Aloha.Selection.getRangeObject(), Aloha.activeEditable.obj);
        promise = showModalDialog(newEl, IMAGE_DIALOG_HTML);
        promise.done(function(data) {
          if (data.files.length) {
            newEl.addClass('aloha-image-uploading');
            return uploadImage(data.files[0], function(url) {
              jQuery(data.target).attr('src', url);
              return newEl.removeClass('aloha-image-uploading');
            });
          }
        });
        promise.fail(function(data) {
          var $target;
          $target = jQuery(data.target);
          if (!$target.is('img')) {
            return $target.remove();
          }
        });
        return promise.show();
      }
    });
    UI.adopt('insertVideo-oer', null, {
      click: function() {
        var newEl, promise;
        newEl = jQuery('<span class="aloha-ephemera image-placeholder"> </span>');
        GENTICS.Utils.Dom.insertIntoDOM(newEl, Aloha.Selection.getRangeObject(), Aloha.activeEditable.obj);
        promise = showModalDialog(newEl, VIDEO_DIALOG_HTML);
        promise.done(function(data) {
          if (data.files.length) {
            newEl.addClass('aloha-image-uploading');
            return uploadImage(data.files[0], function(url) {
              jQuery(data.target).attr('src', url);
              return newEl.removeClass('aloha-image-uploading');
            });
          }
        });
        promise.fail(function(data) {
          var $target;
          $target = jQuery(data.target);
          if (!$target.is('img')) {
            return $target.remove();
          }
        });
        return promise.show();
      }
    });
    return {
      selector: selector,
      populator: populator
    };
  });

}).call(this);
