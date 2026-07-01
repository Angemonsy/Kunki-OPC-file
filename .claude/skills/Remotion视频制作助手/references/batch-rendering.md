# Remotion 批量渲染最佳实践

本文档介绍如何使用 Remotion 进行数据驱动的批量视频生成。

## 核心概念

批量渲染的核心思想是：
1. 准备数据源（JSON、CSV、数据库等）
2. 创建可复用的视频模板组件
3. 动态生成多个 Composition
4. 批量渲染所有视频

## 数据准备

### 方式1：JSON 文件

```json
// data/videos.json
[
  {
    "id": "video-001",
    "title": "2024年销售数据",
    "subtitle": "第一季度报告",
    "data": [120, 150, 180, 200],
    "color": "#3498db"
  },
  {
    "id": "video-002",
    "title": "2024年销售数据",
    "subtitle": "第二季度报告",
    "data": [200, 220, 250, 280],
    "color": "#e74c3c"
  }
]
```

### 方式2：CSV 文件

```csv
id,title,subtitle,value1,value2,value3,value4
video-001,2024年销售数据,第一季度报告,120,150,180,200
video-002,2024年销售数据,第二季度报告,200,220,250,280
```

读取 CSV：

```typescript
import Papa from 'papaparse';
import fs from 'fs';

const csvData = fs.readFileSync('data/videos.csv', 'utf-8');
const parsed = Papa.parse(csvData, {header: true});
const data = parsed.data;
```

### 方式3：数据库查询

```typescript
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const data = await prisma.video.findMany({
  where: {status: 'pending'},
});
```

## 创建模板组件

### 基础模板

```typescript
// src/VideoTemplate.tsx
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

export interface VideoData {
  title: string;
  subtitle: string;
  data: number[];
  color: string;
}

export const VideoTemplate: React.FC<VideoData> = ({
  title,
  subtitle,
  data,
  color,
}) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1]);
  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'white',
        padding: 100,
      }}
    >
      <h1 style={{opacity: titleOpacity, color}}>
        {title}
      </h1>
      <h2 style={{opacity: subtitleOpacity}}>
        {subtitle}
      </h2>

      <div style={{marginTop: 50}}>
        {data.map((value, index) => {
          const height = interpolate(
            frame,
            [40 + index * 10, 60 + index * 10],
            [0, value * 2],
            {extrapolateRight: 'clamp'}
          );

          return (
            <div
              key={index}
              style={{
                width: 80,
                height,
                backgroundColor: color,
                marginRight: 20,
                display: 'inline-block',
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

## 动态注册 Composition

### 方式1：直接导入数据

```typescript
// src/Root.tsx
import {Composition} from 'remotion';
import {VideoTemplate, VideoData} from './VideoTemplate';
import videosData from './data/videos.json';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {videosData.map((video: VideoData) => (
        <Composition
          key={video.id}
          id={video.id}
          component={VideoTemplate}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={video}
        />
      ))}
    </>
  );
};
```

### 方式2：使用 getCompositions

```typescript
// remotion.config.ts
import {Config} from '@remotion/cli/config';
import videosData from './src/data/videos.json';

Config.overrideWebpackConfig((config) => {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@data': path.resolve(__dirname, 'src/data'),
      },
    },
  };
});

export const getCompositions = () => {
  return videosData.map((video) => ({
    id: video.id,
    component: lazy(() => import('./src/VideoTemplate')),
    durationInFrames: 150,
    fps: 30,
    width: 1920,
    height: 1080,
    defaultProps: video,
  }));
};
```

## 批量渲染

### 方式1：Shell 脚本

```bash
#!/bin/bash
# render-all.sh

# 读取所有视频ID
IDS=("video-001" "video-002" "video-003")

# 创建输出目录
mkdir -p out

# 批量渲染
for id in "${IDS[@]}"; do
  echo "Rendering $id..."
  npm run build -- \
    --id="$id" \
    --output="out/$id.mp4"
done

echo "All videos rendered!"
```

### 方式2：Node.js 脚本

```typescript
// scripts/render-all.ts
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import path from 'path';
import videosData from '../src/data/videos.json';

const renderAll = async () => {
  // 1. Bundle 项目
  const bundleLocation = await bundle({
    entryPoint: path.resolve('./src/index.ts'),
    webpackOverride: (config) => config,
  });

  // 2. 批量渲染
  for (const video of videosData) {
    console.log(`Rendering ${video.id}...`);

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: video.id,
      inputProps: video,
    });

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: `out/${video.id}.mp4`,
      inputProps: video,
    });

    console.log(`✓ ${video.id} rendered`);
  }

  console.log('All videos rendered!');
};

renderAll().catch(console.error);
```

运行：

```bash
ts-node scripts/render-all.ts
```

### 方式3：并行渲染

```typescript
// scripts/render-parallel.ts
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import pLimit from 'p-limit';
import videosData from '../src/data/videos.json';

const limit = pLimit(4); // 最多同时渲染4个视频

const renderAll = async () => {
  const bundleLocation = await bundle({
    entryPoint: path.resolve('./src/index.ts'),
  });

  const tasks = videosData.map((video) =>
    limit(async () => {
      console.log(`Starting ${video.id}...`);

      const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: video.id,
      });

      await renderMedia({
        composition,
        serveUrl: bundleLocation,
        codec: 'h264',
        outputLocation: `out/${video.id}.mp4`,
        inputProps: video,
      });

      console.log(`✓ ${video.id} completed`);
    })
  );

  await Promise.all(tasks);
  console.log('All videos rendered!');
};

