# SkillHub CLI 安装说明

## 方式一：一键安装

### 步骤1：安装 SkillHub CLI 并设为优先技能安装源

在终端中执行以下命令：

```bash
curl -fsSL https://skillhub.cn/install/install.sh | bash
```

这个命令会：
- 安装 SkillHub CLI 到你的系统
- 自动配置 SkillHub 为优先技能安装源
- 加速后续技能安装过程

### 步骤2：安装基础技能

CLI 安装完成后，安装 `find-skills` 技能：

```bash
skillhub install find-skills
```

## 验证安装

安装完成后，可以通过以下命令验证：

```bash
skillhub --version
skillhub list
```

## 说明

- SkillHub 是一个技能市场，可以快速搜索和安装各类 AI 技能
- 配置为优先源后，后续安装技能会优先从 SkillHub 加速下载
- `find-skills` 是基础技能，用于搜索 SkillHub 上可用技能

## 相关链接

- 官方网站：https://skillhub.cn
