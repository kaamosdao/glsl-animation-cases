import * as THREE from 'three';
import { gsap } from 'gsap';

class Scene {
  constructor(canvas, images, shaders) {
    this.images = images;
    this.shaders = shaders;

    ({ innerWidth: this.width, innerHeight: this.height } = window);

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

    this.initScene();

    this.render();
  }

  addResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  removeResize() {
    window.removeEventListener('resize', this.resize.bind(this));
  }

  resize = () => {
    ({ innerWidth: this.width, innerHeight: this.height } = window);

    const viewportAspect = this.width / this.height;

    this.resizeImg();

    const { height } = this.plane.geometry.parameters;

    this.camera.fov =
      2 * Math.atan(height / 2 / this.camera.position.z) * (180 / Math.PI);
    this.camera.aspect = viewportAspect;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  };

  resizeImg() {
    this.imgWidth = this.textures[this.imgNum].sizes.width;
    this.imgHeight = this.textures[this.imgNum].sizes.height;

    const viewportAspect = this.width / this.height;
    const imgAspect = this.imgWidth / this.imgHeight;

    this.material.uniforms.resolution.value = new THREE.Vector2(
      this.width,
      this.height
    );

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

  initScene() {
    const loadManager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(loadManager);

    this.textures = this.images.reduce((acc, img) => {
      const sizes = {};
      const texture = loader.load(img, ({ source }) => {
        const { naturalWidth, naturalHeight } = source.data;
        sizes.width = naturalWidth;
        sizes.height = naturalHeight;
      });
      acc.push({ texture, sizes });
      return acc;
    }, []);

    const { vShader, fShader } = this.shaders;

    loadManager.onLoad = () => {
      this.material = new THREE.ShaderMaterial({
        vertexShader: vShader,
        fragmentShader: fShader,
        uniforms: {
          progress: { type: 'f', value: 0 },
          image: {
            type: 't',
            value: this.textures[0].texture,
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

      this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
      this.plane = new THREE.Mesh(this.geometry, this.material);
      this.scene.add(this.plane);

      this.imgNum = 0;

      this.resize();
    };
  }

  animate() {
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    gsap.ticker.add(this.animate.bind(this));
  }

  dismiss() {
    gsap.ticker.remove(this.animate);
  }
}

export default Scene;
