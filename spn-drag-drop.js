angular.module('spnDragDrop', []).
  directive('spnDraggable', function(){
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.attr('draggable', 'true');
      }
    }
  });
