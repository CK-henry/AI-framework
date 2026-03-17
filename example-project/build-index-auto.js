#!/usr/bin/env node

/**
 * SKILL 索引生成工具 v3.0 (极简版 - 语言无关)
 *
 * 特点：
 * 1. 只需要 YAML 头部 (name + tags)
 * 2. 自动从 Markdown 标题结构提取 sections
 * 3. 无需 @key 标记、@index 表格
 * 4. 完全语言无关，适用于任何项目
 *
 * 使用：
 * node build-index-auto.js [项目目录]
 */

const fs = require('fs');
const path = require('path');

// 递归查找文件
function findFiles(dir, pattern, results = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.GUI' && file !== 'dist') {
        findFiles(fullPath, pattern, results);
      }
    } else if (file.endsWith(pattern)) {
      results.push(fullPath);
    }
  }

  return results;
}

// 解析 YAML 头部
function parseYamlHeader(content) {
  const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!yamlMatch) return null;

  const yaml = {};
  const lines = yamlMatch[1].split('\n');

  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const key = match[1];
      let value = match[2].trim();

      // 解析数组 [a, b, c]
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(s => s.trim());
      }

      yaml[key] = value;
    }
  }

  return yaml;
}

// 自动从 Markdown 标题提取 sections
function extractSectionsFromHeadings(content, lines) {
  const sections = {};
  const headingRegex = /^(#{2,4})\s+(.+)$/;

  let currentSection = null;
  let currentStart = null;

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const match = line.match(headingRegex);

    if (match) {
      // 保存上一个 section
      if (currentSection && currentStart) {
        sections[currentSection.key].end = lineNum - 1;
      }

      const level = match[1].length;  // 2, 3, or 4
      const title = match[2].trim();

      // 生成 key: 从标题提取英文/拼音作为 key
      const key = generateKey(title, level);

      // 从标题提取 tags
      const tags = extractTagsFromTitle(title);

      sections[key] = {
        level,
        title,
        start: lineNum,
        end: null,
        tags
      };

      currentSection = { key, level };
      currentStart = lineNum;
    }
  });

  // 处理最后一个 section
  if (currentSection && currentStart) {
    sections[currentSection.key].end = lines.length;
  }

  return sections;
}

// 从标题生成 key
function generateKey(title, level) {
  // 提取英文单词或使用全标题
  const englishMatch = title.match(/[a-zA-Z_][a-zA-Z0-9_]*/);
  if (englishMatch) {
    const prefix = level === 2 ? '' : level === 3 ? 'api:' : 'sub:';
    return prefix + englishMatch[0].toLowerCase();
  }

  // 如果没有英文，使用标题的前几个字作为 key
  const cleanTitle = title.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
  return cleanTitle.slice(0, 10);
}

// 从标题提取 tags
function extractTagsFromTitle(title) {
  const tags = [];

  // 提取中文词汇
  const chineseWords = title.match(/[\u4e00-\u9fa5]+/g);
  if (chineseWords) {
    tags.push(...chineseWords);
  }

  // 提取英文单词
  const englishWords = title.match(/[a-zA-Z]+/g);
  if (englishWords) {
    tags.push(...englishWords.map(w => w.toLowerCase()));
  }

  return [...new Set(tags)];  // 去重
}

function buildIndex(rootDir) {
  console.log('🔍 扫描 SKILL.md 文件...\n');

  const index = {
    version: '3.0.0',
    mode: 'auto-extract',
    updated: new Date().toISOString(),
    stats: {
      totalFiles: 0,
      totalModules: 0,
      totalSections: 0,
      totalTags: 0
    },
    modules: {},
    tagIndex: {}
  };

  const files = findFiles(rootDir, 'SKILL.md');
  index.stats.totalFiles = files.length;

  console.log(`📄 找到 ${files.length} 个 SKILL.md 文件\n`);

  for (const fullPath of files) {
    const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
    const content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n');

    // 解析 YAML 头部
    const yaml = parseYamlHeader(content);
    if (!yaml || !yaml.name) {
      console.log(`⚠️  跳过 ${relativePath} (无 YAML 头部)`);
      continue;
    }

    console.log(`📦 模块: ${yaml.name} (${yaml.title || ''})`);
    console.log(`   文件: ${relativePath}`);

    // 自动提取 sections
    const sections = extractSectionsFromHeadings(content, lines);
    const sectionCount = Object.keys(sections).length;

    console.log(`   自动提取 ${sectionCount} 个 sections:`);
    for (const [key, section] of Object.entries(sections)) {
      console.log(`   ├─ ${key}: "${section.title}" (${section.start}-${section.end}行)`);
      if (section.tags.length > 0) {
        console.log(`   │  └─ auto-tags: ${section.tags.join(', ')}`);
      }
      index.stats.totalSections++;
    }

    // 合并 YAML tags 和自动提取的 tags
    const moduleTags = Array.isArray(yaml.tags) ? yaml.tags : (yaml.tags ? [yaml.tags] : []);

    // 添加到模块索引
    index.modules[yaml.name] = {
      file: relativePath,
      title: yaml.title || yaml.name,
      tags: moduleTags,
      sections
    };
    index.stats.totalModules++;

    // 构建反向索引
    for (const tag of moduleTags) {
      if (!index.tagIndex[tag]) {
        index.tagIndex[tag] = [];
      }
      if (!index.tagIndex[tag].includes(yaml.name)) {
        index.tagIndex[tag].push(yaml.name);
        index.stats.totalTags++;
      }
    }

    // section tags 也加入反向索引
    for (const [sectionKey, section] of Object.entries(sections)) {
      for (const tag of section.tags || []) {
        if (!index.tagIndex[tag]) {
          index.tagIndex[tag] = [];
        }
        const ref = `${yaml.name}#${sectionKey}`;
        if (!index.tagIndex[tag].includes(ref)) {
          index.tagIndex[tag].push(ref);
        }
      }
    }

    console.log('');
  }

  // 写入索引文件
  const indexPath = path.join(rootDir, 'SKILL.index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

  return { index, indexPath };
}

// 主函数
function main() {
  const rootDir = process.argv[2] || process.cwd();

  console.log('═══════════════════════════════════════════════════════');
  console.log('  🚀 SKILL 索引生成工具 v3.0 (极简版 - 自动提取)');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`📁 项目目录: ${rootDir}\n`);

  try {
    const { index, indexPath } = buildIndex(rootDir);

    console.log('═══════════════════════════════════════════════════════');
    console.log('  📊 统计信息');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`  SKILL 文件数: ${index.stats.totalFiles}`);
    console.log(`  索引模块数: ${index.stats.totalModules}`);
    console.log(`  自动提取 Section 数: ${index.stats.totalSections}`);
    console.log(`  标签总数: ${Object.keys(index.tagIndex).length}`);
    console.log('');

    // 显示部分标签索引
    console.log('  标签索引 (前10):');
    const sortedTags = Object.entries(index.tagIndex)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 10);
    for (const [tag, refs] of sortedTags) {
      console.log(`    "${tag}" → ${refs.slice(0, 3).join(', ')}${refs.length > 3 ? '...' : ''}`);
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log(`✅ 索引已生成: ${indexPath}`);
    console.log('═══════════════════════════════════════════════════════');

    console.log('\n💡 提示: 只需在 SKILL.md 开头添加 YAML 头部即可:');
    console.log('   ---');
    console.log('   name: module-name');
    console.log('   tags: [标签1, 标签2, 标签3]');
    console.log('   ---');
    console.log('\n   工具会自动从 ## ### 标题提取 sections 和 tags');

  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { buildIndex, findFiles };
