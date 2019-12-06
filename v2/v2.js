class Matrix {
	constructor(rows, cols) {
		this.m = ("0".repeat(rows).split("")).map((item) => {return ("0".repeat(cols).split("")).map((item2)=>{return parseInt(item2)})});
		this.rows = this.m.length;
		this.cols = this.m[0].length;
	}
}

class Vec4 {
	constructor(...coords) {
		this.x; this.y; this.z; this.w;
		this.quick_assign(...coords);
	}

	mlt4x4(mat) {
		if(isNaN(mat.m[0][0])) console.error("this aint a matrix chief");
		var temp = new Vec4(0, 0, 0, 0);
		temp.x = this.x * mat.m[0][0] + this.y * mat.m[0][1] + this.z * mat.m[0][2] + this.w * mat.m[0][3];
		temp.y = this.x * mat.m[1][0] + this.y * mat.m[1][1] + this.z * mat.m[1][2] + this.w * mat.m[1][3];
		temp.z = this.x * mat.m[2][0] + this.y * mat.m[2][1] + this.z * mat.m[2][2] + this.w * mat.m[2][3];
		temp.w = this.x * mat.m[3][0] + this.y * mat.m[3][1] + this.z * mat.m[3][2] + this.w * mat.m[3][3];
		return temp;
	}

	div4x4(mat) {
		if(isNaN(mat.m[0][0])) console.error("this aint a matrix chief");
		var temp = new Vec4(0, 0, 0, 0);
		temp.x = this.x / mat.m[0][0] + this.y / mat.m[0][1] + this.z / mat.m[0][2] + this.w / mat.m[0][3];
		temp.y = this.x / mat.m[1][0] + this.y / mat.m[1][1] + this.z / mat.m[1][2] + this.w / mat.m[1][3];
		temp.z = this.x / mat.m[2][0] + this.y / mat.m[2][1] + this.z / mat.m[2][2] + this.w / mat.m[2][3];
		temp.w = this.x / mat.m[3][0] + this.y / mat.m[3][1] + this.z / mat.m[3][2] + this.w / mat.m[3][3];
		return temp;
	}

	addVec(vec4) {
		return new Vec4(this.x+vec4.x, this.y+vec4.y, this.z+vec4.z, this.w+vec4.w);
	}

	subVec(vec4) {
		return new Vec4(this.x-vec4.x, this.y-vec4.y, this.z-vec4.z, this.w-vec4.w);
	}

	mltScalar(scalar) {
		return new Vec4(this.x*scalar, this.y*scalar, this.z*scalar, this.w*scalar);
	}

	divScalar(scalar) {
		return new Vec4(this.x/scalar, this.y/scalar, this.z/scalar, this.w/scalar);
	}

	quick_assign(...coords) {
		if(typeof(coords[0]) == "object") {
			this.x = coords[0].x;
			this.y = coords[0].y;
			this.z = coords[0].z;
			this.w = (!isNaN(coords[0].w)) ? coords[0].w : 1;
		} else if(coords.length < 4) {
			console.warn(); ("this requires 4 arguments or an object dumbass");
		} else {
			this.x = parseFloat(coords[0]);
			this.y = parseFloat(coords[1]);
			this.z = parseFloat(coords[2]);
			this.w = parseFloat(coords[3]);
		}
	}
}

class Vec3 {
	constructor(...coords) {
		this.x; this.y; this.z;
		this.quick_assign(...coords);
	}

	mlt3x3(mat) {
		if(isNaN(mat.m[0][0])) console.error("this aint a matrix chief");
		var temp = new Vec3(0, 0, 0);
		temp.x = this.x * mat.m[0][0] + this.y * mat.m[0][1] + this.z * mat.m[0][2];
		temp.y = this.x * mat.m[1][0] + this.y * mat.m[1][1] + this.z * mat.m[1][2];
		temp.z = this.x * mat.m[2][0] + this.y * mat.m[2][1] + this.z * mat.m[2][2];
		return temp;
	}

	div3x3(mat) {
		if(isNaN(mat.m[0][0])) console.error("this aint a matrix chief");
		var temp = new Vec3(0, 0, 0);
		temp.x = this.x / mat.m[0][0] + this.y / mat.m[0][1] + this.z / mat.m[0][2];
		temp.y = this.x / mat.m[1][0] + this.y / mat.m[1][1] + this.z / mat.m[1][2];
		temp.z = this.x / mat.m[2][0] + this.y / mat.m[2][1] + this.z / mat.m[2][2];
		return temp;
	}

	addVec(vec3) {
		return new Vec3(this.x+vec3.x, this.y+vec3.y, this.z+vec3.z);
	}

	subVec(vec3) {
		return new Vec3(this.x-vec3.x, this.y-vec3.y, this.z-vec3.z);
	}

