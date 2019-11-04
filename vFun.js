"use strict";

var mycan = document.getElementById("mycan"),
    canvas = mycan.getContext("2d");
    
    // fixes width and height
    mycan.width = mycan.offsetWidth;
    mycan.height = mycan.offsetHeight;
    
var objects = [],
    strokeColor = "black",
    fillColor = "rgba(0, 255, 0, 0.3)",
    olColor = "white",
    camera = new Vert3(0, 0, 600),
    e = new Vert3((mycan.width/2), (mycan.height/2), 200),
    inter, controllers = [],
    axes = [],
    buttons = [],
    mkb = {x:e.x,y:e.y,},
    afr,
    active = "m",
    lastpressed = 0,
    rotMode = 1,
    speed = 5,
    tx = 0,
    ty = 0,
    automove = new Vert2(-10, 10),
    outline = false,
    vhs = false;
    camera.orientation = [0, 0, 0];
    
    
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
  var base = {y:vert.y*1, z:vert.z*1}, rad = (360 + angle) * Math.PI/180, cos = Math.cos(rad), sin = Math.sin(rad);
  vert.y =  base.y*cos - base.z*sin;
  vert.z =  base.y*sin + base.z*cos;
  
  vert.orientation[0] = angle;
}

function rotateY(vert, angle) {
  var base = {x:vert.x*1, z:vert.z*1}, rad = (360 + angle) * Math.PI/180, cos = Math.cos(rad), sin = Math.sin(rad);
  vert.x = base.z*sin + base.x*cos;
  vert.z = -base.x*sin + base.z*cos;
  
  vert.orientation[1] = angle;
}

function rotateZ(vert, angle) {
  var base = {x:vert.x*1, y:vert.y*1}, rad = (360 + angle) * Math.PI/180, cos = Math.cos(rad), sin = Math.sin(rad);
  vert.x = base.x*cos - base.y*sin;
  vert.y = base.x*sin + base.y*cos;
  
  vert.orientation[2] = angle;
}

function rotate(vert, angleX, angleY, angleZ) {
  if(angleY) rotateY(vert, vert, angleY);
  if(angleZ) rotateZ(vert, vert, angleZ);
  if(angleX) rotateX(vert, vert, angleX);
}

function rotateTo(parentObj, angleX, angleY, angleZ) {
  
  var noRef = [];
  for(var i = 0, temp; i < parentObj.base.length; i++) {
    temp  = parentObj.vertices[i];
    noRef[i] = new Vert3(temp.x, temp.y, temp.z);
    
    if(angleY) rotateY(noRef[i], angleY);
    if(angleZ) rotateZ(noRef[i], angleZ);
    if(angleX) rotateX(noRef[i], angleX);
    
    temp = parentObj.vertices[i];
    temp.x = noRef[i].x;
    temp.y = noRef[i].y;
    temp.z = noRef[i].z;
  }
}

function backcull(p) {
  
  
  var N = new Vert3(0, 0, 0),
      T = {x: p[0].x-camera.x, y: p[0].y-camera.y, z: p[0].z-camera.z},
      vec1 = {x: p[1].x-p[0].x, y: p[1].y-p[0].y, z: p[1].z-p[0].z},
      vec2 = {x: p[2].x-p[0].x, y: p[2].y-p[0].y, z: p[2].z-p[0].z};
  
  // cross product
  N.x = (vec1.y * vec2.z) - (vec1.z * vec2.y);
  N.y = (vec1.z * vec2.x) - (vec1.x * vec2.z);
  N.z = (vec1.x * vec2.y) - (vec1.y * vec2.x);
  
  // if the dot product of T and N is greater than 0, discard this polygon
  if((T.x * N.x) + (T.y * N.y) + (T.z * N.z) >= 0) return true;
  else return false;
}

function project(obj, avgZ) {
  
  // distance between vertice and camera (per dimension)
  var x = obj.x - camera.x,
      y = obj.y - camera.y,
      z = obj.z - camera.z,
      
      // sines of camera orientation
      sx = Math.sin(camera.orientation[0]*Math.PI/180),
      sy = Math.sin(camera.orientation[1]*Math.PI/180),
      sz = Math.sin(camera.orientation[2]*Math.PI/180),
      
      // cosines of camera orientation
      cx = Math.cos(camera.orientation[0]*Math.PI/180),
      cy = Math.cos(camera.orientation[1]*Math.PI/180),
      cz = Math.cos(camera.orientation[2]*Math.PI/180),
      
      // camera transformation
      dx = (cy * ((sz*y) + (cz*x))) - (sy*z),
      dy = (sx * ((cy*z) + (sy*((sz*y) + (cz*x))))) + (cx*((cz*y) - (sz*x))),
      dz = (cx * ((cy*z) + (sy*((sz*y) + (cz*x))))) - (sx*((cz*y) - (sz*x))),
      
      // perspective projection
      outX = ((e.z/dz)*dx) + e.x,
      outY = ((e.z/dz)*dy) + e.y;
  
  
  return new Vert2(outX, outY);
  // return new Vert2(obj.x + e.x, -obj.y + e.y);
}

