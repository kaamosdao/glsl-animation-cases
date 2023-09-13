#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uvRate;
uniform float waveLength;
uniform float time;
uniform vec2 mouse;

varying vec2 vUv;

void main() {
  vUv = uv;

  vUv -= 0.5;
  vUv *= uvRate.xy;
  vUv += 0.5;

  float vWave = sin(time + (position.x + position.y) * waveLength) * 0.02;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x + mouse.y * 0.02, position.y + mouse.x * 0.02, vWave, 1.0);
}
