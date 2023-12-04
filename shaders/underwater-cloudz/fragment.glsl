#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D image;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
uniform float speed;

varying vec2 vUv;
  
float NOISE_SIZE = 2.; // The size of the noise. Essentially the multiplier for the noise UV. Smaller = bigger
float INTENSITY = 1.; // The intensity of the displacement
float REFLECTION_INTENSITY = 4.; // The intensity of the rellowish reflections.
int octaves = 5; // the number of octaves to generate in the FBM noise
float seed = 43758.5453123; // A random seed :)
  
    /*
      Based on Underwater Sun
      Liam Egan - 2018
    */
  
vec2 random2(vec2 st, float seed){
  st = vec2( dot(st,vec2(127.1,311.7)),
            dot(st,vec2(269.5,183.3)) );
  return -1.0 + 2.0*fract(sin(st)*seed);
}
  
    // Value Noise by Inigo Quilez - iq/2013
    // https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st, float seed) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0), seed ), f - vec2(0.0,0.0) ), 
                      dot( random2(i + vec2(1.0,0.0), seed ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0), seed ), f - vec2(0.0,1.0) ), 
                      dot( random2(i + vec2(1.0,1.0), seed ), f - vec2(1.0,1.0) ), u.x), u.y);
}
  
float fbm1(in vec2 _st, float seed) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  // Rotate to reduce axial bias
  mat2 rot = mat2(cos(0.5), sin(0.5),
                  -sin(0.5), cos(0.5));
  for (int i = 0; i < octaves; ++i) {
      v += a * noise(_st, seed);
      _st = rot * _st * 2.0 + shift;
      a *= 0.3;
  }
  return v + .4;
}
  
float pattern(vec2 uv, float seed, float time, inout vec2 q, inout vec2 r) {

  q = vec2( fbm1( uv + vec2(0.0,0.0), seed ),
                  fbm1( uv + vec2(5.2,1.3), seed ) );

  r = vec2( fbm1( uv + 4.0*q + vec2(1.7 - time / 2.,9.2), seed ),
                  fbm1( uv + 4.0*q + vec2(.3 - time / 2.,2.8), seed ) );

  float rtn = fbm1( uv + 3.0*r * speed, seed );

  return rtn;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
      
  // Generate our displacement map
  vec2 _uv = uv * NOISE_SIZE;
  vec2 q = vec2(0.);
  vec2 r = vec2(0.);
  float pattern = pattern(_uv, seed, time/2., q, r);
      
  uv += (.5 - pattern) / INTENSITY; // modulate the main UV coordinates by the pattern
  uv -= .02 / INTENSITY; // This just recenters the UV coords after the distortion
      
  float len = length(uv) + .01;
      
  float ripple;
  ripple = sin(80.0) * .5 * r.x * pattern + 1.; // The ripple pattern
      
  ripple -= fract(ripple * 8.) / 100.; // Adds a nice sort of reflective element

  vec4 img = texture2D(image, vUv);

  vec2 uvDist = vec2(vUv.x + mouse.x * 0.001, vUv.y + mouse.y * 0.001); // the basic colour
  uvDist += (1. - pattern * REFLECTION_INTENSITY * .5) * smoothstep(0.0,.7,clamp(1.9 - len * 1.5,0.0,1.0)) * vec2(-.03, -.01); // vignette and reflection
 
  gl_FragColor = img * texture2D(image, vec2(uvDist.x + mouse.x * 0.001, uvDist.y + mouse.y * 0.001));
}
