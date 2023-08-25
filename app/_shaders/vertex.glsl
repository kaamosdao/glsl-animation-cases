#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uvRate;

varying vec2 vUv;

void main() {
  vUv = uv;

  vUv -= 0.5;
  vUv *= uvRate.xy;
  vUv += 0.5;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
