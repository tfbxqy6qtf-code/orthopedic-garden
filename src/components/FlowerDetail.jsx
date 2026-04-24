import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen, Users, Calendar, Quote, ExternalLink } from 'lucide-react'

function FlowerDetail({ paper, onClose }) {
  if (!paper) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 头部 */}
          <div
            className="sticky top-0 p-6 border-b"
            style={{ backgroundColor: `${paper.flower_color}15` }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: paper.flower_color }}
                />
                <span className="text-sm font-medium text-gray-600">
                  {paper.category_name}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mt-3 leading-snug">
              {paper.title}
            </h2>
          </div>

          {/* 内容 */}
          <div className="p-6 space-y-6">
            {/* 基本信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className="text-gray-400" size={20} />
                <div>
                  <p className="text-xs text-gray-500">作者</p>
                  <p className="text-sm font-medium">
                    {paper.authors?.slice(0, 3).join(', ')}
                    {paper.authors?.length > 3 && ' et al.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <BookOpen className="text-gray-400" size={20} />
                <div>
                  <p className="text-xs text-gray-500">期刊</p>
                  <p className="text-sm font-medium">{paper.journal}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-400" size={20} />
                <div>
                  <p className="text-xs text-gray-500">发表年份</p>
                  <p className="text-sm font-medium">{paper.year}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                <Quote className="text-amber-500" size={20} />
                <div>
                  <p className="text-xs text-amber-600">被引用</p>
                  <p className="text-lg font-bold text-amber-700">
                    {paper.citations} 次
                  </p>
                </div>
              </div>
            </div>

            {/* 摘要 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">摘要</h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {paper.abstract || '暂无摘要信息'}
              </p>
            </div>

            {/* 花朵数据可视化 */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: `${paper.flower_color}10` }}>
              <h3 className="text-sm font-semibold mb-3">花园数据</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500">花瓣数</p>
                  <p className="text-lg font-bold">{paper.flower_props?.petal_count}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">花朵大小</p>
                  <p className="text-lg font-bold">{paper.flower_props?.diameter?.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">茎高度</p>
                  <p className="text-lg font-bold">{paper.flower_props?.stem_height?.toFixed(1)}</p>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3 pt-2">
              {paper.doi && (
                <a
                  href={`https://doi.org/${paper.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink size={18} />
                  查看原文
                </a>
              )}
              <a
                href={`https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(paper.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-gray-300 transition-colors"
              >
                <BookOpen size={18} />
                PubMed检索
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FlowerDetail
