#!/usr/bin/env python3
"""
Web of Science 数据获取脚本
获取近5年骨科基础研究论文Top100（按被引量排序）
"""

import json
import time
import urllib.request
import urllib.error
from datetime import datetime, timedelta
from typing import List, Dict
import os

# Web of Science API 配置
WOS_API_KEY = os.getenv('WOS_API_KEY', '')
WOS_API_URL = "https://api.clarivate.com/api/wos"

# 骨科相关检索词
SEARCH_QUERY = """
(TS=(orthopedic* OR orthopaedic* OR bone OR "skeletal muscle" OR cartilage OR
    tendon OR ligament OR "intervertebral disc" OR joint OR spine OR "bone marrow"
    OR osteoblast* OR osteoclast* OR chondrocyte*))
AND
(TS=("basic research" OR mechanism OR pathway OR "signaling" OR molecular OR
    cellular OR "in vitro" OR "in vivo" OR animal OR rat OR mouse))
NOT
(TS=(clinical trial OR patient* OR surgery OR "case report" OR review))
"""

# 研究方向分类关键词
RESEARCH_AREAS = {
    "bone_regeneration": {
        "name": "骨再生与修复",
        "flower": "rose",
        "color": "#FF6B6B",
        "keywords": ["bone regeneration", "fracture healing", "bone repair", "callus", "bone formation"]
    },
    "bone_metabolism": {
        "name": "骨代谢与矿化",
        "flower": "sunflower",
        "color": "#FFD93D",
        "keywords": ["bone metabolism", "mineralization", "calcium", "phosphate", "bone turnover"]
    },
    "cartilage": {
        "name": "关节软骨研究",
        "flower": "tulip",
        "color": "#C084FC",
        "keywords": ["cartilage", "osteoarthritis", "chondrocyte", "articular", "joint degeneration"]
    },
    "spine": {
        "name": "脊柱与椎间盘",
        "flower": "lavender",
        "color": "#A78BFA",
        "keywords": ["spine", "intervertebral disc", "vertebrae", "spinal", "disc degeneration"]
    },
    "biomaterials": {
        "name": "生物材料",
        "flower": "daisy",
        "color": "#6EE7B7",
        "keywords": ["biomaterial", "scaffold", "hydrogel", "implant", "tissue engineering"]
    },
    "stem_cells": {
        "name": "干细胞研究",
        "flower": "lotus",
        "color": "#F9A8D4",
        "keywords": ["stem cell", "BMSC", "mesenchymal", "progenitor", "differentiation"]
    },
    "infection": {
        "name": "骨感染",
        "flower": "cactus",
        "color": "#8B5A2B",
        "keywords": ["osteomyelitis", "infection", "bacteria", "biofilm", "antimicrobial"]
    },
    "tumor": {
        "name": "骨肿瘤",
        "flower": "hibiscus",
        "color": "#EF4444",
        "keywords": ["bone tumor", "sarcoma", "osteosarcoma", "chondrosarcoma", "metastasis"]
    },
    "mechanobiology": {
        "name": "力学生物学",
        "flower": "dandelion",
        "color": "#94A3B8",
        "keywords": ["mechanobiology", "mechanical loading", "strain", "stress", "mechanotransduction"]
    }
}


def classify_paper(title: str, abstract: str) -> str:
    """根据标题和摘要分类研究方向"""
    text = (title + " " + abstract).lower()
    scores = {}

    for area_id, area_info in RESEARCH_AREAS.items():
        score = sum(1 for keyword in area_info["keywords"] if keyword.lower() in text)
        if score > 0:
            scores[area_id] = score

    # 返回得分最高的分类，如果没有匹配则返回默认
    if scores:
        return max(scores, key=scores.get)
    return "bone_regeneration"  # 默认分类


