var ws;

var player1, player2;
var ball;
var movementSpeed = 10;
var playerType;
var isReady = false;
function setup(){

    createCanvas(600, 400);
    frameRate(30);
    player1 = new Player(true);
    player2 = new Player(false);
    if(confirm('Are you player 1?')){
        playerType = 1;
    } else {
        playerType = 2;
    }
    init();
}



function draw(){
    background(51);
    if(playerType == 1){
        if(keyIsPressed && key == 'd'){
            player1.move(movementSpeed);
        }
        if(keyIsPressed && key == 'a'){
            player1.move(-movementSpeed);
        }
        if(isReady){
            let p1 = {isPlayer: true, playerType: 1, position: player1.getPos()};
            ws.send(JSON.stringify(p1));
        }
    } else if(playerType == 2){
        if(keyIsPressed && key == 'd'){
            player2.move(movementSpeed);
        }
        if(keyIsPressed && key == 'a'){
            player2.move(-movementSpeed);
        }
        if(isReady){
            let p2 = {isPlayer: true, playerType: 2, position: player2.getPos()};
            ws.send(JSON.stringify(p2));
        }
    }
    
   
    player1.draw();
    player2.draw();
    if(ball){
        if(playerType == 1){
            ball.draw();
        } else if(playerType == 2){
            ball.draw2();
        }
    }
    
    //console.log(JSON.stringify(p1));
    //ws.send()
}

function keyPressed(){
    if(keyCode == 32){
        ball = new Ball();
    }
}

function Ball(an){
    var pos = [width/2, height/2];
    const pi = 3.141592653589793238462;
    var startAngle = Math.random() * (360 - 0) + 0;
    //console.log(startAngle);
    var angle = (pi/180) * startAngle;
    if(an){
        angle = an;
    }
    var speed = 3;
    var radius = 5;
    this.draw = function(){
        //console.log(angle);
        if(pos[0] - radius/2 >= player2.getPos()[0] - 5 && pos[1] - radius/2 >= player2.getPos()[1] && pos[1] - radius/2 <= player2.getPos()[1]+50){
            angle = pi - angle;
            speed = speed <= 8 ? speed+1 : 8;
        }
        if(pos[0] - radius/2 <= player1.getPos()[0] + 10 && pos[1] - radius/2 >= player1.getPos()[1] && pos[1] - radius/2 <= player1.getPos()[1]+50){
            angle = pi - angle;
            speed = speed <= 8 ? speed+1 : 8;
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
        let p = {isPlayer: false, ball: pos, angle: angle};
        ws.send(JSON.stringify(p));
    }
    this.draw2 = function(){
        fill(255);
        circle(pos[0], pos[1], radius);
    }
    this.setPos = function(x, y, ang){
        pos[0] = x;
        pos[1] = y;
        angle = ang
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

    this.getPos = function(){
        return pos;
    }

    this.setPos = function(x, y){
        pos[0] = x;
        pos[1] = y;
    }
}





function init() {

    // Connect to Web Socket
    ws = new WebSocket("ws://localhost:9001/");

    // Set event handlers.
    ws.onopen = function() {
        console.log("on open");
        isReady = true;
    };
      
    ws.onmessage = function(e) {
        // e.data contains received string.
        console.log("on message: " + e.data);
        var move = JSON.parse(e.data);
        if(move.isPlayer){
            if(move.playerType == 1 && playerType == 2){
                player1.setPos(move.position[0], move.position[1])
            }
            if(move.playerType == 2 && playerType == 1){
                player2.setPos(move.position[0], move.position[1])
            }
        } else {
            if(playerType == 2){
                if(!ball){
                    ball = new Ball(move.angle);
                }
                ball.setPos(move.ball[0], move.ball[1], move.angle);
            }
        }
        
    };
      
    ws.onclose = function() {
        console.log("on close");
        isReady = false;
    };

    ws.onerror = function(e) {
        console.log(e)
        isReady = false;
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
    