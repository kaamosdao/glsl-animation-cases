import * as THREE from 'three';
import { gsap } from 'gsap';

class Scene {
  constructor(canvas, images) {
    this.time = 0;
    this.images = images;

    ({ innerWidth: this.width, innerHeight: this.height } = window);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      1,
      100
    );
    this.camera.position.set(0, 0, 1);
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(this.width, this.height);

    this.mousePos = { x: 0, y: 0 };

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

    const imgAspect = this.imgWidth / this.imgHeight;

    this.plane.scale.x = imgAspect * 1.09;
    this.plane.scale.y = 1.09;
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

    this.imgNum = 1;

    loadManager.onLoad = () => {
      this.material = new THREE.MeshBasicMaterial({
        map: this.textures[this.imgNum].texture,
      });

      this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
      this.plane = new THREE.Mesh(this.geometry, this.material);
      this.scene.add(this.plane);

      this.resize();
    };
  }

  onMouseMove = (e) => {
    const x = (e.clientX - this.width / 2) / (this.width / 2);
    const y = (e.clientY - this.height / 2) / (this.height / 2);

    this.mousePos.x = x;
    this.mousePos.y = y;
  };

  onClick = () => {
    if (this.playing) {
      return;
    }

    this.playing = true;

    gsap
      .timeline({
        onComplete: () => {
          this.playing = false;
        },
      })
      .to(this.material.uniforms.waveLength, {
        value: 15,
        duration: 2.5,
        ease: 'power1.out',
      })
      .to(this.material.uniforms.waveLength, {
        value: 2,
        duration: 2.5,
        ease: 'power1.out',
      });
  };

  animate = () => {
    if (this.material) {
      this.time += 0.05;
    }

    this.renderer.render(this.scene, this.camera);
  };

  render() {
    gsap.ticker.add(this.animate);
  }

  dismiss() {
    gsap.ticker.remove(this.animate);
  }
}

export default Scene;
