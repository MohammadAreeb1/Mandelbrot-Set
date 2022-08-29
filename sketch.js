let theShader;
let zoom = 1;
let currentcenter = [0, 0];
let prevmousepos = [0, 0];
let currentmousepos = [0, 0];
let mousedown = false;
let range = 2.5;

function preload() {
    theShader = loadShader("shader.vert", "mandelbrot.frag");
    slider = createSlider(1, 1000, 1);
    div = createDiv("Max Number of Iterations (1000)");
    div = createDiv("Drag mouse to pan around");
    div = createDiv("Scroll to Zoom");
    pixelDensity(1);
}

function setup() {
    createCanvas(400, 400, WEBGL);
    noStroke();
}

function draw() {
    if (mousedown) {
        let scaledmousex = mouseX / width;
        let scaledmousey = map(mouseY, 0, height, height, 0) / height;
        currentmousepos = [scaledmousex, scaledmousey];
        let dx = prevmousepos[0] - currentmousepos[0];
        let dy = prevmousepos[1] - currentmousepos[1];
        currentcenter[0] += dx * range;
        currentcenter[1] += dy * range;
        prevmousepos[0] = currentmousepos[0];
        prevmousepos[1] = currentmousepos[1];
    }
    theShader.setUniform("mousepos", currentcenter);
    theShader.setUniform("u_resolution", [width, height]);
    theShader.setUniform("range", getrange(zoom));
    theShader.setUniform("maxitrs", slider.value());
    shader(theShader);
    rect(0, 0, width, height);
}

function mouseWheel(event) {
    if (event.deltaY > 0 && zoom > 1) {
        zoom -= 1;
    } else {
        zoom += 1;
    }
}

function mousePressed() {
    if (mouseX < width && mouseY < height) {
        prevmousepos = [mouseX / width, map(mouseY, 0, height, height, 0) / height];
        mousedown = true;
    }
}

function mouseReleased() {
    mousedown = false;
}

function getrange(zoom) {
    zoom = zoom;
    range = pow(2.0, -zoom * 0.5) * 8.0;
    return range;
}