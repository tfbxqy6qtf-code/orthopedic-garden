import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

// 花朵形状配置
const FLOWER_SHAPES = {
  rose: {
    petalCount: 8,
    layers: 3,
    curve: 0.3,
    scale: 1.2
  },
  sunflower: {
    petalCount: 12,
    layers: 2,
    curve: 0.1,
    scale: 1.5,
    centerSize: 0.4
  },
  tulip: {
    petalCount: 6,
    layers: 1,
    curve: 0.5,
    scale: 1.0,
    cupShaped: true
  },
  lavender: {
    petalCount: 4,
    layers: 5,
    curve: 0.2,
    scale: 0.8,
    spikeShape: true
  },
  daisy: {
    petalCount: 10,
    layers: 1,
    curve: 0.15,
    scale: 1.0
  },
  lotus: {
    petalCount: 12,
    layers: 4,
    curve: 0.4,
    scale: 1.3,
    layered: true
  },
  cactus: {
    petalCount: 0,
    layers: 1,
    scale: 0.8,
    isCactus: true
  },
  hibiscus: {
    petalCount: 5,
    layers: 1,
    curve: 0.35,
    scale: 1.4,
    trumpetShape: true
  },
  dandelion: {
    petalCount: 20,
    layers: 1,
    curve: 0.05,
    scale: 1.0,
    fluffy: true
  }
}

function Flower({ paper, position, onClick, onHover, onUnhover, isHovered }) {
  const flowerRef = useRef()
  const stemRef = useRef()

  const { flower_type, flower_color, flower_props } = paper
  const shape = FLOWER_SHAPES[flower_type] || FLOWER_SHAPES.rose

  // 动态大小
  const scale = flower_props.scale * (isHovered ? 1.3 : 1)

  // 花朵动画
  useFrame((state) => {
    if (flowerRef.current) {
      const time = state.clock.getElapsedTime()
      // 微风吹动
      flowerRef.current.rotation.z = Math.sin(time * 0.5 + position.x) * 0.05
      flowerRef.current.rotation.x = Math.sin(time * 0.3 + position.z) * 0.03

      // 悬停时轻微放大动画
      if (isHovered) {
        flowerRef.current.scale.setScalar(THREE.MathUtils.lerp(
          flowerRef.current.scale.x,
          scale,
          0.1
        ))
      } else {
        flowerRef.current.scale.setScalar(THREE.MathUtils.lerp(
          flowerRef.current.scale.x,
          flower_props.scale,
          0.1
        ))
      }
    }
  })

  // 根据被引量计算花茎高度
  const stemHeight = flower_props.stem_height / 10

  return (
    <group position={position}>
      {/* 花茎 */}
      <mesh
        ref={stemRef}
        position={[0, stemHeight / 2, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.05, 0.08, stemHeight, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>

      {/* 叶子 */}
      <Leaves stemHeight={stemHeight} color="#228B22" />

      {/* 花朵主体 */}
      <group
        ref={flowerRef}
        position={[0, stemHeight, 0]}
        onClick={onClick}
        onPointerOver={onHover}
        onPointerOut={onUnhover}
        name="flower"
      >
        {shape.isCactus ? (
          <CactusFlower color={flower_color} />
        ) : shape.fluffy ? (
          <DandelionFlower color={flower_color} count={flower_props.petal_count} />
        ) : (
          <Blossom
            color={flower_color}
            shape={shape}
            petalCount={flower_props.petal_count}
          />
        )}

        {/* 悬停时显示被引量 */}
        {isHovered && (
          <Html distanceFactor={10}>
            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {paper.citations} citations
            </div>
          </Html>
        )}
      </group>
    </group>
  )
}

// 花朵绽放组件
function Blossom({ color, shape, petalCount }) {
  const petals = useMemo(() => {
    const items = []
    const actualCount = petalCount || shape.petalCount

    for (let layer = 0; layer < shape.layers; layer++) {
      const layerScale = 1 - layer * 0.15
      const layerOffset = layer * 0.1

      for (let i = 0; i < actualCount; i++) {
        const angle = (i / actualCount) * Math.PI * 2 + layer * 0.3
        items.push({
          angle,
          layer,
          layerScale,
          layerOffset,
          index: i
        })
      }
    }
    return items
  }, [shape, petalCount])

  return (
    <group>
      {/* 花心 */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFA500" emissiveIntensity={0.3} />
      </mesh>

      {/* 花瓣 */}
      {petals.map((petal, idx) => (
        <Petal
          key={idx}
          color={color}
          angle={petal.angle}
          layerScale={petal.layerScale}
          layerOffset={petal.layerOffset}
          curve={shape.curve}
          cupShaped={shape.cupShaped}
          trumpetShape={shape.trumpetShape}
        />
      ))}
    </group>
  )
}

// 单片花瓣
function Petal({ color, angle, layerScale, layerOffset, curve, cupShaped, trumpetShape }) {
  const petalRef = useRef()

  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.25 * layerScale, 16, 16)
    geo.scale(1, 0.3, 0.5)

    if (cupShaped) {
      geo.scale(0.8, 1.5, 0.8)
    } else if (trumpetShape) {
      geo.scale(1.2, 0.5, 1)
    }

    return geo
  }, [layerScale, cupShaped, trumpetShape])

  return (
    <mesh
      ref={petalRef}
      geometry={geometry}
      position={[
        Math.cos(angle) * (0.2 + layerOffset),
        cupShaped ? 0.2 : 0.1,
        Math.sin(angle) * (0.2 + layerOffset)
      ]}
      rotation={[
        cupShaped ? -0.5 : curve,
        angle,
        cupShaped ? 0 : 0.2
      ]}
    >
      <meshStandardMaterial
        color={color}
        roughness={0.6}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// 蒲公英花朵
function DandelionFlower({ color, count }) {
  const seeds = useMemo(() => {
    return Array.from({ length: count || 20 }, (_, i) => ({
      phi: Math.acos(-1 + (2 * i) / (count || 20)),
      theta: Math.sqrt((count || 20) * Math.PI) * i
    }))
  }, [count])

  return (
    <group>
      {seeds.map((seed, idx) => (
        <mesh
          key={idx}
          position={[
            0.3 * Math.sin(seed.phi) * Math.cos(seed.theta),
            0.3 * Math.cos(seed.phi),
            0.3 * Math.sin(seed.phi) * Math.sin(seed.theta)
          ]}
        >
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color={color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// 仙人掌花朵
function CactusFlower({ color }) {
  return (
    <group>
      {/* 仙人掌主体 */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.2, 0.6, 4, 8]} />
        <meshStandardMaterial color="#4a7c59" />
      </mesh>
      {/* 顶部花朵 */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}

// 叶子组件
function Leaves({ stemHeight, color }) {
  return (
    <>
      <mesh
        position={[0.1, stemHeight * 0.4, 0]}
        rotation={[0, 0, -0.5]}
      >
        <sphereGeometry args={[0.08, 8, 8]} scale={[2, 0.5, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh
        position={[-0.1, stemHeight * 0.6, 0]}
        rotation={[0, 0, 0.5]}
      >
        <sphereGeometry args={[0.06, 8, 8]} scale={[1.5, 0.4, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </>
  )
}

export default Flower