def calculate_flower_size(citations: int) -> Dict:
    """根据被引量计算花朵大小"""
    # 花瓣数量：被引量/10，最大20瓣
    petal_count = min(max(citations // 10, 5), 20)

    # 花朵直径：对数缩放，范围20-80像素
    diameter = 20 + min(60, (citations ** 0.5) * 3)

    # 高度：被引量越高，花茎越高
    stem_height = 30 + min(70, citations // 5)

    return {
        "petal_count": petal_count,
        "diameter": diameter,
        "stem_height": stem_height,
        "scale": 0.5 + min(1.5, citations / 200)
    }


def fetch_wos_data() -> List[Dict]:
    """
    从Web of Science获取数据
    注意：需要有效的API Key
    """
    if not WOS_API_KEY:
        print("警告: 未设置 WOS_API_KEY，使用模拟数据")
        return generate_mock_data()

    headers = {
        "X-ApiKey": WOS_API_KEY,
        "Accept": "application/json"
    }

    # 计算时间范围（近5年）
    end_date = datetime.now()
    start_date = end_date - timedelta(days=5*365)

    papers = []

    # 分页获取数据
    for page in range(1, 6):  # 获取前500篇，然后筛选Top100
        params = {
            "databaseId": "WOS",
            "usrQuery": SEARCH_QUERY,
            "publishTimeSpan": f"{start_date.strftime('%Y-%m-%d')}+{end_date.strftime('%Y-%m-%d')}",
            "sortField": "TC",  # 按被引量排序
            "sortOrder": "DESC",
            "firstRecord": (page - 1) * 100 + 1,
            "count": 100
        }

        try:
            response = requests.get(
                f"{WOS_API_URL}/query",
                headers=headers,
                params=params,
                timeout=30
            )
            response.raise_for_status()
            data = response.json()

            for record in data.get("Data", {}).get("Records", {}).get("records", []):
                paper = parse_record(record)
                if paper:
                    papers.append(paper)

            time.sleep(1)  # 避免请求过快

        except Exception as e:
            print(f"获取第{page}页数据失败: {e}")
            break

    # 取Top100
    papers = sorted(papers, key=lambda x: x["citations"], reverse=True)[:100]

    return papers


def parse_record(record: Dict) -> Dict:
    """解析Web of Science记录"""
    try:
        title = record.get("title", {}).get("title", [{}])[0].get("content", "")
        abstract = record.get("abstract", {}).get("abstract_text", [{}])[0].get("content", "")
        authors = [a.get("full_name", "") for a in record.get("author", {}).get("authors", [])]
        journal = record.get("source", {}).get("source_title", [{}])[0].get("content", "")
        year = record.get("source", {}).get("publishYear", "")
        citations = int(record.get("citations", {}).get("count", 0))
        doi = record.get("identifier", {}).get("doi", "")

        # 分类
        category = classify_paper(title, abstract)

        # 计算花朵属性
        flower_props = calculate_flower_size(citations)

        return {
            "id": doi or f"paper_{len(title)}",
            "title": title,
            "authors": authors[:5],  # 只保留前5位作者
            "journal": journal,
            "year": year,
            "citations": citations,
            "doi": doi,
            "abstract": abstract[:500] + "..." if len(abstract) > 500 else abstract,
            "category": category,
            "category_name": RESEARCH_AREAS[category]["name"],
            "flower_type": RESEARCH_AREAS[category]["flower"],
            "flower_color": RESEARCH_AREAS[category]["color"],
            "flower_props": flower_props
        }
    except Exception as e:
        print(f"解析记录失败: {e}")
        return None


def generate_mock_data() -> List[Dict]:
    """生成模拟数据（用于测试）"""
    import random

    papers = []
    categories = list(RESEARCH_AREAS.keys())

    # 真实的骨科论文标题模板
    title_templates = [
        "{mechanism} of {target} in {disease} through {pathway}",
        "{method} enhances {outcome} in {model}",
        "Role of {factor} in regulating {process}",
        "{cell_type} differentiation mediated by {signal}",
        "{intervention} promotes {tissue} regeneration via {mechanism}"
    ]

    mechanisms = ["Activation", "Inhibition", "Regulation", "Modulation"]
    targets = ["BMP signaling", "Wnt pathway", "NF-κB", "PI3K/Akt", "MAPK"]
    diseases = ["osteoporosis", "osteoarthritis", "fracture", "bone defect"]
    pathways = ["autophagy", "apoptosis", "inflammation", "oxidative stress"]

    for i in range(100):
        category = random.choice(categories)
        citations = random.randint(10, 500)

        # 生成模拟标题
        template = random.choice(title_templates)
        title = template.format(
            mechanism=random.choice(mechanisms),
            target=random.choice(targets),
            disease=random.choice(diseases),
            pathway=random.choice(pathways),
            method="CRISPR" if random.random() > 0.5 else "siRNA",
            outcome="bone formation",
            model="rat model",
            factor="miR-21",
            process="osteogenesis",
            cell_type="BMSC",
            signal="TGF-β",
            intervention="Exercise",
            tissue="cartilage"
        )

        flower_props = calculate_flower_size(citations)

        papers.append({
            "id": f"mock_{i}",
            "title": title,
            "authors": [f"Author {j}" for j in range(random.randint(3, 6))],
            "journal": random.choice(["Nature Bone", "Bone Research", "JBMR", "Osteoarthritis Cartilage"]),
            "year": random.randint(2021, 2026),
            "citations": citations,
            "doi": f"10.1000/mock{i}",
            "abstract": f"This study investigates the role of {category} in orthopedic research...",
            "category": category,
            "category_name": RESEARCH_AREAS[category]["name"],
            "flower_type": RESEARCH_AREAS[category]["flower"],
            "flower_color": RESEARCH_AREAS[category]["color"],
            "flower_props": flower_props
        })

    return sorted(papers, key=lambda x: x["citations"], reverse=True)


def generate_garden_layout(papers: List[Dict]) -> List[Dict]:
    """生成3D花园布局"""
    import random
    import math

    # 按类别分组
    categories = {}
    for paper in papers:
        cat = paper["category"]
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(paper)

    # 为每个类别分配花园区域
    layout = []
    garden_radius = 50

    for idx, (cat, cat_papers) in enumerate(categories.items()):
        # 计算类别中心位置（圆形分布）
        angle = (2 * math.pi * idx) / len(categories)
        center_x = math.cos(angle) * garden_radius * 0.6
        center_z = math.sin(angle) * garden_radius * 0.6

        # 在该区域内随机分布花朵
        for i, paper in enumerate(cat_papers):
            # 在类别中心周围随机分布
            r = random.uniform(0, 15)
            theta = random.uniform(0, 2 * math.pi)

            x = center_x + r * math.cos(theta)
            z = center_z + r * math.sin(theta)
            y = 0  # 地面高度

            paper["position"] = {
                "x": round(x, 2),
                "y": y,
                "z": round(z, 2)
            }

            # 添加一些随机旋转
            paper["rotation"] = {
                "x": 0,
                "y": random.uniform(0, 360),
                "z": 0
            }

            layout.append(paper)

    return layout


def main():
    """主函数"""
    print("🌸 开始获取骨科论文数据...")

    # 获取数据
    papers = fetch_wos_data()
    print(f"✅ 获取到 {len(papers)} 篇论文")

    # 生成布局
    garden_data = generate_garden_layout(papers)

    # 保存数据
    output = {
        "generated_at": datetime.now().isoformat(),
        "total_papers": len(garden_data),
        "categories": {k: v for k, v in RESEARCH_AREAS.items()},
        "papers": garden_data
    }

    with open("top100.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print("✅ 数据已保存到 top100.json")

    # 生成统计信息
    print("\n📊 数据统计:")
    print(f"总论文数: {len(garden_data)}")
    cat_counts = {}
    for p in garden_data:
        cat = p["category_name"]
        cat_counts[cat] = cat_counts.get(cat, 0) + 1

    for cat, count in sorted(cat_counts.items(), key=lambda x: -x[1]):
        print(f"  {cat}: {count}篇")

    print(f"\n平均被引量: {sum(p['citations'] for p in garden_data) / len(garden_data):.1f}")
    print(f"最高被引量: {max(p['citations'] for p in garden_data)}")


if __name__ == "__main__":
    main()
