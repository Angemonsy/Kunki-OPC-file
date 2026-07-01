# Remotion 动画效果示例

本文档提供常用的动画效果代码示例，可直接复制使用。

## 基础动画

### 1. 淡入淡出

```typescript
import {useCurrentFrame, interpolate} from 'remotion';

export const FadeInOut: React.FC = () => {
  const frame = useCurrentFrame();

  // 淡入（0-30帧）+ 保持（30-120帧）+ 淡出（120-150帧）
  const opacity = interpolate(
    frame,
    [0, 30, 120, 150],
    [0, 1, 1, 0]
  );

  return (
    <div style={{opacity}}>
      内容
    </div>
  );
};
```

### 2. 缩放动画

```typescript
export const ScaleAnimation: React.FC = () => {
  const frame = useCurrentFrame();

  // 从小到大
  const scale = interpolate(
    frame,
    [0, 30],
    [0.5, 1],
    {extrapolateRight: 'clamp'}
  );

  return (
    <div style={{transform: `scale(${scale})`}}>
      内容
    </div>
  );
};
```

### 3. 滑入动画

```typescript
export const SlideIn: React.FC = () => {
  const frame = useCurrentFrame();

  // 从下方滑入
  const translateY = interpolate(
    frame,
    [0, 30],
    [100, 0],
    {extrapolateRight: 'clamp'}
  );

  return (
    <div style={{transform: `translateY(${translateY}px)`}}>
      内容
    </div>
  );
};
```

### 4. 旋转动画

```typescript
export const RotateAnimation: React.FC = () => {
  const frame = useCurrentFrame();

  // 360度旋转
  const rotate = interpolate(
    frame,
    [0, 60],
    [0, 360]
  );

  return (
    <div style={{transform: `rotate(${rotate}deg)`}}>
      内容
    </div>
  );
};
```

## 组合动画

### 5. 淡入 + 缩放

```typescript
export const FadeInScale: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const scale = interpolate(frame, [0, 30], [0.8, 1]);

  return (
    <div style={{
      opacity,
      transform: `scale(${scale})`,
    }}>
      内容
    </div>
  );
};
```

### 6. 滑入 + 淡入

```typescript
export const SlideInFade: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 20], [0, 1]);
  const translateX = interpolate(frame, [0, 30], [-100, 0]);

  return (
    <div style={{
      opacity,
      transform: `translateX(${translateX}px)`,
    }}>
      内容
    </div>
  );
};
```

## 文字动画

### 7. 打字机效果

```typescript
export const TypewriterEffect: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();

  const charsShown = Math.floor(interpolate(
    frame,
    [0, text.length * 2],
    [0, text.length]
  ));

  return (
    <div>
      {text.substring(0, charsShown)}
    </div>
  );
};
```

### 8. 逐字淡入

```typescript
export const WordByWordFade: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');

  return (
    <div style={{display: 'flex', gap: 10}}>
      {words.map((word, index) => {
        const opacity = interpolate(
          frame,
          [index * 5, index * 5 + 10],
          [0, 1],
          {extrapolateRight: 'clamp'}
        );

        return (
          <span key={index} style={{opacity}}>
            {word}
          </span>
        );
      })}
    </div>
  );
};
```

## 高级动画

### 9. 弹跳效果

```typescript
import {spring} from 'remotion';

export const BounceAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: {
      damping: 10,
      stiffness: 100,
      mass: 0.5,
    },
  });

  return (
    <div style={{transform: `scale(${scale})`}}>
      内容
    </div>
  );
};
```

### 10. 波浪效果

```typescript
export const WaveEffect: React.FC = () => {
  const frame = useCurrentFrame();

  const items = Array.from({length: 10}, (_, i) => i);

  return (
    <div style={{display: 'flex', gap: 10}}>
      {items.map((i) => {
        const translateY = Math.sin((frame + i * 5) * 0.1) * 20;

        return (
          <div
            key={i}
            style={{
              width: 50,
              height: 50,
              backgroundColor: '#3498db',
              transform: `translateY(${translateY}px)`,
            }}
          />
        );
      })}
    </div>
  );
};
```

