export interface OpenAIGenerationRequest {
  model: string
  prompt: string
  image: File | string // File object or base64 string
}

export interface OpenAIGenerationResponse {
  data: Array<{
    b64_json: string
  }>
}

export interface OpenAIConfig {
  apiKey?: string
  baseUrl?: string
  imageBase64?: string
}

export async function generateOpenAIImage(
  prompt: string,
  config: OpenAIConfig = {}
): Promise<{ images: Array<{ url: string }> }> {
  // 获取API配置，优先使用传入的配置，否则使用环境变量
  const apiKey = config.apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY
  const baseURL = config.baseUrl || process.env.NEXT_PUBLIC_OPENAI_BASE_URL || "https://api.openai.com/v1"

  if (!apiKey) {
    throw new Error("OpenAI API密钥未配置，请在配置中设置API密钥或在环境变量中设置 NEXT_PUBLIC_OPENAI_API_KEY")
  }

  // 如果有图像，使用编辑API，否则使用生成API
  const isEdit = config.imageBase64 && config.imageBase64.trim() !== ''
  const url = isEdit ? `${baseURL}/images/edits` : `${baseURL}/images/generations`

  let body: any
  let headers: any = {
    'Authorization': `Bearer ${apiKey}`,
  }

  if (isEdit) {
    // 图像编辑模式 - 使用FormData
    const formData = new FormData()
    
    // 将base64转换为Blob
    const base64Data = config.imageBase64!.replace(/^data:image\/[a-z]+;base64,/, '')
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'image/png' })
    
    formData.append('image[]', blob, 'image.png')
    formData.append('model', 'gpt-image-1')
    formData.append('prompt', prompt)
    
    body = formData
  } else {
    // 图像生成模式 - 使用JSON
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify({
       model: 'gpt-image-1',
       prompt: prompt,
       response_format: 'b64_json',
       size: '1024x1024',
       n: 1
     })
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] OpenAI API Error Response:", errorText)
      
      // 提供用户友好的错误消息
      let userFriendlyMessage = "图片生成失败，请重试"
      
      if (response.status === 401) {
        userFriendlyMessage = "OpenAI API密钥无效，请检查您的密钥设置"
      } else if (response.status === 403) {
        userFriendlyMessage = "OpenAI API访问被拒绝，请检查您的权限或余额"
      } else if (response.status === 429) {
        userFriendlyMessage = "请求过于频繁，请稍后再试"
      } else if (response.status === 500) {
        userFriendlyMessage = "OpenAI服务器内部错误，请稍后重试"
      } else if (response.status >= 400 && response.status < 500) {
        userFriendlyMessage = "请求参数错误，请检查您的OpenAI设置"
      }
      
      throw new Error(userFriendlyMessage)
    }

    const result = await response.json()
    
    // 转换返回格式以匹配Kolors API的格式
    const images = result.data.map((item: any) => ({
      url: `data:image/png;base64,${item.b64_json}`
    }))
    
    return { images }
  } catch (error) {
    if (error instanceof Error) {
      // 如果是我们自己抛出的友好错误消息，直接传递
      if (error.message.includes('API密钥无效') || 
          error.message.includes('访问被拒绝') || 
          error.message.includes('请求过于频繁') || 
          error.message.includes('服务器内部错误') || 
          error.message.includes('请求参数错误')) {
        throw error
      }
      
      // 处理网络错误等其他错误
      if (error.message.includes('fetch')) {
        throw new Error('网络连接失败，请检查网络连接后重试')
      }
      
      throw new Error('图片生成失败，请重试')
    }
    throw new Error('图片生成失败，请重试')
  }
}

// 将base64图像数据转换为可下载的URL
export function base64ToDownloadUrl(base64Data: string, filename: string = 'generated-image.png'): string {
  const byteCharacters = atob(base64Data)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: 'image/png' })
  return URL.createObjectURL(blob)
}

// 下载base64图像
export function downloadBase64Image(base64Data: string, filename: string = 'generated-image.png'): void {
  const url = base64ToDownloadUrl(base64Data, filename)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}