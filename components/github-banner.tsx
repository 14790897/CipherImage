"use client"

import { Star, Github } from "lucide-react"
import { Button } from "@/components/ui/button"

export function GitHubBanner() {
  const handleStarClick = () => {
    window.open("https://github.com/14790897/CipherImage", "_blank")
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Github className="w-5 h-5" />
          <span className="text-sm">
            开源项目 - 如果这个工具对您有帮助，请给我们一个Star！
          </span>
        </div>
        <Button
          onClick={handleStarClick}
          variant="secondary"
          size="sm"
          className="bg-white text-blue-600 hover:bg-gray-100 flex items-center gap-1"
        >
          <Star className="w-4 h-4" />
          GitHub Star
        </Button>
      </div>
    </div>
  )
}