### 11. 路径动画

```typescript
export const PathAnimation: React.FC = () => {
  const frame = useCurrentFrame();

  // 圆形路径
  const angle = interpolate(frame, [0, 60], [0, Math.PI * 2]);
  const radius = 100;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: `translate(${x}px, ${y}px)`,
    }}>
      ●
    </div>
  );
};
```

## 转场效果

### 12. 擦除转场

```typescript
export const WipeTransition: React.FC = () => {
  const frame = useCurrentFrame();

  const clipPath = interpolate(
    frame,
    [0, 30],
    [0, 100]
  );

  return (
    <div style={{
      clipPath: `inset(0 ${100 - clipPath}% 0 0)`,
    }}>
      内容
    </div>
  );
};
```

### 13. 缩放转场

```typescript
export const ZoomTransition: React.FC = () => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [0, 30],
    [1, 10]
  );

  return (
    <div style={{
      transform: `scale(${scale})`,
      transformOrigin: 'center',
    }}>
      内容
    </div>
  );
};
```

## 数据可视化动画

### 14. 柱状图动画

```typescript
export const BarChart: React.FC<{data: number[]}> = ({data}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{display: 'flex', alignItems: 'flex-end', gap: 10}}>
      {data.map((value, index) => {
        const height = interpolate(
          frame,
          [index * 5, index * 5 + 20],
          [0, value * 5],
          {extrapolateRight: 'clamp'}
        );

        return (
          <div
            key={index}
            style={{
              width: 50,
              height,
              backgroundColor: '#3498db',
            }}
          />
        );
      })}
    </div>
  );
};
```

### 15. 进度条动画

```typescript
export const ProgressBar: React.FC<{progress: number}> = ({progress}) => {
  const frame = useCurrentFrame();

  const width = interpolate(
    frame,
    [0, 60],
    [0, progress],
    {extrapolateRight: 'clamp'}
  );

  return (
    <div style={{
      width: '100%',
      height: 30,
      backgroundColor: '#ecf0f1',
      borderRadius: 15,
    }}>
      <div style={{
        width: `${width}%`,
        height: '100%',
        backgroundColor: '#3498db',
        borderRadius: 15,
        transition: 'width 0.3s',
      }} />
    </div>
  );
};
```

## 使用技巧

### 缓动函数

使用 `Easing` 函数创建更自然的动画：

```typescript
import {Easing} from 'remotion';

const opacity = interpolate(
  frame,
  [0, 30],
  [0, 1],
  {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  }
);
```

常用缓动函数：
- `Easing.linear` - 线性
- `Easing.ease` - 默认缓动
- `Easing.easeIn` - 缓入
- `Easing.easeOut` - 缓出
- `Easing.easeInOut` - 缓入缓出
- `Easing.bezier(x1, y1, x2, y2)` - 自定义贝塞尔曲线

### Spring 动画

使用 `spring` 创建物理动画：

```typescript
import {spring, useVideoConfig} from 'remotion';

const {fps} = useVideoConfig();

const scale = spring({
  frame,
  fps,
  config: {
    damping: 10,      // 阻尼
    stiffness: 100,   // 刚度
    mass: 0.5,        // 质量
  },
});
```

### 延迟动画

使用 `Sequence` 控制动画时机：

```typescript
<Sequence from={30}>
  <FadeInAnimation />
</Sequence>

<Sequence from={60}>
  <SlideInAnimation />
</Sequence>
```

## 性能优化

1. **使用 `React.memo`** 避免不必要的重渲染
2. **避免复杂计算** 在每帧中进行
3. **使用 `useMemo`** 缓存计算结果
4. **减少 DOM 节点** 数量

```typescript
const MemoizedComponent = React.memo(MyComponent);

const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```
