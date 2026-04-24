import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Plane } from '@react-three/drei'
import * as THREE from 'three'
import FlowerSimple from './FlowerSimple'

function Garden3D({ papers, categories, onFlowerClick, onFlowerHover, hoveredFlower }) {
  // 计算规整的花园布局
  const layoutPapers = useMemo(() => {
    if (!papers || papers.length === 0) return []

    const catKeys = Object.keys(categories || {})
    const catCount = catKeys.length || 1
    const layout = []

    // 花园中心圆半径
    const gardenRadius = 40

    // 为每个类别分配一个扇形区域
    catKeys.forEach((catKey, catIdx) => {
      const catPapers = papers.filter(p => p.category === catKey)
      if (catPapers.length === 0) return

      // 计算该类别的中心角度和位置
      const angle = (catIdx / catCount) * Math.PI * 2 - Math.PI / 2
      const centerX = Math.cos(angle) * gardenRadius * 0.6
      const centerZ = Math.sin(angle) * gardenRadius * 0.6

      // 在该区域内规整排列花朵（网格布局）
      const count = catPapers.length
      const cols = Math.ceil(Math.sqrt(count * 1.5))
      const rows = Math.ceil(count / cols)

      const spacing = 3.5
      const blockWidth = (cols - 1) * spacing
      const blockDepth = (rows - 1) * spacing

      catPapers.forEach((paper, idx) => {
        const row = Math.floor(idx / cols)
        const col = idx % cols

        const localX = col * spacing - blockWidth / 2
        const localZ = row * spacing - blockDepth / 2

        // 轻微随机偏移
        const jitter = 0.2
        const offsetX = (Math.random() - 0.5) * jitter
        const offsetZ = (Math.random() - 0.5) * jitter

        layout.push({
          ...paper,
          position: {
            x: centerX + localX + offsetX,
            y: 0,
            z: centerZ + localZ + offsetZ
          }
        })
      })
    })

    return layout
  }, [papers, categories])

  // 地面纹理
  const groundTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#5a8a5a'
    ctx.fillRect(0, 0, 512, 512)
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * 512
      const y = Math.random() * 512
      ctx.fillStyle = `hsl(${100 + Math.random() * 30}, 50%, ${35 + Math.random() * 15}%)`
      ctx.fillRect(x, y, 2, 2)
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(10, 10)
    return texture
  }, [])

  // 类别中心点
  const categoryCenters = useMemo(() => {
    if (!categories) return {}
    const catKeys = Object.keys(categories)
    const catCount = catKeys.length || 1
    const centers = {}
    const gardenRadius = 40

    catKeys.forEach((catKey, catIdx) => {
      const angle = (catIdx / catCount) * Math.PI * 2 - Math.PI / 2
      centers[catKey] = {
        x: Math.cos(angle) * gardenRadius * 0.6,
        z: Math.sin(angle) * gardenRadius * 0.6,
        color: categories[catKey]?.color || '#888888'
      }
    })
    return centers
  }, [categories])

  return (
    <group>
      {/* 地面 */}
      <Plane
        args={[200, 200]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <meshStandardMaterial map={groundTexture} />
      </Plane>

      {/* 类别标记 - 简单的彩色柱子 */}
      {Object.entries(categoryCenters).map(([catKey, center]) => {
        const count = papers.filter(p => p.category === catKey).length
        return (
          <group key={catKey}>
            {/* 标记柱 */}
            <mesh position={[center.x, 2, center.z]} castShadow>
              <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
              <meshStandardMaterial color={center.color} emissive={center.color} emissiveIntensity={0.2} />
            </mesh>
            {/* 标记球 */}
            <mesh position={[center.x, 4.5, center.z]} castShadow>
              <sphereGeometry args={[0.8, 16, 16]} />
              <meshStandardMaterial color={center.color} />
            </mesh>
          </group>
        )
      })}

      {/* 中心装饰 */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[2, 2.5, 4, 8]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
      <mesh position={[0, 5, 0]} castShadow>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>

      {/* 花朵 */}
      {layoutPapers.map((paper) => (
        <FlowerSimple
          key={paper.id}
          paper={paper}
          position={[paper.position.x, paper.position.y, paper.position.z]}
          onClick={() => onFlowerClick(paper)}
          onHover={() => onFlowerHover(paper)}
          onUnhover={() => onFlowerHover(null)}
          isHovered={hoveredFlower?.id === paper.id}
        />
      ))}
    </group>
  )
}

export default Garden3D
