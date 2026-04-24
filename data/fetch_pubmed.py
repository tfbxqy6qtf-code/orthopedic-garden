#!/usr/bin/env python3
"""
PubMed + Semantic Scholar 数据获取脚本
免费获取骨科基础研究论文数据
"""

import json
import time
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime
from typing import List, Dict
import os

# ============ 配置 ============
# 检索策略：近5年骨科基础研究
SEARCH_QUERY = "(orthopedic[Title/Abstract] OR orthopaedic[Title/Abstract] OR bone[Title/Abstract] OR cartilage[Title/Abstract] OR spine[Title/Abstract] OR joint[Title/Abstract]) AND (basic research[Title/Abstract] OR mechanism[Title/Abstract] OR pathway[Title/Abstract] OR molecular[Title/Abstract] OR cellular[Title/Abstract]) NOT (clinical trial[Title/Abstract] OR case report[Title/Abstract])"

# 研究方向分类关键词
RESEARCH_AREAS = {
    "bone_regeneration": {
        "name": "骨再生与修复",
        "flower": "rose",
        "color": "#FF6B6B",
        "keywords": ["bone regeneration", "fracture healing", "bone repair", "callus", "bone formation", "osteogenesis"]
    },
    "bone_metabolism": {
        "name": "骨代谢与矿化",
        "flower": "sunflower",
        "color": "#FFD93D",
        "keywords": ["bone metabolism", "mineralization", "calcium", "phosphate", "bone turnover", "osteoclast", "osteoblast"]
    },
    "cartilage": {
        "name": "关节软骨研究",
        "flower": "tulip",
        "color": "#C084FC",
        "keywords": ["cartilage", "osteoarthritis", "chondrocyte", "articular", "joint degeneration", "meniscus"]
    },
    "spine": {
        "name": "脊柱与椎间盘",
        "flower": "lavender",
        "color": "#A78BFA",
        "keywords": ["spine", "intervertebral disc", "vertebrae", "spinal", "disc degeneration", "scoliosis"]
    },
    "biomaterials": {
        "name": "生物材料",
        "flower": "daisy",
        "color": "#6EE7B7",
        "keywords": ["biomaterial", "scaffold", "hydrogel", "implant", "tissue engineering", "3D printing"]
    },
    "stem_cells": {
        "name": "干细胞研究",
        "flower": "lotus",
        "color": "#F9A8D4",
        "keywords": ["stem cell", "BMSC", "mesenchymal", "progenitor", "differentiation", "iPSC"]
    },
    "infection": {
        "name": "骨感染",
        "flower": "cactus",
        "color": "#8B5A2B",
        "keywords": ["osteomyelitis", "infection", "bacteria", "biofilm", "antimicrobial", "septic"]
    },
    "tumor": {
        "name": "骨肿瘤",
        "flower": "hibiscus",
        "color": "#EF4444",
        "keywords": ["bone tumor", "sarcoma", "osteosarcoma", "chondrosarcoma", "metastasis", "bone cancer"]
    },
    "mechanobiology": {
        "name": "力学生物学",
        "flower": "dandelion",
        "color": "#94A3B8",
        "keywords": ["mechanobiology", "mechanical loading", "strain", "stress", "mechanotransduction", "biomechanics"]
    }
}


def fetch_pubmed_ids(query: str, max_results: int = 200) -> List[str]:
    """从 PubMed 获取论文 ID 列表"""
    print(f"🔍 正在搜索 PubMed: {query[:50]}...")

    # 构建搜索 URL
    search_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
    params = {
        "db": "pubmed",
        "term": query,
        "retmax": max_results,
        "sort": "date",
        "retmode": "json",
        "mindate": "2021",
        "maxdate": "2026"
    }

    url = f"{search_url}?{urllib.parse.urlencode(params)}"

    try:
        with urllib.request.urlopen(url, timeout=30) as response:
            data = json.loads(response.read().decode('utf-8'))
            idlist = data.get('esearchresult', {}).get('idlist', [])
            print(f"✅ 找到 {len(idlist)} 篇论文")
            return idlist
    except Exception as e:
        print(f"❌ PubMed 搜索失败: {e}")
        return []


def fetch_pubmed_details(pmids: List[str]) -> List[Dict]:
    """获取论文详细信息"""
    if not pmids:
        return []

    print(f"📄 正在获取 {len(pmids)} 篇论文详情...")

    summary_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi"
    params = {
        "db": "pubmed",
        "id": ",".join(pmids[:200]),  # 每次最多200篇
        "retmode": "json"
    }

    url = f"{summary_url}?{urllib.parse.urlencode(params)}"

    try:
        with urllib.request.urlopen(url, timeout=60) as response:
            data = json.loads(response.read().decode('utf-8'))
            result = data.get('result', {})
            uids = result.get('uids', [])

            papers = []
            for uid in uids:
                paper = result.get(uid, {})
                if paper:
                    papers.append(parse_pubmed_paper(paper, uid))

            return papers
    except Exception as e:
        print(f"❌ 获取详情失败: {e}")
        return []


def parse_pubmed_paper(paper: Dict, pmid: str) -> Dict:
    """解析 PubMed 论文数据"""
    title = paper.get('title', '')
    authors = [a.get('name', '') for a in paper.get('authors', [])]
    journal = paper.get('fulljournalname', paper.get('source', ''))
    year = paper.get('pubdate', '').split()[0] if paper.get('pubdate') else ''
    doi = paper.get('elocationid', '').replace('doi: ', '') if paper.get('elocationid') else ''

    return {
        "id": pmid,
        "pmid": pmid,
        "title": title,
        "authors": authors[:5],
        "journal": journal,
        "year": year,
        "citations": 0,  # 稍后用 Semantic Scholar 补充
        "doi": doi,
        "abstract": "",  # PubMed 需要单独获取摘要
        "category": "",
        "category_name": "",
        "flower_type": "",
        "flower_color": "",
        "flower_props": {},
        "position": {},
        "rotation": {}
    }


