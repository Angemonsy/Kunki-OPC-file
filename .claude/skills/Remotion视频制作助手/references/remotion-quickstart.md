# Remotion 快速入门指南

## 什么是 Remotion？

Remotion 是一个使用 React 创建视频的框架。你可以用熟悉的 React 组件来编写视频内容，然后将其渲染为 MP4 视频文件。

## 核心概念

### 1. Composition（组合）

Composition 是视频的基本单元，定义了视频的属性：

```typescript
<Composition
  id="MyVideo"              // 唯一标识符
  component={MyVideo}       // React 组件
  durationInFrames={150}    // 视频时长（帧数）
  fps={30}                  // 帧率
  width={1920}              // 宽度
  height={1080}             // 高度
/>
```

### 2. useCurrentFrame

获取当前渲染的帧数，用于创建动画：

```typescript
const frame = useCurrentFrame();
// frame 从 0 开始，每帧递增 1
```

### 3. interpolate

将帧数映射到动画值：

```typescript
const opacity = interpolate(
  frame,           // 输入值（当前帧）
  [0, 30],        // 输入范围
  [0, 1],         // 输出范围
  {
    extrapolateLeft: 'clamp',   // 左侧边界处理
    extrapolateRight: 'clamp',  // 右侧边界处理
  }
);
```

### 4. Sequence

控制元素在时间轴上的出现时间：

```typescript
<Sequence from={30} durationInFrames={60}>
  <MyComponent />
</Sequence>
```

## 快速开始

### 步骤 1：创建项目

```bash
npm init video
# 或
yarn create video
```

### 步骤 2：启动开发服务器

```bash
cd my-video
npm start
```

浏览器会自动打开 `http://localhost:3000`

### 步骤 3：编辑视频组件

编辑 `src/Video.tsx`：

```typescript
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

export const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1 style={{opacity, fontSize: 100}}>
        Hello Remotion!
      </h1>
    </AbsoluteFill>
  );
};
```

### 步骤 4：渲染视频

```bash
npm run build
```

视频会输出到 `out/video.mp4`

## 常用组件

### AbsoluteFill

填充整个画面的容器：

```typescript
<AbsoluteFill style={{backgroundColor: 'blue'}}>
  {/* 内容 */}
</AbsoluteFill>
```

### Img

显示图片：

```typescript
import {Img, staticFile} from 'remotion';

<Img src={staticFile('image.png')} />
```

### Audio

添加音频：

```typescript
import {Audio, staticFile} from 'remotion';

<Audio src={staticFile('audio.mp3')} />
```

### Video

嵌入视频：

```typescript
import {Video, staticFile} from 'remotion';

<Video src={staticFile('video.mp4')} />
```

## 动画示例

### 淡入效果

```typescript
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateRight: 'clamp',
});
```

### 缩放效果

```typescript
const scale = interpolate(frame, [0, 30], [0.5, 1], {
  extrapolateRight: 'clamp',
});

<div style={{transform: `scale(${scale})`}}>
  内容
</div>
```

### 位移效果

```typescript
const translateY = interpolate(frame, [0, 30], [100, 0], {
  extrapolateRight: 'clamp',
});

<div style={{transform: `translateY(${translateY}px)`}}>
  内容
</div>
```

### 旋转效果

```typescript
const rotate = interpolate(frame, [0, 60], [0, 360]);

<div style={{transform: `rotate(${rotate}deg)`}}>
  内容
</div>
```

## 项目结构

```
my-video/
├── src/
│   ├── Root.tsx          # 主入口，注册 Composition
│   ├── Video.tsx         # 视频组件
│   └── index.ts          # 导出配置
├── public/               # 静态资源
│   ├── audio/
│   └── images/
├── package.json
└── remotion.config.ts    # Remotion 配置
```

## 配置文件

`remotion.config.ts`：

```typescript
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
```

## 常用命令

```bash
# 启动开发服务器
npm start

# 渲染视频
npm run build

# 指定输出路径
npm run build -- --output=out/my-video.mp4

# 渲染特定 Composition
npm run build -- --id=MyVideo

# 自定义编码参数
npm run build -- --codec=h264 --crf=18
```

## 下一步

- 学习更多动画技巧
- 了解数据驱动的批量生成
- 探索音频和字幕功能
- 优化渲染性能
