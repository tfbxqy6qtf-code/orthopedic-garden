import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Garden3D from './components/Garden3D'
import FlowerDetail from './components/FlowerDetail'
import Legend from './components/Legend'
import LoadingScreen from './components/LoadingScreen'
import Header from './components/Header'

function App() {
  const [papers, setPapers] = useState([])
  const [categories, setCategories] = useState({})
  const [selectedFlower, setSelectedFlower] = useState(null)
  const [hoveredFlower, setHoveredFlower] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Starting to fetch data...')
    fetch('./top100.json')
      .then(res => {
        console.log('Response received:', res.status)
        return res.json()
      })
      .then(data => {
        console.log('Data loaded:', data.papers?.length, 'papers')
        setPapers(data.papers || [])
        setCategories(data.categories || {})
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load data:', err)
        setLoading(false)
      })
  }, [])

  const filteredPapers = activeFilter === 'all'
    ? papers
    : papers.filter(p => p.category === activeFilter)

  console.log('Rendering with', filteredPapers.length, 'papers')

  return (
    <div className="relative w-full h-full">
      {loading && <LoadingScreen />}

      <Canvas
        camera={{ position: [0, 80, 120], fov: 45 }}
        shadows
        style={{ width: '100vw', height: '100vh' }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#87CEEB']} />
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[50, 100, 50]}
          intensity={0.8}
          castShadow
          shadow-mapSize={2048}
        />
        <directionalLight position={[-50, 50, -50]} intensity={0.3} />

        <Suspense fallback={null}>
          <Garden3D
            papers={filteredPapers}
            categories={categories}
            onFlowerClick={setSelectedFlower}
            onFlowerHover={setHoveredFlower}
            hoveredFlower={hoveredFlower}
          />
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={30}
          maxDistance={250}
          maxPolarAngle={Math.PI / 2 - 0.05}
        />
      </Canvas>

      <Header
        totalPapers={papers.length}
        lastUpdate={papers[0]?.year || '2021-2026'}
      />

      <Legend
        categories={categories}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        paperCounts={papers.reduce((acc, p) => {
          acc[p.category] = (acc[p.category] || 0) + 1
          return acc
        }, {})}
      />

      {hoveredFlower && !selectedFlower && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-sm">
            <p className="font-semibold text-gray-800">{hoveredFlower.title?.substring(0, 30)}...</p>
            <p className="text-gray-600">被引: {hoveredFlower.citations}次</p>
          </div>
        </div>
      )}

      {selectedFlower && (
        <FlowerDetail
          paper={selectedFlower}
          onClose={() => setSelectedFlower(null)}
        />
      )}
    </div>
  )
}

export default App
