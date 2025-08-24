import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Google OAuth 登录
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  
  if (error) {
    console.error('Google 登录错误:', error)
    throw error
  }
  
  return data
}

// 登出
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('登出错误:', error)
    throw error
  }
}

// 获取当前用户
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('获取用户信息错误:', error)
    return null
  }
  
  return user
}