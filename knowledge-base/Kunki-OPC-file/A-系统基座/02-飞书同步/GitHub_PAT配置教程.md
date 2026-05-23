# GitHub 个人访问令牌(PAT)配置教程 - 小龙虾读写知识库

## 🎯 目标
给云服务器上的小龙虾配置 GitHub 推送权限，让它能把生成的内容直接提交回你的 `Kunki-OPC-file` 仓库。

---

## 🔐 第一步：在 GitHub 网站生成 Token

1. **登录 GitHub**：打开 https://github.com ，登录你的账号 `Angemonsy`

2. **进入设置**：
   - 点击右上角头像 → **Settings**
   - 往下拉，左边菜单找 **Developer settings**（在最底下），点进去

3. **生成新 Token**：
   - 点 **Personal access tokens** → **Tokens (classic)**
   - 点右上角 **Generate new token** → **Generate new token (classic)**

4. **配置 Token 权限**：
   - **Note** 填 `cloud-lobster-access` （备注一下用途）
   - **Expiration** 选 `No expiration` （永不过期，或者选一年也可以）
   - **勾选权限范围**：只勾 `repo` 这一整组就够了！
     - ✅ `repo` → `repo:status`
     - ✅ `repo` → `repo_deployment`
     - ✅ `repo` → `public_repo`
     - ✅ `repo` → `repo:invite`
     - 其他都不用勾

5. **生成并保存 Token**：
   - 点最底下 **Generate token**
   - **⚠️ 立刻复制 Token 保存！** GitHub 只显示这一次，刷页面就没了

---

## 💻 第二步：在小龙虾那边配置 Git

在小龙虾所在的云服务器上执行：

```bash
# 1. 如果还没克隆仓库，用稀疏克隆（推荐）
git clone --depth=1 https://<你的Token>@github.com/Angemonsy/Kunki-OPC-file.git

# 或者，如果已经克隆了，设置远程地址带Token：
cd /path/to/Kunki-OPC-file
git remote set-url origin https://<你的Token>@github.com/Angemonsy/Kunki-OPC-file.git
```

**把 `<你的Token>` 替换成你刚才复制的那串字符**。

---

## ✅ 验证是否成功

在小龙虾那边测试一下：

```bash
cd /path/to/Kunki-OPC-file
echo "# 测试推送\n测试时间: $(date)" > test-push.md
git add test-push.md
git commit -m "测试：小龙虾推送权限验证"
git push origin main
```

去 GitHub 网站看看你的仓库，如果 `test-push.md` 出现了，就是成功了！

成功后可以删掉测试文件：
```bash
rm test-push.md
git add .
git commit -m "清理：删除测试文件"
git push origin main
```

---

## 🔒 安全说明

- Token 只给了 `repo` 权限，只能操作你这一个仓库，不能干别的
- 如果泄漏了，去 GitHub 删掉这个 Token 再生成一个就行
- 只给公开仓库读写，不会影响你其他私有仓库

---

## 🎯 之后小龙虾怎么用

配好之后，小龙虾这边操作流程：

1. **读取内容**：用 `kunki-knowledge-base` skill，直接按优先级从 GitHub 读文件
2. **生成内容**：按知识库结构放到对应位置（比如每日复盘放 `C-记忆核心/02-每日输入/`）
3. **提交回GitHub**：
   ```bash
   git pull origin main  # 先拉最新，避免冲突
   git add .
   git commit -m "[龙虾] YYYY-MM-DD 内容更新说明"
   git push origin main
   ```
4. **你本地拿**：你在本地电脑执行 `git pull origin main` 就拿到小龙虾更新的内容了

---

## 💡 优势对比

| 方式 | Token消耗 | 速度 | 复杂度 |
|------|----------|------|--------|
| 走飞书同步 | 高，每次读都要耗 | 慢 | 复杂 |
| 走GitHub直接读写 | 几乎不耗飞书token | 快 | 简单，配一次一直用 |

---

*最后更新：2026-05-17*
