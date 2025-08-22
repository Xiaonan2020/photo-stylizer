"use client"

import type React from "react"

import { useState, useRef, type DragEvent } from "react"
import { ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploaderProps {
  onImageSelect: (file: File, base64: string) => void
  selectedImage?: string
  className?: string
}

export function ImageUploader({ onImageSelect, selectedImage, className }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find((file) => file.type.startsWith("image/"))

    if (imageFile) {
      processFile(imageFile)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("文件大小不能超过10MB")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      onImageSelect(file, base64)
    }
    reader.readAsDataURL(file)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          "hover:border-blue-400 hover:bg-blue-50/5",
          isDragging ? "border-blue-400 bg-blue-50/10" : "border-gray-600",
          selectedImage ? "border-solid border-gray-500" : "",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
        />

        {selectedImage ? (
          <div className="space-y-4">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Selected"
              className="max-w-full max-h-48 mx-auto rounded-lg object-contain"
            />
            <p className="text-sm text-gray-400">点击更换图片</p>
            <p className="text-xs text-green-400 bg-green-400/10 px-3 py-2 rounded">
              ✨ 图片已上传，将进行风格转换生成
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-200 mb-2">点击上传图片或拖放至此</p>
              <p className="text-sm text-gray-400">支持格式：JPG、PNG、GIF</p>
              <p className="text-xs text-blue-400 mt-2">💡 上传图片进行风格转换，或直接选择风格生成新图片</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
