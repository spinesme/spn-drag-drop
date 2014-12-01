'use strict';

angular.module('spnDragDrop', []).
directive('spnDraggable', function() {
    return {
      restrict: 'A',
      scope: {
        data: '=spnData',
        onDragStartCallback: '=?spnOnDrag',
        onDragMoveCallback: '=?spnOnMove',
        onDragEndCallback: '=?spnOnDragEnd'
      },
      link: function(scope, element, attrs) {
        element.attr('draggable', attrs.spnDraggable);

        /*
         - dragstart
         - drag
         dragenter
         dragleave
         dragover
         drop
         - dragend
         */

        interact('div[spn-draggable]')
          .draggable({
            max: Infinity,
            autoScroll: true,

            onstart: function(e) {
              console.log('interact on start');

              if (scope.onDragStartCallback) {
                scope.onDragStartCallback(e);
              }
            },

            onmove: function(e) {
              console.log('interact on move');
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

              if (scope.onDragMoveCallback) {
                scope.onDragMoveCallback(e);
              }
            },

            onend: function(e) {
              console.log('interact on end');

              if (scope.onDragEndCallback) {
                scope.onDragEndCallback(e);
              }
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
        onDropActivateCallback: '=?spnOnDropActivate',
        onDropDeactivateCallback: '=?spnOnDropDeactivate',
        onDragOverCallback: '=?spnOnDragOver',
        onDragLeaveCallback: '=?spnOnDragLeave'
      },
      link: function(scope, element) {

        interact('div[spn-droppable]').dropzone({
          accept: 'div[spn-draggable]',

          ondropactivate: function(e){
            console.log('interact drop activate');
            //add active dropzone feedback
            if (scope.onDropActivateCallback) {
              scope.onDropActivateCallback(e);
            }
          },

          ondragenter: function(e){
            console.log('interact drag enter');
            //add feedback the possibility of drop
            if (scope.onDragOverCallback) {
              scope.onDragOverCallback(e);
            }
          },

          ondragleave: function(e){
            console.log('interact drag leave');
            //remove feedback the possibility of drop
            if (scope.onDragLeaveCallback) {
              scope.onDragLeaveCallback(e);
            }
          },

          ondrop: function(e){
            console.log('interact drop');
            if (scope.onDropCallback) {
              scope.onDropCallback(e);
            }
          },

          ondropdeactivate: function(e){
            console.log('interact drop deactivate');
            //add active dropzone feedback
            if (scope.onDropDeactivateCallback) {
              scope.onDropDeactivateCallback(e);
            }
          }
        });
      }
    };
  });
