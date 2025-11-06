import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { isAuthenticated } from "@/utils/auth"
import { handleForgotPassword } from "@/api/handle_login"
import Loading from "@/components/Loading"
import Link from "next/link"

export default function ForgotPasswordForm() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  // Check authentication status after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true)
    if (isAuthenticated()) {
      router.push("/profile")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    const result = await handleForgotPassword(username, email)

    if (result.success) {
      setSuccess(result.message)
    } else {
      setError(result.message)
    }

    setIsLoading(false)
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
          <h1 className="text-2xl font-semibold tracking-tight">Quên mật khẩu</h1>
          <p className="text-sm text-muted-foreground">
            Nhập tên đăng nhập và email của bạn để nhận link đặt lại mật khẩu
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
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full mt-4 relative" size="lg">
          {isLoading ? <Loading show={true} /> : "Gửi email đặt lại mật khẩu"}
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

