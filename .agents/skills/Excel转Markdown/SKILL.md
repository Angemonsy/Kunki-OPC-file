---
name: Excel转Markdown
description: 将Excel表格原封不动转为Markdown文档，保留所有列和数据，方便AI直接读取。
  触发场景：当用户需要将Excel转为Markdown、需要AI读取Excel数据、需要把表格数据转成md时自动调用。

  关键词：Excel转MD、表格转MD、xlsx转md、读取Excel、Excel转Markdown

  快速启动：用户说"把这个Excel转成md"即可启动。
---

# Excel 转 Markdown

## 功能

将 .xlsx 文件的所有列和数据原封不动转为 Markdown 表格文件，方便 AI 后续直接 Read 读取。

## 执行步骤

### 1. 确认输入

用户提供 Excel 文件路径（vault 内的相对路径或绝对路径）。如果用户没指定输出路径，默认存到同目录下，文件名改为 `.md` 后缀。

### 2. 生成并运行 Python 脚本

在 vault 根目录创建临时脚本 `_excel_to_md_temp.py`，执行后立即删除。

**脚本模板**（根据实际路径替换）：

```python
import openpyxl, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

input_path = r'{输入文件路径}'
output_path = r'{输出文件路径}'

wb = openpyxl.load_workbook(input_path)
ws = wb.active

# 读取表头
headers = [str(c.value) if c.value else f'列{i}' for i, c in enumerate(ws[1])]

# 读取所有数据行
rows = list(ws.iter_rows(min_row=2, values_only=True))

def clean(v, max_len=0):
    """清理单元格内容，处理换行和管道符"""
    if v is None: return ''
    s = str(v).replace('|', '/').replace('\n', ' ').replace('\r', ' ')
    if max_len and len(s) > max_len:
        s = s[:max_len] + '...'
    return s

lines = []
lines.append(f'# {ws.title}')
lines.append('')
lines.append(f'> 从 Excel 自动转换，共 {len(rows)} 行数据')
lines.append('')
lines.append('---')
lines.append('')

# 表头
lines.append('| ' + ' | '.join(headers) + ' |')
lines.append('|' + '|'.join(['------' for _ in headers]) + '|')

# 数据行
for r in rows:
    cells = [clean(r[i], 150) for i in range(len(headers))]
    lines.append('| ' + ' | '.join(cells) + ' |')

output = '\n'.join(lines)
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(output)

print(f'Done! {len(rows)} rows, {len(headers)} columns written to {output_path}')
```

### 3. 执行流程

```
创建临时脚本 _excel_to_md_temp.py
    ↓
python _excel_to_md_temp.py
    ↓
删除临时脚本 rm _excel_to_md_temp.py
    ↓
告知用户输出路径和数据概况（行数、列数）
```

### 4. 可选：排序

如果用户指定了排序列（如"按阅读量排序"），在脚本中加入排序逻辑：

```python
sort_col = {排序列索引}
def parse_num(v):
    if not v: return 0
    s = str(v).replace('+','').replace(',','')
    return int(s) if s.isdigit() else 0

rows.sort(key=lambda r: parse_num(r[sort_col]), reverse=True)
```

### 5. 可选：截断长内容

如果某列内容过长（如文章正文），可设置 max_len 截断：

```python
# 对特定列设置截断长度
col_max_len = {18: 200, 21: 150}  # 列索引: 最大字符数
cells = [clean(r[i], col_max_len.get(i, 0)) for i in range(len(headers))]
```

## 注意事项

- 依赖 Python 的 openpyxl 库（用户环境已安装）
- Windows 终端编码问题：脚本开头必须加 `sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')`
- 临时脚本用完即删，不留垃圾文件
- 单元格中的 `|` 会被替换为 `/`，避免破坏 Markdown 表格
- 单元格中的换行会被替换为空格
