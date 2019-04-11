var ws;
var shitPos = [ // 0 = nothing
    [0, 0, 0], //1 = circle
    [0, 0, 0], //2 = cross
    [0, 0, 0]
]
var playerShit = 'x';
var myTurn = true;
var player1, player2;
var ball;
var movementSpeed = 6;
function setup(){

    createCanvas(600, 400);
    frameRate(30);
    player1 = new Player(true);
    player2 = new Player(false);
    ball = new Ball();
}



function draw(){
    background(51);
    if(keyIsPressed && key == 'd'){
        player1.move(movementSpeed);
    }
    if(keyIsPressed && key == 'a'){
        player1.move(-movementSpeed);
    }
    if(keyIsPressed && key == 'l'){
        player2.move(movementSpeed);
    }
    if(keyIsPressed && key == 'j'){
        player2.move(-movementSpeed);
    }
    player1.draw();
    player2.draw();
    ball.draw();
}

function Ball(){
    var pos = [width/2, height/2];
    const pi = 3.141592653589793238462;
    var startAngle = Math.random() * (360 - 0) + 0;
    console.log(startAngle);
    var angle = (pi/180) * startAngle;
    var speed = 10;
    var radius = 5;
    this.draw = function(){
        //console.log(angle);
        if(pos[0] - radius/2 >= width){
            angle = pi - angle;
        }
        if(pos[0] - radius/2 <= 0){
            angle = pi - angle;
        }
        if(pos[1] - radius/2 <= 0){
            angle = pi - (angle - pi);
        }
        if(pos[1] - radius/2 >= height){
            angle = pi + (pi - angle);
        }

        pos[0] += speed*cos(angle);
        pos[1] += speed*sin(angle);
        fill(255);
        circle(pos[0], pos[1], radius);
    }
}

function Player(first){
    var playerWidth = 50;
    let x = first ? 10 : width - playerWidth/2;
    var pos = [x, 0];
    
    
    this.move = function(direction){
        pos[1] += direction;
        if(pos[1] > (height - playerWidth)){
            pos[1] = height - playerWidth;
        }
        if(pos[1] < 0){
            pos[1] = 0;
        }
    }
    this.draw = function(){
        fill(255);
        rect(pos[0], pos[1], 10, playerWidth);
    }
}





function init() {

    // Connect to Web Socket
    ws = new WebSocket("ws://localhost:9001/");

    // Set event handlers.
    ws.onopen = function() {
        console.log("on open");
    };
      
    ws.onmessage = function(e) {
        // e.data contains received string.
        console.log("on message: " + e.data);
        var move = JSON.parse(e.data);
        if(shitPos[move.pos[1]][move.pos[0]] != 0){
            return;
        }
        if(move.shit == 'x'){
            shitPos[move.pos[1]][move.pos[0]] = 2;
        } else { 
            shitPos[move.pos[1]][move.pos[0]] = 1;
        }
        myTurn = !myTurn;
    };
      
    ws.onclose = function() {
        console.log("on close");
    };

    ws.onerror = function(e) {
        console.log(e)
    };

}
    
function onSubmit() {
    var input = document.getElementById("input");
    // You can send message to the Web Socket using ws.send.
    ws.send(input.value);
    output("send: " + input.value);
    input.value = "";
    input.focus();
}
    
function onCloseClick() {
    ws.close();
}
    