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

        var thumb;

        interact('div[spn-draggable]')
          .draggable({
            max: Infinity,
            autoScroll: true,

            onstart: function(e) {
              var target = e.target;
              thumb = target.cloneNode(true);
              thumb.style.position = "absolute";
              thumb.style.top = e.pageY + 'px';
              thumb.style.left = e.pageX + 'px';
              target.parentNode.appendChild(thumb);

              console.log(e);
              console.log(thumb.style.left);

              e.target.classList.add('dragging');

              if (scope.onDragStartCallback) {
                scope.onDragStartCallback(e);
              }
            },

            onmove: function(e) {
              var
                //target = e.target,
                // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(thumb.getAttribute('data-x')) | 0) + e.dx,
                y = (parseFloat(thumb.getAttribute('data-y')) | 0) + e.dy;

              //translate element
              thumb.style.webkitTransform =
                thumb.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';

              // update the posiion attributes
              thumb.setAttribute('data-x', x);
              thumb.setAttribute('data-y', y);

              if (scope.onDragMoveCallback) {
                scope.onDragMoveCallback(e);
              }
            },

            onend: function(e) {
              var parent = e.target.parentNode;
              parent.removeChild(parent.lastChild);

              if(scope.onDragEndCallback) {
                scope.onDragEndCallback(e);
              }
            }

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
            //add active dropzone feedback
            if (scope.onDropActivateCallback) {
              scope.onDropActivateCallback(e);
            }
          },

          ondragenter: function(e){
            //add feedback the possibility of drop
            if (scope.onDragOverCallback) {
              scope.onDragOverCallback(e);
            }
          },

          ondragleave: function(e){
            //remove feedback the possibility of drop
            if (scope.onDragLeaveCallback) {
              scope.onDragLeaveCallback(e);
            }
          },

          ondrop: function(e){
            if (scope.onDropCallback) {
              scope.onDropCallback(e);
            }
          },

          ondropdeactivate: function(e){
            //add active dropzone feedback
            if (scope.onDropDeactivateCallback) {
              scope.onDropDeactivateCallback(e);
            }
          }
        });
      }
    };
  });
