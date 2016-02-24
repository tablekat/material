
app.directive("material", function(){
  return {
    restrict : "E",
    scope: {
      material: '=',
      pop: '='
    },
    templateUrl: 'static/partials/material.html',
    controller: 'MaterialCtrl'
  };
});

app.controller("MaterialCtrl", function($rootScope, $scope, $location, $interval, materialService){
  $scope.goto = function(path){
    $location.path(path);
  }
  $scope.Math = window.Math;
  if($scope.pop !== false) $scope.popClass = "pop";

  function updateStyle(){
    $scope.style = {
      left: $scope.material.x + 'px',
      top: $scope.material.y + 'px',
      width: $scope.material.width + 'px',
      height: $scope.material.height + 'px',
      //'box-shadow': $scope.material.z > 5 ? boxShadow($scope.material.z) : undefined
      'z-index': Math.floor($scope.material.z),
      'line-height': $scope.material.height + 'px', // cosmetic
      opacity: $scope.material.deleted ? 0 : 1,
      background: $scope.material.color,
    };
    //$scope.class = $scope.material.z > 5 ? undefined : 'md-whiteframe-z' + $scope.material.z;
    $scope.class = 'md-whiteframe-' + (Math.floor($scope.material.z) % 25) + 'dp';
  }

  $scope.$watch("material", updateStyle);
  $scope.$watch("material.z", updateStyle);
  $scope.$watch("material.x", updateStyle);
  $scope.$watch("material.y", updateStyle);
  $scope.$watch("material.deleted", updateStyle);
  $scope.$watch("material.color", updateStyle);

  var mousedown = { v: false, x: -1, y: -1 };
  var mouse = { x: -1, y: -1 };
  $scope.mousedown = function(event){
    mousedown.v = true;
    mousedown.x = event.x;
    mousedown.y = event.y;
    $scope.mousemove(event);
    if(!$rootScope.settingColor) event.stopPropagation();
  };

  $scope.mousemove = function(event){
    if(mousedown.v && event.buttons && mouse.x > -1 && mouse.y > -1){
      var vel = Math.sqrt(Math.pow(mouse.x - event.x, 2) + Math.pow(mouse.y - event.y, 2));
      if(vel < 9){
        $scope.material.x += event.x - mouse.x;
        $scope.material.y += event.y - mouse.y;
        $scope.material.dx = 0;
        $scope.material.dy = 0;
      }else{
        $scope.material.dx = (event.x - mouse.x + $scope.material.dx) / 2;
        $scope.material.dy = (event.y - mouse.y + $scope.material.dy) / 2;
      }
    }
    mouse.x = event.x;
    mouse.y = event.y;
  };

  $scope.mouseup = function(event){
    $scope.mousemove(event);
    mousedown.v = false;
    var dist = Math.sqrt(Math.pow(mousedown.x - event.x, 2) + Math.pow(mousedown.y - event.y, 2));
    if(dist < 5){
      //$scope.material.z = ($scope.material.z + 1) % 25;
      $scope.material.dz += 3;
    }
  }

  function boxShadow(z){
    var str = "";
    str += "0 " + (2 * (z-1))   + "px " + (z+2)         + "px " + (1 - z)   + "px rgba(0,0,0,.2),";
    str += "0 " + (1+3*(z-1))   + "px " + (1+4.5*(z-1)) + "px " + ((z-1)/2) + "px rgba(0,0,0,.14),";
    var q = -1.75 * z * z + 14.45 * z - 11.75;
    var q2 = 0.25 * z * z + 0.05 * z - 1.25;
    str += "0 " + (2+((z-1)/3)) + "px " + q             + "px " + q2        + "px rgba(0,0,0,.12)";
    return str;
  }

  var phys = $interval(function tick(){
    if($scope.popClass) $scope.popClass = undefined;

    var damp = 0.95;
    var gravity = 0.3;
    var ygravityOnDelete = 7;
    $scope.material.dx *= damp;
    $scope.material.dy *= damp;
    $scope.material.dz = $scope.material.dz * damp - gravity;
    if($scope.material.deleted) $scope.material.dy += ygravityOnDelete;

    var zUnderUs = materialService.getZUnder($scope.material);
    zUnderUs = Math.max(zUnderUs, 0);

    if($scope.material.z + $scope.material.dz > 24){
      $scope.material.z = 24;
      $scope.material.dz = 0;
    }
    if($scope.material.z + $scope.material.dz < zUnderUs + 1){
      $scope.material.z = zUnderUs + 1;
      $scope.material.dz = 0;
    }

    $scope.material.x += $scope.material.dx;
    $scope.material.y += $scope.material.dy;
    $scope.material.z += $scope.material.dz;

  }, 33); // TODO: variable for framerate


});
