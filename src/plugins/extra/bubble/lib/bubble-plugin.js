// Generated by CoffeeScript 1.3.3

/*
----------------------
 State Machine
----------------------

(*) Denotes the initial State
(S) Denotes the "selected" State (when the cursor is in the element)
$el is the element (link, figure, title)
$tip is the popover element (tooltip)

There are 3 variables that are stored on each element;
[ isOpened, null/timer, isSelected ]


(*) [closed, _, _]
    |   |
    |   | (select via keyboard (left/right/up/down))
    |   |
    |   \----> (S) [opened, _, selected]
    |           |   |
    |           |   | (click elsewhere (not $el/$tip)
    |           |   |
    |           |   \----> [closed, _, _]
    |           |
    |           | ($el/$tip.mouseenter)
    |           |
    |           \----> Nothing happens (unlike the other mouseenter case)
    |
    | ($el.mouseenter)
    |
    \----> [closed, timer, _] (waiting to show the popoup)
            |   |
            |   | ($el.mouseleave)
            |   |
            |   \----> (*)
            |
            | (... wait some time)
            |
            \----> [opened, _, _] (hover popup displayed)
                    |   |
                    |   | (select via click or keyboard)
                    |   |
                    |   \---> (S) [opened, _, selected]
                    |
                    | ($el.mouseleave)
                    |
                    \----> [opened, timer, _] (mouse has moved away from $el but the popup hasn't disappeared yet) (POSFDGUOFDIGU)
                            |   |
                            |   | (... wait some time)
                            |   |
                            |   \---> (*) [closed, _, _]
                            |
                            | ($tip.mouseenter)
                            |
                            \---> (TIP) [opened, _, _]
                                    |
                                    | ($tip.mouseleave)
                                    |
                                    \---> [opened, timer, _]
                                            |   |
                                            |   | (... wait some time)
                                            |   |
                                            |   \----> (*) [closed, _, _]
                                            |
                                            \---> (TIP)
*/


