!(function(w) {if (!w) return null;w.$z = new (function() {
	
	var that = this;

	// mapping on the canvas x^y
	var Vertex2D = function(x, y) {
	   	this.x = parseFloat(x);
	   	this.y = parseFloat(y);
	};

	// defind base node type
	var Vertex = function (x,y,z) {
		this.x = parseFloat(x);
		this.y = parseFloat(y);
		this.z = parseFloat(z);
	}

	// draw a Positive polyhedron
	// @param n  more n more like ball
	//		  radius	radius
	// 		  center_point
	var Ball = function (n, radius, center_point) {
		if (!n%2) throw "Error param in n="+n;
		let r = radius, cp = center_point;
		// degree
		let d = 180/n;
		let sin = Math.sin, cos = Math.cos;
		this.vertices = [];
		let t_vertices = [];
		// set a Basis vectors on the x axis (r, 0, 0)
		t_vertices.push(new Vertex(r, 0, 0));
		// Rotating around y axis for (n-1) times
		for (var i = 1; i < n; i++) {
			t_vertices.push(rotate(t_vertices[0], toRadians(d*i), 'y', org_p))
		}
		console.log("generating ball in rotating around y axis ->",t_vertices);
		// then , all vertices rotating around z axis for (n/2 -1) times [ignore vertice whitch on the z axis]
		let t_t_vertices = t_vertices.slice();
		for (var i = 1; i < n/2; i++) {
			for (var i = 0; i < t_t_vertices.length; i++) {
				if (t_t_vertices[i].z === 0)
					continue;
				t_vertices.push(rotate(t_vertices[0], toRadians(d*i), 'z', org_p))
			}
		}
		delete t_t_vertices;
		console.log("generating ball in rotating around z axis ->",t_vertices)
		return t_vertices;
		//////////////////
	}

	// generate the cube
	var Cube = function(center_point, size) {
		let d = size / 2;
		this.vertices = [
			new Vertex(center_point.x - d, center_point.y - d, center_point.y + d),
			new Vertex(center_point.x + d, center_point.y - d, center_point.y + d),
			new Vertex(center_point.x - d, center_point.y + d, center_point.y + d),
			new Vertex(center_point.x + d, center_point.y + d, center_point.y + d),
			new Vertex(center_point.x - d, center_point.y + d, center_point.y - d),
			new Vertex(center_point.x + d, center_point.y + d, center_point.y - d),
			new Vertex(center_point.x - d, center_point.y - d, center_point.y - d),
			new Vertex(center_point.x + d, center_point.y - d, center_point.y - d),
		];
		// Generate the faces
	   	this.faces = [
	   	    [this.vertices[0], this.vertices[1], this.vertices[3], this.vertices[2]],
	   	    [this.vertices[2], this.vertices[3], this.vertices[5], this.vertices[4]],
	   	    [this.vertices[0], this.vertices[2], this.vertices[4], this.vertices[6]],
	   	    [this.vertices[1], this.vertices[3], this.vertices[5], this.vertices[7]],
	   	    [this.vertices[0], this.vertices[1], this.vertices[7], this.vertices[6]],
	   	    [this.vertices[4], this.vertices[5], this.vertices[7], this.vertices[6]]
	   	];
	}
	// @param degree	degree
	// @return radian  input a number of degree and return a radian
	function toRadians(degree){
		return Math.PI*degree/180%2;
	}
	function mapping(V, carmera) {
	   	// Distance between the camera and the plane
	   	return new Vertex2D((canvas_W/2 + (V.x - carmera.x)*distance/(carmera.z-V.z)), (canvas_H/2 - (V.y - carmera.y)*distance/(carmera.z-V.z)));
	}

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
	// draw objcet without perspective
	function paint(objects, ctx, carmera, dx, dy) {
		var crm = carmera;
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
		ctx.fillStyle = 'rgba(0, 150, 255, 0.9)';
		// get a list of center point of a face with carmera
		function get_judge_vals(obj, carmera) {
			var _judge_vals = [];
			// center point
			var c_p;
			var f_len = 0;
			for (var i = 0; i < obj.faces.length; i++) {
				// center point of a face
				var _sum_x = _sum_y = _sum_z = 0;
				f_len = obj.faces[i].length;
				for (var _f = 0; _f < f_len; _f++) {
					// every point of current face
					var _p = obj.faces[i][_f];
					_sum_x += _p.x;
					_sum_y += _p.y;
					_sum_z += _p.z;
				}
				c_p = new Vertex(_sum_x/f_len, _sum_y/f_len, _sum_z/f_len);
				_judge_vals.push(((c_p.x + carmera.x)*(c_p.x + carmera.x) + (c_p.y + carmera.y)*(c_p.y + carmera.y) + (c_p.z + carmera.z)*(c_p.z + carmera.z)));
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
			_t_l.sort(function(a,b) {return a.val>b.val})
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
    // AntiClock rotate
    function rotate(target_vertex, rotate, axis, around_point) {
    	var _rotate = function(target_vertex, rotate, axis, around_point) {
    		// body...
    	}
    	if (rotate!= null ) {
    		var _s = Math.sin(rotate);
    		var _c = Math.cos(rotate)
    	}
    	let org_res = [];
    	let a_p = around_point || org_p;
    	if (axis == "x") {
    		let matrix = [[1,0,0],[0,_c,-_s],[0,_s,_c]];
    		org_res = [matrix[0][0]*target_vertex.x, matrix[1][1]*target_vertex.y + matrix[2][1]*target_vertex.y, matrix[2][1]*target_vertex.z + matrix[2][2]*target_vertex.z];
    	}else if (axis == "y") {
    		let matrix = [[_c,0,_s],[0,1,0],[-_s,0,_c]];
    		org_res = [matrix[0][0]*target_vertex.x, matrix[1][1]*target_vertex.y + matrix[2][1]*target_vertex.y, matrix[2][1]*target_vertex.z + matrix[2][2]*target_vertex.z];
    	}else if (axis == "z") {
    		let matrix = [[_c,-_s,0],[_s,_c,0],[0,0,1]];
    		org_res = [matrix[0][0]*target_vertex.x, matrix[1][1]*target_vertex.y + matrix[2][1]*target_vertex.y, matrix[2][1]*target_vertex.z + matrix[2][2]*target_vertex.z];
    	}else{
    		console.log("Error rotate axis ",axis);
    		return null;
    	}
    	return new Vertex(org_res[0]+a_p.x, org_res[1]+a_p.y, org_res[2]+a_p.z);
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