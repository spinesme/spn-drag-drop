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
              thumb.style.top = target.offsetTop + 'px';
              thumb.style.left = target.offsetLeft + 'px';
              thumb.classList.add('spn-dragging-clone');
              target.parentNode.appendChild(thumb);

              console.log(e);
              console.log(thumb.style.left);

              e.target.classList.add('spn-dragging');

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

              e.target.classList.remove('spn-dragging');

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

        interact.dynamicDrop(true);

        interact('div[spn-droppable]').dropzone({
          accept: 'div[spn-draggable]',

          ondropactivate: function(e){
            e.relatedTarget.classList.add('spn-drag');
            e.target.classList.add('spn-drop-active');

            if (scope.onDropActivateCallback) {
              scope.onDropActivateCallback(e);
            }
          },

          ondragenter: function(e){
            //add feedback the possibility of drop
            e.target.classList.add('spn-drop-selected');

            if (scope.onDragOverCallback) {
              scope.onDragOverCallback(e);
            }
          },

          ondragleave: function(e){
            e.target.classList.remove('spn-drop-selected');

            if (scope.onDragLeaveCallback) {
              scope.onDragLeaveCallback(e);
            }
          },

          ondrop: function(e){
            e.target.classList.remove('spn-drop-selected');
            e.target.classList.remove('spn-drop-active');

            if (scope.onDropCallback) {
              scope.onDropCallback(e);
            }
          },

          ondropdeactivate: function(e){
            e.relatedTarget.classList.remove('spn-drag');
            e.target.classList.remove('spn-drop-active');

            if (scope.onDropDeactivateCallback) {
              scope.onDropDeactivateCallback(e);
            }
          }
        });
      }
    };
  });
