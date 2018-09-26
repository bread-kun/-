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

function drawCube(mix_vertex, max_vertex) {
	var cube = [];
	// body...
}