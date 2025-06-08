"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Eye, EyeOff, Lock } from "lucide-react"
import { embedTextInImage, extractTextFromImage } from "@/lib/steganography"
import { fileToImageData, imageDataToBlob, downloadFile } from "@/lib/image-utils"

export default function SteganographyTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [secretText, setSecretText] = useState("")
  const [key, setKey] = useState("")
  const [extractedText, setExtractedText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState("")
  const [showKey, setShowKey] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setMessage("")
    } else {
      setMessage("请选择有效的图片文件")
    }
  }

  const handleEmbed = async () => {
    if (!selectedFile || !secretText || !key) {
      setMessage("请选择图片、输入要隐藏的文本和密钥")
      return
    }

    setIsProcessing(true)
    setMessage("")

    try {
      const imageData = await fileToImageData(selectedFile)
      const stegoImageData = embedTextInImage(imageData, secretText, key)
      const blob = await imageDataToBlob(stegoImageData)

      const filename = `stego_${selectedFile.name.replace(/\.[^/.]+$/, "")}.png`
      downloadFile(blob, filename)

      setMessage(`成功将消息隐藏到图片中！已下载为 ${filename}`)
    } catch (error) {
      setMessage(`隐写失败: ${error instanceof Error ? error.message : "未知错误"}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleExtract = async () => {
    if (!selectedFile || !key) {
      setMessage("请选择图片和输入密钥")
      return
    }

    setIsProcessing(true)
    setMessage("")

    try {
      const imageData = await fileToImageData(selectedFile)
      const extracted = extractTextFromImage(imageData, key)
      setExtractedText(extracted)

      if (extracted) {
        setMessage("成功提取隐藏信息！")
      } else {
        setMessage("未找到隐藏信息，请检查密钥是否正确")
      }
    } catch (error) {
      setMessage(`提取失败: ${error instanceof Error ? error.message : "未知错误"}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">密钥图片隐写工具</h1>
          <p className="text-gray-600">安全地在图片中隐藏和提取文本信息</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              选择载体图片
            </CardTitle>
            <CardDescription>支持 PNG、JPG、JPEG 格式的图片文件</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
              </div>

              {previewUrl && (
                <div className="flex justify-center">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="预览图片"
                    className="max-w-md max-h-64 object-contain rounded-lg border"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                密钥设置
              </CardTitle>
              <CardDescription>用于控制隐写位置的密钥，提取时需要相同密钥</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Input
                  type={showKey ? "text" : "password"}
                  placeholder="请输入密钥"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {message && (
            <Card>
              <CardContent className="pt-6">
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </div>

        <Tabs defaultValue="embed" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="embed">隐藏信息</TabsTrigger>
            <TabsTrigger value="extract">提取信息</TabsTrigger>
          </TabsList>

          <TabsContent value="embed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>隐藏文本信息</CardTitle>
                <CardDescription>输入要隐藏在图片中的文本信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="secret-text">要隐藏的文本</Label>
                  <Textarea
                    id="secret-text"
                    placeholder="请输入要隐藏的文本信息..."
                    value={secretText}
                    onChange={(e) => setSecretText(e.target.value)}
                    rows={4}
                  />
                  <p className="text-sm text-gray-500 mt-1">字符数: {secretText.length}</p>
                </div>

                <Button
                  onClick={handleEmbed}
                  disabled={isProcessing || !selectedFile || !secretText || !key}
                  className="w-full"
                >
                  {isProcessing ? "处理中..." : "隐藏信息到图片"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="extract" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>提取隐藏信息</CardTitle>
                <CardDescription>从图片中提取隐藏的文本信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleExtract} disabled={isProcessing || !selectedFile || !key} className="w-full">
                  {isProcessing ? "处理中..." : "提取隐藏信息"}
                </Button>

                {extractedText && (
                  <div>
                    <Label htmlFor="extracted-text">提取的文本</Label>
                    <Textarea id="extracted-text" value={extractedText} readOnly rows={4} className="bg-gray-50" />
                    <p className="text-sm text-gray-500 mt-1">提取字符数: {extractedText.length}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>
              • <strong>隐藏信息：</strong>
              选择载体图片，输入密钥和要隐藏的文本，点击"隐藏信息到图片"下载含有隐藏信息的图片
            </p>
            <p>
              • <strong>提取信息：</strong>选择含有隐藏信息的图片，输入相同的密钥，点击"提取隐藏信息"查看隐藏的文本
            </p>
            <p>
              • <strong>安全性：</strong>使用密钥控制隐写位置，没有正确密钥无法提取隐藏信息
            </p>
            <p>
              • <strong>兼容性：</strong>支持PNG、JPG、JPEG格式，建议使用PNG格式以获得最佳效果
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