def fetch_semantic_scholar_citations(dois: List[str]) -> Dict[str, int]:
    """从 Semantic Scholar 获取被引量"""
    print(f"📊 正在获取被引量数据...")

    citations = {}

    for doi in dois:
        if not doi:
            continue

        try:
            url = f"https://api.semanticscholar.org/graph/v1/paper/DOI:{doi}?fields=citationCount"
            req = urllib.request.Request(
                url,
                headers={'User-Agent': 'Mozilla/5.0 (Academic Project)'}
            )

            with urllib.request.urlopen(req, timeout=10) as response:
                data = json.loads(response.read().decode('utf-8'))
                citations[doi] = data.get('citationCount', 0)

            time.sleep(0.1)  # 避免请求过快

        except Exception as e:
            citations[doi] = 0

    print(f"✅ 获取了 {len(citations)} 篇论文的被引量")
    return citations


def classify_paper(title: str, abstract: str = "") -> str:
    """根据标题和摘要分类研究方向"""
    text = (title + " " + abstract).lower()
    scores = {}

    for area_id, area_info in RESEARCH_AREAS.items():
        score = sum(1 for keyword in area_info["keywords"] if keyword.lower() in text)
        if score > 0:
            scores[area_id] = score

    if scores:
        return max(scores, key=scores.get)
    return "bone_regeneration"  # 默认分类


def calculate_flower_size(citations: int) -> Dict:
    """根据被引量计算花朵大小"""
    petal_count = min(max(citations // 10, 5), 20)
    diameter = 20 + min(60, (citations ** 0.5) * 3)
    stem_height = 30 + min(70, citations // 5)
    scale = 0.5 + min(1.5, citations / 200)

    return {
        "petal_count": petal_count,
        "diameter": diameter,
        "stem_height": stem_height,
        "scale": scale
    }


def generate_garden_layout(papers: List[Dict]) -> List[Dict]:
    """生成花园布局"""
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
        angle = (2 * math.pi * idx) / len(categories)
        center_x = math.cos(angle) * garden_radius * 0.6
        center_z = math.sin(angle) * garden_radius * 0.6

        for i, paper in enumerate(cat_papers):
            r = random.uniform(0, 15)
            theta = random.uniform(0, 2 * math.pi)

            x = center_x + r * math.cos(theta)
            z = center_z + r * math.sin(theta)

            paper["position"] = {
                "x": round(x, 2),
                "y": 0,
                "z": round(z, 2)
            }
            paper["rotation"] = {
                "x": 0,
                "y": random.uniform(0, 360),
                "z": 0
            }
            layout.append(paper)

    return layout


def main():
    """主函数"""
    print("🌸 骨科论文花园 - 数据获取工具")
    print("=" * 50)
    print("数据来源: PubMed + Semantic Scholar (免费)")
    print("=" * 50)

    # 1. 搜索论文
    pmids = fetch_pubmed_ids(SEARCH_QUERY, max_results=200)
    if not pmids:
        print("❌ 未找到论文，使用备用方案...")
        return

    # 2. 获取详细信息
    papers = fetch_pubmed_details(pmids)
    print(f"✅ 获取到 {len(papers)} 篇论文详情")

    # 3. 获取被引量（使用 Semantic Scholar）
    dois = [p["doi"] for p in papers if p["doi"]]
    if dois:
        print(f"📊 正在获取 {len(dois)} 篇论文的被引量...")
        citations = fetch_semantic_scholar_citations(dois[:100])  # 限制100篇避免超时

        for paper in papers:
            if paper["doi"] in citations:
                paper["citations"] = citations[paper["doi"]]

    # 4. 按被引量排序并取Top100
    papers = sorted(papers, key=lambda x: x["citations"], reverse=True)[:100]
    print(f"✅ 精选 Top {len(papers)} 篇论文")

    # 5. 分类
    for paper in papers:
        category = classify_paper(paper["title"], paper.get("abstract", ""))
        paper["category"] = category
        paper["category_name"] = RESEARCH_AREAS[category]["name"]
        paper["flower_type"] = RESEARCH_AREAS[category]["flower"]
        paper["flower_color"] = RESEARCH_AREAS[category]["color"]
        paper["flower_props"] = calculate_flower_size(paper["citations"])

    # 6. 生成布局
    garden_data = generate_garden_layout(papers)

    # 7. 保存数据
    output = {
        "generated_at": datetime.now().isoformat(),
        "total_papers": len(garden_data),
        "categories": RESEARCH_AREAS,
        "papers": garden_data
    }

    with open("top100.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print("\n✅ 数据已保存到 top100.json")

    # 8. 统计信息
    print("\n📊 数据统计:")
    print(f"总论文数: {len(garden_data)}")
    cat_counts = {}
    for p in garden_data:
        cat = p["category_name"]
        cat_counts[cat] = cat_counts.get(cat, 0) + 1

    for cat, count in sorted(cat_counts.items(), key=lambda x: -x[1]):
        print(f"  {cat}: {count}篇")

    if garden_data:
        avg_citations = sum(p["citations"] for p in garden_data) / len(garden_data)
        max_citations = max(p["citations"] for p in garden_data)
        print(f"\n平均被引量: {avg_citations:.1f}")
        print(f"最高被引量: {max_citations}")

        # 显示Top 5
        print("\n🏆 Top 5 高被引论文:")
        for i, p in enumerate(garden_data[:5], 1):
            print(f"  {i}. {p['title'][:60]}... ({p['citations']}次)")


if __name__ == "__main__":
    main()
