export interface Live2DModelConfig {
  name: string
  modelPath: string
  scale?: number
  x?: number
  y?: number
  description?: string
  tags?: string[]
  preview?: string
}

export interface ModelStats {
  textureCount: number
  motionCount: number
  expressionCount: number
  parameterCount: number
}

export class Live2DSimulator {
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private animationId: number | null = null
  private currentModel: Live2DModelConfig | null = null
  private mouseX = 0
  private mouseY = 0
  private eyeX = 0
  private eyeY = 0
  private blinkTimer = 0
  private breathTimer = 0
  private isInitialized = false

  // 模拟的动作和表情列表
  private availableMotions = ["idle", "tap_body", "flick_head", "shake", "nod"]
  private availableExpressions = ["normal", "happy", "sad", "surprised", "angry"]

  async initialize(canvas: HTMLCanvasElement): Promise<void> {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")

    if (!this.ctx) {
      throw new Error("Failed to get 2D context")
    }

    this.setupEventListeners()
    this.isInitialized = true
  }

  async loadModel(config: Live2DModelConfig): Promise<void> {
    if (!this.isInitialized || !this.canvas || !this.ctx) {
      throw new Error("Simulator not initialized")
    }

    this.currentModel = config
    this.startAnimation()
  }

  private setupEventListeners(): void {
    if (!this.canvas) return

    this.canvas.addEventListener("mousemove", (event) => {
      const rect = this.canvas!.getBoundingClientRect()
      this.mouseX = event.clientX - rect.left
      this.mouseY = event.clientY - rect.top
    })

    this.canvas.addEventListener("click", (event) => {
      const rect = this.canvas!.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      // 模拟点击交互
      this.triggerClickAnimation(x, y)
    })
  }

  private startAnimation(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }

    const animate = () => {
      this.update()
      this.render()
      this.animationId = requestAnimationFrame(animate)
    }

    animate()
  }

  private update(): void {
    if (!this.canvas) return

    // 更新眼部跟随
    const centerX = this.canvas.width / 2
    const centerY = this.canvas.height / 2
    const maxDistance = 50

    const deltaX = this.mouseX - centerX
    const deltaY = this.mouseY - centerY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    if (distance > 0) {
      const normalizedX = (deltaX / distance) * Math.min(distance, maxDistance)
      const normalizedY = (deltaY / distance) * Math.min(distance, maxDistance)

      this.eyeX += (normalizedX - this.eyeX) * 0.1
      this.eyeY += (normalizedY - this.eyeY) * 0.1
    }

    // 更新眨眼
    this.blinkTimer += 0.016 // 假设60fps
    if (this.blinkTimer > 3 + Math.random() * 2) {
      this.blinkTimer = 0
    }

    // 更新呼吸
    this.breathTimer += 0.016
  }

  private render(): void {
    if (!this.canvas || !this.ctx) return

    const ctx = this.ctx
    const width = this.canvas.width
    const height = this.canvas.height

    // 清空画布
    ctx.clearRect(0, 0, width, height)

    // 绘制背景渐变
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, "#fdf2f8")
    gradient.addColorStop(1, "#f3e8ff")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // 绘制模拟的Live2D角色
    this.drawCharacter(ctx, width, height)

    // 绘制交互提示
    this.drawInteractionHints(ctx, width, height)
  }

  private drawCharacter(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const centerX = width / 2
    const centerY = height / 2

    // 呼吸效果
    const breathScale = 1 + Math.sin(this.breathTimer * 2) * 0.02

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.scale(breathScale, breathScale)

    // 绘制身体
    ctx.fillStyle = "#fbbf24"
    ctx.beginPath()
    ctx.ellipse(0, 50, 80, 120, 0, 0, Math.PI * 2)
    ctx.fill()

    // 绘制头部
    ctx.fillStyle = "#fde68a"
    ctx.beginPath()
    ctx.ellipse(0, -50, 60, 70, 0, 0, Math.PI * 2)
    ctx.fill()

    // 绘制眼睛
    const eyeBlinkFactor = this.blinkTimer < 0.1 ? 0 : 1

    // 左眼
    ctx.fillStyle = "#1f2937"
    ctx.beginPath()
    ctx.ellipse(-20 + this.eyeX * 0.1, -60 + this.eyeY * 0.1, 8, 12 * eyeBlinkFactor, 0, 0, Math.PI * 2)
    ctx.fill()

    // 右眼
    ctx.beginPath()
    ctx.ellipse(20 + this.eyeX * 0.1, -60 + this.eyeY * 0.1, 8, 12 * eyeBlinkFactor, 0, 0, Math.PI * 2)
    ctx.fill()

    // 绘制嘴巴
    ctx.strokeStyle = "#ef4444"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(0, -30, 15, 0, Math.PI)
    ctx.stroke()

    // 绘制头发
    ctx.fillStyle = "#8b5cf6"
    ctx.beginPath()
    ctx.ellipse(0, -80, 70, 40, 0, 0, Math.PI)
    ctx.fill()

    ctx.restore()
  }

  private drawInteractionHints(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // 绘制鼠标跟随指示器
    if (this.mouseX > 0 && this.mouseY > 0) {
      ctx.strokeStyle = "#ec4899"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(width / 2, height / 2)
      ctx.lineTo(this.mouseX, this.mouseY)
      ctx.stroke()
      ctx.setLineDash([])

      // 绘制鼠标位置圆圈
      ctx.strokeStyle = "#ec4899"
      ctx.beginPath()
      ctx.arc(this.mouseX, this.mouseY, 10, 0, Math.PI * 2)
      ctx.stroke()
    }

    // 绘制信息文本
    ctx.fillStyle = "#6b7280"
    ctx.font = "14px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("移动鼠标进行眼部跟随", width / 2, height - 60)
    ctx.fillText("点击角色进行交互", width / 2, height - 40)
    ctx.fillText(`当前模型: ${this.currentModel?.name || "未知"}`, width / 2, height - 20)
  }

  private triggerClickAnimation(x: number, y: number): void {
    // 模拟点击动画效果
    console.log(`Clicked at (${x}, ${y}) - triggering animation`)

    // 重置眨眼计时器来触发眨眼
    this.blinkTimer = 0

    // 可以在这里添加更多的点击效果
  }

  playMotion(motionName: string): void {
    console.log(`Playing motion: ${motionName}`)
    // 模拟动作播放
    this.triggerClickAnimation(this.canvas?.width || 0 / 2, this.canvas?.height || 0 / 2)
  }

  setExpression(expressionName: string): void {
    console.log(`Setting expression: ${expressionName}`)
    // 模拟表情设置
  }

  getAvailableMotions(): string[] {
    return [...this.availableMotions]
  }

  getAvailableExpressions(): string[] {
    return [...this.availableExpressions]
  }

  getModelStats(): ModelStats {
    return {
      textureCount: 3,
      motionCount: this.availableMotions.length,
      expressionCount: this.availableExpressions.length,
      parameterCount: 12,
    }
  }

  destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }

    if (this.canvas) {
      this.canvas.removeEventListener("mousemove", () => {})
      this.canvas.removeEventListener("click", () => {})
    }

    this.canvas = null
    this.ctx = null
    this.currentModel = null
    this.isInitialized = false
  }

  get model() {
    return this.currentModel
  }
}
