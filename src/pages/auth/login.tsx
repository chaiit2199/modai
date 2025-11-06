import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { isAuthenticated } from "@/utils/auth"
import { handleLogin } from "@/api/handle_login"
import Loading from "@/components/Loading"
import { Eye, EyeOff } from "lucide-react"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  // Check authentication status after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true)
    // Only check on client-side to avoid hydration mismatch
    if (isAuthenticated()) {
      router.push("/profile")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await handleLogin(username, password)

    if (result.success) {
      // Redirect to profile on success
      router.push("/profile")
    } else {
      // Show error message
      setError(result.message);
    }

    setIsLoading(false)
  }
 
  if (!isMounted) {
    return (
      <Loading show={true} />
    )
  }

  return (
    <div className="flex-auto flex flex-col items-center justify-center mt-10">
        <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-line bg-white p-8 max-w-lg m-auto w-full"
            >
            <div className="space-y-1 text-center mb-8">
                <h1 className="text-2xl font-semibold tracking-tight">Đăng nhập</h1>
                <p className="text-sm text-muted-foreground">
                  Đăng nhập vào tài khoản của bạn
                </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-foreground"> 
                    Tên đăng nhập
                  </label>
                  <Input
                      id="username"
                      placeholder="Tên đăng nhập"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                      Password
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
                      {showPassword ?  <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" /> }
                    </button>
                  </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4">
                <Link href="/auth/forgot-password" className="text-sm font-medium text-gray-500 hover:underline">
                Quên mật khẩu?</Link>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full mt-4" size="lg">
                {isLoading ? <Loading show={true} /> : "Đăng nhập"}
            </Button>

            <p className="text-center text-sm text-muted-foreground pt-4">
                Không có tài khoản?{" "}
                <Link href="/register" className="font-medium text-gray-500 hover:underline">
                  Đăng ký
                </Link>
            </p>
        </form>
    </div>
  )
}
