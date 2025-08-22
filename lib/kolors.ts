export interface KolorsGenerationRequest {
  model: string
  prompt: string
  image_size: string
  batch_size?: number
  num_inference_steps: number
  guidance_scale: number
  seed?: number
  negative_prompt?: string
  image?: string
}

export interface KolorsGenerationResponse {
  images: Array<{
    url: string
  }>
  timings: {
    inference: number
  }
  seed: number
}

export async function generateKolorsImage(
  prompt: string,
  options: {
    imageSize?: string
    numInferenceSteps?: number
    guidanceScale?: number
    seed?: number
    negativePrompt?: string
    imageBase64?: string
  } = {},
): Promise<KolorsGenerationResponse> {
  const apiKey = process.env.NEXT_PUBLIC_KOLORS_API_KEY

  if (!apiKey) {
    throw new Error("API密钥未配置，请在环境变量中设置 NEXT_PUBLIC_KOLORS_API_KEY")
  }

  const {
    imageSize = "1024x1024",
    numInferenceSteps = 20,
    guidanceScale = 7.5,
    seed,
    negativePrompt,
    imageBase64,
  } = options

  const requestBody: KolorsGenerationRequest = {
    model: "Kwai-Kolors/Kolors",
    prompt,
    image_size: imageSize,
    batch_size: 1,
    num_inference_steps: numInferenceSteps,
    guidance_scale: guidanceScale,
    ...(seed && { seed }),
    ...(negativePrompt && { negative_prompt: negativePrompt }),
    ...(imageBase64 && { image: imageBase64 }),
  }

  console.log("[v0] API Request:", JSON.stringify(requestBody, null, 2))

  try {
    const response = await fetch("https://api.siliconflow.cn/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    console.log("[v0] API Response Status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] API Error Response:", errorText)
      
      // 提供用户友好的错误消息
      let userFriendlyMessage = "图片生成失败，请重试"
      
      if (response.status === 401) {
        userFriendlyMessage = "API密钥无效，请检查您的密钥设置"
      } else if (response.status === 403) {
        userFriendlyMessage = "API访问被拒绝，请检查您的权限或余额"
      } else if (response.status === 429) {
        userFriendlyMessage = "请求过于频繁，请稍后再试"
      } else if (response.status === 500) {
        userFriendlyMessage = "服务器内部错误，请稍后重试"
      } else if (response.status >= 400 && response.status < 500) {
        userFriendlyMessage = "请求参数错误，请检查您的设置"
      }
      
      throw new Error(userFriendlyMessage)
    }

    const result = await response.json()
    console.log("[v0] API Success Response:", result)
    return result
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
      if (error.message.includes('fetch') || error.message.includes('network')) {
        throw new Error('网络连接失败，请检查网络连接后重试')
      }
      
      throw new Error('图片生成失败，请重试')
    }
    throw new Error('图片生成失败，请重试')
  }
}

export const PRESET_STYLES = [
  { id: "custom", name: "自定义风格", prompt: "" },
  {
    id: "qversion",
    name: "Q版手办",
    prompt: "Please maintain the original composition, character poses and details. Transform into cute chibi figure style, kawaii collectible toy, vinyl figure aesthetic, pastel colors, adorable character design with rounded features",
  },
  {
    id: "toy-package",
    name: "玩具包装",
    prompt: "Please maintain the original composition, character poses and details. Transform into toy packaging design style, vibrant commercial product presentation, collectible figure in display box, retail packaging aesthetic",
  },
  {
    id: "3d-model",
    name: "3D模型",
    prompt: "Please maintain the original composition, character poses and details. Transform into 3D rendered character style, clean modeling, professional studio lighting, digital sculpture, high quality render with smooth surfaces",
  },
  {
    id: "blind-box",
    name: "盲盒",
    prompt: "Please maintain the original composition, character poses and details. Transform into blind box collectible character style, cute mascot design, pastel colors, kawaii aesthetic, small figure with simple features",
  },
  {
    id: "pixar",
    name: "皮克斯",
    prompt: "Please maintain the original composition, character poses and details. Transform into Pixar animation style, 3D cartoon character, expressive features, Disney Pixar aesthetic, animated movie style with warm lighting",
  },
  {
    id: "polaroid-clay",
    name: "拍立得黏土",
    prompt: "Please maintain the original composition, character poses and details. Transform into polaroid photo of clay sculpture style, handmade clay figure, soft textures, warm lighting, instant film aesthetic with clay material",
  },
  {
    id: "polaroid-real",
    name: "拍立得写实",
    prompt: "Please maintain the original composition, character poses and details. Transform into realistic polaroid photo style, instant film aesthetic, warm vintage tones, retro photography with film grain",
  },
  {
    id: "jewelry-box",
    name: "珠宝盒",
    prompt: "Please maintain the original composition, character poses and details. Transform into elegant portrait in ornate jewelry box frame, luxurious decorative border, precious gems, golden details, vintage elegance",
  },
  {
    id: "q-icon",
    name: "Q版图标",
    prompt: "Please maintain the original composition, character poses and details. Transform into cute icon style character, simplified kawaii features, app icon aesthetic, clean vector style, chibi design with bold outlines",
  },
  {
    id: "cartoon-sticker",
    name: "卡通贴纸",
    prompt: "Please maintain the original composition, character poses and details. Transform into cartoon sticker style, bright colors, bold outlines, kawaii design, cute character sticker aesthetic with glossy finish",
  },
  {
    id: "doraemon",
    name: "多啦A梦",
    prompt: "Please maintain the original composition, character poses and details. Transform into Doraemon anime style, classic Japanese cartoon aesthetic, simple rounded features, bright blue and white colors, manga style",
  },
  {
    id: "snoopy",
    name: "史努比",
    prompt: "Please maintain the original composition, character poses and details. Transform into Snoopy comic style, Peanuts cartoon aesthetic, simple line art, black and white with minimal colors, classic comic strip style",
  },
  {
    id: "japanese-illustration",
    name: "日本插画",
    prompt: "Please maintain the original composition, character poses and details. Transform into Japanese illustration style, soft watercolor textures, delicate line work, pastel colors, kawaii aesthetic, anime-inspired art",
  },
  {
    id: "wool-felt",
    name: "羊毛毡",
    prompt: "Please maintain the original composition, character poses and details. Transform into wool felt craft style, handmade felt texture, soft fuzzy materials, needle felting aesthetic, cozy handcraft appearance",
  },
  {
    id: "enamel-pin",
    name: "珐琅别针",
    prompt: "Please maintain the original composition, character poses and details. Transform into enamel pin style, hard enamel finish, bold colors, metallic outlines, collectible pin aesthetic, glossy surface",
  },
  {
    id: "fashion-magazine",
    name: "时尚杂志",
    prompt: "Please maintain the original composition, character poses and details. Transform into fashion magazine style, high-end editorial photography, professional lighting, glamorous styling, vogue aesthetic, sophisticated composition",
  },
  {
    id: "crystal-ball",
    name: "水晶球",
    prompt: "Please maintain the original composition, character poses and details. Transform into crystal ball snow globe style, miniature scene inside glass sphere, magical sparkles, dreamy atmosphere, transparent crystal effect",
  },
]
