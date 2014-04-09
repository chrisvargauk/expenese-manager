// v0.0.1
// Requirement: jquery.js, js-plugin-tap.js
// Author: Krisztian Varga

console.log('loaded: lib/scrollable.js');

(function ($) {
  $.fn.scrollable = (function () {
    return function (scrollingAreaSelector, scrollDirection) {
      var $this = $(this);
      var $movingArea = scrollingAreaSelector ? $this.find(scrollingAreaSelector) : $this.find('>'),
          scrollDirection = scrollDirection ? scrollDirection : 'vertical';

      $this.addEvt('drag', function (evt) {
        var $this = $(this);

        if ( scrollDirection === 'vertical' ) {
          $movingArea.css('margin-top', '+='+this.Tap.DragDetails.yDiff);

          var cssMarginTop = $movingArea.css('margin-top'),
              marginTop = cssMarginTop.replace('px', '');

          // Dont leave gap at the top if scrolling too much up
          if ( 0 < marginTop ) {
            $movingArea.css('margin-top', '0');
          }

          var containerHeight = $this.height(),
              spaceAtBottom = $movingArea.height() + (marginTop - containerHeight);

          // Dont leave gap at the bottom if scrolling too much down
          if ( spaceAtBottom < 0 ) {
            $movingArea.css('margin-top', containerHeight - $movingArea.height() );
          }

        } else {
          $movingArea.css('margin-left', '+='+this.Tap.DragDetails.xDiff);

          var cssMarginLeft = $movingArea.css('margin-left'),
              marginLeft = cssMarginLeft.replace('px', '');

          // Dont leave gap on the left if scrolling too much to the left
          if ( 0 < marginLeft ) {
            $movingArea.css('margin-left', '0');
          }

          var containerWidth = $this.width(),
              spaceOnLeft = $movingArea.width() + (marginLeft - containerWidth);

          // Dont leave gap on the right if scrolling too much
          if ( spaceOnLeft < 0 ) {
            $movingArea.css('margin-left', containerWidth - $movingArea.width() );
          }
        }
      });

      return this;
    }
  }());
}(jQuery));