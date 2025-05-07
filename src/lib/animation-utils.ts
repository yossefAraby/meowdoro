
import { useEffect, useRef, useState } from 'react';

// Custom hook to check if an element is in view
export const useInView = (options = {}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);
    
    observer.observe(ref.current);
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return { ref, isInView };
};

// Custom hook for parallax scrolling effect
export const useParallax = (speed = 0.5) => {
  const ref = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const element = ref.current;
      if (!element) return;
      
      // Calculate the transform based on scroll position and speed
      const yValue = scrollY * speed;
      element.style.transform = `translate3d(0, ${yValue}px, 0)`;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);
  
  return ref;
};

// Custom hook for a smooth counter animation
export const useSmoothCounter = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  
  useEffect(() => {
    let animationFrameId: number;
    
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const progressRatio = Math.min(progress / duration, 1);
      
      // Use easeOutQuad for a smooth animation
      const eased = 1 - (1 - progressRatio) * (1 - progressRatio);
      countRef.current = Math.floor(eased * end);
      setCount(countRef.current);
      
      if (progressRatio < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration]);
  
  return count;
};

// Interactive water bubble effect
export class WaterBubble {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  points: { x: number; y: number; originalX: number; originalY: number; vx: number; vy: number }[];
  center: { x: number; y: number };
  radius: number;
  mouseX: number = 0;
  mouseY: number = 0;
  isMouseDown: boolean = false;
  isMouseOver: boolean = false;
  mouseMoveStrength: number = 10;
  rafId: number | null = null;
  image: HTMLImageElement | null = null;
  
  constructor(canvas: HTMLCanvasElement, imageUrl?: string) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.width = canvas.width;
    this.height = canvas.height;
    this.center = { x: this.width / 2, y: this.height / 2 };
    this.radius = Math.min(this.width, this.height) * 0.45;
    this.points = [];
    
