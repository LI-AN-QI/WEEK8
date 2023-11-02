//THE CLIENT SIDE:

//Initialization:
//Open the socket connection 
    //Listen for and receive call back of the socket connection

//Create the sketch:
    //Send message to the server + Listen for the message from the server
    //Then use that message to draw

//Message to be sent: 1.mouse position, 2.the current color used by each client
    //1.function mouseDragged():Every time when mouse is held and is moved,send the data: (x,y,currentcolor) to all clients
    //2.function changeCircleColor():Everytime the button changecolor is clicked, set a new random color to the ellipse, send the data (currentcolor) to all clients
//use the position data (send to) and (listen from) the server to draw
    //function drawPos(pos)

/////////////////////////////////////////////////////////////////

//Open and connect socket
let socket = io();


//Listen for confirmation of connection
socket.on('connect', function () {
    console.log("Connected");
}); 



let currentColor;

function setup() {
    createCanvas(windowWidth*0.99, windowHeight*0.9);
    background(255);
    
    //A button to change ellipse color
    let changecolorbtn = select('#changecolor');
    changecolorbtn.mousePressed(changeCircleColor); 

    //A button to clear the canvas
    let clearCanvasbtn = select("#clearcanvas"); 
    clearCanvasbtn.mousePressed(clearCanvas); 

    //A button to save the canvas
    let save = select('#save');
    save.mousePressed(saveCanvasImage);

    //Initialzie current color
    currentColor = color(random(255),random(255),random(255));

    //Listen for messages named 'data' from the server
    socket.on('data', function(obj) {
        console.log(obj);
        draw(obj);
      });

  }



//When mouse is dragged,send the data (mouse position, current ellipse color) to the server
function mouseDragged() {
    //Grab (x & y & color), and set these datas into the object 'clientdraw'
    let clientdraw = { 
        x: mouseX, 
        y: mouseY,
        color: currentColor 
    };
    //Send all datas to the server
     socket.emit('data', clientdraw);
}
  

//a function that draws ellipses using the data sent to the server ↑ (x & y position & current random color)
function draw(datas) {
    noStroke();
    fill(datas.color.levels[0], datas.color.levels[1], datas.color.levels[2]);
    ellipse(datas.x, datas.y, 20, 20); 
}

//////////////console.log(obj):(the data sent to the server)
// {x: 315, y: 500.6000003814697, color: {…}}
// color: 
//      levels: (4) [241, 94, 119, 255]
//      maxes: {rgb: Array(4), hsb: Array(4), hsl: Array(4)}
//      mode: "rgb"
//      _array: (4) [0.9444542692691023, 0.3678357681515476, 0.4654127176775318, 1]
//      [[Prototype]]: Object
//      x: 315
//      y: 500.6000003814697


//a function to update the color of currentcolor and send it to all clients
function changeCircleColor() {
    //set another random color to currentColor
    currentColor = color(random(255), random(255), random(255));
    //send the color data to all clients
    //socket.emit('colorChange', currentColor); //Q: didn't have a socket.on('colorChange',function()=>{})?
}


function clearCanvas() {
    background(255); 
  }

function saveCanvasImage() {
    let fileName = 'MYDRAW_' + Date() + '.png';
    saveCanvas(fileName, 'png');
}