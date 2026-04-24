import React from 'react'
import { motion } from 'framer-motion'
import { Flower2, Filter } from 'lucide-react'

function Legend({ categories, activeFilter, onFilterChange, paperCounts }) {
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

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="absolute left-4 top-24 bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-4 max-w-xs"
    >
      <div className="flex items-center gap-2 mb-3 text-gray-700">
        <Flower2 size={20} />
        <h3 className="font-semibold">研究品种</h3>
      </div>

      <div className="space-y-2">
        {/* 全部 */}
        <button
          onClick={() => onFilterChange('all')}
          className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${
            activeFilter === 'all'
              ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-300'
              : 'hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🌸</span>
            <span className="text-sm font-medium">全部品种</span>
          </div>
          <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
            {Object.values(paperCounts).reduce((a, b) => a + b, 0)}
          </span>
        </button>

        <div className="h-px bg-gray-200 my-2" />

        {/* 各分类 */}
        {Object.entries(categories).map(([key, cat]) => {
          const count = paperCounts[key] || 0
          if (count === 0) return null

          return (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${
                activeFilter === key
                  ? 'ring-2'
                  : 'hover:bg-gray-100'
              }`}
              style={{
                backgroundColor: activeFilter === key ? `${cat.color}20` : undefined,
                '--tw-ring-color': cat.color
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{flowerEmojis[cat.flower] || '🌸'}</span>
                <div className="text-left">
                  <span className="text-sm font-medium block">{cat.name}</span>
                </div>
              </div>
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

      {/* 提示 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
        <p className="flex items-center gap-1">
          <Filter size={14} />
          <span>点击花色筛选，点击花朵查看详情</span>
        </p>
      </div>
    </motion.div>
  )
}

export default Legend