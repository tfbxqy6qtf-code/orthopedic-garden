import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 花茎 with 叶子
function Stem({ height, scale }) {
  const curve = useMemo(() => {
    const points = []
    const segments = 10
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const x = Math.sin(t * Math.PI * 0.3) * 0.5
      const y = t * height
      const z = Math.cos(t * Math.PI * 0.2) * 0.3
      points.push(new THREE.Vector3(x, y, z))
    }
    return new THREE.CatmullRomCurve3(points)
  }, [height])

  const leafPositions = useMemo(() => {
    return [0.3, 0.5, 0.7].map(t => ({
      pos: curve.getPoint(t),
      rot: t * Math.PI * 4,
      scale: 0.5 + t * 0.5
    }))
  }, [curve])

  return (
    <group>
      {/* 主茎 */}
      <mesh castShadow>
        <tubeGeometry args={[curve, 20, 0.08 * scale, 8, false]} />
        <meshStandardMaterial color="#228B22" roughness={0.8} />
      </mesh>

      {/* 叶子 */}
      {leafPositions.map((leaf, i) => (
        <group key={i} position={leaf.pos}>
          <mesh
            rotation={[0, leaf.rot, Math.PI / 4]}
            castShadow
          >
            <sphereGeometry args={[0.3 * leaf.scale * scale, 8, 8]} />
            <meshStandardMaterial color="#32CD32" />
          </mesh>
          <mesh
            position={[0.3 * leaf.scale * scale, 0.1, 0]}
            rotation={[0, leaf.rot, Math.PI / 3]}
            castShadow
          >
            <sphereGeometry args={[0.2 * leaf.scale * scale, 8, 8]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// 玫瑰花 - 层层叠叠的花瓣
function Rose({ color, scale, isHovered }) {
  const groupRef = useRef()

  return (
    <group ref={groupRef}>
      {/* 内层花瓣 */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2
        const radius = 0.3 * scale
        return (
          <mesh
            key={`inner-${i}`}
            position={[
              Math.cos(angle) * radius * 0.5,
              0.2 * scale,
              Math.sin(angle) * radius * 0.5
            ]}
            rotation={[
              Math.PI / 2 + 0.3,
              -angle,
              0
            ]}
            castShadow
          >
            <sphereGeometry args={[0.25 * scale, 8, 8]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isHovered ? 0.4 : 0.15}
            />
          </mesh>
        )
      })}

      {/* 中层花瓣 */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2 + 0.4
        const radius = 0.5 * scale
        return (
          <mesh
            key={`mid-${i}`}
            position={[
              Math.cos(angle) * radius,
              0.1 * scale,
              Math.sin(angle) * radius
            ]}
            rotation={[
              Math.PI / 2 + 0.5,
              -angle,
              0
            ]}
            castShadow
          >
            <sphereGeometry args={[0.35 * scale, 8, 8]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isHovered ? 0.35 : 0.1}
            />
          </mesh>
        )
      })}

      {/* 外层花瓣 */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
        const angle = (i / 10) * Math.PI * 2 + 0.2
        const radius = 0.75 * scale
        return (
          <mesh
            key={`outer-${i}`}
            position={[
              Math.cos(angle) * radius,
              -0.1 * scale,
              Math.sin(angle) * radius
            ]}
            rotation={[
              Math.PI / 2 + 0.7,
              -angle,
              0
            ]}
            castShadow
          >
            <sphereGeometry args={[0.4 * scale, 8, 8]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isHovered ? 0.3 : 0.08}
            />
          </mesh>
        )
      })}

      {/* 花芯 */}
      <mesh position={[0, 0.1 * scale, 0]} castShadow>
        <sphereGeometry args={[0.25 * scale, 8, 8]} />
        <meshStandardMaterial color="#4a1a1a" />
      </mesh>
    </group>
  )
}

// 向日葵 - 大盘形，黄色花瓣
function Sunflower({ color, scale, isHovered }) {
  const groupRef = useRef()
  const petalCount = 16

  return (
    <group ref={groupRef}>
      {/* 花瓣 */}
      {Array.from({ length: petalCount }).map((_, i) => {
        const angle = (i / petalCount) * Math.PI * 2
        const radius = 0.6 * scale
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              0.1 * scale,
              Math.sin(angle) * radius
            ]}
            rotation={[Math.PI / 2 + 0.2, -angle, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.15 * scale, 0.08 * scale, 0.8 * scale, 6]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isHovered ? 0.4 : 0.15}
            />
          </mesh>
        )
      })}

      {/* 花盘 */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.55 * scale, 0.5 * scale, 0.15 * scale, 16]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>

      {/* 花盘纹理 */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * 0.4 * scale
        return (
          <mesh
            key={`seed-${i}`}
            position={[
              Math.cos(angle) * radius,
              0.08 * scale,
              Math.sin(angle) * radius
            ]}
            castShadow
          >
            <sphereGeometry args={[0.06 * scale, 6, 6]} />
            <meshStandardMaterial color="#3d2817" />
          </mesh>
        )
      })}
    </group>
  )
}