function render(objects, canvas, dx, dy) {
  
  // Clears the canvas and sets the colors for stroke and fill
  canvas.clearRect(0, 0, 2*dx, 2*dy);
  canvas.fillStyle = "black";
  canvas.fillRect(0, 0, 2*dx, 2*dy);
  
  canvas.strokeStyle = strokeColor;
  canvas.fillStyle = fillColor;
  // loops through parent objects
  for(var i = 0; i < objects.length; i++) {
    
    e.x = dx + tx;
    e.y = dy + ty;
    
    // outline
    var ol = [new Vert2(dx*2, dy*2), new Vert2(0, 0)];
    
    for(var kawaii = 0, t, t2; kawaii < objects[i].vertices.length; kawaii++) {
      t = objects[i].base[kawaii];
      t2 = objects[i].vertices[kawaii];
      t2.x = t.x * objects[i].size;
      t2.y = t.y * objects[i].size;
      t2.z = t.z * objects[i].size;
    }
    
    rotateTo(objects[i], ...objects[i].orientation);
    
    var zBuf = [];
    
    // loops through current parent's subobjects
    for(var j = 0; j < objects[i].subObjs.length; j++) {
      // loops through polygons in the current subobject
      
      for(var k = 0, tempval; k < (objects[i].subObjs[j].polygons).length; k++) {
        var zObj = {zval: 0, polygon: [] }, leastbeast = 0;
        for(var l = 0; l < objects[i].subObjs[j].polygons[k].length; l++) {
          tempval = e.z - objects[i].subObjs[j].polygons[k][l].z;
          if(tempval > leastbeast) leastbeast = tempval;
        }
        zObj.zval = leastbeast;
        zObj.polygon = objects[i].subObjs[j].polygons[k];
        if(!backcull(zObj.polygon)) zBuf.push(zObj);
      }
    }
    
    zBuf.sort((a, b)=>{return (a.zval > b.zval) ? -1 : ((a.zval < b.zval) ? 1 : 0)});
  
    for(var zCount = 0; zCount < zBuf.length; zCount++) {
      var verts = zBuf[zCount].polygon,
        
      P = project(verts[0]);
        
      if(P.x < ol[0].x) ol[0].x = P.x * 1;
      if(P.x > ol[1].x) ol[1].x = P.x * 1;
          
      if(P.y < ol[0].y) ol[0].y = P.y * 1;
      if(P.y > ol[1].y) ol[1].y = P.y * 1;
      
      canvas.beginPath();
      canvas.moveTo(P.x, P.y);
        
      // loops through vertices (excluding first one)
      for(var lego = 1; lego < verts.length; lego++) {
        P = project(verts[lego]);
        canvas.lineTo(P.x, P.y);
        if(P.x < ol[0].x) ol[0].x = P.x * 1;
        if(P.x > ol[1].x) ol[1].x = P.x * 1;
        
        if(P.y < ol[0].y) ol[0].y = P.y * 1;
        if(P.y > ol[1].y) ol[1].y = P.y * 1;
      }
              // ends path nd draws
      canvas.closePath();
      canvas.stroke();
      canvas.fill();
    }
    
    if(outline) {
      canvas.strokeStyle = olColor;
      canvas.beginPath();
      canvas.moveTo(ol[0].x, ol[0].y);
      canvas.lineTo(ol[1].x, ol[0].y);
      canvas.lineTo(ol[1].x, ol[1].y);
      canvas.lineTo(ol[0].x, ol[1].y);
      canvas.closePath();
      canvas.stroke();
    }
    
    if(vhs) {
      if(ol[1].x > dx*2) {automove.x = -5; tx = mycan.width/2 - (ol[1].x - (tx + mycan.width/2))}
      else if(ol[0].x < 0) {automove.x = 5; tx -= ol[0].x}
      
      if(ol[1].y > dy*2) {automove.y = -5; ty = mycan.height/2 - (ol[1].y - (ty + mycan.height/2))}
      else if(ol[0].y < 0) {automove.y = 5; ty -= ol[0].y}
    }
  }
}

