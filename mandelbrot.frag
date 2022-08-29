#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float range;
uniform vec2 mousepos;
uniform float maxitrs;
vec3 color;
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
    float real = map(st.x,0.,1.,-range,range);
    float complex = map(st.y,0.,1.,-range,range);
    real = real + mousepos.x;
    complex = complex + mousepos.y;
    vec2 current = vec2(real, complex);
    
  
    vec2 z = vec2(0,0);
    const float count = 1000.;
    float itr = 0.;
	for( float i = 0.; i <= count; i++){
        if (i >= maxitrs){break;}
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
    hue = 255. * hue/maxitrs;
    hue = map(hue, 0.,255.,0.,1.);
    if (itr < maxitrs){
        value = 1.;
    }else{
        value = 0.;
    }
    vec3 hsv = vec3(hue, 1, value);
    color = hsv2rgb(hsv);

  
    gl_FragColor = vec4(color,1.0);
}