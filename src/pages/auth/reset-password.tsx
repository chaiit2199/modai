import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { isAuthenticated } from "@/utils/auth"
import { handleResetPassword } from "@/api/handle_login"
import Loading from "@/components/Loading"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  // Check authentication status after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true)
    if (isAuthenticated()) {
      router.push("/auth/admin")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Get token from query string (handle Next.js query format)
    const reset_token = router.query.token;
    const token = Array.isArray(reset_token) ? reset_token[0] : reset_token;

    if (!token || typeof token !== 'string') {
      setError("Token không hợp lệ. Vui lòng kiểm tra lại link đặt lại mật khẩu.")
      return
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }

    setIsLoading(true)

    try {
      const result = await handleResetPassword(token, password)
      
      if (result.success) {
        setSuccess(result.message)
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/auth/login")
        }, 2000)
      } else {
        setError(result.message)
      }
    } catch (err) {
      console.error('Reset password error:', err)
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }
 
  if (!isMounted) {
    return <Loading show={true} />
  }

  return (
    <div className="flex-auto flex flex-col items-center justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-line bg-white p-8 max-w-lg m-auto w-full"
      >
        <div className="space-y-1 text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Đặt lại mật khẩu</h1>
          <p className="text-sm text-muted-foreground">
            Nhập mật khẩu mới của bạn
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Mật khẩu mới
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full mt-4" size="lg">
          {isLoading ? <Loading show={true} /> : "Đặt lại mật khẩu"}
        </Button>

        <div className="text-center mt-4">
          <Link href="/auth/login" className="text-sm font-medium text-gray-500 ">
            Quay lại đăng nhập
          </Link>
        </div>
      </form>
    </div>
  )
}

