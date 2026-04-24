# 🌸 骨科论文花园 | Orthopedic Research Garden

[![Weekly Update](https://github.com/YOUR_USERNAME/orthopedic-garden/actions/workflows/weekly-update.yml/badge.svg)](https://github.com/YOUR_USERNAME/orthopedic-garden/actions/workflows/weekly-update.yml)

一个3D可视化的骨科基础研究论文展示平台，将近5年PubMed高被引论文以"花园"形式呈现。

![Garden Preview](./docs/preview.png)

## ✨ 特色功能

- 🌺 **3D花园可视化** - 每篇论文都是一朵独特的花
- 🎨 **研究方向分类** - 9种不同花色代表不同研究领域
- 📊 **被引量映射** - 花朵大小反映论文影响力
- 🔍 **交互式探索** - 点击花朵查看论文详情
- 🔄 **每周自动更新** - GitHub Actions定时刷新数据
- 📱 **响应式设计** - 支持桌面和移动设备

## 🌼 花朵品种说明

| 花色 | 研究方向 | 花朵类型 | 颜色代码 |
|------|----------|----------|----------|
| 🌹 红色 | 骨再生与修复 | 玫瑰 | #FF6B6B |
| 🌻 黄色 | 骨代谢与矿化 | 向日葵 | #FFD93D |
| 🌷 紫色 | 关节软骨研究 | 郁金香 | #C084FC |
| 🪻 淡紫 | 脊柱与椎间盘 | 薰衣草 | #A78BFA |
| 🌼 绿色 | 生物材料 | 雏菊 | #6EE7B7 |
| 🪷 粉色 | 干细胞研究 | 荷花 | #F9A8D4 |
| 🌵 棕色 | 骨感染 | 仙人掌 | #8B5A2B |
| 🌺 鲜红 | 骨肿瘤 | 木槿花 | #EF4444 |
| 🌿 灰色 | 力学生物学 | 蒲公英 | #94A3B8 |

## 🚀 在线访问

**GitHub Pages**: https://YOUR_USERNAME.github.io/orthopedic-garden/

> 替换 `YOUR_USERNAME` 为你的GitHub用户名

### 本地开发

```bash
# 克隆项目
git clone https://github.com/YOUR_USERNAME/orthopedic-garden.git
cd orthopedic-garden

# 安装依赖
npm install

# 获取论文数据
cd data && python3 fetch_pubmed_v2.py && cd ..
cp data/top100.json public/

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000/orthopedic-garden/ 查看3D花园

### 数据更新

项目配置了GitHub Actions每周自动更新数据：

1. 每周一自动从PubMed获取最新数据
2. 自动构建并部署到GitHub Pages
3. 手动触发：进入Actions页面点击"Run workflow"

## 📁 项目结构

```
orthopedic-garden/
├── data/
│   └── fetch_pubmed_v2.py    # PubMed数据获取脚本
├── src/
│   ├── components/
│   │   ├── Garden3D.jsx      # 3D花园主场景
│   │   ├── FlowerSimple.jsx  # 9种花朵组件
│   │   ├── FlowerDetail.jsx  # 详情弹窗
│   │   ├── Legend.jsx        # 图例组件
│   │   ├── Header.jsx        # 顶部导航
│   │   └── LoadingScreen.jsx # 加载页面
│   ├── App.jsx               # 主应用
│   └── main.jsx              # 入口文件
├── .github/workflows/
│   ├── deploy.yml            # 部署到GitHub Pages
│   └── weekly-update.yml     # 自动更新工作流
└── package.json
```

## 🛠️ 技术栈

- **3D引擎**: Three.js + React Three Fiber
- **UI框架**: React 18 + Tailwind CSS
- **动画**: Framer Motion
- **数据源**: PubMed E-utilities API (免费)
- **部署**: GitHub Pages
- **自动化**: GitHub Actions

## 📊 数据来源

- **数据库**: PubMed (NCBI)
- **检索策略**: 8个检索式覆盖9大研究方向
- **时间范围**: 近5年（2021-2026）
- **排序依据**: 期刊影响力 + 发表年份估算
- **筛选数量**: Top 100

## 🎯 花朵大小计算

```
花瓣数量 = min(被引量 / 15, 20)
花朵直径 = 20 + sqrt(被引量) × 2.5
茎高度 = 30 + 被引量 / 8
缩放比例 = 0.6 + min(1.4, 被引量 / 250)
```

## 📄 许可证

MIT License © 2026 Orthopedic Garden Contributors

---

**维护**: 每周一自动更新 | **最后更新**: 见页面底部
