angular.module('spnDragDrop', []).
  directive('spnDraggable', function(){
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
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
          return true
        }

        function handleDragEnd(e) {
          element.removeClass('spn-drag');
          return true
        }

        element.bind('dragstart', handleDragStart);
        element.bind('dragend', handleDragEnd);

      }
    }
  })
  .directive('spnDroppable', function() {
    return {
      restrict: 'A',
      scope: {
        onDropCallback: '=?spnOnDrop'
      },
      link: function (scope, element, attrs) {

        function handleDragEnter(e) {
          element.addClass('spn-drag-over');
        }

        function handleDragLeave(e) {
          element.removeClass('spn-drag-over');
        }

        function handleDragOver(e) {
          if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
          }
        }

        function handleDrop(e) {
          console.log('******** DROP ********');alert('go');
          if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
          }
console.log(scope.onDropCallback);
          if(scope.onDropCallback) {
            scope.onDropCallback(e);
          }

          return false
        }

        element.bind('drop', function(e) {
          e.preventDefault();
          alert('ko');
          handleDrop(e);
        });
        element.bind('dragenter', handleDragEnter);
        element.bind('dragover', handleDragOver);
        element.bind('dragleave', handleDragLeave);
      }
    }
  });
