"use client"

import { useState, useEffect } from "react"
import { Upload } from "lucide-react"
import { ImageUploader } from "@/components/image-uploader"
import { StyleSelector } from "@/components/style-selector"
import { GenerationControls, type GenerationOptions } from "@/components/generation-controls"
import { ResultDisplay } from "@/components/result-display"
import { ModelSelector, type ModelConfig } from "@/components/model-selector"
import { generateKolorsImage, PRESET_STYLES } from "@/lib/kolors"
import { generateOpenAIImage } from "@/lib/openai"

export default function PhotoStylerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedImageBase64, setSelectedImageBase64] = useState<string>("")
  const [selectedStyle, setSelectedStyle] = useState<string>("cinematic")
  const [customPrompt, setCustomPrompt] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [resultUrl, setResultUrl] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    model: 'kolors'
  })

  // Load cached result from localStorage
  useEffect(() => {
    const cached = localStorage.getItem("last-generation-result")
    if (cached) {
      try {
        const { url, timestamp } = JSON.parse(cached)
        // Check if result is less than 1 hour old
        if (Date.now() - timestamp < 60 * 60 * 1000) {
          setResultUrl(url)
        } else {
          localStorage.removeItem("last-generation-result")
        }
      } catch (e) {
        localStorage.removeItem("last-generation-result")
      }
    }
  }, [])

  const handleImageSelect = (file: File, base64: string) => {
    setSelectedFile(file)
    setSelectedImageBase64(base64)
    setError("")
  }

  const handleGenerate = async (options: GenerationOptions) => {
    let prompt = ""
    if (selectedStyle === "custom") {
      if (!customPrompt.trim()) {
        setError("请输入自定义风格描述")
        return
      }
      prompt = customPrompt.trim()
    } else {
      const style = PRESET_STYLES.find((s) => s.id === selectedStyle)
      prompt = style?.prompt || "portrait style"
    }

    setIsGenerating(true)
    setError("")
    setResultUrl("")

    try {
      console.log("[v0] Starting image generation with prompt:", prompt)
      console.log("[v0] Using model:", modelConfig.model)

      let result: any
      
      if (modelConfig.model === 'openai') {
        // Use OpenAI API with PRESET_STYLES prompt
        let openaiPrompt = prompt
        if (selectedStyle !== 'custom') {
          const style = PRESET_STYLES.find((s) => s.id === selectedStyle)
          openaiPrompt = style?.prompt || prompt
        }
        
        result = await generateOpenAIImage(openaiPrompt, {
          imageBase64: selectedImageBase64,
          apiKey: modelConfig.openaiApiKey,
          baseUrl: modelConfig.openaiBaseUrl
        })
      } else {
        // Use Kolors API (default)
        result = await generateKolorsImage(prompt, {
          imageSize: "1024x1024",
          numInferenceSteps: options.numInferenceSteps,
          guidanceScale: options.guidanceScale,
          seed: options.seed,
          negativePrompt: options.negativePrompt,
          imageBase64: selectedImageBase64 || undefined,
        })
      }

      console.log("[v0] Generation successful, result:", result)

      if (result.images && result.images.length > 0) {
        const imageUrl = result.images[0].url
        setResultUrl(imageUrl)

        // Cache result
        localStorage.setItem(
          "last-generation-result",
          JSON.stringify({
            url: imageUrl,
            timestamp: Date.now(),
          }),
        )
      } else {
        throw new Error("生成结果为空")
      }
    } catch (err) {
      console.error("[v0] Generation failed:", err)
      const errorMessage = err instanceof Error ? err.message : "生成失败，请重试"
      setError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRetry = () => {
    setError("")
    // Use default generation options for retry
    handleGenerate({
      guidanceScale: 7.5,
      numInferenceSteps: 20,
    })
  }

  const canGenerate = !isGenerating && (selectedStyle !== "custom" || customPrompt.trim())

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Panel - Upload and Controls */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Upload className="w-5 h-5 text-blue-400" />
                <h1 className="text-xl font-semibold text-gray-200">图片和风格</h1>
              </div>

              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-300">
                  💡 当前使用文本生成模式。选择风格后即可生成图片，上传的参考图片将用于优化提示词。
                </p>
              </div>

              <div className="space-y-6">
                <ModelSelector config={modelConfig} onConfigChange={setModelConfig} />
                
                <ImageUploader onImageSelect={handleImageSelect} selectedImage={selectedImageBase64} />

                <StyleSelector
                  selectedStyle={selectedStyle}
                  customPrompt={customPrompt}
                  onStyleChange={setSelectedStyle}
                  onCustomPromptChange={setCustomPrompt}
                />

                {modelConfig.model === 'kolors' ? (
                  <GenerationControls onGenerate={handleGenerate} isGenerating={isGenerating} disabled={!canGenerate} />
                ) : (
                  <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
                    <button
                      onClick={() => handleGenerate({ guidanceScale: 7.5, numInferenceSteps: 20 })}
                      disabled={!canGenerate}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>生成中...</span>
                        </>
                      ) : (
                        <span>生成图片</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
            <ResultDisplay
              resultUrl={resultUrl}
              isGenerating={isGenerating}
              error={error}
              onRetry={handleRetry}
              className="h-full min-h-[600px]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
