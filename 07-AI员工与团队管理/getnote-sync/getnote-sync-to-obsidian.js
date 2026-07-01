#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 配置
const OBSIDIAN_ROOT = '/Users/kunki/ObsidianVaults/领航知识库';
const GETNOTES_FOLDER = path.join(OBSIDIAN_ROOT, '00-inbox', '020 GetNotes');

// 类型映射到文件夹
const TYPE_MAP = {
  'class_audio': '01 语音记录',
  'recorder_audio': '01 语音记录',
  'meeting': '02 多人会议',
  'plain_text': '03 纯文本记录',
  'link': '04 链接同步摘抄',
  'img_text': '04 链接同步摘抄',
};

// 获取所有笔记
console.log('📥 获取所有笔记列表...');
const allNotesJson = execSync('~/bin/getnote notes --all -o json', { encoding: 'utf8' });
const result = JSON.parse(allNotesJson);
const allNotes = result.data.notes;
console.log(`✅ 共 ${allNotes.length} 条笔记`);

// 处理每条笔记
let syncedCount = 0;
let skippedCount = 0;

for (const note of allNotes) {
  // 确定目标文件夹
  const folderName = TYPE_MAP[note.type] || '99 其他';
  const targetFolder = path.join(GETNOTES_FOLDER, folderName);
  
  // 生成安全的文件名
  const safeTitle = (note.title || `untitled-${note.id}`)
    .replace(/[\\/*?:"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
  const fileName = `${safeTitle}.md`;
  const filePath = path.join(targetFolder, fileName);
  
  // 检查文件是否已存在
  if (fs.existsSync(filePath)) {
    // 跳过已存在的，避免重复覆盖
    skippedCount++;
    continue;
  }
  
  console.log(`\n_syncing: ${safeTitle}`);
  
  // 获取笔记详情
  try {
    const noteJson = execSync(`~/bin/getnote note ${note.id} -o json`, { encoding: 'utf8' });
    const noteResult = JSON.parse(noteJson);
    const noteDetail = noteResult.data.note;
    
    // 生成 Markdown 内容
    let content = `---\n`;
    content += `getnote_id: ${note.id}\n`;
    content += `title: ${noteDetail.title || ''}\n`;
    content += `type: ${noteDetail.type}\n`;
    content += `created_at: ${noteDetail.created_at}\n`;
    content += `url: https://biji.com/note/${note.id}\n`;
    content += `tags:\n`;
    if (noteDetail.tags && Array.isArray(noteDetail.tags)) {
      noteDetail.tags.forEach(tag => {
        content += `  - ${tag}\n`;
      });
    }
    content += `---\n\n`;
    
    if (noteDetail.title) {
      content += `# ${noteDetail.title}\n\n`;
    }
    
    if (noteDetail.content) {
      content += `${noteDetail.content}\n\n`;
    }
    
    content += `来源: [得到大脑](${noteDetail.url || `https://biji.com/note/${note.id}`})\n`;
    
    // 写入文件
    fs.writeFileSync(filePath, content, 'utf8');
    syncedCount++;
    console.log(`✅ Created: ${path.relative(OBSIDIAN_ROOT, filePath)}`);
  } catch (error) {
    console.error(`❌ Failed to sync ${note.id}: ${error.message}`);
  }
}

console.log(`\n🎉 同步完成！`);
console.log(`   新增: ${syncedCount} 条笔记`);
console.log(`   跳过: ${skippedCount} 条（已存在）`);
console.log(`   总计: ${syncedCount + skippedCount} / ${allNotes.length}`);
