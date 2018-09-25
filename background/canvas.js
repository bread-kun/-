// 画布不支持jquery只能用原生js获取画布对象
var canvas = document.getElementById('canvas');

var WIDTH = 0,
	HEIGHT = 0,
	POINT = 0;
var context = null;
var circleArr = [];

// 初始化画布
function initCanvas(canvas, width, height) {
	context = canvas.getContext('2d');
	// 减去滚动条距离
	WIDTH = window.innerWidth - 15;
	// 减去底部隐藏边界
	HEIGHT = window.innerHeight - 0.01 * window.innerHeight;
	if(WIDTH < 1400) {
		POINT = 24;
	} else {
		POINT = 36;
	}
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	context.strokeStyle = 'rgba(221,236,245,0.6)';
	context.fillStyle = 'rgba(221,236,245,0.6)';
}
//线条：开始xy坐标，结束xy坐标，线条透明度
function Line(x, y, _x, _y/*, o*/) {
	this.beginX = x,
		this.beginY = y,
		this.closeX = _x,
		this.closeY = _y;
		/*this.o = o;*/
}
//点：圆心xy坐标，半径，每帧移动xy的距离
function Circle(x, y, r, moveX, moveY) {
	this.x = x,
		this.y = y,
		this.r = r,
		this.moveX = moveX,
		this.moveY = moveY;
}
//生成max和min之间的随机数
function num(max, _min) {
	var min = arguments[1] || 0;
	return Math.floor(Math.random() * (max - min + 1) + min);
}
// 绘制原点
function drawCricle(cxt, x, y, r, moveX, moveY) {
	var circle = new Circle(x, y, r, moveX, moveY);
	cxt.beginPath();
	cxt.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
	cxt.closePath();
	cxt.fill();
	return circle;
}
//绘制线条
function drawLine(cxt, x, y, _x, _y, o) {
	var line = new Line(x, y, _x, _y, o);
	cxt.beginPath();
	cxt.strokeStyle = 'rgba(221,236,245,'+o+')';
	cxt.moveTo(line.beginX, line.beginY);
	cxt.lineTo(line.closeX, line.closeY);
	cxt.closePath();
	cxt.stroke();

}
//初始化生成原点
function initCircle() {
	circleArr = [];
	for(var i = 0; i < POINT; i++) {
		circleArr.push(drawCricle(context, num(WIDTH), num(HEIGHT), num(12, 9), num(10, -10) / 40, num(10, -10) / 40));
	}
	draw();
}

//每帧绘制
function draw() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	for(var i = 0; i < POINT; i++) {
		drawCricle(context, circleArr[i].x, circleArr[i].y, circleArr[i].r);
	}
	for(var i = 0; i < POINT; i++) {
		for(var j = 0; j < POINT; j++) {
			if(i + j < POINT) {
				var A = Math.abs(circleArr[i + j].x - circleArr[i].x),
					B = Math.abs(circleArr[i + j].y - circleArr[i].y);
				var lineLength = Math.sqrt(A * A + B * B);
				var C = 1 / lineLength * 7 - 0.009;
				var lineOpacity = C > 0.03 ? 0.03 : C;
				if(lineOpacity>0) {
					drawLine(context, circleArr[i].x, circleArr[i].y, circleArr[i + j].x, circleArr[i + j].y, lineOpacity*10);
				}
			}
		}
	}
}

function clearCanvas() {
	var c = document.getElementById("canvas");
	var cxt = c.getContext("2d");
	cxt.clearRect(0, 0, c.width, c.height);
}

function intervalCircle() {
	setInterval(function() {
		for(var i = 0; i < POINT; i++) {
			var cir = circleArr[i];
			cir.x += cir.moveX;
			cir.y += cir.moveY;
			if(cir.x > WIDTH) cir.x = 0;
			else if(cir.x < 0) cir.x = WIDTH;
			if(cir.y > HEIGHT) cir.y = 0;
			else if(cir.y < 0) cir.y = HEIGHT;

		}
		draw();
	}, 16);
}

$(function() {
	initCanvas(canvas, window.innerWidth, window.innerHeight);
	initCircle();
	intervalCircle();

	// 窗口变动时候重绘图
	$(window).resize(function() {
		initCanvas(canvas, window.innerWidth, window.innerHeight);
		initCircle();
	});
});