"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Volume2, VolumeX, Settings, Heart, Star, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Live2DViewer } from "@/components/live2d-viewer"
import type { Live2DModelConfig } from "@/lib/live2d-simulator"

export default function Live2DShowcase() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [volume, setVolume] = useState([80])
  const [isMuted, setIsMuted] = useState(false)
  const [currentModel, setCurrentModel] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const models: (Live2DModelConfig & { description: string; tags: string[]; preview: string })[] = [
    {
      name: "Hiyori Momose",
      modelPath: "demo://hiyori",
      scale: 0.4,
      description: "可爱的学生角色",
      tags: ["学生", "可爱", "日常"],
      preview: "/placeholder.svg?height=200&width=150",
    },
    {
      name: "Koharu",
      modelPath: "demo://koharu",
      scale: 0.3,
      description: "活泼的少女角色",
      tags: ["活泼", "少女", "元气"],
      preview: "/placeholder.svg?height=200&width=150",
    },
    {
      name: "Shizuku",
      modelPath: "demo://shizuku",
      scale: 0.35,
      description: "温柔的姐姐角色",
      tags: ["温柔", "姐姐", "优雅"],
      preview: "/placeholder.svg?height=200&width=150",
    },
  ]

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(true)
  }

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted)
  }

  const handleModelChange = (index: number) => {
    setCurrentModel(index)
    setIsLoading(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Live2D Showcase
                </h1>
                <p className="text-sm text-muted-foreground">互动式2D角色展示</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                <Zap className="w-3 h-3 mr-1" />
                演示版本
              </Badge>
              <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                <Star className="w-3 h-3 mr-1" />
                精选模型
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 主展示区域 */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-pink-500/10 to-purple-500/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{models[currentModel].name}</CardTitle>
                    <CardDescription className="text-base mt-1">{models[currentModel].description}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    {models[currentModel].tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 relative">
                <Live2DViewer
                  key={currentModel} // 强制重新渲染
                  modelConfig={models[currentModel]}
                  onModelLoad={(success) => {
                    setIsLoading(!success)
                    if (success) {
                      console.log("Model loaded successfully")
                    }
                  }}
                  className="w-full"
                />
              </CardContent>

              {/* 控制栏 */}
              <div className="p-4 bg-white border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handlePlayPause} disabled={isLoading}>
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleReset} disabled={isLoading}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleVolumeToggle} disabled={isLoading}>
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-32">
                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                      <Slider
                        value={volume}
                        onValueChange={setVolume}
                        max={100}
                        step={1}
                        className="flex-1"
                        disabled={isLoading || isMuted}
                      />
                    </div>
                    <Button variant="outline" size="sm" disabled={isLoading}>
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 模型选择 */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">模型选择</CardTitle>
                <CardDescription>选择不同的Live2D角色</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {models.map((model, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      currentModel === index ? "border-pink-500 bg-pink-50" : "border-gray-200 hover:border-pink-300"
                    }`}
                    onClick={() => handleModelChange(index)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={model.preview || "/placeholder.svg"}
                        alt={model.name}
                        className="w-12 h-16 object-cover rounded bg-gradient-to-b from-pink-100 to-purple-100"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{model.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{model.description}</p>
                        <div className="flex gap-1 mt-2">
                          {model.tags.slice(0, 2).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs px-1 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 功能介绍 */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">功能特性</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="interaction" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="interaction">交互</TabsTrigger>
                    <TabsTrigger value="animation">动画</TabsTrigger>
                  </TabsList>
                  <TabsContent value="interaction" className="space-y-3 mt-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        <span>鼠标跟随眼部追踪</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>点击触发表情动画</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>实时渲染展示</span>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="animation" className="space-y-3 mt-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>流畅的动画效果</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>自然的呼吸效果</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>自动眨眼动画</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* 统计信息 */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">展示统计</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-pink-50 rounded-lg">
                    <div className="text-2xl font-bold text-pink-600">3</div>
                    <div className="text-xs text-muted-foreground">可用模型</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">5</div>
                    <div className="text-xs text-muted-foreground">动画效果</div>
                  </div>
                </div>
                <div className="text-center p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                  <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    60fps
                  </div>
                  <div className="text-xs text-muted-foreground">流畅渲染</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
