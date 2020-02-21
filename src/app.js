import * as THREE from "three";
import React, { useRef, useEffect, useState } from "react";
import { Canvas, extend, useFrame, useThree } from "react-three-fiber";
import Effects from "./components/effects";
import BlockGroup from "./components/block";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import dat from "dat.gui";

extend({ OrbitControls });

const BlockContainer = props => {
  const { position } = props;
  return (
    <group position={position}>
      <BlockGroup {...props} />
    </group>
  );
};

const BlockMap = props => {
  const { position, config } = props;
  const blockMap = useRef();
  useFrame(() => {
    // uncomment to rotate group of components
    // blockMap.current.rotation.y += 0.004;
    // blockMap.current.rotation.x -= 0.008;
  });

  return (
    <group ref={blockMap} position={position}>
      <BlockContainer {...config} position={[0, 0, 0]} />

      <BlockContainer {...config} position={[0, 0, 7.5]} />
      <BlockContainer {...config} position={[0, 0, -7.5]} />
      <BlockContainer {...config} position={[7.5, 0, 0]} />
      <BlockContainer {...config} position={[-7.5, 0, 0]} />

      <BlockContainer {...config} position={[7.5, 0, 7.5]} />
      <BlockContainer {...config} position={[7.5, 0, -7.5]} />
      <BlockContainer {...config} position={[-7.5, 0, -7.5]} />
      <BlockContainer {...config} position={[-7.5, 0, 7.5]} />
    </group>
  );
};

const options = { iter: 0.11, wave: 0.1, amp: 1.75, isVox: false };

const Controls = props => {
  const ref = useRef();
  const {
    camera,
    gl: { domElement }
  } = useThree();
  return <orbitControls ref={ref} args={[camera, domElement]} />;
};

const App = () => {
  const [iter, setIter] = useState(options.iter);
  const [wave, setWave] = useState(options.wave);
  const [amp, setAmp] = useState(options.amp);
  const [isVox, setVox] = useState(options.isVox);
  const [lcolor, setColor1] = useState("#0099ff");
  const [dcolor, setColor2] = useState("#FF6600");
  const lightColor = useRef();

  useEffect(() => {
    let options = {
      iter,
      amp,
      isVox,
      wave,
      lcolor,
      dcolor
    };
    const gui = new dat.GUI();
    const folderRender = gui.addFolder("Render Options");
    folderRender
      .add(options, "iter", 0.01, 0.3)
      .step(0.01)
      .onFinishChange(value => {
        setIter(value);
      });
    folderRender
      .add(options, "wave", 0.01, 0.8)
      .step(0.01)
      .onFinishChange(value => {
        setWave(value);
      });
    folderRender
      .add(options, "amp", 0.1, 3.5)
      .step(0.01)
      .onFinishChange(value => {
        setAmp(value);
      });
    folderRender.addColor(options, "lcolor").onChange(value => {
      setColor1(value);
    });
    folderRender.addColor(options, "dcolor").onChange(value => {
      setColor2(value);
    });
    folderRender.add(options, "isVox").onFinishChange(value => {
      setVox(value);
    });
  }, []);

  const config = {
    iter,
    amp,
    isVox,
    wave
  };

  return (
    <>
      <Canvas
        gl={{ antialias: false, alpha: false }}
        camera={{
          position: [0, -1, 20],
          fov: 75,
          near: 0.1,
          far: 1500
        }}
        onCreated={({ gl, scene }) => {
          scene.rotation.set(Math.PI / 4.75, 0, 0);
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.setClearColor(new THREE.Color("#111111"));
        }}
      >
        <Controls />
        <pointLight position={[-1, 18, -22]} color="#CCCCCC" />
        <pointLight position={[-1, -28, 21]} color={dcolor} />
        <pointLight ref={lightColor} position={[1, 20, -12]} color={lcolor} />
        <BlockMap config={config} />
        <Effects />
      </Canvas>
    </>
  );
};

export default App;
