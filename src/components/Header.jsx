import React from 'react'
import { motion } from 'framer-motion'
import { Flower2, Info, Github } from 'lucide-react'

function Header({ totalPapers, lastUpdate }) {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-md shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
            <Flower2 className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              骨科论文花园
            </h1>
            <p className="text-xs text-gray-500">
              Orthopedic Research Garden · 近5年基础研究热点
            </p>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="hidden md:flex items-center gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{totalPapers}</p>
            <p className="text-xs text-gray-500">精选论文</p>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{lastUpdate || '2021-2026'}</p>
            <p className="text-xs text-gray-500">时间范围</p>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">9</p>
            <p className="text-xs text-gray-500">研究方向</p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="关于项目"
          >
            <Info size={20} className="text-gray-600" />
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="GitHub"
          >
            <Github size={20} className="text-gray-600" />
          </a>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
