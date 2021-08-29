const BACKGROUND_COLOR = '#000000'
const STROKE_COLOR = '#5EBC4E'
const STROKE_WIDTH = 10;
var isDrawing = false;

curX = 0;
curY = 0;
preX = 0;
preY = 0;

var canvas;
var context;

function prepareCanvas() {
    console.log("Preparing Canvas");
    canvas = document.querySelector('#drawCanvas');
    context = canvas.getContext('2d');

    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    // Mouse Event Handlers

    canvas.addEventListener('mousedown', function (event) {
        isDrawing = true;

        curX = event.clientX - canvas.offsetLeft;
        curY = event.clientY - canvas.offsetTop;
    });

    canvas.addEventListener('mouseup', (e) => {
        isDrawing = false;
    });

    canvas.addEventListener('mousemove', function (event) {
        if (isDrawing) {
            stroke(event.clientX, event.clientY);
        }
    });

    canvas.addEventListener('mouseleave', (event) => {
        isDrawing = false;
    });


    // Touch Event Handlers

    canvas.addEventListener('touchstart', function (event) {
        touch = event.changedTouches;
        isDrawing = true;

        curX = touch.pageX - canvas.offsetLeft;
        curY = touch.pageY - canvas.offsetTop;
    });

    canvas.addEventListener('touchend', (e) => {
        isDrawing = false;
    });

    canvas.addEventListener('touchmove', function (event) {
        if (isDrawing) {
            touch = event.changedTouches[0];
            stroke(touch.pageX, touch.pageY);
        }
    });

    canvas.addEventListener('mouseleave', (event) => {
        isDrawing = false;
    });
};

function clearCanvas() {
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

function stroke(x, y) {   
    preX = curX;
    curX = x - canvas.offsetLeft;

    preY = curY;
    curY = y - canvas.offsetTop;

    context.strokeStyle = STROKE_COLOR;
    context.lineWidth = STROKE_WIDTH;

    context.beginPath();
    context.moveTo(preX, preY);
    context.lineTo(curX, curY);
    context.closePath();

    context.lineJoin = "round";

    context.stroke();
}