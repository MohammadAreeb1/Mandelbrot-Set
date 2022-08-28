#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
vec3 color;
float range;
float value;

float map(float value, float min1, float max1, float min2, float max2)
{
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 mouse = u_mouse/u_resolution;
    // range = 	0.34;
    range = pow(2., -(u_time)*0.5)*8.;
    float move =1.;
    
    float mousex = map(mouse.x,0.,1.,move,-move);
    float mousey = map(mouse.y,0.,1.,move,-move);

    
    float real = map(st.x,0.,1.,-range,range);
    float complex = map(st.y,0.,1.,-range,range);
    real = real + mouse.x;
    complex = complex + mouse.y;


    vec2 current = vec2(real, complex);
    
    vec2 z = vec2(0,0);
    const float count = 100.;
    float itr = 0.;
	for( float i = 0.; i <= count; i++){
        itr = itr + 1.;
    	float zreal = (z.x*z.x) - (z.y*z.y);
        float zcomplex = (2.*z.x*z.y);
        z = vec2(zreal, zcomplex);
        z = z + current;
        if (distance(z,vec2(0.,0.)) >= 2.){
            break;
        }
    }
        float hue = itr + 1. - log(log2(distance(vec2(0,0),z)));
        hue = 255. * hue/count;
        hue = map(hue, 0.,255.,0.,1.);
        if (itr < count){
            value = 1.;
        }else{
            value = 0.;
        }
        vec3 hsv = vec3(hue, 1, value);
        color = hsv2rgb(hsv);
    gl_FragColor = vec4(color,1.0);
}