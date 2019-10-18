"use strict";

// class Mat {
  
//   constructor(items = ("0").repeat(4).split(""), len = 0, width = 0) {
    
//     if(len < items.length) len = items.length;
//     if(width < items.length) width = items.length;
    
//     var out = ("0").repeat(len).split("");
//   	for(var i = 0; i < len; i++) {
//   	  out[i] = (("0").repeat(width).split(""));
//   	  for(var j = 0; j < out[i].length; j++) {
//   	    out[i][j] = parseFloat(out[i][j]);
//   	  }
//   	  out[i][i] = (items[i]) ? parseFloat(items[i]) : 0;
//   	}
//   	return out;
//   }
// }


// // Only works for AxA * BxB and AxA * 1x(number) sized matrices
// function mltMat(mat1, mat2) {
//   var out = new Mat([0], Math.max(mat1.length, mat2.length), Math.max(mat1[0].length, mat2[0].length)), currentval;
  
// }

function Vert3 (...coords) {
  this.x = parseFloat(coords[0]);
  this.y = parseFloat(coords[1]);
  this.z = parseFloat(coords[2]);
  this.orientation = (coords[3]) ? coords[3] : [0, 0, 0];
}

function Vert2(...coords) {
  this.x = parseFloat(coords[0]);
  this.y = parseFloat(coords[1]);
}

function rotateX(vert, angle) {
  var base = {x:vert.x*1, y:vert.y*1, z:vert.z*1}, rad = (360 + angle) * Math.PI/180, cos = Math.cos(rad), sin = Math.sin(rad);
  vert.y =  base.y*cos - base.z*sin;
  vert.z =  base.y*sin + base.z*cos;
  
  vert.orientation[1] = angle;
}

function rotateY(vert, angle) {
  var base = {x:vert.x*1, y:vert.y*1, z:vert.z*1}, rad = (360 + angle) * Math.PI/180, cos = Math.cos(rad), sin = Math.sin(rad);
  vert.x = base.z*sin + base.x*cos;
  vert.z = -base.x*sin + base.z*cos;
  
  vert.orientation[1] = angle;
}

function rotateZ(vert, angle) {
  var base = {x:vert.x*1, y:vert.y*1, z:vert.z*1}, rad = (360 + angle) * Math.PI/180, cos = Math.cos(rad), sin = Math.sin(rad);
  vert.x = base.x*cos - base.y*sin;
  vert.y = base.x*sin + base.y*cos;
  
  vert.orientation[1] = angle;
}

function rotate(vert, angleX, angleY, angleZ) {
  
  if(angleY) rotateY(vert, vert, angleY);
  if(angleZ) rotateZ(vert, vert, angleZ);
  if(angleX) rotateX(vert, vert, angleX);
}

function rotateTo(parentObj, angleX, angleY, angleZ) {
  
  var noRef = [];
  for(var i = 0, temp; i < parentObj.base.length; i++) {
    temp  = parentObj.base[i];
    noRef[i] = new Vert3(temp.x, temp.y, temp.z);
    
    if(angleY) rotateY(noRef[i], angleY);
    if(angleZ) rotateZ(noRef[i], angleZ);
    if(angleX) rotateX(noRef[i], angleX);
    
    temp = parentObj.vertices[i];
    temp.x = noRef[i].x;
    temp.y = noRef[i].y;
    temp.z = noRef[i].z;
    temp.orientation = noRef[i].orientation;
  }
}

function project(obj) {
  return new Vert2(obj.x, obj.y);
}

var strokeColor = "black",
    fillColor = "rgba(0, 255, 0, 0.3)";

function render(objects, canvas, dx, dy) {
  
  // Clears the canvas and sets the colors for stroke and fill
  canvas.fillStyle = "black";
  canvas.fillRect(0, 0, 2*dx, 2*dy);
  canvas.fillStyle = fillColor;
  canvas.strokeStyle = strokeColor;
  
  // loops through parent objects
  for(var i = 0; i < objects.length; i++) {
    
    // objects[i].vertices.sort((a, b)=>{
    //   return a.z - b.z;
    // });
    
    // loops through current parent's subobjects
    for(var j = 0; j < objects[i].subObjs.length; j++) {
      
      // loops through polygons in the current subobject
      for(var k = 0; k < (objects[i].subObjs[j].polygons).length; k++) {
       
    var verts = objects[i].subObjs[j].polygons[k],
        P = project(verts[0]);
        
        canvas.beginPath();
        canvas.moveTo(P.x + dx, -P.y + dy);
        
        // loops through vertices (excluding first one)
        for(var l = 1; l < verts.length; l++) {
          
          P = project(verts[l]);
          canvas.lineTo(P.x + dx, -P.y + dy);
        }
        
        // ends path and draws
        canvas.closePath();
        canvas.stroke();
        canvas.fill();
      }
    }
  }
}

function ParentObj3D(obj) {
  this.base = obj.base;
  this.vertices = obj.vertices;
  this.subObjs = obj.subObjs;
}

function SubObj3D(obj) {
  this.polygons = obj.polygons;
  this.parent = obj.parent;
}