	mltScalar(scalar) {
		return new Vec3(this.x*scalar, this.y*scalar, this.z*scalar);
	}

	divScalar(scalar) {
		return new Vec3(this.x/scalar, this.y/scalar, this.z/scalar);
	}

	quick_assign(...coords) {
		if(typeof(coords[0]) == "object" && !isNaN(coords[0].z)) {
			this.x = coords[0].x;
			this.y = coords[0].y;
			this.z = coords[0].z;
		} else if(coords.length < 3) {
			console.error("this requires 3 arguments or an object dumbass");
		} else {
			this.x = parseFloat(coords[0]);
			this.y = parseFloat(coords[1]);
			this.z = parseFloat(coords[2]);
		}
	}
}

class Vec2 {
	constructor(...coords) {
		if(typeof(coords[0]) == "object") {
			this.x = coords[0].x;
			this.y = coords[0].y;
		} else if(coords.length < 2) {
			console.error("this requires 2 arguments or an object dumbass");
		} else {
			this.x = parseFloat(coords[0]);
			this.y = parseFloat(coords[1]);
		}
	}

	addVec(vec2) {
		return new Vec2(this.x+vec2.x, this.y+vec2.y);
	}

	subVec(vec2) {
		return new Vec2(this.x-vec2.x, this.y-vec2.y);
	}
}

class ChildMesh3d {
	constructor(...coords) {
		this.polygons = [];
		this.coords = new Vec3(...coords);
	}
}

class ParentMesh3d {
	constructor(...coords) {
		this.vertices = [];
		this.base;
		this.children = [];
		this.coords = new Vec3(...coords);
	}
}

class Polygon {
	constructor() {
		this.vecs = [];
		this.zval = -Infinity;
	}

	updateZval() {
		for(var i = 0; i < this.vecs.length; i++) {	if(this.vecs[i].z > this.zval) this.zval = this.vecs[i].z; }
	}
}

class Camera {
	constructor(...coords) {
		this.x; this.y; this.z;
		this.quick_assign(...coords);
		this.base = new Vec3(this);
		this.fov = 90;
		this.f;
		this.q;
		this.orientation = [0, 0, 0];
		this.view_max = 250;
		this.view_min = 10;
	}

	quick_assign(...coords) {
		if(typeof(coords[0]) == "object" && !isNaN(coords[0].z)) {
			this.x = coords[0].x;
			this.y = coords[0].y;
			this.z = coords[0].z;
		} else if(coords.length < 3) {
			console.error("camera's position is supposed to be set with a Vec3");
		} else {
			this.x = parseFloat(coords[0]);
			this.y = parseFloat(coords[1]);
			this.z = parseFloat(coords[2]);
		}
	}

	rotate(deg_x, deg_y, deg_z) {
		this.orientation = [(360 + deg_x + this.orientation[0])%360, (360 + deg_y + this.orientation[1])%360, (360 + deg_z + this.orientation[2])%360];
		Engine.rotate(this, this.base, ...this.orientation);
	}

	rotateTo(deg_x, deg_y, deg_z) {
		this.orientation = [(360 + deg_x)%360, (360 + deg_y)%360, (360 + deg_z)%360];
		Engine.rotate(this, this.base, ...this.orientation);
	}
}

class World {
	constructor(world_size_x, world_size_y, world_size_z) {
		this.dimensions = new Vec3(world_size_x, world_size_y, world_size_z);
		this.objects = [];
	}
}

class Engine {
	constructor(canvas_context, world_size_x, world_size_y, world_size_z) {
		this.camera = new Camera(new Vec3(0, 0, 0));
		this.world = new World(world_size_x, world_size_y, world_size_z);
		this.ctx = canvas_context; this.screen_height; this.screen_width; this.aspect_ratio;
		this.resizeScreen();
		this.afr;
		window.addEventListener("resize", this.resizeScreen);
	}

	static rotateX(vec3, deg) {
		var base = new Vec3(vec3), mat = new Matrix(3, 3), rad = ((360 + deg)%360) * Math.PI/180, cos = Math.cos(rad), sin = Math.sin(rad);
		mat.m[0] = [1, 0, 0]; mat.m[1] = [0, cos, -sin]; mat.m[2] = [0, sin, cos];
		vec3.quick_assign(base.mlt3x3(mat));
	}

	static rotateY(vec3, deg) {
		var base = new Vec3(vec3), mat = new Matrix(3, 3), rad = ((360 + deg)%360) * Math.PI/180, cos = Math.cos(rad), sin = Math.sin(rad);
		mat.m[0] = [cos, 0, sin]; mat.m[1] = [0, 1, 0]; mat.m[2] = [-sin, 0, cos];
		vec3.quick_assign(base.mlt3x3(mat));
	}

