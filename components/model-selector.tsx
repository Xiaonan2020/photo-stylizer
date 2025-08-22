"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export interface ModelConfig {
  model: 'kolors' | 'openai'
  openaiApiKey?: string
  openaiBaseUrl?: string
}

interface ModelSelectorProps {
  config: ModelConfig
  onConfigChange: (config: ModelConfig) => void
}

export function ModelSelector({ config, onConfigChange }: ModelSelectorProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  const handleOpenAIToggle = (checked: boolean) => {
    onConfigChange({ 
      ...config, 
      model: checked ? 'openai' : 'kolors'
    })
  }

  const handleApiKeyChange = (apiKey: string) => {
    onConfigChange({ ...config, openaiApiKey: apiKey })
  }

  const handleBaseUrlChange = (baseUrl: string) => {
    onConfigChange({ ...config, openaiBaseUrl: baseUrl })
  }

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
      <Collapsible open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between text-gray-300 hover:text-white hover:bg-gray-700 p-0 h-auto"
          >
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">更换模型</span>
            </div>
            {isConfigOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="use-openai"
              checked={config.model === 'openai'}
              onCheckedChange={handleOpenAIToggle}
              className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <Label htmlFor="use-openai" className="text-sm text-gray-300 cursor-pointer">
              使用 OpenAI 模型
            </Label>
          </div>
          
          {config.model === 'openai' && (
            <div className="space-y-3 pl-6 border-l-2 border-gray-600">
              <div className="space-y-2">
                <Label htmlFor="openai-api-key" className="text-sm text-gray-300">
                  API KEY
                </Label>
                <Input
                  id="openai-api-key"
                  type="password"
                  placeholder="eg. sk-xxx"
                  value={config.openaiApiKey || ''}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                {/* <p className="text-xs text-gray-400">
                  如不填写，将使用环境变量 NEXT_PUBLIC_OPENAI_API_KEY
                </p> */}
              </div>
              <div className="space-y-2">
                <Label htmlFor="openai-base-url" className="text-sm text-gray-300">
                  Base URL
                </Label>
                <Input
                  id="openai-base-url"
                  placeholder="eg. https://api.openai.com/v1"
                  value={config.openaiBaseUrl || ''}
                  onChange={(e) => handleBaseUrlChange(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                {/* <p className="text-xs text-gray-400">
                  如不填写，将使用环境变量 NEXT_PUBLIC_OPENAI_BASE_URL
                </p> */}
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}