function ParentObj3D(obj) {
  this.base = obj.base;
  this.vertices = obj.vertices;
  this.subObjs = obj.subObjs;
  this.size = obj.size;
  this.orientation = [0, 0, 0];
}

function SubObj3D(obj) {
  this.polygons = obj.polygons;
}

function loadObj(size, fileString) {
  var subObjs = (fileString.indexOf("o ") > -1) ? fileString.split("o ") : fileString.split("g ");
  // subObjs.shift();
  var parent = {vertices: [new Vert3(0, 0, 0)], base:[new Vert3(0, 0, 0)],  subObjs: [], size: size/2};
  
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
        parent.vertices.push(new Vert3(temp[1+jkrowling], temp[2+jkrowling], temp[3+jkrowling]));
        parent.base.push(new Vert3(temp[1+jkrowling], temp[2+jkrowling], temp[3+jkrowling]));
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
    if(out.polygons.length > 0) parent.subObjs.push(new SubObj3D(out));
  }
  // pushes parent object to the objects array
  objects.push(new ParentObj3D(parent));
  render([objects[0]], canvas, mycan.width/2, mycan.height/2);
}

function loadFile(e) {
  var reader = new FileReader(), input = e.target.files, elm = document.getElementById("objInput"), size = document.getElementById("size"), counter = 0;
  reader.onload = function() {
    var out = reader.result;
    loadObj(size.value, out);
  };
  
  reader.readAsText(input[0]);
  
  reader.onloadend = function() {
    counter++;
    if(counter < input.length-1) reader.readAsText(input[counter]);
  };
  
  elm.removeEventListener("change", loadFile);
  elm.parentNode.removeChild(elm);
  size.parentNode.removeChild(size);
  
  inter = setInterval(loop, 50);
}

function loop() {
  for(var i = 0, base; i < objects.length; i++) {
    
    if(active == "r" && rotMode < 0) {objects[i].orientation = [axes[3]*90, axes[2]*90, false]}
    else if(active == "l" && rotMode < 0) {objects[i].orientation[0] += axes[1]*5; objects[i].orientation[1] += axes[0]*5; objects[i].orientation[2] = false}
    else if(rotMode > 0) {objects[i].orientation[0] += 1; objects[i].orientation[1] -= 1; objects[i].orientation[2] = false; if(vhs) {tx += automove.x; ty += automove.y}}
  }
  render(objects, canvas, (mycan.width/2), mycan.height/2);
}

function mak(event) {
  if(event.type == "mousemove" && rotMode < 0) {
    mkb.x = event.x; mkb.y = event.y;
    objects[0].orientation[1] = (mkb.x/mycan.width)*180;
    objects[0].orientation[0] = (mkb.y/mycan.height)*180;
  } else if(event.type == "keypress" && rotMode < 0) {
    switch(event.keyCode) {
      // W
      case 119:
        ty -= speed;
        break;
      // A
      case 97:
        tx -= speed;
        break;
      // S
      case 115:
        ty += speed;
        break;
      // D
      case 100:
        tx += speed;
        break;
    }
  } else if(event.type == "keyup") {
    switch(event.keyCode) {
      // Q
      case 81:
        active = (active == "m" && controllers[0] !== undefined) ? "l" : "m";
        break;
      // R
      case 82:
        rotMode *= -1;
        break;
      // V
      case 86:
        vhs = (vhs) ? false : true;
        if(rotMode < 0) rotMode *= -1;
        break;
      case 67:
        outline = (outline) ? false : true;
        break;
      // Minus
      case 189:
        objects[0].size -= 2;
        break;
      // Plus
      case 187:
        objects[0].size += 2;
        break;
    }
  }
}

function inputLoop() {
  if(active !== "m") {
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

    objects[0].size += buttons[7].value;
    objects[0].size -= buttons[6].value;
    
    tx += (buttons[15].value - buttons[14].value)*speed;
    ty += (buttons[13].value - buttons[12].value)*speed;
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

window.addEventListener("resize", ()=>{mycan.width = mycan.offsetWidth; mycan.height = mycan.offsetHeight; render([objects[0]], canvas, mycan.width/2, mycan.height/2)});
window.addEventListener("gamepadconnected", addController);
window.addEventListener("gamepaddisconnected", removeController);
window.addEventListener("mousemove", mak);
window.addEventListener("keypress", mak);
window.addEventListener("keyup", mak);
document.getElementById("objInput").addEventListener("change", loadFile);