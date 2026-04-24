import React from 'react'
import { motion } from 'framer-motion'

function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50"
    >
      <div className="text-center">
        {/* 加载动画 */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          {/* 外圈 */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 border-4 border-pink-200 rounded-full border-t-pink-500"
          />
          {/* 中圈 */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 border-4 border-purple-200 rounded-full border-b-purple-500"
          />
          {/* 花心 */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center"
          >
            <span className="text-2xl">🌸</span>
          </motion.div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">
          正在培育花园...
        </h2>
        <p className="text-sm text-gray-500">
          加载3D场景与论文数据
        </p>
      </div>
    </motion.div>
  )
}

export default LoadingScreen
