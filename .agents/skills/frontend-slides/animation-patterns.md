# Frontend Slides — Animation Patterns

Use this reference when generating presentations. Match animations to the intended feeling.

## Effect-to-Feeling Guide

| Feeling / Vibe | Animation Approach | Visual Cues |
|---------|---------|---------|
| **Drama / Cinematic** | Slow fade-in (1-1.5s), large-scale transitions, parallax | Dark backgrounds, spotlight effect, full-bleed imagery |
| **Tech / Futuristic** | Neon glow effects, text scrambling/glitching, grid reveal | Particle systems, grid layouts, monospaced emphasis, cyan/magenta/electric blue |
| **Playful / Friendly** | Elastic easing, subtle floating/hover drift | Rounded corners, bright/macaron colors, hand-drawn elements |
| **Professional / Business** | Subtle fast animations (200-300ms), clean slide transitions | Navy/slate/charcoal colors, precise spacing, data visualization |
| **Calm / Minimal** | Very slow gentle movements, soft fades | Plenty of whitespace, muted colors, serif fonts, generous padding |
| **Editorial / Magazine** | Staggered text reveal, mixed typography, text-wrapped images | Strong hierarchy, pull quotes, broken grid layouts, serif headings + sans body |

## CSS Animation Snippets

### Staggered Reveal (most common)

Use this for sequential reveal of elements as they come into view:

```css
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity var(--duration-normal) var(--ease-out-expo),
    transform var(--duration-normal) var(--ease-out-expo);
}

.slide.visible .reveal {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger children */
.reveal:nth-child(1) { transition-delay: 0.1s; }
.reveal:nth-child(2) { transition-delay: 0.2s; }
.reveal:nth-child(3) { transition-delay: 0.3s; }
.reveal:nth-child(4) { transition-delay: 0.4s; }
.reveal:nth-child(5) { transition-delay: 0.5s; }
```

### Slow Dramatic Fade

For cinematic/dramatic feeling:

```css
.reveal {
  opacity: 0;
  transform: translateY(60px) scale(1.05);
  transition:
    opacity 1.2s var(--ease-out-expo),
    transform 1.2s var(--ease-out-expo);
}
```

### Neon Glow Pulse

For neon/tech/cyber feeling:

```css
.glow {
  box-shadow: 0 0 20px var(--accent-glow), 0 0 40px var(--accent-glow);
  animation: pulse-glow 3s ease-in-out infinite alternate;
}

@keyframes pulse-glow {
  from { opacity: 0.8; box-shadow: 0 0 20px var(--accent-glow), 0 0 40px var(--accent-glow); }
  to   { opacity: 1;   box-shadow: 0 0 30px var(--accent-glow), 0 0 60px var(--accent-glow); }
}
```

### Floating Particles Background (JS + CSS)

For neon/tech/cyber backgrounds:

```html
<canvas class="particles" id="particles"></canvas>
```

```css
.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.6;
  pointer-events: none;
}
```

```javascript
// Simple particle animation (include in the HTML)
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }
  draw() {
    ctx.fillStyle = 'rgba(0, 255, 204, 0.8)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < 50; i++) {
  particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}
animate();
```

### Subtle Floating Hover

For playful/affable designs:

```css
.float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%   { transform: translateY(0px); }
  50%  { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}
```

### Text Scramble Effect (JS)

For tech/neon cyber aesthetic:

```javascript
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= start) {
        if (!char || this.frame - start < end) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
          output += `<span>${char}</span>`;
        } else {
          output += to;
          complete++;
        }
      } else if (this.frame < start) {
        output += from;
      } else {
        output += '';
      }
    }
    this.el.innerHTML = output;
    if (complete >= this.queue.length) this.resolve();
    else this.frameRequest = requestAnimationFrame(this.update);
  }
}

// Usage:
// const scramble = new TextScramble(document.querySelector('.scramble'));
// scramble.setText('Your Text Here');
```

## Common Problems & Fixes

### Slide overflows content
→ If content doesn't fit, **increase the viewport height scale** with `transform: scale(0.9)` on `.slide-content` or reduce font sizes via `clamp()`. Never allow scrolling.

### Fonts not loading
→ Always use `https://api.fontshare.com/v2/css?f[]=...` links, they're CORS-free and work with file:// URLs.

### Animations not triggering
→ The JS uses IntersectionObserver. Make sure all slides have `.slide` class, animated elements have `.reveal` class.

### Navigation not working
→ The `SlidePresentation` class handles keyboard (arrow keys, space, page up/down), touch swipe, progress bar, and nav dots. Always include the full class from the template.
