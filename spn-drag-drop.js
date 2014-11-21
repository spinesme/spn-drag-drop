'use strict';

angular.module('spnDragDrop', []).
directive('spnDraggable', function() {
    return {
      restrict: 'A',
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
          e.originalEvent.dataTransfer.setData('text', 'foo');
          return true;
        }

        function handleDragEnd(e) {
          element.removeClass('spn-drag');
          return true;
        }

        element.bind('dragstart', handleDragStart);
        element.bind('dragend', handleDragEnd);

      }
    };
  })
  .directive('spnDroppable', function() {
    return {
      restrict: 'A',
      scope: {
        onDropCallback: '=?spnOnDrop'
      },
      link: function(scope, element) {

        function handleDragEnter(e) {
          element.addClass('spn-drag-over');
        }

        function handleDragLeave(e) {
          element.removeClass('spn-drag-over');
        }

        function handleDragOver(e) {
          if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop
          }
        }

        function handleDrop(e) {
          if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
          }

          if (scope.onDropCallback) {
            scope.onDropCallback(e);
          }

          return false;
        }

        element.bind('drop', handleDrop);
        element.bind('dragenter', handleDragEnter);
        element.bind('dragover', handleDragOver);
        element.bind('dragleave', handleDragLeave);
      }
    };
  });
