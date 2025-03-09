import * as THREE from "three";
import React, { useRef, useState } from "react";
import {
  Canvas,
  useFrame,
  ThreeElements,
  useLoader,
  useThree,
  ThreeEvent,
} from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

function Box(props: ThreeElements["mesh"]) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((state, delta) => (meshRef.current.rotation.x += delta));
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "#2f74c0"} />
    </mesh>
  );
}

function Strawberry() {
  const gltf = useLoader(GLTFLoader, "models/strawberrySub.glb");
  const { camera } = useThree();

  // 3d 모델 크기 확인
  // const boxHelper = new THREE.BoxHelper(gltf.scene, 0x00ff00);
  // gltf.scene.add(boxHelper);

  // 배경 제거거
  const background = gltf.scene.getObjectByName("평면002");
  if (background) {
    background.visible = false;
  }

  // 클릭 시 특정 위치로 이동동
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!event.object) return;
    const object = event.object;
    camera.position.set(
      object.position.x + 2,
      object.position.y + 2,
      object.position.z + 5
    );
  };

  return (
    <primitive
      object={gltf.scene}
      children-0-castShadow
      onClick={handleClick}
      scale={0.5}
    />
  );
}

export default function App() {
  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Strawberry />
      {/* <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} /> */}
      <OrbitControls />
      <gridHelper args={[10, 10]} />
    </Canvas>
  );
}
