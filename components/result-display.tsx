"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, ImageIcon, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface ResultDisplayProps {
  resultUrl?: string
  isGenerating: boolean
  error?: string
  onDownload?: () => void
  onRetry?: () => void
  className?: string
}

export function ResultDisplay({ resultUrl, isGenerating, error, onDownload, onRetry, className }: ResultDisplayProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleDownload = async () => {
    if (!resultUrl) return

    try {
      const response = await fetch(resultUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `stylized-image-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      onDownload?.()
    } catch (error) {
      console.error("Download failed:", error)
      alert("下载失败，请重试")
    }
  }

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <div className="flex items-center space-x-2 mb-4">
        <RefreshCw className="w-5 h-5 text-gray-400" />
        <h2 className="text-xl font-semibold text-gray-200">结果</h2>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {isGenerating ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-200 mb-2">生成中...</p>
              <p className="text-sm text-gray-400">请稍候，正在处理您的图片</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-red-400 mb-2">生成失败</p>
              <p className="text-sm text-gray-400 mb-4">{error}</p>
              {onRetry && (
                <Button
                  onClick={onRetry}
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent"
                >
                  重试
                </Button>
              )}
            </div>
          </div>
        ) : resultUrl ? (
          <div className="w-full space-y-4">
            <div className="relative bg-gray-800/50 rounded-lg p-4">
              <img
                src={resultUrl || "/placeholder.svg"}
                alt="Generated result"
                className={cn(
                  "w-full max-h-96 object-contain rounded-lg transition-opacity duration-300",
                  imageLoaded ? "opacity-100" : "opacity-0",
                )}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                </div>
              )}
            </div>
            <Button onClick={handleDownload} className="w-full bg-green-600 hover:bg-green-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              下载图片
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-700/50 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-400 mb-2">您的生成结果将显示在这里</p>
              <p className="text-sm text-gray-500">上传图片并选择风格以开始</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
