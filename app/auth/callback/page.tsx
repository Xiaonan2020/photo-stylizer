"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // 处理 OAuth 回调
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('认证回调错误:', error)
          router.push('/?error=auth_failed')
          return
        }

        if (data.session) {
          console.log('用户登录成功:', data.session.user)
          // 登录成功，重定向到首页
          router.push('/?login=success')
        } else {
          // 没有会话，重定向到首页
          router.push('/')
        }
      } catch (error) {
        console.error('处理认证回调时出错:', error)
        router.push('/?error=callback_failed')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-300">正在处理登录...</p>
      </div>
    </div>
  )
}