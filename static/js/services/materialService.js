
app.service("materialService", function(){

  var materials = [];

  return {

    getMats: function(){
      return materials;
    },

    putMat: function(m){
      materials.push(m);
    },

    getMatsAtPoint: function(x, y){
      var mats = [];
      materials.forEach(function(m){
        if(m.x <= x && m.x + m.width >= x && m.y <= y && m.y + m.height >= y){
          mats.push(m);
        }
      });
      return mats;
    },

    getMatsInBox: function(x, y, w, h){
      if(!w && !h && x.width && x.height){
        h = x.height; w = x.width; y = x.y; x = x.x;
      }
      var mats = [];
      materials.forEach(function(m){
        if(m.x            < x + w &&
           m.x + m.width  > x &&
           m.y            < y + h &&
           m.height + m.y > y){
             mats.push(m);
           }
      });
      return mats;
    },

    getZUnder: function(mat){
      var mats = this.getMatsInBox(mat);
      var zs = mats.map(function(m){
        return m.z >= mat.z ? -1 : m.z;
      });
      return Math.max.apply(null, zs);
    }

  };
});
