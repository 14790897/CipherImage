"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Live2DSimulator, type Live2DModelConfig } from "@/lib/live2d-simulator"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Loader2, RefreshCw, Info } from "lucide-react"

interface Live2DViewerProps {
  modelConfig: Live2DModelConfig
  onModelLoad?: (success: boolean) => void
  className?: string
}

export function Live2DViewer({ modelConfig, onModelLoad, className }: Live2DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const simulatorRef = useRef<Live2DSimulator | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableMotions, setAvailableMotions] = useState<string[]>([])
  const [availableExpressions, setAvailableExpressions] = useState<string[]>([])
  const [loadingStep, setLoadingStep] = useState<string>("初始化...")

  const initializeSimulator = useCallback(async () => {
    if (!canvasRef.current) return

    try {
      setIsLoading(true)
      setError(null)
      setLoadingStep("初始化渲染器...")

      // 设置canvas尺寸
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      canvas.style.width = rect.width + "px"
      canvas.style.height = rect.height + "px"

      // 创建模拟器并初始化
      const simulator = new Live2DSimulator()
      setLoadingStep("初始化Live2D模拟器...")
      await simulator.initialize(canvas)

      setLoadingStep("加载模型...")
      // 模拟加载延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      await simulator.loadModel(modelConfig)

      setLoadingStep("获取模型信息...")
      // 获取可用动作和表情
      const motions = simulator.getAvailableMotions()
      const expressions = simulator.getAvailableExpressions()

      setAvailableMotions(motions)
      setAvailableExpressions(expressions)

      simulatorRef.current = simulator
      onModelLoad?.(true)
      setLoadingStep("加载完成")
    } catch (err) {
      console.error("Live2D simulator initialization failed:", err)
      const errorMessage = err instanceof Error ? err.message : "未知错误"
      setError(`初始化失败: ${errorMessage}`)
      onModelLoad?.(false)
    } finally {
      setIsLoading(false)
    }
  }, [modelConfig, onModelLoad])

  useEffect(() => {
    initializeSimulator()

    return () => {
      if (simulatorRef.current) {
        simulatorRef.current.destroy()
        simulatorRef.current = null
      }
    }
  }, [initializeSimulator])

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * window.devicePixelRatio
        canvas.height = rect.height * window.devicePixelRatio
        canvas.style.width = rect.width + "px"
        canvas.style.height = rect.height + "px"
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleMotionPlay = (motion: string) => {
    if (simulatorRef.current) {
      simulatorRef.current.playMotion(motion)
    }
  }

  const handleExpressionSet = (expression: string) => {
    if (simulatorRef.current) {
      simulatorRef.current.setExpression(expression)
    }
  }

  const handleRetry = () => {
    initializeSimulator()
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center h-96 p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">加载失败</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">{error}</p>
          <div className="flex gap-2">
            <Button onClick={handleRetry} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              重试
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-96 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg border"
          style={{ display: isLoading ? "none" : "block" }}
        />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-pink-500" />
              <p className="text-sm text-muted-foreground">{loadingStep}</p>
            </div>
          </div>
        )}
      </div>

      {/* 控制面板 */}
      {!isLoading && !error && (
        <div className="mt-4 space-y-4">
          {/* 信息提示 */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Info className="w-4 h-4 text-blue-500" />
            <p className="text-sm text-blue-700">这是Live2D模拟器演示版本，展示基本交互功能</p>
          </div>

          {/* 动作控制 */}
          {availableMotions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">动作控制</h4>
              <div className="flex flex-wrap gap-2">
                {availableMotions.map((motion) => (
                  <Button
                    key={motion}
                    variant="outline"
                    size="sm"
                    onClick={() => handleMotionPlay(motion)}
                    className="text-xs"
                  >
                    {motion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* 表情控制 */}
          {availableExpressions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">表情控制</h4>
              <div className="flex flex-wrap gap-2">
                {availableExpressions.map((expression) => (
                  <Badge
                    key={expression}
                    variant="secondary"
                    className="cursor-pointer hover:bg-pink-100 transition-colors"
                    onClick={() => handleExpressionSet(expression)}
                  >
                    {expression}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 交互说明 */}
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">移动鼠标查看眼部跟随效果，点击角色进行交互</p>
          </div>
        </div>
      )}
    </div>
  )
}
