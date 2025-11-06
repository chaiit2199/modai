"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default  function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login request
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border bg-card p-8 shadow-lg"
        >
        <div className="space-y-1 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        <div className="space-y-4">
            <div className="space-y-2">
            <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
            >
                Email
            </label>
            <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
            />
            </div>

            <div className="space-y-2">
            <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
            >
                Password
            </label>
            <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
            />
            </div>
        </div>

        <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" className="rounded border border-input" />
            Remember me
            </label>

            <a
            href="#"
            className="text-sm font-medium text-primary hover:text-primary/80"
            >
            Forgot password?
            </a>
        </div>

        <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4"
            size="lg"
        >
            {isLoading ? "Signing in..." : "Sign in"}
        </Button>

        <p className="text-center text-sm text-muted-foreground pt-2">
            Don't have an account?{" "}
            <a href="/register" className="font-medium text-primary hover:underline">
            Sign up
            </a>
        </p>
        </form>

  )
}