function loadObj(size, fileString) {
  var subObjs = (fileString.indexOf("o ") > -1) ? fileString.split("o ") : fileString.split("g ");
  subObjs.shift();
  var parent = {vertices: [new Vert3(0, 0, 0)], base:[new Vert3(0, 0, 0)],  subObjs: []}, d = size/2;
  
  // loops through all subobjects
  for(var i = 0; i < subObjs.length; i++) {
    
    // splits subobject string into array
    subObjs[i] = subObjs[i].split("\n");
    var out = {polygons: [], parent: {}}, cur, temp;
    
    // loops through all the items (lines) in the array
    for(var j = 0; j < subObjs[i].length; j++) {
      cur = subObjs[i][j], temp = cur.split(" ");
      // create vertex and push it to parent element
      if(temp[0] == "v") {
        var jkrowling = (!isNaN(parseInt(temp[1]))) ? 0 : 1;
        parent.vertices.push(new Vert3(temp[1+jkrowling]*d, temp[2+jkrowling]*d, temp[3+jkrowling]*d));
        parent.base.push(new Vert3(temp[1+jkrowling]*d, temp[2+jkrowling]*d, temp[3+jkrowling]*d));
      }
    }
    
    // loops through all the lines again
    for(j = 0; j < subObjs[i].length; j++) {
      cur = subObjs[i][j], temp = cur.split(" ");
      // loops through all the polygons, ties them to the previously established vertices, and pushes it to subobject
      if(temp[0] == "f") {
        var poly = [];
        for(var k = 1; k < temp.length; k++) {
          if(!isNaN(parseInt(temp[k].split("/")[0]))) poly.push(parent.vertices[parseInt(temp[k].split("/")[0])]);
        }
        out.polygons.push(poly);
      }
    }
    // pushes subobject to parent object
    out.parent = parent;
    parent.subObjs.push(new SubObj3D(out));
  }
  // pushes parent object to the objects array
  objects.push(new ParentObj3D(parent));
  render([objects[0]], canvas, mycan.width/2, mycan.height/2);
}

function loadFile(e) {
  var reader = new FileReader(), input = e.target.files, elm = document.getElementById("objInput"), size = document.getElementById("size");
  reader.onload = function() {
    var out = reader.result;
    loadObj(size.value, out);
  };
  
  for(var i = 0; i < input.length; i++) {
    reader.readAsText(input[i]);
  }
  
  
  elm.removeEventListener("change", loadFile);
  elm.parentNode.removeChild(elm);
  size.parentNode.removeChild(size);
  
  inter = setInterval(loop, 50);
}

function loop() {
  for(var i = 0, base; i < objects.length; i++) {
    // base = objects[i].base;
    if(active == "r" && rotMode < 0) rotateTo(objects[i], axes[3]*90, axes[2]*90, false);
     else {
      for(var j = 1, vert; j < objects[i].vertices.length; j++) {
        vert = objects[i].vertices[j];
        if(active == "l" && rotMode < 0) {
          rotateY(vert, axes[0]*5);
          rotateX(vert, axes[1]*5);
        } else {
          rotateY(vert, -1);
          rotateX(vert, 1);
        }
      }
    }
  }
  render(objects, canvas, mycan.width/2, mycan.height/2);
}


var objects = [],
    mycan = document.getElementById("mycan"),
    canvas = mycan.getContext("2d");


// fixes width and height
mycan.width = mycan.offsetWidth;
mycan.height = mycan.offsetHeight;

var inter;

var controllers = [], axes = [], buttons = [], afr, active = "r", lastpressed = 0, rotMode = 1;

function inputLoop() {
  buttons = controllers[0].buttons;
  axes = controllers[0].axes;
  if(axes[2] !== 0 || axes[3] !== 0) active = "r";
  if((axes[2] === 0 && axes[3] === 0) && (axes[0] !== 0 || axes[1] !== 0)) active = "l";
  
  if(buttons[3].pressed && lastpressed === 0) lastpressed = window.performance.now();
  else if(!buttons[3].pressed && lastpressed !== 0) {
    var time = window.performance.now() - lastpressed;
    if(time >= 50) rotMode *= -1;
    lastpressed = 0;
  }
  
  afr = requestAnimationFrame(getControllers);
}

function addController(e) {
  var cont = (e.gamepad) ? e.gamepad : e;
  controllers[cont.index] = cont;
  getControllers();
}

function removeController(e) {
  var cont = (e.gamepad) ? e.gamepad : e;
  delete controllers[cont.index];
  rotMode = 1;
  if(controllers.length === 0) cancelAnimationFrame(afr);
}

function getControllers() {
  if(!("gamepadconnected" in window)) {
    var pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for(var i = 0, item; i < pads.length; i++) {
      item = pads[i];
      
      if(!item) continue;
      
      if(item.index in controllers) controllers[item.index] = item;
      else addController(item);
    }
  }
  
  afr = requestAnimationFrame(inputLoop);
}

window.addEventListener("resize", ()=>{
  mycan.width = mycan.offsetWidth;
  mycan.height = mycan.offsetHeight;
  render([objects[0]], canvas, mycan.width/2, mycan.height/2);
});

window.addEventListener("gamepadconnected", addController);
window.addEventListener("gamepaddisconnected", removeController);

document.getElementById("objInput").addEventListener("change", loadFile);