(function() {

  define(['aloha', 'jquery', 'bubble/link', 'bubble/figure', 'bubble/title-figcaption'], function(Aloha, jQuery, linkConfig, figureConfig, figcaptionConfig) {
    var Bootstrap_Popover_hide, Bootstrap_Popover_show, Helper, bindHelper, findMarkup, helpers, monkeyPatch, selectionChangeHandler;
    if (true) {
      Bootstrap_Popover_show = function() {
        var $tip, actualHeight, actualWidth, inside, placement, pos, tp;
        if (this.hasContent() && this.enabled) {
          $tip = this.tip();
          this.setContent();
          if (this.options.animation) {
            $tip.addClass("fade");
          }
          placement = (typeof this.options.placement === "function" ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement);
          inside = /in/.test(placement);
          $tip.css({
            top: 0,
            left: 0,
            display: "block"
          }).appendTo((inside ? this.$element : document.body));
          pos = this.getPosition(inside);
          actualWidth = $tip[0].offsetWidth;
          actualHeight = $tip[0].offsetHeight;
          switch ((inside ? placement.split(" ")[1] : placement)) {
            case "bottom":
              tp = {
                top: pos.top + pos.height,
                left: pos.left + pos.width / 2 - actualWidth / 2
              };
              break;
            case "top":
              tp = {
                top: pos.top - actualHeight - 10,
                left: pos.left + pos.width / 2 - actualWidth / 2
              };
              break;
            case "left":
              tp = {
                top: pos.top + pos.height / 2 - actualHeight / 2,
                left: pos.left - actualWidth
              };
              break;
            case "right":
              tp = {
                top: pos.top + pos.height / 2 - actualHeight / 2,
                left: pos.left + pos.width
              };
          }
          $tip.css(tp).addClass(placement).addClass("in");
          /* Trigger the shown event
          */

          return this.$element.trigger('shown-popover');
        }
      };
      Bootstrap_Popover_hide = function(originalHide) {
        return function() {
          originalHide.bind(this)();
          return this.$element.trigger('hidden-popover');
        };
      };
      monkeyPatch = function() {
        var proto;
        console && console.warn('Monkey patching Bootstrap popovers so the buttons in them are clickable');
        proto = jQuery('<div></div>').popover({}).data('popover').constructor.prototype;
        proto.show = Bootstrap_Popover_show;
        return proto.hide = Bootstrap_Popover_hide(proto.hide);
      };
      monkeyPatch();
    }
    helpers = [];
    Helper = (function() {

      function Helper(cfg) {
        jQuery.extend(this, cfg);
        if (this.focus || this.blur) {
          console && console.warn('Popover.focus and Popover.blur are deprecated in favor of listening to the "shown-popover" or "hidden-popover" events on the original DOM element');
        }
      }

      Helper.prototype.start = function(editable) {
        var $el, MILLISECS, afterHide, afterShow, delayTimeout, makePopover, that;
        that = this;
        $el = jQuery(editable.obj);
        afterShow = function($n) {
          return clearTimeout($n.data('aloha-bubble-openTimer'));
        };
        afterHide = function($n) {
          return $n.data('aloha-bubble-selected', false);
        };
        MILLISECS = 2000;
        delayTimeout = function($self, eventName, ms, after) {
          if (ms == null) {
            ms = MILLISECS;
          }
          if (after == null) {
            after = null;
          }
          return setTimeout(function() {
            $self.popover(eventName);
            $self.removeData('aloha-bubble-openTimer');
            $self.removeData('aloha-bubble-closeTimer');
            if (after) {
              return after.bind($self)($self);
            }
          }, ms);
        };
        makePopover = function($nodes, placement) {
          return $nodes.each(function() {
            var $node;
            $node = jQuery(this);
            if (that.focus) {
              $node.on('shown-popover', function() {
                return that.focus.bind($node[0])($node.data('popover').$tip);
              });
            }
            if (that.blur) {
              $node.on('hidden-popover', function() {
                return that.blur.bind($node[0])();
              });
            }
            return $node.popover({
              placement: placement || 'bottom',
              trigger: 'manual',
              content: function() {
                return that.populator.bind($node)($node);
              }
            });
          });
        };
        makePopover($el.find(this.selector), this.placement);
        that = this;
        return $el.on('mouseenter.bubble', this.selector, function() {
          var $node;
          $node = jQuery(this);
          clearTimeout($node.data('aloha-bubble-closeTimer'));
          if (!$node.data('popover')) {
            makePopover($node, that.placement);
          }
          if (!that.noHover) {
            $node.data('aloha-bubble-openTimer', delayTimeout($node, 'show', MILLISECS, afterShow));
            return $node.one('mouseleave.bubble', function() {
              var $tip;
              clearTimeout($node.data('aloha-bubble-openTimer'));
              if (!$node.data('aloha-bubble-selected')) {
                $tip = $node.data('popover').$tip;
                if ($tip) {
                  $tip.on('mouseenter', function() {
                    return clearTimeout($node.data('aloha-bubble-closeTimer'));
                  });
                  $tip.on('mouseleave', function() {
                    if (!$node.data('aloha-bubble-closeTimer')) {
                      return $node.data('aloha-bubble-closeTimer', delayTimeout($node, 'hide', MILLISECS / 2, afterHide));
                    }
                  });
                }
                if (!$node.data('aloha-bubble-closeTimer')) {
                  return $node.data('aloha-bubble-closeTimer', delayTimeout($node, 'hide', MILLISECS / 2, afterHide));
                }
              }
            });
          }
        });
      };

      Helper.prototype.stop = function(editable) {
        var $nodes;
        jQuery(editable.obj).undelegate(this.selector, '.bubble');
        $nodes = jQuery(editable.obj).find(this.selector);
        $nodes.removeData('aloha-bubble-openTimer', 0);
        $nodes.removeData('aloha-bubble-closeTimer', 0);
        $nodes.removeData('aloha-bubble-selected', false);
        return $nodes.popover('destroy');
      };

      return Helper;

    })();
    findMarkup = function(range, selector) {
      var filter;
      if (range == null) {
        range = Aloha.Selection.getRangeObject();
      }
      if (Aloha.activeEditable) {
        filter = function() {
          var $el;
          $el = jQuery(this);
          return $el.is(selector) || $el.parents(selector)[0];
        };
        return range.findMarkup(filter, Aloha.activeEditable.obj);
      } else {
        return null;
      }
    };
    selectionChangeHandler = function(rangeObject, selector) {
      var enteredLinkScope, foundMarkup;
      enteredLinkScope = false;
      if (Aloha.activeEditable != null) {
        foundMarkup = findMarkup(rangeObject, selector);
        enteredLinkScope = foundMarkup;
      }
      return enteredLinkScope;
    };
    bindHelper = function(cfg) {
      var afterHide, afterShow, enteredLinkScope, helper, insideScope;
      helper = new Helper(cfg);
      afterShow = function($n) {
        return clearTimeout($n.data('aloha-bubble-openTimer'));
      };
      afterHide = function($n) {
        return $n.data('aloha-bubble-selected', false);
      };
      insideScope = false;
      enteredLinkScope = false;
      Aloha.bind('aloha-editable-activated', function(event, data) {
        return helper.start(data.editable);
      });
      Aloha.bind('aloha-editable-deactivated', function(event, data) {
        helper.stop(data.editable);
        insideScope = false;
        return enteredLinkScope = false;
      });
      return Aloha.bind('aloha-selection-changed', function(event, rangeObject) {
        var $el, nodes;
        $el = jQuery(rangeObject.getCommonAncestorContainer());
        if (!$el.is(helper.selector)) {
          $el = $el.parents(helper.selector);
        }
        nodes = jQuery(Aloha.activeEditable.obj).find(helper.selector);
        nodes = nodes.not($el);
        nodes.popover('hide');
        afterHide(nodes);
        if (Aloha.activeEditable) {
          enteredLinkScope = selectionChangeHandler(rangeObject, helper.selector);
          if (insideScope !== enteredLinkScope) {
            insideScope = enteredLinkScope;
            if (!$el.is(helper.selector)) {
              $el = $el.parents(helper.selector);
            }
            if (enteredLinkScope) {
              $el.data('aloha-bubble-selected', true);
              if (!$el.data('popover')) {
                $el.popover({
                  placement: helper.placement || 'bottom',
                  trigger: 'manual',
                  content: function() {
                    return helper.populator.bind($el)($el);
                  }
                });
              }
              $el.popover('show');
              $el.data('aloha-bubble-selected', true);
              afterShow($el);
              $el.off('.bubble');
              return event.stopPropagation();
            }
          }
        }
      });
    };
    bindHelper(linkConfig);
    bindHelper(figureConfig);
    bindHelper(figcaptionConfig);
    return {
      register: function(cfg) {
        return bindHelper(new Helper(cfg));
      }
    };
  });

}).call(this);
