let theShader;
let signoftime = true;

function preload() {
    theShader = loadShader("shader.vert", "mandelbrot.frag");
    pixelDensity(1);
}

function setup() {
    createCanvas(400, 400, WEBGL);
    noStroke();
}

function draw() {
    theShader.setUniform("u_resolution", [width, height]);
    theShader.setUniform("u_time", getsmoothtime()); // we divide millis by 1000 to convert it to seconds
    theShader.setUniform("u_mouse", [mouseX, map(mouseY, 0, height, height, 0)]); // we flip Y so it's oriented properly in our shader
    shader(theShader);
    rect(0, 0, width, height);
}

function getsmoothtime() {
    let seconds = millis() / 1000.0;
    let frequency = (1 / 3) * seconds + 5;
    let time = 15 * sin(frequency) + 17.5;
    if (signoftime) {
        print(time);
        signoftime = false;
    }
    return time;
}