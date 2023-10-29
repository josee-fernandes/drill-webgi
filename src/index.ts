import {
  ViewerApp,
  AssetManagerPlugin,
  GBufferPlugin,
  ProgressivePlugin,
  TonemapPlugin,
  SSRPlugin,
  SSAOPlugin,
  BloomPlugin,
  AssetManagerBasicPopupPlugin,
  CanvasSnipperPlugin,
  FileTransferPlugin,

  // Color, // Import THREE.js internals
  // Texture, // Import THREE.js internals
} from "webgi";
import "./styles.css";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

async function setupViewer() {
  // Initialize the viewer
  const viewer = new ViewerApp({
    canvas: document.getElementById("webgi-canvas") as HTMLCanvasElement,
    useRgbm: false,
  });

  // Add some plugins
  const manager = await viewer.addPlugin(AssetManagerPlugin);

  // Add a popup(in HTML) with download progress when any asset is downloading.
  await viewer.addPlugin(AssetManagerBasicPopupPlugin);
  const camera = viewer.scene.activeCamera;
  const position = camera.position;
  const target = camera.target;

  // Add plugins individually.
  await viewer.addPlugin(GBufferPlugin);
  await viewer.addPlugin(new ProgressivePlugin(32));
  await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm));
  // await viewer.addPlugin(GammaCorrectionPlugin)
  await viewer.addPlugin(SSRPlugin);
  await viewer.addPlugin(SSAOPlugin);
  // await viewer.addPlugin(DiamondPlugin)
  // await viewer.addPlugin(FrameFadePlugin)
  // await viewer.addPlugin(GLTFAnimationPlugin)
  // await viewer.addPlugin(GroundPlugin)
  await viewer.addPlugin(BloomPlugin);
  // await viewer.addPlugin(TemporalAAPlugin)
  // await viewer.addPlugin(AnisotropyPlugin)
  // and many more...

  // or use this to add all main ones at once.
  //   await addBasePlugins(viewer);

  // Required for downloading files from the UI
  await viewer.addPlugin(FileTransferPlugin);

  // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
  await viewer.addPlugin(CanvasSnipperPlugin);

  // This must be called once after all plugins are added.
  viewer.renderer.refreshPipeline();

  // Import and add a GLB file.
  await viewer.load("./assets/drill.glb");

  // WEBGI Update
  let needsUpdate = true;

  const onUpdate = () => {
    needsUpdate = true;
    camera.positionUpdated(false);
    camera.targetUpdated(false);
    viewer.renderer.resetShadows();
  };

  viewer.addEventListener("preFrame", () => {
    if (needsUpdate) {
      camera.positionUpdated(true);
      camera.targetUpdated(true);
      needsUpdate = false;
    }
  });

  const setupScrollAnimation = () => {
    const timeline = gsap.timeline();

    // Second section
    timeline
      .to(position, {
        x: 2.6911364802,
        y: -1.843717436,
        z: -4.1440576409,
        scrollTrigger: {
          trigger: ".second",
          start: "top bottom",
          end: "top top",
          scrub: 1,
        },
        onUpdate,
      })
      .to(target, {
        x: -0.2329439633,
        y: 0.1707043152,
        z: -0.6420947845,
        scrollTrigger: {
          trigger: ".second",
          start: "top bottom",
          end: "top top",
          scrub: 1,
        },
      })
      .fromTo(
        position,
        {
          x: 2.6911364802,
          y: -1.843717436,
          z: -4.1440576409,
          scrollTrigger: {
            trigger: ".second",
            start: "top bottom",
            end: "top top",
            scrub: 1,
          },
          onUpdate,
        },
        {
          x: -3.1144053864,
          y: -0.1505998917,
          z: 2.0573046709,
          scrollTrigger: {
            trigger: ".third",
            start: "top bottom",
            end: "top top",
            scrub: 1,
          },
          onUpdate,
        }
      )
      .fromTo(
        target,
        {
          x: -0.2329439633,
          y: 0.1707043152,
          z: -0.6420947845,
          scrollTrigger: {
            trigger: ".second",
            start: "top bottom",
            end: "top top",
            scrub: 1,
          },
        },
        {
          x: -0.6016303699,
          y: 1.1516048724,
          z: -0.5938401565,
          scrollTrigger: {
            trigger: ".third",
            start: "top bottom",
            end: "top top",
            scrub: 1,
          },
        }
      );

    // Third section
    //   .to(position, {
    //     x: -3.1144053864,
    //     y: -0.1505998917,
    //     z: 2.0573046709,
    //     scrollTrigger: {
    //       trigger: ".third",
    //       start: "top bottom",
    //       end: "top top",
    //       scrub: 1,
    //     },
    //     onUpdate,
    //   })
    //   .to(target, {
    //     x: -0.6016303699,
    //     y: 1.1516048724,
    //     z: -0.5938401565,
    //     scrollTrigger: {
    //       trigger: ".third",
    //       start: "top bottom",
    //       end: "top top",
    //       scrub: 1,
    //     },
    //   });
  };

  setupScrollAnimation();
}

setupViewer();
