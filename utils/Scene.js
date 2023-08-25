import * as THREE from 'three';
import { gsap } from 'gsap';

class Scene {
  constructor(canvas, images, shaders) {
    this.images = images;
    this.shaders = shaders;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.001,
      100
    );
    this.camera.position.set(0, 0, 1);
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(this.width, this.height);

    this.addObjects();
    this.resize();
    this.render();
  }

  addResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  removeResize() {
    window.removeEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    const viewportAspect = this.width / this.height;
    const imgAspect = this.imgWidth / this.imgHeight;

    this.material.uniforms.resolution.value = new THREE.Vector2(
      this.width,
      this.height
    );

    const { height } = this.plane.geometry.parameters;
    this.camera.fov =
      2 * Math.atan(height / 2 / this.camera.position.z) * (180 / Math.PI);
    this.camera.aspect = viewportAspect;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);

    this.plane.scale.x = viewportAspect;

    if (imgAspect > viewportAspect) {
      this.material.uniforms.uvRate.value = new THREE.Vector2(
        viewportAspect / imgAspect,
        1
      );
    } else {
      this.material.uniforms.uvRate.value = new THREE.Vector2(
        1,
        imgAspect / viewportAspect
      );
    }
  }

  addObjects() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    this.textures = this.images.map((img) =>
      new THREE.TextureLoader().load(img)
    );

    this.imgWidth = 1920;
    this.imgHeight = 1280;

    const { vShader, fShader } = this.shaders;

    this.material = new THREE.ShaderMaterial({
      vertexShader: vShader,
      fragmentShader: fShader,
      uniforms: {
        progress: { type: 'f', value: 0 },
        image: {
          type: 't',
          value: this.textures[0],
        },
        uvRate: {
          type: 'v2',
          value: new THREE.Vector2(1, 1),
        },
        resolution: {
          type: 'v2',
          value: new THREE.Vector2(this.width, this.height),
        },
      },
    });

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.plane.scale.x = this.imgWidth / this.imgHeight;

    this.scene.add(this.plane);
  }

  animate() {
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    gsap.ticker.add(this.animate.bind(this));
  }
}

export default Scene;
