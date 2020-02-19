import React, { useMemo, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Model = ({ url }) => {
  const [obj, set] = useState();
  useMemo(() => new GLTFLoader().load(url, set), [url]);
  return obj ? <primitive object={obj.scene} /> : null;
};

export default Model;
