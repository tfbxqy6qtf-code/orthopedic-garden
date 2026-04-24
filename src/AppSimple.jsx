import React, { useState, useEffect } from 'react'
import './index.css'

function AppSimple() {
  const [papers, setPapers] = useState([])
  const [categories, setCategories] = useState({})
  const [selectedPaper, setSelectedPaper] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('./top100.json')
      .then(res => res.json())
      .then(data => {
        console.log('Loaded data:', data)
        setPapers(data.papers || [])
        setCategories(data.categories || {})
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading data:', err)
        setLoading(false)
      })
  }, [])

  const filteredPapers = activeFilter === 'all'
    ? papers
    : papers.filter(p => p.category === activeFilter)

  const flowerEmojis = {
    rose: '🌹',
    sunflower: '🌻',
    tulip: '🌷',
    lavender: '🪻',
    daisy: '🌼',
    lotus: '🪷',
    cactus: '🌵',
    hibiscus: '🌺',
    dandelion: '🌿'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-100 to-blue-100">
        <div className="text-center">
          <div className="text-6xl mb-4">🌸</div>
          <h2 className="text-xl font-bold">正在培育花园...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-xl">🌸</span>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                骨科论文花园
              </h1>
              <p className="text-xs text-gray-500">近5年基础研究热点 · Top 100</p>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <span className="font-bold text-lg">{papers.length}</span>
              <span className="block text-gray-500 text-xs">论文</span>
            </div>
            <div className="text-center">
              <span className="font-bold text-lg">{Object.keys(categories).length}</span>
              <span className="block text-gray-500 text-xs">方向</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar - Legend */}
        <aside className="w-64 p-4 sticky top-20 h-fit">
          <div className="bg-white/90 rounded-xl shadow-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span>🌸</span> 研究品种
            </h3>

            <button
              onClick={() => setActiveFilter('all')}
              className={`w-full flex items-center justify-between p-2 rounded-lg mb-2 transition-all ${
                activeFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🌸</span> 全部品种
              </span>
              <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                {papers.length}
              </span>
            </button>

            <div className="h-px bg-gray-200 my-2" />

            {Object.entries(categories).map(([key, cat]) => {
              const count = papers.filter(p => p.category === key).length
              if (count === 0) return null
              return (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg transition-all mb-1 ${
                    activeFilter === key ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                  style={{ backgroundColor: activeFilter === key ? `${cat.color}20` : undefined }}
                >
                  <span className="flex items-center gap-2">
                    <span>{flowerEmojis[cat.flower] || '🌸'}</span>
                    <span className="text-sm">{cat.name}</span>
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: cat.color }}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Main Garden */}
        <main className="flex-1 p-6">
          <div className="bg-white/50 rounded-2xl p-6 min-h-[600px]">
            <div className="grid grid-cols-10 gap-3">
              {filteredPapers.map((paper, idx) => (
                <div
                  key={paper.id}
                  onClick={() => setSelectedPaper(paper)}
                  className="relative group cursor-pointer transition-transform hover:scale-110"
                  style={{
                    gridColumn: `span ${Math.max(1, Math.min(3, Math.floor(paper.flower_props?.scale || 1)))}`,
                  }}
                >
                  <div
                    className="flex flex-col items-center p-3 rounded-xl transition-all hover:shadow-lg"
                    style={{ backgroundColor: `${paper.flower_color}20` }}
                  >
                    <span
                      className="text-4xl filter drop-shadow-lg transition-transform group-hover:scale-125"
                      style={{ fontSize: `${20 + (paper.flower_props?.scale || 1) * 15}px` }}
                    >
                      {flowerEmojis[paper.flower_type] || '🌸'}
                    </span>
                    <span className="text-xs text-gray-600 mt-1 text-center line-clamp-2">
                      {paper.title.substring(0, 20)}...
                    </span>
                    <span className="text-xs font-bold text-amber-600">
                      {paper.citations} 引用
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      {selectedPaper && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPaper(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div
              className="p-6 border-b"
              style={{ backgroundColor: `${selectedPaper.flower_color}15` }}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{flowerEmojis[selectedPaper.flower_type] || '🌸'}</span>
                  <span className="text-sm text-gray-600">{selectedPaper.category_name}</span>
                </div>
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>
              <h2 className="text-xl font-bold mt-3">{selectedPaper.title}</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">作者</p>
                  <p className="text-sm font-medium">{selectedPaper.authors?.slice(0, 3).join(', ')}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">期刊</p>
                  <p className="text-sm font-medium">{selectedPaper.journal}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">年份</p>
                  <p className="text-sm font-medium">{selectedPaper.year}</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-xs text-amber-600">被引用</p>
                  <p className="text-lg font-bold text-amber-700">{selectedPaper.citations} 次</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">摘要</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {selectedPaper.abstract}
                </p>
              </div>

              <div className="flex gap-3">
                {selectedPaper.doi && (
                  <a
                    href={`https://doi.org/${selectedPaper.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    查看原文
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppSimple
