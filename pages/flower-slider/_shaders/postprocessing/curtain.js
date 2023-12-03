const CurtainShader = {
  name: 'CurtainShader',

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
			vec2 transUv = vUv;

			if (transUv.x >= 0.25 && transUv.x < 0.5) {
				transUv.x = transUv.x - 0.25 * uProgress;
			}
			if (transUv.x >= 0.5 && transUv.x < 0.75) {
				transUv.x = transUv.x - 0.5 * uProgress;
			}
			if (transUv.x >= 0.75) {
				transUv.x = transUv.x - 0.65 * uProgress;
			}
			
			vec4 color = texture2D( tDiffuse, transUv );
	
			gl_FragColor = color;

		}`,
};

export default CurtainShader;
