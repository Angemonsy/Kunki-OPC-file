import {useCurrentFrame, useVideoConfig, Audio, Video, Img, staticFile, interpolate, spring} from 'remotion';

const fontFamily = 'AlibabaPuHuiTi';
const fontFamilyRegular = 'AlibabaPuHuiTi-Regular';

const fontFace = new FontFace(fontFamily, `url('${staticFile('AlibabaPuHuiTi-3-45-Light.ttf')}')`);
fontFace.load().then((f) => document.fonts.add(f));

const fontFaceRegular = new FontFace(fontFamilyRegular, `url('${staticFile('AlibabaPuHuiTi-3-55-Regular.ttf')}')`);
fontFaceRegular.load().then((f) => document.fonts.add(f));

export const HelloWorld = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const currentTime = frame / fps;
  const totalDuration = durationInFrames / fps;

  // ========== 【变量区】开始 ==========

  // 【变量1】slides 数组：PPT风格，一屏多行，苹果配色
  // 每屏包含 start/end 时间和 lines 数组，每行有 text/type/size/delay
  // type: "hero"(大标题) | "accent"(强调) | "gradient"(渐变) | "normal"(普通) | "sub"(辅助)
  const slides = [
    {start: 0.0, end: 4.0, lines: [
      {text: "第一行文字", type: "normal", size: 60, delay: 0},
      {text: "关键词", type: "hero", size: 110, delay: 0.12},
      {text: "补充说明", type: "accent", size: 72, delay: 0.24}
    ]},
    // 继续添加更多屏幕...
  ];

  // 【变量2】audioFile：音频文件名
  const audioFile = 'audio.wav';

  // 【变量3】bgmFile 和 bgmVolume：背景音乐配置
  const bgmFile = null; // 如果有BGM，填写文件名如 'bgm.mp3'，没有就保持 null
  const bgmVolume = 0.15;

  // 【变量4】subtitles 数组：底部逐句字幕（来自 SRT）
  const subtitles = [
    {start: 0.0, end: 2.5, text: "第一句字幕"},
    {start: 2.5, end: 5.0, text: "第二句字幕"},
    // 继续添加更多字幕...
  ];

  // 【变量5】images 数组：画中画图片（来自文案中的 ![[xxx.png]]）
  // 图片显示时盖住PPT文字（zIndex 5 > PPT的3），结束后PPT文字接上，每张不超过8秒
  const images = [
    // {fileName: "example.png", start: 10, end: 16},
  ];

  // 【变量6】videos 数组：嵌入视频素材（可选）
  // {fileName: "clip.mp4", start: 8, end: 16}
  const videos = [];

  // ========== 【变量区】结束 ==========

  // 【布局】字号缩放因子（横屏）
  const sizeScale = 0.65;

  // ========== 【固定区】开始 - 苹果动画效果核心代码 ==========

  // 预处理：消除 slides 之间的间隙，让每屏 end 延伸到下一屏 start
  for (let i = 0; i < slides.length - 1; i++) {
    if (slides[i + 1].start > slides[i].end) {
      slides[i].end = slides[i + 1].start;
    }
  }
  // 同样消除 subtitles 间隙
  for (let i = 0; i < subtitles.length - 1; i++) {
    if (subtitles[i + 1].start > subtitles[i].end) {
      subtitles[i].end = subtitles[i + 1].start;
    }
  }

  const FADE_OUT_TIME = 0.3;
  const currentSub = slides.find(
    (s) => currentTime >= s.start && currentTime < s.end
  );

  const currentCaption = subtitles.find(
    (s) => currentTime >= s.start && currentTime < s.end
  );

  // 画中画：找到当前时间对应的图片
  const currentImage = images.find(
    (img) => currentTime >= img.start && currentTime < img.end
  );

  // 画中画淡入淡出动画
  const getPipAnimation = () => {
    if (!currentImage) return { opacity: 0, scale: 0.9 };
    const elapsed = currentTime - currentImage.start;
    const remaining = currentImage.end - currentTime;
    const fadeIn = spring({
      frame: Math.max(0, elapsed * fps),
      fps,
      config: { damping: 200, stiffness: 300, mass: 0.5 },
    });
    const fadeOut = remaining < 0.5 ? remaining / 0.5 : 1;
    const opacity = Math.min(fadeIn, fadeOut);
    const scale = interpolate(fadeIn, [0, 1], [0.9, 1]);
    return { opacity, scale };
  };

  const getLineAnimation = (line, index) => {
    if (!currentSub) return { opacity: 0, scale: 0.8, y: 20 };
    const elapsed = currentTime - currentSub.start - (line.delay || 0);
    const remaining = currentSub.end - currentTime;
    // 淡入
    const fadeIn = spring({
      frame: Math.max(0, (elapsed * fps)),
      fps,
      config: { damping: 200, stiffness: 300, mass: 0.5 },
    });
    // 淡出：最后 FADE_OUT_TIME 秒内渐隐
    const fadeOut = remaining < FADE_OUT_TIME ? Math.max(0, remaining / FADE_OUT_TIME) : 1;
    const progress = Math.min(fadeIn, fadeOut);
    return {
      opacity: progress,
      scale: interpolate(progress, [0, 1], [0.85, 1]),
      y: interpolate(progress, [0, 1], [30, 0]),
    };
  };

  const getAppleStyle = (line) => {
    const baseStyle = {
      fontFamily: `${fontFamily}, -apple-system, SF Pro Display, system-ui, sans-serif`,
      textAlign: 'center',
      letterSpacing: '-0.5px',
      lineHeight: 1.2,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    };
    switch (line.type) {
      case 'hero':
        return {
          ...baseStyle, fontSize: line.size * sizeScale,
          fontWeight: '900', color: '#FFFFFF',
          letterSpacing: '-2px',
          textShadow: '0 2px 40px rgba(255, 255, 255, 0.15)',
        };
      case 'accent':
        return {
          ...baseStyle, fontSize: line.size * sizeScale,
          fontWeight: '700', color: '#0A84FF',
          letterSpacing: '-1px',
        };
      case 'gradient':
        return {
          ...baseStyle, fontSize: line.size * sizeScale,
          fontWeight: '800',
          background: 'linear-gradient(90deg, #0A84FF, #5E5CE6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-1px',
        };
      case 'normal':
        return {
          ...baseStyle, fontSize: line.size * sizeScale,
          fontWeight: '600', color: '#E5E5E7',
          letterSpacing: '-0.5px',
        };
      case 'sub':
        return {
          ...baseStyle, fontSize: line.size * sizeScale,
          fontWeight: '500', color: '#86868B',
          letterSpacing: '0px',
        };
      default:
        return {
          ...baseStyle, fontSize: line.size * sizeScale,
          fontWeight: '600', color: '#F5F5F7',
        };
    }
  };

  // 底部字幕淡入淡出动画
  const getCaptionOpacity = () => {
    if (!currentCaption) return 0;
    const elapsed = currentTime - currentCaption.start;
    const remaining = currentCaption.end - currentTime;
    const fadeIn = spring({
      frame: Math.max(0, elapsed * fps),
      fps,
      config: { damping: 200, stiffness: 400, mass: 0.3 },
    });
    const fadeOut = remaining < 0.15 ? Math.max(0, remaining / 0.15) : 1;
    return Math.min(fadeIn, fadeOut);
  };

  return (
    <div style={{
      flex: 1,
      backgroundColor: '#000000',
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 120px',
      position: 'relative',
    }}>
      {/* 格子背景 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        zIndex: 0,
        pointerEvents: 'none',
      }} />
      <Audio src={staticFile(audioFile)} />
      {bgmFile && <Audio
        src={staticFile(bgmFile)}
        loop
        volume={(f) => {
          const t = f / fps;
          const fadeIn = interpolate(t, [0, 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const fadeOut = interpolate(t, [totalDuration - 5, totalDuration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return bgmVolume * fadeIn * fadeOut;
        }}
      />}

      {/* 嵌入视频素材 */}
      {videos.map((v, vi) => (
        currentTime >= v.start && currentTime < v.end && (
          <div key={vi} style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 5,
            pointerEvents: 'none',
          }}>
            <Video
              src={staticFile(v.fileName)}
              startFrom={0}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              volume={0}
            />
          </div>
        )
      ))}

      {/* 全屏背景图片 */}
      {currentImage && (() => {
        const pipAnim = getPipAnimation();
        return (
          <>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: pipAnim.opacity,
              transform: `scale(${pipAnim.scale})`,
              pointerEvents: 'none',
              zIndex: 5,
            }}>
              <Img
                src={staticFile(currentImage.fileName)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </>
        );
      })()}

      {/* PPT 关键词区域（居中） */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        alignItems: 'center',
        width: '100%',
        maxWidth: 900,
        zIndex: 3,
      }}>
        {currentSub && currentSub.lines.map((line, i) => {
          const anim = getLineAnimation(line, i);
          return (
            <div
              key={i}
              style={{
                ...getAppleStyle(line),
                opacity: anim.opacity,
                transform: `translateY(${anim.y}px) scale(${anim.scale})`,
                transition: 'none',
              }}
            >
              {line.text}
            </div>
          );
        })}
      </div>

      {/* 底部字幕条 */}
      {currentCaption && (() => {
        const charWidth = 30;
        const textWidth = currentCaption.text.length * charWidth + 48;
        const maxWidth = 1920 - 80;
        const captionScale = textWidth > maxWidth ? maxWidth / textWidth : 1;
        return (
        <div style={{
          position: 'absolute',
          bottom: 120,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: getCaptionOpacity(),
          zIndex: 8,
          transform: `scale(${captionScale})`,
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.65)',
            borderRadius: 12,
            padding: '12px 24px',
            whiteSpace: 'nowrap',
          }}>
            <span style={{
              fontFamily: `${fontFamilyRegular}, ${fontFamily}, -apple-system, SF Pro Display, system-ui, sans-serif`,
              fontSize: 30,
              fontWeight: '500',
              color: 'rgba(255, 255, 255, 0.95)',
              letterSpacing: '0.5px',
              lineHeight: 1.4,
              textAlign: 'center',
            }}>
              {currentCaption.text}
            </span>
          </div>
        </div>
        );
      })()}
    </div>
  );

  // ========== 【固定区】结束 ==========
};