// 郁金香 - 杯状花朵
function Tulip({ color, scale, isHovered }) {
  const groupRef = useRef()

  return (
    <group ref={groupRef}>
      {/* 花瓣 - 杯状 */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.3 * scale,
              0.5 * scale,
              Math.sin(angle) * 0.3 * scale
            ]}
            rotation={[0.4, -angle, 0]}
            castShadow
          >
            <sphereGeometry args={[0.4 * scale, 8, 12]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isHovered ? 0.4 : 0.15}
            />
          </mesh>
        )
      })}

      {/* 内侧花瓣 */}
      {[0, 1].map((i) => {
        const angle = i * Math.PI
        return (
          <mesh
            key={`inner-${i}`}
            position={[
              Math.cos(angle) * 0.15 * scale,
              0.6 * scale,
              Math.sin(angle) * 0.15 * scale
            ]}
            rotation={[0.2, -angle, 0]}
            castShadow
          >
            <sphereGeometry args={[0.25 * scale, 8, 10]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isHovered ? 0.35 : 0.12}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// 雏菊 - 细长白色花瓣
function Daisy({ color, scale, isHovered }) {
  const petalCount = 12

  return (
    <group>
      {/* 花瓣 */}
      {Array.from({ length: petalCount }).map((_, i) => {
        const angle = (i / petalCount) * Math.PI * 2
        const radius = 0.5 * scale
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              0.05 * scale,
              Math.sin(angle) * radius
            ]}
            rotation={[Math.PI / 2 + 0.15, -angle, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.08 * scale, 0.05 * scale, 0.7 * scale, 6]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isHovered ? 0.4 : 0.12}
            />
          </mesh>
        )
      })}

      {/* 花芯 */}
      <mesh position={[0, 0.08 * scale, 0]} castShadow>
        <sphereGeometry args={[0.2 * scale, 12, 12]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
    </group>
  )
}

// 薰衣草 - 细长三角形花穗
function Lavender({ color, scale, isHovered }) {
  return (
    <group>
      {/* 花穗 - 多个小花瓣组成 */}
      {Array.from({ length: 15 }).map((_, i) => {
        const y = (i / 15) * 0.8 * scale
        const offset = Math.sin(i * 0.5) * 0.1 * scale
        const size = 0.15 * scale * (1 - i / 20)
        return (
          <mesh
            key={i}
            position={[offset, y, 0]}
            castShadow
          >
            <sphereGeometry args={[size, 8, 8]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isHovered ? 0.4 : 0.15}
            />
          </mesh>
        )
      })}

      {/* 侧边小花 */}
      {Array.from({ length: 8 }).map((_, i) => {
        const y = 0.1 * scale + (i / 8) * 0.5 * scale
        const angle = (i % 2 === 0 ? 1 : -1) * Math.PI / 3
        return (
          <mesh
            key={`side-${i}`}
            position={[
              Math.cos(angle) * 0.15 * scale,
              y,
              Math.sin(angle) * 0.15 * scale
            ]}
            castShadow
          >
            <sphereGeometry args={[0.08 * scale, 6, 6]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isHovered ? 0.35 : 0.1}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// 荷花 - 多层花瓣，优雅形态
function Lotus({ color, scale, isHovered }) {
  return (
    <group>
      {/* 外层花瓣 */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 0.55 * scale
        return (
          <mesh
            key={`outer-${i}`}
            position={[
              Math.cos(angle) * radius,
              -0.1 * scale,
              Math.sin(angle) * radius
            ]}
            rotation={[0.6, -angle, 0]}
            castShadow
          >
            <sphereGeometry args={[0.3 * scale, 8, 12]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isHovered ? 0.35 : 0.1}
            />
          </mesh>
        )
      })}

      {/* 内层花瓣 */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2 + 0.3
        const radius = 0.35 * scale
        return (
          <mesh
            key={`inner-${i}`}
            position={[
              Math.cos(angle) * radius,
              0.2 * scale,
              Math.sin(angle) * radius
            ]}
            rotation={[0.4, -angle, 0]}
            castShadow
          >
            <sphereGeometry args={[0.25 * scale, 8, 10]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isHovered ? 0.4 : 0.15}
            />
          </mesh>
        )
      })}

      {/* 花芯 */}
      <mesh position={[0, 0.25 * scale, 0]} castShadow>
        <sphereGeometry args={[0.15 * scale, 8, 8]} />
        <meshStandardMaterial color="#FFE4B5" />
      </mesh>
    </group>
  )
}

// 仙人掌 - 肉质茎，带刺
function Cactus({ color, scale, isHovered }) {
  return (
    <group>
      {/* 主干 */}
      <mesh position={[0, 0.5 * scale, 0]} castShadow>
        <cylinderGeometry args={[0.35 * scale, 0.4 * scale, 1 * scale, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 0.3 : 0.08}
        />
      </mesh>

      {/* 分枝 */}
      <mesh
        position={[0.35 * scale, 0.7 * scale, 0]}
        rotation={[0, 0, -Math.PI / 4]}
        castShadow
      >
        <cylinderGeometry args={[0.2 * scale, 0.25 * scale, 0.5 * scale, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 0.3 : 0.08}
        />
      </mesh>

      <mesh
        position={[-0.35 * scale, 0.4 * scale, 0]}
        rotation={[0, 0, Math.PI / 3]}
        castShadow
      >
        <cylinderGeometry args={[0.18 * scale, 0.22 * scale, 0.4 * scale, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 0.3 : 0.08}
        />
      </mesh>

      {/* 刺 */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2
        const y = 0.2 * scale + Math.random() * 0.6 * scale
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.38 * scale,
              y,
              Math.sin(angle) * 0.38 * scale
            ]}
            rotation={[0, -angle, Math.PI / 2]}
            castShadow
          >
            <coneGeometry args={[0.02 * scale, 0.1 * scale, 4]} />
            <meshStandardMaterial color="#F5F5DC" />
          </mesh>
        )
      })}
    </group>
  )
}

// 木槿花 - 大喇叭形
function Hibiscus({ color, scale, isHovered }) {
  return (
    <group>
      {/* 五片大花瓣 */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2
        const radius = 0.5 * scale
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius
            ]}
            rotation={[Math.PI / 2 + 0.3, -angle, 0]}
            castShadow
          >
            <sphereGeometry args={[0.35 * scale, 8, 10]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isHovered ? 0.4 : 0.15}
            />
          </mesh>
        )
      })}

      {/* 花蕊筒 */}
      <mesh position={[0, 0.1 * scale, 0]} castShadow>
        <cylinderGeometry args={[0.12 * scale, 0.1 * scale, 0.5 * scale, 8]} />
        <meshStandardMaterial color="#8B0000" />
      </mesh>

      {/* 花蕊顶端 */}
      <mesh position={[0, 0.4 * scale, 0]} castShadow>
        <sphereGeometry args={[0.08 * scale, 8, 8]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
    </group>
  )
}

