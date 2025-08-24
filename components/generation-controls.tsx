"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface GenerationControlsProps {
  onGenerate: (options: GenerationOptions) => void
  isGenerating: boolean
  disabled: boolean
  isAuthenticated?: boolean
  className?: string
}

export interface GenerationOptions {
  guidanceScale: number
  numInferenceSteps: number
  seed?: number
  negativePrompt?: string
}

export function GenerationControls({ onGenerate, isGenerating, disabled, isAuthenticated = true, className }: GenerationControlsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [guidanceScale, setGuidanceScale] = useState(7.5)
  const [numInferenceSteps, setNumInferenceSteps] = useState(20)
  const [seed, setSeed] = useState<string>("")
  const [negativePrompt, setNegativePrompt] = useState<string>("")

  const handleGenerate = () => {
    const options: GenerationOptions = {
      guidanceScale,
      numInferenceSteps,
      ...(seed && { seed: Number.parseInt(seed) }),
      ...(negativePrompt && { negativePrompt }),
    }
    onGenerate(options)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Advanced Settings Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center space-x-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
      >
        <Settings className="w-4 h-4" />
        <span>高级设置</span>
        {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Advanced Settings Panel */}
      {showAdvanced && (
        <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              引导系数 (Guidance Scale): {guidanceScale}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={guidanceScale}
              onChange={(e) => setGuidanceScale(Number.parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1.0</span>
              <span>20.0</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">推理步数: {numInferenceSteps}</label>
            <input
              type="range"
              min="10"
              max="50"
              step="1"
              value={numInferenceSteps}
              onChange={(e) => setNumInferenceSteps(Number.parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10</span>
              <span>50</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">随机种子 (可选)</label>
            <input
              type="number"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="留空使用随机种子"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">负面提示词 (Negative Prompt)</label>
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="描述您不希望在图像中包含的内容，例如：模糊、低质量、变形..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>
        </div>
      )}

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={disabled || isGenerating}
        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? "生成中..." : isAuthenticated ? "生成" : "登录后生成"}
      </Button>

      <p className="text-xs text-gray-500 text-center">每次生成耗时约 10-30 秒</p>
    </div>
  )
}
