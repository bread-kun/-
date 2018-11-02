"use strict"
!(function(w) {if (!w) return null;w.$z = new (function() {
	const HORIZONTAL = 0;
	const VERTICAL = 1;
	var that = this;

	// @description		2D zoom base vertex
	// @param	x,y 	x,y value of a point in canvas
	var Vertex2D = function(x, y) {
	   	this.x = parseFloat(x);
	   	this.y = parseFloat(y);
	};

	// @description		3D zoom base vertex
	// @param	x,y,z   x,y,z value of a point in zoom
	var Vertex = function (x,y,z) {
		this.x = parseFloat(x);
		this.y = parseFloat(y);
		this.z = parseFloat(z);
		this.toString = function() {
			return "(" + this.x + "," + this.y + "," + this.z + ")";
		}
	}

	// @description 	draw a Positive polyhedron
	// @param	  n 	more n more like ball
	//		 radius		radius
	// 		 center_point	center point of target object
	var Ball = function (n, radius, center_point) {
		function MyBall(vertices,faces) {
			this.vertices = vertices;
			this.faces = [];
			console.log(faces);
			for (var i = 0; i < faces.length; i++) {
				var face = [];
				for (var j = 0; j < faces[i].length; j++) {
					face.push(this.vertices[faces[i][j]]);
				}
				this.faces.push(face);
			}
		}
		if (!n%2) throw "Error param in n="+n;
		let r = radius, cp = center_point;

		///////////////////////// make vertices
		// degree
		let d = 360/n;
		let sin = Math.sin, cos = Math.cos;
		this.vertices = [];
		let t_vertices = [];
		// last bottom vertex
		let last_vertex;
		// set a Basis vectors on the x axis (r, 0, 0)
		t_vertices.push(new Vertex(r, 0, 0));
		// Rotating around y axis for (n-1) times
		for (var i = 1; i <= n/2; i++) {
			t_vertices.push(rotate(t_vertices[0], toRadians(d*i), 'y', org_p))
		}
		last_vertex = t_vertices.pop();
		console.log("generating ball in rotating around y axis ->",t_vertices);
		// then , all vertices rotating around z axis for (n/2 -1) times [ignore vertice whitch on the z axis]
		let t_t_vertices = t_vertices.slice();
		for (var i = 1; i < n; i++) {
			for (var j = 1; j < t_t_vertices.length; j++) {
				t_vertices.push(rotate(t_vertices[j], toRadians(d*i), 'x', org_p))
			}
		}
		t_vertices.push(last_vertex);
		delete t_t_vertices;
		console.log("generating ball in rotating around x axis ->",t_vertices)
		
		///////////////////////// make faces
		// link every point each distence is 2*r*sin$ and 2*sqrt(2)*r*sin$
		var faces = [];
		var _nears = [];
		var _pa;
		var _pb;
		var _dist = 2*radius*Math.sin(toRadians(d));
		var _step = n/2-1;
		for (var i = 0,j = 1; i < n; i++, j++) {
			faces.push([0,1+i*_step,(1+j*_step)%(t_vertices.length-2)]);
			faces.push([t_vertices.length-1,_step+i*_step,(_step+j*_step)%(t_vertices.length-2)]);
		}
		for (var i = 1; i < n/2-1; i++) {
			for (var j = 0,k = 1; j < n; j++,k++) {
				faces.push([i+j*_step,(i+k*_step)%(t_vertices.length-2),(i+k*_step)%(t_vertices.length-2)+1,i+j*_step+1])
			}
		}
		// for (var i = 0; i < t_vertices.length; i++) {
		// 	// link three point to be a face, first point should in distence 2*r*sin$
		// 	_nears.length = 0;
		// 	_pa = t_vertices[i];
		// 	for (var _cp = 0; _nears.length < n && _cp < t_vertices.length; _cp++) {
		// 		if (_pa === t_vertices[_cp])
		// 			continue;
		// 		console.log("=============",_pa, t_vertices[cp]);
		// 		if (distence(_pa, t_vertices[cp]).toFixed(8) == (_dist*_dist).toFixed(8))
		// 			_nears.push(_cp);
		// 	}
		// 	console.log("++ point ++ " + _pa.say() + " nears is --");
		// 	console.log(_nears.slice());
		// 	t_t_vertices = _nears.slice();
		// 	for (var j = 0; j < t_t_vertices.length; j++) {
		// 	}
		// }
		return new MyBall(t_vertices,faces);
	}

	// // generate the cube
	// var Cube = function(center_point, size) {
	// 	let d = size / 2;
	// 	this.vertices = [
	// 		new Vertex(center_point.x - d, center_point.y - d, center_point.y + d),
	// 		new Vertex(center_point.x + d, center_point.y - d, center_point.y + d),
	// 		new Vertex(center_point.x - d, center_point.y + d, center_point.y + d),
	// 		new Vertex(center_point.x + d, center_point.y + d, center_point.y + d),
	// 		new Vertex(center_point.x - d, center_point.y + d, center_point.y - d),
	// 		new Vertex(center_point.x + d, center_point.y + d, center_point.y - d),
	// 		new Vertex(center_point.x - d, center_point.y - d, center_point.y - d),
	// 		new Vertex(center_point.x + d, center_point.y - d, center_point.y - d),
	// 	];
	// 	// Generate the faces
	//    	this.faces = [
	//    	    [this.vertices[0], this.vertices[1], this.vertices[3], this.vertices[2]],
	//    	    [this.vertices[2], this.vertices[3], this.vertices[5], this.vertices[4]],
	//    	    [this.vertices[0], this.vertices[2], this.vertices[4], this.vertices[6]],
	//    	    [this.vertices[1], this.vertices[3], this.vertices[5], this.vertices[7]],
	//    	    [this.vertices[0], this.vertices[1], this.vertices[7], this.vertices[6]],
	//    	    [this.vertices[4], this.vertices[5], this.vertices[7], this.vertices[6]]
	//    	];
	// }

	// @description		change a angle to arc(radian)
	// @param	degree	input degree
	// @return 	radian  arc system value
	function toRadians(degree){
		return Math.PI*(degree/180%2);
	}
	// @description		get the distence between point_a and point_b
	// @param	a,b		two Vertex (whatever 3D or 2D vertex,but both should be in same Dimension())
	// 			sqrtflag	default true, if false, there will use sqrt function to get the detail distence, or not just for compare
	function distence(point_a, point_b, sqrtflag) {
		let res;
		let a = point_a	|| null, b = point_b || null;
		let issqrt = sqrtflag || true;
		if (!a&b) throw "Error param number in distence	";
		// 2D vertex distence calculate
		if (a instanceof Vertex2D && b instanceof Vertex2D){
			res = (a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y);
		// 3D vertex distence calculate
		} else if (a instanceof Vertex && b instanceof Vertex) {
			res = (a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y) + (a.z-b.z)*(a.z-b.z);
		// fast way Array vertex distence calculate
		} else if (a instanceof Array && b instanceof Array) {
			if (a.length === 3 && 3 === b.length) {
				res = (a[0]-b[0])*(a[0]-b[0]) + (a[1]-b[1])*(a[1]-b[1]) + (a[2]-b[2])*(a[2]-b[2]);
			} else if (a.length === 2 && 2 === b.length) {
				res = (a[0]-b[0])*(a[0]-b[0]) + (a[1]-b[1])*(a[1]-b[1]);
			} else {
				throw Error("Error length with point_a" + point_a + " and point_b " + point_b);
			}
		}
		return issqrt?Math.sqrt(res):res;
	}

	// @description		mapping 3D Vertex to 2D Vertex
	// @param	V 		3D Vertex
	//			carmera carmera instance
	function mapping(V, carmera) {
	   	// global variable distance , mean distance between camera center and canvas plane
	   	return new Vertex2D(((V.x*2 - carmera.x)*distance/(carmera.z-V.z/3)), (canvas_H/2 - (V.y*2 - carmera.y)*distance/(carmera.z-V.z/3)));
	}

	// 粉刷
	// @description		a important function to paint object on canvas
	// @param	objects	list of objects
	function render(objects, ctx, dx, dy) {
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
		ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';
		// ctx.clearRect(0,0, canvas_W, canvas_H);
		// For each object
		for (var i = 0, n_obj = objects.length; i < n_obj; ++i) {
			// For each face
			for (var j = 0, n_faces = objects[i].faces.length; j < n_faces; ++j) {
				// Current face
				var face = objects[i].faces[j];
				// Draw the first vertex
				var P = mapping(face[0]);
				ctx.beginPath();
				ctx.moveTo(P.x + dx, P.y + dy);
				console.log("moveTo " + (P.x + dx) + " , " + (P.y + dy));
				// Draw the other vertices
				// 绘制其余顶点
				for (var k = 1; k < face.length; k++) {
					P = mapping(face[k]);
					ctx.lineTo(P.x + dx, P.y + dy);
					console.log("draw to " + (P.x + dx) + " , " + (P.y + dy));
				}
				// Close the path and draw the face
				ctx.closePath();
				ctx.stroke();
				ctx.fill();
	       }
	   }
	}
	// @description		draw objcet without perspective
	// @param	objects	list of objects
	// 			carmera carmera instance
	// 			
	function paint(objects, ctx, carmera, dx, dy) {
		var crm = carmera;
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
		ctx.fillStyle = 'rgba(0, 150, 255, 0.9)';
		// get a list of center point of a face with carmera
		function get_judge_vals(obj, carmera) {
			var _judge_vals = [];
			// center point
			var c_p;
			// face length of vertices
			var f_len = 0;
			for (var i = 0; i < obj.faces.length; i++) {
				// center point of a face
				var _sum_x = _sum_y = _sum_z = 0;
				f_len = obj.faces[i].length;
				for (var _f = 0; _f < f_len; _f++) {
					// every point of current face
					var _p = obj.faces[i][_f];
					try{
						_sum_x += _p.x;
						_sum_y += _p.y;
						_sum_z += _p.z;
					}catch(e){
						console.log(i,_f);
						console.log(_p);
						throw e;
					}
				}
				c_p = new Vertex(_sum_x/f_len, _sum_y/f_len, _sum_z/f_len);
				_judge_vals.push(((c_p.x - carmera.x)*(c_p.x - carmera.x) + (c_p.y - carmera.y)*(c_p.y - carmera.y) + (c_p.z - carmera.z)*(c_p.z - carmera.z)));
			}
			return _judge_vals;
		}
		// return a list of source index and sorted by source list value
		function get_order_list(list) {
			console.log("sorting list:", list);
			var _t_l = [];
			for (var i = 0; i < list.length; i++) {
				_t_l.push({idx:i,val:list[i]});
			}
			_t_l.sort(function(a,b) {return a.val<b.val})
			var res = [];
			for (var i = 0; i < _t_l.length; i++) {
				res.push(_t_l[i].idx);
			}
			return res;
		}
		// For each object
		for (var i = 0, n_obj = objects.length; i < n_obj; i++) {
			var _judge_vals = get_order_list(get_judge_vals(objects[i], crm));
			// For each face
			for (var j = 0, n_faces = objects[i].faces.length; j < n_faces; j++) {
				// Current face
				var f_i = _judge_vals[j];
				var face = objects[i].faces[f_i];
				// Draw the first vertex
				var P = mapping(face[0], crm);
				ctx.beginPath();
				ctx.moveTo(P.x + dx, P.y + dy);
				// Draw the other vertices
				for (var k = 1; k < face.length; k++) {
					P = mapping(face[k], crm);
					ctx.lineTo(P.x + dx, P.y + dy);
				}
				// Close the path and draw the face
				ctx.closePath();
				ctx.stroke();
				ctx.fill("evenodd");
	       }
	   }
	}

	function draw_Axis(carmera) {
        let crm = carmera;
        let _org = mapping(new Vertex(0,0,0), crm);
        let eager_xyz = [new Vertex(99999, 0, 0),new Vertex(0, 99999, 0),new Vertex(0,0, carmera.z - 1)];
        let eager_color = ['rgba(60,240,60,0.35)','rgba(60,60,240,0.35)','rgba(240,60,60,0.35)'];
        for (let i = 2; i >= 0; i--) {
            ctx.beginPath();
            ctx.moveTo(_org.x, _org.y);
            ctx.strokeStyle = eager_color[i];
            var _e = mapping(eager_xyz[i], crm);
            ctx.lineTo(_e.x, _e.y);
            ctx.stroke();
        }
    }
    function carmera_rotate() {
    	// body...
    }
    // AntiClock rotate
    function rotate(target_vertex, rotate, axis, around_point) {
    	// decimal format
    	var _deci = 8;
    	var _rotate = function(target_vertex, rotate, axis, around_point) {
    		// body...
    	}
    	if (rotate!= null ) {
    		var _s = Math.sin(rotate).toFixed(_deci);
    		var _c = Math.cos(rotate).toFixed(_deci);
    	}
    	let org_res = [];
    	let a_p = around_point || org_p;
    	if (axis == "x") {
    		let matrix = [[1,0,0],[0,_c,-_s],[0,_s,_c]];
    		org_res = [target_vertex.x, matrix[1][1]*target_vertex.y + matrix[2][1]*target_vertex.z, matrix[1][2]*target_vertex.y + matrix[2][2]*target_vertex.z];
    	}else if (axis == "y") {
    		let matrix = [[_c,0,-_s],[0,1,0],[_s,0,_c]];
    		org_res = [matrix[0][0]*target_vertex.x + matrix[2][0]*target_vertex.z, target_vertex.y, matrix[0][2]*target_vertex.x + matrix[2][2]*target_vertex.z];
    		console.log(_s,_c);
    		console.log(org_res)
    	}else if (axis == "z") {
    		let matrix = [[_c,_s,0],[-_s,_c,0],[0,0,1]];
    		org_res = [matrix[0][0]*target_vertex.x + matrix[1][0]*target_vertex.y, matrix[0][1]*target_vertex.x + matrix[1][1]*target_vertex.y, target_vertex.z];
    	}else{
    		console.log("Error rotate axis ",axis);
    		return null;
    	}
    	var _v = new Vertex(org_res[0]+a_p.x, org_res[1]+a_p.y, org_res[2]+a_p.z);
    	let _t = target_vertex;
    	console.log("rotating Vertex ("+_t.x + ',' + _t.y + ',' + _t.z +") to ("+_v.x + ',' + _v.y + ',' + _v.z +")");
    	return _v;
    }

    function re_draw(ctx) {
        ctx.clearRect(0,0,canvas_W,canvas_H);
        draw_Axis(carmera);
        paint(objects, ctx, carmera, 0, 0);
    }

	function drawCube(mix_vertex, max_vertex) {
		var cube = [];
		
		// body...
	}
	// source point (0,0,0)
	const org_p = new Vertex(0,0,0);
	that.__proto__ = {Vertex2D:Vertex2D,Vertex:Vertex,Cube:Cube,draw_Axis:draw_Axis,re_draw:re_draw,Ball:Ball,t_rotate:rotate
	}
})()})(window)