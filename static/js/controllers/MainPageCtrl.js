

app.controller("MainPageCtrl", function($rootScope, $scope, $location, $http, $route, materialService, $timeout){
  $scope.goto = function(path){
    $location.path(path);
  }

  $scope.materials = [];
  $scope.trace = null;
  $scope.fabtoolbar = { isOpen: false, color: false };
  $scope.showColorPicker = false;
  $rootScope.settingColor = false;

  $scope.deleteAll = function(){
    $scope.materials.forEach(function(m){
      m.deleted = true;
    });
    $timeout(function(){
      $scope.materials = $scope.materials.filter(function(m){
        return !m.deleted;
      });
    }, 1000);
  }

  $scope.showColorPickerF = function(event){
    $scope.showColorPicker = !$scope.showColorPicker
    $rootScope.settingColor = $scope.showColorPicker;
    event.stopPropagation();
  }

  var mousedown = { v: false, x: -1, y: -1 };
  var mouse = { x: -1, y: -1 };
  $scope.mousedown = function(event){
    if($scope.fabtoolbar.color && $rootScope.settingColor){
      var mats = materialService.getMatsAtPoint(event.x, event.y);
      mats.map(function(m){
        m.color = $scope.fabtoolbar.color;
      });
      $scope.showColorPicker = false;
      $rootScope.settingColor = false;
    }else{
      if($rootScope.settingColor) return;
      mousedown.v = true;
      mousedown.x = event.x;
      mousedown.y = event.y;
      $scope.mousemove(event);
    }
  };

  $scope.mousemove = function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    if(mousedown.v) $scope.trace = makeMaterial(mousedown.x, mousedown.y, mouse.x, mouse.y, true);
  };

  $scope.mouseup = function(event){
    if(!mousedown.v) return;
    mousedown.v = false;
    //$scope.materials.push(makeMaterial(mousedown.x, mousedown.y, event.x, event.y));
    materialService.putMat(makeMaterial(mousedown.x, mousedown.y, event.x, event.y));
    $scope.materials = materialService.getMats();
    $scope.trace = null;
  }

  function makeMaterial(x1, y1, x2, y2, reqDist){
    var x = x2;
    var y = y2;
    var dist = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
    var z = 24; //1; // todo: get z at location, go through materials and find ones at the click locations
    var width = 100, height = 100;

    if(dist > 5){
      x = x1;
      y = y1;
      width = x2 - x1;
      if(width < 0){
        width = -width;
        x -= width;
      }
      height = y2 - y1;
      if(height < 0){
        height = -height;
        y -= height;
      }
    }else{
      if(reqDist) return null;
      x -= width / 2;
      y -= height / 2;
    }

    return {
      width: width,
      height: height,
      x: x,
      y: y,
      z: z,
      dx: 0,
      dy: 0,
      dz: 0,
      deleted: false,
      color: null
    };
  }

});
