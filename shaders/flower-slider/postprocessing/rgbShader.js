const RGBShader = {
  name: 'RGBShader',

  uniforms: {
    tDiffuse: { value: null },
    uProgress: { value: 0 },
  },

  vertexShader: /* glsl */ `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

  fragmentShader: /* glsl */ `

		uniform float uProgress;
		uniform sampler2D tDiffuse;

		varying vec2 vUv;
		
		void main() {
			
			vec4 color = texture2D( tDiffuse, vUv );
			vec4 colorPlusShift = texture2D( tDiffuse, vUv + uProgress * vec2(0.1, 0.) );
			vec4 colorMinusShift = texture2D( tDiffuse, vUv - uProgress * vec2(0.1, 0.) );
	
			gl_FragColor = vec4(colorPlusShift.r, color.g, colorMinusShift.b, 1.);

		}`,
};

export default RGBShader;