renderAll().catch(console.error);
```

## 云端渲染

### 使用 Remotion Lambda

```bash
# 1. 部署到 Lambda
npx remotion lambda sites create src/index.ts

# 2. 批量渲染
for id in video-001 video-002 video-003; do
  npx remotion lambda render \
    --region=us-east-1 \
    --composition="$id" \
    --out-name="$id.mp4"
done
```

### 使用 Remotion Cloud Run

```bash
# 1. 部署到 Cloud Run
npx remotion cloudrun sites create src/index.ts

# 2. 批量渲染
for id in video-001 video-002 video-003; do
  npx remotion cloudrun render \
    --region=us-central1 \
    --composition="$id" \
    --out-name="$id.mp4"
done
```

## 性能优化

### 1. 使用并发渲染

```bash
npm run build -- --concurrency=8
```

### 2. 优化组件性能

```typescript
// 使用 React.memo 避免不必要的重渲染
export const ChartBar = React.memo<{value: number; color: string}>(
  ({value, color}) => {
    const frame = useCurrentFrame();
    const height = interpolate(frame, [0, 30], [0, value]);

    return (
      <div
        style={{
          width: 50,
          height,
          backgroundColor: color,
        }}
      />
    );
  }
);
```

### 3. 预加载资源

```typescript
import {delayRender, continueRender, staticFile} from 'remotion';
import {useEffect, useState} from 'react';

export const VideoTemplate: React.FC = () => {
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    // 预加载图片
    const img = new Image();
    img.src = staticFile('logo.png');
    img.onload = () => {
      continueRender(handle);
    };
  }, [handle]);

  return <div>...</div>;
};
```

### 4. 使用缓存

```typescript
// 缓存昂贵的计算
const expensiveData = useMemo(() => {
  return processData(rawData);
}, [rawData]);
```

## 进度监控

### 添加渲染进度回调

```typescript
await renderMedia({
  composition,
  serveUrl: bundleLocation,
  codec: 'h264',
  outputLocation: `out/${video.id}.mp4`,
  onProgress: ({progress, renderedFrames, encodedFrames}) => {
    console.log(`Progress: ${(progress * 100).toFixed(2)}%`);
    console.log(`Rendered: ${renderedFrames}, Encoded: ${encodedFrames}`);
  },
});
```

### 创建进度条

```typescript
import cliProgress from 'cli-progress';

const progressBar = new cliProgress.SingleBar({
  format: 'Rendering |{bar}| {percentage}% | {value}/{total} frames',
});

progressBar.start(composition.durationInFrames, 0);

await renderMedia({
  composition,
  serveUrl: bundleLocation,
  codec: 'h264',
  outputLocation: `out/${video.id}.mp4`,
  onProgress: ({renderedFrames}) => {
    progressBar.update(renderedFrames);
  },
});

progressBar.stop();
```

## 错误处理

### 重试机制

```typescript
const renderWithRetry = async (video: VideoData, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await renderMedia({
        composition,
        serveUrl: bundleLocation,
        codec: 'h264',
        outputLocation: `out/${video.id}.mp4`,
      });
      return; // 成功，退出
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) throw error; // 最后一次重试失败
      await new Promise((resolve) => setTimeout(resolve, 5000)); // 等待5秒后重试
    }
  }
};
```

### 失败日志

```typescript
const failedVideos: string[] = [];

for (const video of videosData) {
  try {
    await renderMedia({...});
    console.log(`✓ ${video.id} rendered`);
  } catch (error) {
    console.error(`✗ ${video.id} failed:`, error);
    failedVideos.push(video.id);
  }
}

if (failedVideos.length > 0) {
  console.log('\nFailed videos:', failedVideos.join(', '));
  fs.writeFileSync('failed.json', JSON.stringify(failedVideos, null, 2));
}
```

## 最佳实践总结

1. **数据结构化**：使用 JSON 或数据库存储视频数据
2. **模板复用**：创建通用的视频模板组件
3. **并行渲染**：使用 `p-limit` 控制并发数量
4. **错误处理**：添加重试机制和失败日志
5. **进度监控**：实时显示渲染进度
6. **性能优化**：使用 React.memo、useMemo 等优化手段
7. **云端渲染**：大规模渲染使用 Lambda 或 Cloud Run
8. **资源管理**：预加载图片、音频等资源

## 完整示例

```typescript
// scripts/batch-render.ts
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import pLimit from 'p-limit';
import cliProgress from 'cli-progress';
import videosData from '../src/data/videos.json';

const limit = pLimit(4);
const multibar = new cliProgress.MultiBar({
  clearOnComplete: false,
  hideCursor: true,
});

const renderAll = async () => {
  console.log('Bundling project...');
  const bundleLocation = await bundle({
    entryPoint: path.resolve('./src/index.ts'),
  });

  console.log(`Rendering ${videosData.length} videos...`);

  const tasks = videosData.map((video) =>
    limit(async () => {
      const bar = multibar.create(100, 0);

      try {
        const composition = await selectComposition({
          serveUrl: bundleLocation,
          id: video.id,
        });

        await renderMedia({
          composition,
          serveUrl: bundleLocation,
          codec: 'h264',
          outputLocation: `out/${video.id}.mp4`,
          onProgress: ({progress}) => {
            bar.update(Math.floor(progress * 100));
          },
        });

        bar.stop();
        console.log(`✓ ${video.id}`);
      } catch (error) {
        bar.stop();
        console.error(`✗ ${video.id}:`, error);
        throw error;
      }
    })
  );

  await Promise.all(tasks);
  multibar.stop();
  console.log('\nAll videos rendered successfully!');
};

renderAll().catch(console.error);
```

运行：

```bash
ts-node scripts/batch-render.ts
```
