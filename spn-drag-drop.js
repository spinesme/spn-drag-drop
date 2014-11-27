'use strict';

angular.module('spnDragDrop', []).
directive('spnDraggable', function() {
    return {
      restrict: 'A',
      scope: {
        data: '=spnData',
        onDragStartCallback: '=?spnOnDrag',
        onDragEndCallback: '=?spnOnDragEnd'
      },
      link: function(scope, element, attrs) {
        element.attr('draggable', attrs.spnDraggable);

        /*
         dragstart
         drag
         dragenter
         dragleave
         dragover
         drop
         dragend
         */

        function handleDragStart(e) {
          element.addClass('spn-drag');

          if (e.originalEvent) {
            e.originalEvent.dataTransfer.setData('data', JSON.stringify(scope.data));
          }

          if (scope.onDragStartCallback) {
            scope.onDragStartCallback(scope.data, e);
          }

          return true;
        }

        function handleDragEnd(e) {
          element.removeClass('spn-drag');

          if (scope.onDragEndCallback) {
            scope.onDragEndCallback(scope.data, e);
          }

          return true;
        }

        function handleTouchStart(e) {
          element.addClass('spn-drag');

          e.originalEvent.dataTransfer.setData('data', JSON.stringify(scope.data));

          event.preventDefault();
        }

        function handleTouchMove(e) {
          var offset = element.offset();
          e.preventDefault();
          e.stopPropagation();
          var orig = (e.type === 'mousemove') ? e.originalEvent : e.originalEvent.changedTouches[0];
          var newOffset = {
            x: orig.pageX - offset.x - origPos.left,
            y: orig.pageY - offset.y - origPos.top
          };
          element.css({
            'transform': 'translate(' + newOffset.x + 'px, ' + newOffset.y + 'px) translatez(1px)'
          });

        }

        element.bind('dragstart', handleDragStart);
        element.bind('dragend', handleDragEnd);


        // element.bind('touchstart', handleTouchStart, false)
        // element.bind('touchmove mousemove', handleTouchMove, false)

        interact('div[draggable]')
          .draggable({
            max: Infinity,
            autoScroll: true,

            onmove: function(e) {
              var target = e.target,
                // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(target.getAttribute('data-x')) || 0) + e.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + e.dy;

              //translate element
              target.style.webkitTransform =
                target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';

              // update the posiion attributes
              target.setAttribute('data-x', x);
              target.setAttribute('data-y', y);

              handleDragStart(e);
            },
            onend: function(e) {
              console.log('interact on move');
              handleDragEnd(e);
            },
          }).autoScroll(true);

      }
    };
  })
  .directive('spnDroppable', function() {
    return {
      restrict: 'A',
      scope: {
        onDropCallback: '=?spnOnDrop',
        onDragEnterCallback: '=?spnOnDragEnter',
        onDragOverCallback: '=?spnOnDragOver',
        onDragLeaveCallback: '=?spnOnDragLeave'
      },
      link: function(scope, element) {

        function handleDragEnter(e) {
          element.addClass('spn-drag-over');

          if (scope.onDragEnterCallback) {
            scope.onDragEnterCallback(e);
          }
        }

        function handleDragLeave(e) {
          element.removeClass('spn-drag-over');

          if (scope.onDragLeaveCallback) {
            scope.onDragLeaveCallback(e);
          }
        }

        function handleDragOver(e) {
          if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop
          }

          if (scope.onDragOverCallback) {
            scope.onDragOverCallback(e);
          }
        }

        function handleDrop(e) {
          if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
          }

          var data = JSON.parse(e.originalEvent.dataTransfer.getData('data'));

          if (scope.onDropCallback) {
            scope.onDropCallback(data, e);
          }

          return false; // Maybe we should use a e.preventDefault at the beginning
        }

        element.bind('drop', handleDrop);
        element.bind('dragenter', handleDragEnter);
        element.bind('dragover', handleDragOver);
        element.bind('dragleave', handleDragLeave);
      }
    };
  });
