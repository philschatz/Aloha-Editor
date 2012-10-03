// Generated by CoffeeScript 1.3.3
(function() {
  var toolbarSettings;

  toolbarSettings = [
    'bold', 'italic', 'underline', {
      text: 'Table',
      subMenu: ['createTable', 'addrowbefore', 'addrowafter', 'addcolumnbefore', 'addcolumnafter', '', 'deleterow', 'deletecolumn']
    }
  ];

  define(["aloha", "aloha/plugin", "ui/ui", '../../appmenu/appmenu', "i18n!format/nls/i18n", "i18n!aloha/nls/i18n", "aloha/console", "css!simpletoolbar/css/simpletoolbar.css"], function(Aloha, Plugin, Ui, appmenu, i18n, i18nCore) {
    var CONTAINER_JQUERY;
    CONTAINER_JQUERY = jQuery('.toolbar');
    if (CONTAINER_JQUERY.length === 0) {
      CONTAINER_JQUERY = jQuery('<div></div>').addClass('toolbar-container').appendTo('body');
    }
    /*
       register the plugin with unique name
    */

    return Plugin.create("simpletoolbar", {
      init: function() {
        var applyHeading, item, labels, order, recurse, toolbar, toolbarLookup, _i, _len;
        window.toolbar = toolbar = new appmenu.ToolBar();
        toolbar.el.appendTo(CONTAINER_JQUERY);
        toolbar.el.addClass('aloha');
        toolbarLookup = {};
        recurse = function(item, lookupMap) {
          var menuItem, subItem, subItems, subMenu;
          if ('string' === $.type(item)) {
            if ('' === item) {
              return new appmenu.Separator();
            }
            menuItem = new appmenu.ToolButton(item);
            lookupMap[item] = menuItem;
            return menuItem;
          } else {
            subItems = (function() {
              var _i, _len, _ref, _results;
              _ref = item.subMenu || [];
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                subItem = _ref[_i];
                _results.push(recurse(subItem, lookupMap));
              }
              return _results;
            })();
            subMenu = new appmenu.Menu(subItems);
            menuItem = new appmenu.ToolButton(item.text, {
              subMenu: subMenu
            });
            return menuItem;
          }
        };
        for (_i = 0, _len = toolbarSettings.length; _i < _len; _i++) {
          item = toolbarSettings[_i];
          toolbar.append(recurse(item, toolbarLookup));
        }
        Ui.adopt = function(slot, type, settings) {
          var ItemRelay;
          ItemRelay = (function() {

            function ItemRelay(items) {
              this.items = items;
            }

            ItemRelay.prototype.show = function() {
              var _j, _len1, _ref, _results;
              _ref = this.items;
              _results = [];
              for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                item = _ref[_j];
                _results.push(item.setHidden(false));
              }
              return _results;
            };

            ItemRelay.prototype.hide = function() {
              var _j, _len1, _ref, _results;
              _ref = this.items;
              _results = [];
              for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                item = _ref[_j];
                _results.push(item.setHidden(true));
              }
              return _results;
            };

            ItemRelay.prototype.setActive = function(bool) {
              var _j, _len1, _ref, _results;
              _ref = this.items;
              _results = [];
              for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                item = _ref[_j];
                _results.push(item.setChecked(bool));
              }
              return _results;
            };

            ItemRelay.prototype.setState = function(bool) {
              return this.setActive(bool);
            };

            ItemRelay.prototype.enable = function(bool) {
              var _j, _len1, _ref, _results;
              if (bool == null) {
                bool = true;
              }
              _ref = this.items;
              _results = [];
              for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                item = _ref[_j];
                _results.push(item.setDisabled(!bool));
              }
              return _results;
            };

            ItemRelay.prototype.disable = function() {
              var _j, _len1, _ref, _results;
              _ref = this.items;
              _results = [];
              for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                item = _ref[_j];
                _results.push(item.setDisabled(true));
              }
              return _results;
            };

            ItemRelay.prototype.setActiveButton = function(a, b) {
              return console.log("" + slot + " TODO:SETACTIVEBUTTON:", a, b);
            };

            ItemRelay.prototype.focus = function(a) {
              return console.log("" + slot + " TODO:FOCUS:", a);
            };

            ItemRelay.prototype.foreground = function(a) {
              return console.log("" + slot + " TODO:FOREGROUND:", a);
            };

            return ItemRelay;

          })();
          if (slot in toolbarLookup) {
            item = toolbarLookup[slot];
          } else {
            item = new appmenu.ToolButton('DUMMY_ITEM_THAT_SQUASHES_STATE_CHANGES');
          }
          item.setText(settings.tooltip);
          item.setIcon(settings.icon);
          item.setAction(settings.click);
          item.element = item.el;
          return new ItemRelay([item]);
        };
        applyHeading = function() {
          var $newEl, $oldEl, rangeObject;
          rangeObject = Aloha.Selection.getRangeObject();
          if (rangeObject.isCollapsed()) {
            GENTICS.Utils.Dom.extendToWord(rangeObject);
          }
          Aloha.Selection.changeMarkupOnSelection(Aloha.jQuery(this.markup));
          $oldEl = Aloha.jQuery(rangeObject.getCommonAncestorContainer());
          $newEl = Aloha.jQuery(Aloha.Selection.getRangeObject().getCommonAncestorContainer());
          return $newEl.addClass($oldEl.attr('class'));
        };
        order = ['p', 'h1', 'h2', 'h3'];
        labels = {
          'p': 'Normal Text',
          'h1': 'Heading 1',
          'h2': 'Heading 2',
          'h3': 'Heading 3'
        };
        return Aloha.bind("aloha-selection-changed", function(event, rangeObject) {
          var $el, h, i, isActive, _j, _len1, _results;
          $el = Aloha.jQuery(rangeObject.startContainer);
          _results = [];
          for (i = _j = 0, _len1 = order.length; _j < _len1; i = ++_j) {
            h = order[i];
            _results.push(isActive = $el.parents(h).length > 0);
          }
          return _results;
        });
      },
      /*
           toString method
      */

      toString: function() {
        return "simpletoolbar";
      }
    });
  });

}).call(this);
