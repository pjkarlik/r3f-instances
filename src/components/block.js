import * as THREE from "three";
import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "react-three-fiber";
import SimplexNoise from "../utils/simplex";

const _object = new THREE.Object3D();
const _color = new THREE.Color();

const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const BlockGroup = props => {
  const ref = useRef();
  const attrib = useRef();
  const spc = 0.25;
  const cols = 30;
  const rows = 30;
  const startX = (cols * spc) / 2;
  const startY = (rows * spc) / 2;
  const generator = new SimplexNoise(123.23);

  const colors = useMemo(() => {
    const color = [];
    for (let i = 0; i < 255; i++) {
      const shade = i;
      color.push(rgbToHex(shade, shade, shade));
    }
    return color;
  }, []);

  const colorArray = useMemo(() => {
    const color = new Float32Array(6000 * 3);
    for (let i = 0; i < 6000; i++) {
      _color.set(colors[i / 12]);
      _color.toArray(color, i * 3);
    }
    return color;
  }, [colors]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTick(tick + 1);
    }, 100);
    return () => clearTimeout(timer);
  });

  const [tick, setTick] = useState(0);
  const { iter, wave, amp, isVox = false } = props;
  const vAmp = isVox ? 0.95 : amp;
  const tAmp = isVox ? 80 : 150;
  const distance = (x1, y1, x2, y2) => {
    if (!x2) x2 = 0;
    if (!y2) y2 = 0;
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  };

  useFrame(state => {
    let i = 0;
    const time = state.clock.getElapsedTime();
    const { position } = props;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const id = i++;

        const tm = time * 0.5;

        let noiseX =
          generator.noise3D(
            (position[0] / spc + x) * iter,
            (position[2] / spc - y) * iter,
            time * 0.25
          ) * vAmp;

        // let noiseX =
        //   Math.sin((position[0] / spc + x + tm) * iter) * (vAmp * 0.45);
        // noiseX *= Math.sin((position[2] / spc - y + tm) * iter) * (vAmp * 0.45);

        const d = distance(
          position[0] / spc + x,
          position[2] / spc - y,
          15,
          -15
        );
        let voxHeight = (amp * 12);
        if (wave > .01) {
          noiseX *= Math.sin(d * wave - tm) * (vAmp * 0.75);
        } else {
          voxHeight = (amp * 4);
        }
        const hght = isVox ? Math.floor(noiseX * voxHeight) * spc : noiseX;
        const px = ~~((Math.abs(hght) * tAmp) / vAmp);
        const tt = 10 + px;
        const tp = tt > 999 ? 999 : tt;
        _color.set(colors[tp]);
        _color.toArray(colorArray, id * 3);
        attrib.current.needsUpdate = true;
        _object.position.set(-startX + x * spc, hght, startY - y * spc);
        _object.updateMatrix();
        ref.current.setMatrixAt(id, _object.matrix);
      }
      ref.current.instanceMatrix.needsUpdate = true;
    }
  });
  return (
    <instancedMesh ref={ref} args={[null, null, 1000]}>
      <boxBufferGeometry attach="geometry" args={[spc, spc, spc]}>
        <instancedBufferAttribute
          ref={attrib}
          attachObject={["attributes", "color"]}
          args={[colorArray, 3]}
        />
      </boxBufferGeometry>
      <meshPhongMaterial attach="material" vertexColors={THREE.VertexColors} />
    </instancedMesh>
  );
};

export default BlockGroup;
