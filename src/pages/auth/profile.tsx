import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { getUser, clearAuth, isAuthenticated, User } from "@/utils/auth"
import Metadata from "@/components/Metadata"
import { Button } from "@/components/ui/button"

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/auth/login")
      return
    }

    // Get user info
    const userData = getUser()
    if (userData) {
      setUser(userData)
    } else {
      router.push("/auth/login")
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    clearAuth()
    router.push("/auth/login")
  }

  if (isLoading) {
    return (
      <div className="flex-auto flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container my-8">
      <Metadata title="Profile" />
      
      <div className="flex-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="rounded-xl border border-line bg-white p-8 max-w-lg w-full">
          <div className="space-y-1 text-center mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
            <p className="text-sm text-muted-foreground">Your account information</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Username
              </label>
              <div className="px-3 py-2 border border-line rounded-md bg-background">
                {user.username}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Email
              </label>
              <div className="px-3 py-2 border border-line rounded-md bg-background">
                {user.email}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Role
              </label>
              <div className="px-3 py-2 border border-line rounded-md bg-background">
                {user.role}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                User ID
              </label>
              <div className="px-3 py-2 border border-line rounded-md bg-background">
                {user.id}
              </div>
            </div>

            <Button
              onClick={handleLogout}
              className="w-full mt-6"
              variant="outline"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

