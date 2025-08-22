"use client"
import { PRESET_STYLES } from "@/lib/kolors"
import { cn } from "@/lib/utils"

interface StyleSelectorProps {
  selectedStyle: string
  customPrompt: string
  onStyleChange: (styleId: string) => void
  onCustomPromptChange: (prompt: string) => void
  className?: string
}

export function StyleSelector({
  selectedStyle,
  customPrompt,
  onStyleChange,
  onCustomPromptChange,
  className,
}: StyleSelectorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-medium text-gray-200 mb-4">选择一种风格：</h3>

      <div className="h-80 overflow-y-auto border border-gray-600 rounded-lg p-2 bg-gray-900/50 scrollbar-hide">
        <div className="grid grid-cols-2 gap-3">
          {PRESET_STYLES.map((style) => (
            <label
              key={style.id}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors",
                "hover:bg-gray-700/50",
                selectedStyle === style.id ? "bg-blue-600/20 border border-blue-500" : "bg-gray-800/50",
              )}
            >
              <input
                type="radio"
                name="style"
                value={style.id}
                checked={selectedStyle === style.id}
                onChange={(e) => onStyleChange(e.target.value)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-200 font-medium">{style.name}</span>
            </label>
          ))}
        </div>
      </div>

      {selectedStyle === "custom" && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">自定义风格描述：</label>
          <textarea
            value={customPrompt}
            onChange={(e) => onCustomPromptChange(e.target.value)}
            placeholder="请输入您想要的风格描述，例如：油画风格，温暖色调..."
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>
      )}
    </div>
  )
}