// 蒲公英 - 球状，毛茸茸
function Dandelion({ color, scale, isHovered }) {
  return (
    <group>
      {/* 花茎顶端 */}
      <mesh position={[0, 0.5 * scale, 0]} castShadow>
        <sphereGeometry args={[0.1 * scale, 8, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>

      {/* 绒毛球 */}
      {Array.from({ length: 40 }).map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / 40)
        const theta = Math.sqrt(40 * Math.PI) * phi
        const radius = 0.35 * scale

        return (
          <mesh
            key={i}
            position={[
              radius * Math.cos(theta) * Math.sin(phi),
              0.8 * scale + radius * Math.cos(phi),
              radius * Math.sin(theta) * Math.sin(phi)
            ]}
            castShadow
          >
            <sphereGeometry args={[0.05 * scale, 4, 4]} />
            <meshStandardMaterial
              color="#FFFACD"
              transparent
              opacity={0.8}
            />
          </mesh>
        )
      })}

      {/* 主球体 */}
      <mesh position={[0, 0.8 * scale, 0]} castShadow>
        <sphereGeometry args={[0.25 * scale, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 0.3 : 0.1}
        />
      </mesh>
    </group>
  )
}

// 主花朵组件
function FlowerSimple({ paper, position, onClick, onHover, onUnhover, isHovered }) {
  const groupRef = useRef()
  const scale = paper?.flower_props?.scale || 1
  const flowerType = paper?.flower_type || 'rose'
  const color = paper?.flower_color || '#FF6B6B'
  const stemHeight = (paper?.flower_props?.stem_height || 40) / 10

  // 动画 - 花朵随风摆动
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime()
      const xPos = position?.[0] || 0
      // 更自然的摆动
      const sway = Math.sin(time * 0.5 + xPos * 0.1) * 0.03 + Math.sin(time * 1.2 + xPos * 0.2) * 0.01
      groupRef.current.rotation.z = sway
      groupRef.current.rotation.x = Math.cos(time * 0.4 + xPos * 0.1) * 0.02
    }
  })

  // 确保position是有效的数组
  const pos = position || [0, 0, 0]

  // 根据花的类型渲染不同形状
  const renderFlower = () => {
    const props = { color, scale, isHovered }
    switch (flowerType) {
      case 'rose':
        return <Rose {...props} />
      case 'sunflower':
        return <Sunflower {...props} />
      case 'tulip':
        return <Tulip {...props} />
      case 'daisy':
        return <Daisy {...props} />
      case 'lavender':
        return <Lavender {...props} />
      case 'lotus':
        return <Lotus {...props} />
      case 'cactus':
        return <Cactus {...props} />
      case 'hibiscus':
        return <Hibiscus {...props} />
      case 'dandelion':
        return <Dandelion {...props} />
      default:
        return <Rose {...props} />
    }
  }

  return (
    <group
      ref={groupRef}
      position={pos}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
        onHover()
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
        onUnhover()
      }}
    >
      {/* 花茎 */}
      <Stem height={stemHeight} scale={scale} />

      {/* 花朵（放在茎顶端） */}
      <group position={[0, stemHeight, 0]}>
        {renderFlower()}
      </group>
    </group>
  )
}

export default FlowerSimple
