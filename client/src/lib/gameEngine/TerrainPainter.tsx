export interface TerrainPainterOptions {
  onTerrainUpdate: (terrain: any[]) => void;
  vibrancyMultiplier: number;
}

export default class TerrainPainter {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private options: TerrainPainterOptions;
  private paintedPixels: Map<string, { color: string; timestamp: number }> = new Map();
  private brushSize = 20;
  private currentTool = 'terrain';

  constructor(canvas: HTMLCanvasElement, options: TerrainPainterOptions) {
    this.canvas = canvas;
    this.options = options;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;
    
    this.initializeCanvas();
    this.render();
  }

  private initializeCanvas() {
    // Set up canvas for pixel art
    this.ctx.imageSmoothingEnabled = false;
    
    // Fill with a dark, desaturated background
    this.ctx.fillStyle = '#2a2a2a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Add some subtle texture
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const brightness = 20 + Math.random() * 20;
      this.ctx.fillStyle = `hsl(0, 0%, ${brightness}%)`;
      this.ctx.fillRect(Math.floor(x), Math.floor(y), 2, 2);
    }
  }

  public paint(x: number, y: number) {
    const { vibrancyMultiplier } = this.options;
    
    // Create paint effect
    for (let dx = -this.brushSize; dx <= this.brushSize; dx++) {
      for (let dy = -this.brushSize; dy <= this.brushSize; dy++) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= this.brushSize) {
          const paintX = Math.floor(x + dx);
          const paintY = Math.floor(y + dy);
          
          if (paintX >= 0 && paintX < this.canvas.width && 
              paintY >= 0 && paintY < this.canvas.height) {
            
            // Generate color based on position and vibrancy
            const hue = (paintX + paintY) * 0.01 % 1; // Vary hue based on position
            const saturation = Math.min(1, 0.2 + vibrancyMultiplier * 0.6);
            const lightness = Math.min(0.8, 0.3 + vibrancyMultiplier * 0.3);
            
            const color = `hsl(${hue * 360}, ${saturation * 100}%, ${lightness * 100}%)`;
            
            // Paint with falloff
            const opacity = Math.max(0, 1 - distance / this.brushSize);
            this.ctx.globalAlpha = opacity;
            this.ctx.fillStyle = color;
            this.ctx.fillRect(paintX, paintY, 2, 2);
            
            // Store painted pixel
            const key = `${paintX},${paintY}`;
            this.paintedPixels.set(key, {
              color,
              timestamp: Date.now()
            });
          }
        }
      }
    }
    
    this.ctx.globalAlpha = 1;
    
    // Add particle effects
    this.addPaintParticles(x, y);
    
    // Notify of terrain update
    this.notifyTerrainUpdate(x, y);
  }

  private addPaintParticles(x: number, y: number) {
    // Simple particle effect using canvas
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const distance = 20 + Math.random() * 20;
      const particleX = x + Math.cos(angle) * distance;
      const particleY = y + Math.sin(angle) * distance;
      
      this.ctx.fillStyle = `hsla(45, 100%, 70%, ${0.7 - Math.random() * 0.4})`;
      this.ctx.fillRect(
        Math.floor(particleX - 1), 
        Math.floor(particleY - 1), 
        3, 
        3
      );
    }
    
    // Fade particles over time
    setTimeout(() => {
      this.render();
    }, 100);
  }

  private notifyTerrainUpdate(x: number, y: number) {
    const terrainData = [{
      x,
      y,
      color: `hsl(${Math.random() * 360}, 60%, 50%)`,
      type: 'grass' as const,
      timestamp: Date.now()
    }];
    
    this.options.onTerrainUpdate(terrainData);
  }

  public setVibrancyMultiplier(multiplier: number) {
    this.options.vibrancyMultiplier = multiplier;
  }

  public setBrushSize(size: number) {
    this.brushSize = Math.max(5, Math.min(50, size));
  }

  public setTool(tool: string) {
    this.currentTool = tool;
  }

  public render() {
    // Re-render painted pixels with current vibrancy
    this.paintedPixels.forEach((pixel, key) => {
      const [x, y] = key.split(',').map(Number);
      const age = (Date.now() - pixel.timestamp) / 1000;
      const fadeIn = Math.min(1, age / 2); // Fade in over 2 seconds
      
      this.ctx.globalAlpha = fadeIn;
      this.ctx.fillStyle = pixel.color;
      this.ctx.fillRect(x, y, 2, 2);
    });
    
    this.ctx.globalAlpha = 1;
  }

  public cleanup() {
    // Clean up resources if needed
    this.paintedPixels.clear();
  }
}