    // Load image if provided
    if (imageUrl) {
      this.image = new Image();
      this.image.src = imageUrl;
      this.image.onload = () => this.start();
    } else {
      this.start();
    }
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    
    // Touch events
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }
  
  // Event handlers
  handleMouseMove(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
  }
  
  handleMouseDown() {
    this.isMouseDown = true;
    this.mouseMoveStrength = 30;
  }
  
  handleMouseUp() {
    this.isMouseDown = false;
    this.mouseMoveStrength = 10;
  }
  
  handleMouseEnter() {
    this.isMouseOver = true;
  }
  
  handleMouseLeave() {
    this.isMouseOver = false;
    // Reset points when mouse leaves
    this.resetPoints();
  }
  
  handleTouchStart(e: TouchEvent) {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const touch = e.touches[0];
    this.mouseX = touch.clientX - rect.left;
    this.mouseY = touch.clientY - rect.top;
    this.isMouseDown = true;
    this.isMouseOver = true;
    this.mouseMoveStrength = 30;
  }
  
  handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const touch = e.touches[0];
    this.mouseX = touch.clientX - rect.left;
    this.mouseY = touch.clientY - rect.top;
  }
  
  handleTouchEnd() {
    this.isMouseDown = false;
    this.isMouseOver = false;
    this.mouseMoveStrength = 10;
    this.resetPoints();
  }
  
  // Initialize points around the circle
  initializePoints(count = 40) {
    const angleStep = (2 * Math.PI) / count;
    this.points = [];
    
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep;
      const x = this.center.x + this.radius * Math.cos(angle);
      const y = this.center.y + this.radius * Math.sin(angle);
      
      this.points.push({
        x,
        y,
        originalX: x,
        originalY: y,
        vx: 0,
        vy: 0
      });
    }
  }
  
  // Reset points to their original positions
  resetPoints() {
    for (const point of this.points) {
      point.x = point.originalX;
      point.y = point.originalY;
      point.vx = 0;
      point.vy = 0;
    }
  }
  
  // Start the animation
  start() {
    this.initializePoints();
    this.animate();
  }
  
  // Stop the animation
  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
  
  // Animation loop
  animate() {
    this.update();
    this.draw();
    this.rafId = requestAnimationFrame(this.animate.bind(this));
  }
  
  // Update point positions
  update() {
    const damping = 0.9;
    const springStrength = 0.01;
    
    for (const point of this.points) {
      // Calculate distance from mouse
      if (this.isMouseOver) {
        const dx = point.x - this.mouseX;
        const dy = point.y - this.mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          // Apply force based on mouse position
          const force = (100 - distance) / 100 * this.mouseMoveStrength;
          point.vx += (dx / distance) * force;
          point.vy += (dy / distance) * force;
        }
      }
      
      // Spring force back to original position
      point.vx += (point.originalX - point.x) * springStrength;
      point.vy += (point.originalY - point.y) * springStrength;
      
      // Apply damping to gradually reduce velocity
      point.vx *= damping;
      point.vy *= damping;
      
      // Update position
      point.x += point.vx;
      point.y += point.vy;
    }
  }
  
  // Draw the bubble
  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw the bubble shape
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].x, this.points[0].y);
    
    for (let i = 0; i < this.points.length; i++) {
      const currentPoint = this.points[i];
      const nextPoint = this.points[(i + 1) % this.points.length];
      
      // Use quadratic curves for a smoother shape
      const cpX = (currentPoint.x + nextPoint.x) / 2;
      const cpY = (currentPoint.y + nextPoint.y) / 2;
      this.ctx.quadraticCurveTo(currentPoint.x, currentPoint.y, cpX, cpY);
    }
    
    this.ctx.closePath();
    
    // Create a radial gradient for water effect
    const gradient = this.ctx.createRadialGradient(
      this.center.x, this.center.y - this.radius * 0.3, 0,
      this.center.x, this.center.y, this.radius * 1.2
    );
    
    gradient.addColorStop(0, 'hsla(var(--primary), 0.6)');
    gradient.addColorStop(0.5, 'hsla(var(--primary), 0.3)');
    gradient.addColorStop(1, 'hsla(var(--primary), 0.1)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    
    // Draw image inside if available
    if (this.image) {
      this.ctx.clip();
      const imgSize = Math.min(this.image.width, this.image.height);
      const scale = (this.radius * 1.8) / imgSize;
      const imgWidth = this.image.width * scale;
      const imgHeight = this.image.height * scale;
      this.ctx.drawImage(
        this.image,
        this.center.x - imgWidth / 2,
        this.center.y - imgHeight / 2,
        imgWidth,
        imgHeight
      );
    }
    
    this.ctx.restore();
    
    // Add a subtle glow effect
    this.ctx.save();
    this.ctx.filter = 'blur(10px)';
    this.ctx.globalAlpha = 0.3;
    this.ctx.beginPath();
    this.ctx.arc(this.center.x, this.center.y, this.radius * 0.9, 0, Math.PI * 2);
    this.ctx.fillStyle = 'hsla(var(--primary), 0.6)';
    this.ctx.fill();
    this.ctx.restore();
  }
  
  // Resize canvas and update bubble
  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.center = { x: width / 2, y: height / 2 };
    this.radius = Math.min(width, height) * 0.45;
    this.initializePoints();
  }
}

// Hook to create and manage a water bubble
export const useWaterBubble = (imageUrl: string) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bubbleRef = useRef<WaterBubble | null>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Create water bubble
    bubbleRef.current = new WaterBubble(canvasRef.current, imageUrl);
    
    // Handle resizing
    const handleResize = () => {
      if (canvasRef.current && bubbleRef.current) {
        const canvas = canvasRef.current;
        const container = canvas.parentElement;
        if (container) {
          const { width, height } = container.getBoundingClientRect();
          bubbleRef.current.resize(width, height);
        }
      }
    };
    
    // Initial resize
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (bubbleRef.current) {
        bubbleRef.current.stop();
      }
    };
  }, [imageUrl]);
  
  return canvasRef;
};
