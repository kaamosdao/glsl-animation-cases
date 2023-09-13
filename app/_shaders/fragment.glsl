#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D image;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

varying vec2 vUv;

void main() {
  vec2 p = (7.68 * gl_FragCoord.xy / resolution.xy) - vec2(0.5, 1.0);
  vec2 i = p;
  float c = 1.0;

  float inten = 1.1;

  for(int n = 0; n < 4; n++){
    float t = time * (1.0 - (10.0 / float(n + 10))) * 1.5;
    float ix = i.x + mouse.x;
    float iy = i.y + mouse.y;

    i = p + vec2(cos(t - ix) + sin(t + iy), sin(t - iy) + cos(t + ix));
		c += float(n)/length(vec2(p.x/sin(ix + t)/inten, p.y/cos(iy + t)/inten)) * 20.;
  }

  c /= 90.;
  c = 1.8 - sqrt(c);

  vec4 color = texture2D(image, vUv) * texture2D(image, vec2(vUv.x + cos(c) * mouse.x * 0.07, vUv.y + cos(c) * mouse.y * 0.07 )) * 0.75;

  gl_FragColor = color;
}