	static rotateZ(vec3, deg) {
		var base = new Vec3(vec3), mat = new Matrix(3, 3), rad = ((360 + deg)%360) * Math.PI/180, cos = Math.cos(rad), sin = Math.sin(rad);
		mat.m[0] = [cos, -sin, 0]; mat.m[1] = [sin, cos, 0]; mat.m[2] = [0, 0, 1];
		vec3.quick_assign(base.mlt3x3(mat));
	}

	static rotate(vec, base, deg_x, deg_y, deg_z) {
		var noRef = new Vec3(base);

		if(deg_y) Engine.rotateY(noRef, deg_y);
		if(deg_z) Engine.rotateZ(noRef, deg_z);
		if(deg_x) Engine.rotateX(noRef, deg_x);

		vec.quick_assign(noRef);
	}


	get projection_matrix() {
		var mat = new Matrix(4, 4); this.camera.q = this.camera.view_max/(this.camera.view_max-this.camera.view_min); this.camera.f = 1/(Math.tan(this.camera.fov/2)*(180/3.14));
		mat.m[0] = [this.aspect_ratio*this.camera.f, 0,             0,                                   0];
		mat.m[1] = [0,                               this.camera.f, 0,                                   0];
		mat.m[2] = [0,                               0,             this.camera.q,                       1];
		mat.m[3] = [0,                               0,             -this.camera.view_min*this.camera.q, 0];
		return mat;
	}

	loop() {
		this.afr = requestAnimationFrame(this.loop);
	}

	start() {
		this.afr = requestAnimationFrame(this.loop);
	}

	pause() {
		cancelAnimationFrame(this.afr);
	}

	loadObjFile(fileString) {
		var childStrings = (fileString.indexOf("o ") > -1) ? fileString.split("o ") : fileString.split("g "),
				parent = new ParentMesh3d(new Vec3(0, 0, 0));
		for(var i = 0, j, k, line, temp, child; i < childStrings.length; i++) {
			child = new ChildMesh3d(parent.coords);
			childStrings[i] = childStrings[i].split("\n");

			for(j = 0; j < childStrings[i].length; j++) {
				line = childStrings[i][j].replace(/\s+/g, " ").split(" ");
				if(line[0] != "v") continue;
				parent.vertices.push(new Vec3(line[1], line[2], line[3]));
			}

			for(j = 0; j < childStrings[i].length; j++) {
				line = childStrings[i][j].replace(/\s+/g, " ").split(" ").map(item => item.split("/"));
				if(line[0] != "f") continue;
				temp = new Polygon();
				for(k = 1; k < line.length; k++) { temp.vecs.push(parent.vertices[parseInt(line[k][0])-1]); }
				temp.updateZval();
				child.polygons.push(temp);
			}

			if(child.polygons.length > 0) parent.children.push(child);
		}
		this.world.objects.push(parent);
	}

	drawPolygon(vecs) {
		var P = vecs[0], ctx = this.ctx;
		P.x = (P.x + 1) * 0.5 * this.screen_width;
		P.y = (P.y + 1) * 0.5 * this.screen_height;
		ctx.beginPath();
		ctx.moveTo(P.x, P.y);
		for(var i = 1; i < vecs.length; i++) {
			P = vecs[i];
			P.x = (P.x + 1) * 0.5 * this.screen_width;
			P.y = (P.y + 1) * 0.5 * this.screen_height;
			ctx.lineTo(P.x, P.y);
		}
		ctx.closePath();
		ctx.stroke();
	}

	project(vec3, mat) {
		vec3.addVec(new Vec3(0, 0, 3));
		var temp = new Vec4(vec3).mlt4x4(mat),
		projected = (temp.w != 0) ? temp.divScalar(temp.w) : temp;
		return projected;
	}

	render() {
		var mat = this.projection_matrix;
		this.ctx.clearRect(0, 0, this.screen_width, this.screen_height);

		for(var i = 0, j, k, vecs; i < this.world.objects.length; i++) {
			for(j = 0; j < this.world.objects[i].children.length; j++) {
				this.world.objects[i].children[j].polygons.sort((a, b) => (a.zval > b.zval) ? -1 : 1);
				for(k = 0; k < this.world.objects[i].children[j].polygons.length; k++) {
					vecs = Array.from(this.world.objects[i].children[j].polygons[k].vecs);
					vecs.map(item => this.project(item, mat));
					this.drawPolygon(vecs);
				}
			}
		}
	}

	resizeScreen() {
		this.screen_height = document.documentElement.clientHeight;
		this.screen_width = document.documentElement.clientWidth;
		this.ctx.canvas.width = this.screen_width;// this.ctx.canvas.offsetWidth;
		this.ctx.canvas.height = this.screen_height;// this.ctx.canvas.offsetHeight;
		this.aspect_ratio = this.screen_height / this.screen_width;
	}
}
