/* eslint-disable no-param-reassign */
import * as THREE from 'three';
import { gsap } from 'gsap';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

import {
  CurtainShader,
  RGBShader,
} from '@/shaders/flower-slider/postprocessing';

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
    this.renderer.setClearColor(0x1b1f2b);

    this.mousePos = { x: 0, y: 0 };
    this.mouseTarget = new THREE.Vector2();

    this.initPostProcessing();

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
    this.composer.setSize(this.width, this.height);
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

  initPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.setSize(this.width, this.height);

    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    this.curtainPass = new ShaderPass(CurtainShader);
    this.composer.addPass(this.curtainPass);

    this.rgbPass = new ShaderPass(RGBShader);
    this.composer.addPass(this.rgbPass);
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
    this.groups = [];

    loadManager.onLoad = () => {
      const picsAmount = 3;

      const imgs = this.textures.slice(1);
      const alphaMap = this.textures[0].texture;

      imgs.forEach(({ texture, sizes }, index) => {
        const group = new THREE.Group();

        group.position.x = (index * sizes.width) / 1000 / 1.09;

        this.groups.push(group);
        this.scene.add(group);

        for (let i = 0; i < picsAmount; i += 1) {
          let material;

          material = new THREE.MeshBasicMaterial({
            map: texture,
          });

          if (i > 0) {
            material = new THREE.MeshBasicMaterial({
              map: texture,
              alphaMap,
              transparent: true,
            });
          }

          const plane = new THREE.Mesh(this.geometry, material);
          const distanceBetween = 0.09;
          plane.position.z = i * distanceBetween;

          this.planes.push(plane);

          group.add(plane);
        }
      });

      this.resize();
      this.initSlideAnimation();
    };
  }

  onMouseMove = (e) => {
    const x = (e.clientX - this.width / 2) / (this.width / 2);
    const y = (e.clientY - this.height / 2) / (this.height / 2);

    this.mousePos.x = x;
    this.mousePos.y = y;
  };

  initSlideAnimation() {
    this.isAnimating = false;
    this.isLast = false;

    this.tl = gsap
      .timeline({
        onComplete: () => {
          this.isAnimating = false;
          this.isLast = !this.isLast;
        },
        onReverseComplete: () => {
          this.isAnimating = false;
          this.isLast = !this.isLast;
        },
        paused: true,
      })
      .to(
        this.camera.position,
        {
          z: 0.7,
          duration: 1,
          ease: 'power2.inOut',
        },
        0
      )
      .to(
        this.camera.position,
        {
          x: this.textures[0].sizes.width / 1000 / 1.09,
          duration: 1.5,
          ease: 'power4.inOut',
        },
        0.5
      )
      .to(
        this.camera.position,
        {
          z: 1,
          duration: 1,
          ease: 'power2.inOut',
        },
        1.5
      )
      .to(
        this.curtainPass.uniforms.uProgress,
        {
          value: 1,
          duration: 1,
          ease: 'power3.inOut',
        },
        0
      )
      .to(
        this.curtainPass.uniforms.uProgress,
        {
          value: 0,
          duration: 1,
          ease: 'power3.inOut',
        },
        1.5
      )
      .to(
        this.rgbPass.uniforms.uProgress,
        {
          value: 1,
          duration: 1,
          ease: 'power3.inOut',
        },
        0
      )
      .to(
        this.rgbPass.uniforms.uProgress,
        {
          value: 0,
          duration: 1,
          ease: 'power3.inOut',
        },
        1.5
      );
  }

  runSlideAnimation = () => {
    if (this.isAnimating) {
      return;
    }

    this.isAnimating = true;

    if (this.isLast) {
      this.tl.reverse();
    } else {
      this.tl.play();
    }
  };

  animate = () => {
    this.time += 0.05;

    this.mouseTarget.lerp(this.mousePos, 0.05);

    this.oscillator = Math.sin(this.time * 0.06) * 0.5 + 0.5;

    this.groups.forEach((group) => {
      group.rotation.x = -this.mouseTarget.y * 0.1;
      group.rotation.y = -this.mouseTarget.x * 0.1;
      group.children.forEach((mesh, i) => {
        mesh.position.z = (i + 1) * 0.1 - this.oscillator * 0.1;
      });
    });

    this.composer.render();
  };

  render() {
    gsap.ticker.add(this.animate);
  }

  dismiss() {
    gsap.ticker.remove(this.animate);
  }
}

export default Scene;
