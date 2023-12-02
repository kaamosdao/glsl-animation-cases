/* eslint-disable no-param-reassign */
import * as THREE from 'three';
import { gsap } from 'gsap';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class Scene {
  constructor(canvas, images) {
    this.time = 0;
    this.images = images;

    ({ innerWidth: this.width, innerHeight: this.height } = window);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 1);
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xffffff);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    this.mousePos = { x: 0, y: 0 };
    this.mouseTarget = new THREE.Vector2();

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

    const { height } = this.planes[0].geometry.parameters;

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

    this.planes.forEach((plane) => {
      plane.scale.x = imgAspect * 1.09;
      plane.scale.y = 1.09;
    });
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

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    this.planes = [];
    this.group = new THREE.Group();

    loadManager.onLoad = () => {
      const picsAmount = 3;

      for (let i = 0; i < picsAmount; i += 1) {
        let material;

        material = new THREE.MeshBasicMaterial({
          map: this.textures[this.imgNum].texture,
        });

        if (i > 0) {
          material = new THREE.MeshBasicMaterial({
            map: this.textures[this.imgNum].texture,
            alphaMap: this.textures[0].texture,
            transparent: true,
          });
        }

        const plane = new THREE.Mesh(this.geometry, material);
        const distanceBetween = 0.09;
        plane.position.z = i * distanceBetween;

        this.planes.push(plane);

        this.group.add(plane);
      }

      this.scene.add(this.group);

      this.resize();
    };
  }

  onMouseMove = (e) => {
    const x = (e.clientX - this.width / 2) / (this.width / 2);
    const y = (e.clientY - this.height / 2) / (this.height / 2);

    this.mousePos.x = x;
    this.mousePos.y = y;
  };

  animate = () => {
    this.time += 0.05;

    this.mouseTarget.lerp(this.mousePos, 0.05);

    this.oscillator = Math.sin(this.time * 0.06) * 0.5 + 0.5;

    this.group.rotation.x = -this.mouseTarget.y * 0.1;
    this.group.rotation.y = -this.mouseTarget.x * 0.1;
    this.group.children.forEach((mesh, i) => {
      mesh.position.z = (i + 1) * 0.1 - this.oscillator * 0.1;
    });

    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  };

  render() {
    gsap.ticker.add(this.animate);
  }

  dismiss() {
    gsap.ticker.remove(this.animate);
  }
}

export default Scene;
