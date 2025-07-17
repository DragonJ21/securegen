"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Copy, RefreshCw, Moon, Sun, ExternalLink } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { StarryBackground } from "@/components/starry-background"
import { SkyBackground } from "@/components/sky-background"

interface PasswordSettings {
  length: number
  includeNumbers: boolean
  includeSymbols: boolean
  includeUppercase: boolean
  includeLowercase: boolean
  avoidAmbiguous: boolean
}

interface UsernameSettings {
  style: "techy" | "natural" | "random"
  alwaysUnique: boolean
}

export default function SecureGen() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [generatedUsername, setGeneratedUsername] = useState("")
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [usedUsernames, setUsedUsernames] = useState<Set<string>>(new Set())

  const [passwordSettings, setPasswordSettings] = useState<PasswordSettings>({
    length: 16,
    includeNumbers: true,
    includeSymbols: true,
    includeUppercase: true,
    includeLowercase: true,
    avoidAmbiguous: true,
  })

  const [usernameSettings, setUsernameSettings] = useState<UsernameSettings>({
    style: "techy",
    alwaysUnique: true,
  })

  useEffect(() => {
    setMounted(true)
    generateNew()
  }, [])

  const generatePassword = (settings: PasswordSettings): string => {
    let charset = ""

    if (settings.includeLowercase) {
      charset += settings.avoidAmbiguous ? "abcdefghjkmnpqrstuvwxyz" : "abcdefghijklmnopqrstuvwxyz"
    }
    if (settings.includeUppercase) {
      charset += settings.avoidAmbiguous ? "ABCDEFGHJKMNPQRSTUVWXYZ" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    }
    if (settings.includeNumbers) {
      charset += settings.avoidAmbiguous ? "23456789" : "0123456789"
    }
    if (settings.includeSymbols) {
      charset += settings.avoidAmbiguous ? "!@#$%^&*()_+-=[]{}|;:,.<>?" : "!@#$%^&*()_+-=[]{}|;:,.<>?"
    }

    if (charset === "") return ""

    let password = ""
    for (let i = 0; i < settings.length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return password
  }

  const generateUsername = (settings: UsernameSettings): string => {
    const techyPrefixes = ["byte", "code", "cyber", "data", "dev", "hack", "neo", "pixel", "tech", "web"]
    const techySuffixes = ["walker", "master", "ninja", "wizard", "hunter", "rider", "forge", "storm", "blade", "core"]

    const naturalAdjectives = [
      "silver",
      "golden",
      "crystal",
      "shadow",
      "mystic",
      "azure",
      "crimson",
      "emerald",
      "violet",
      "amber",
    ]
    const naturalNouns = ["leaf", "moon", "star", "river", "mountain", "forest", "ocean", "flame", "wind", "aurora"]

    const randomChars = "abcdefghijklmnopqrstuvwxyz"
    const mythicalWords = [
      "phoenix",
      "dragon",
      "griffin",
      "helios",
      "atlas",
      "orion",
      "nova",
      "cosmos",
      "zenith",
      "apex",
    ]

    let username = ""

    switch (settings.style) {
      case "techy":
        const techPrefix = techyPrefixes[Math.floor(Math.random() * techyPrefixes.length)]
        const techSuffix = techySuffixes[Math.floor(Math.random() * techySuffixes.length)]
        const techNumber = Math.floor(Math.random() * 100)
        username = `${techPrefix}${techSuffix}${techNumber}`
        break

      case "natural":
        const adjective = naturalAdjectives[Math.floor(Math.random() * naturalAdjectives.length)]
        const noun = naturalNouns[Math.floor(Math.random() * naturalNouns.length)]
        const mythical = mythicalWords[Math.floor(Math.random() * mythicalWords.length)]
        username = `${adjective}${noun}_${mythical}`
        break

      case "random":
        let randomString = ""
        for (let i = 0; i < 6; i++) {
          randomString += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
        }
        const randomNumber = Math.floor(Math.random() * 100)
        const randomMythical = mythicalWords[Math.floor(Math.random() * mythicalWords.length)]
        username = `${randomString}${randomNumber}_${randomMythical}`
        break
    }

    if (settings.alwaysUnique && usedUsernames.has(username)) {
      return generateUsername(settings)
    }

    return username
  }

  const generateNew = async () => {
    setIsGenerating(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const newPassword = generatePassword(passwordSettings)
    const newUsername = generateUsername(usernameSettings)

    setGeneratedPassword(newPassword)
    setGeneratedUsername(newUsername)

    if (usernameSettings.alwaysUnique) {
      setUsedUsernames((prev) => new Set([...prev, newUsername]))
    }

    setIsGenerating(false)
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen relative">
      {/* Theme-based backgrounds */}
      {theme === "dark" ? <StarryBackground /> : <SkyBackground />}

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
              SecureGen
            </h1>
            <div className="flex-1 flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full enhanced-focus hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 glow-border"
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          <p className="text-xl text-foreground/80 font-medium">
            Generate strong passwords and unique usernames instantly.
          </p>
        </div>

        {/* Generated Output Section */}
        <Card className="mb-8 glass-card shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 dark:from-blue-500/20 dark:to-purple-500/20">
            <CardTitle className="flex items-center justify-between text-xl">
              Generated Credentials
              <Button
                onClick={generateNew}
                disabled={isGenerating}
                className="gap-2 rounded-xl enhanced-focus glow-button font-semibold"
              >
                <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                Generate New
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-3">
              <Label htmlFor="username" className="text-base font-semibold">
                Generated Username
              </Label>
              <div className="flex gap-3">
                <Input
                  id="username"
                  value={generatedUsername}
                  readOnly
                  className="font-mono text-lg glass-input enhanced-focus rounded-xl border-0 glow-border"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(generatedUsername, "username")}
                  className="rounded-xl enhanced-focus glow-border hover:bg-white/20 dark:hover:bg-white/10"
                  aria-label="Copy username"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-base font-semibold">
                Generated Password
              </Label>
              <div className="flex gap-3">
                <Input
                  id="password"
                  value={generatedPassword}
                  readOnly
                  className="font-mono text-lg glass-input enhanced-focus rounded-xl border-0 glow-border"
                  type="text"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(generatedPassword, "password")}
                  className="rounded-xl enhanced-focus glow-border hover:bg-white/20 dark:hover:bg-white/10"
                  aria-label="Copy password"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Password Settings Panel */}
          <Card className="glass-card shadow-2xl border-0 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20">
              <CardTitle className="text-xl">Password Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Length</Label>
                  <span className="text-sm font-mono bg-primary/10 px-2 py-1 rounded-lg">
                    {passwordSettings.length}
                  </span>
                </div>
                <Slider
                  value={[passwordSettings.length]}
                  onValueChange={(value) => setPasswordSettings((prev) => ({ ...prev, length: value[0] }))}
                  min={8}
                  max={64}
                  step={1}
                  className="w-full enhanced-focus"
                />
              </div>

              <Separator className="bg-white/20 dark:bg-white/10" />

              <div className="space-y-4">
                {[
                  { id: "numbers", label: "Include Numbers", key: "includeNumbers" },
                  { id: "symbols", label: "Include Symbols", key: "includeSymbols" },
                  { id: "uppercase", label: "Include Uppercase", key: "includeUppercase" },
                  { id: "lowercase", label: "Include Lowercase", key: "includeLowercase" },
                  { id: "ambiguous", label: "Avoid Ambiguous Characters", key: "avoidAmbiguous" },
                ].map((option) => (
                  <div key={option.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={option.id}
                      checked={passwordSettings[option.key as keyof PasswordSettings] as boolean}
                      onCheckedChange={(checked) =>
                        setPasswordSettings((prev) => ({ ...prev, [option.key]: checked as boolean }))
                      }
                      className="enhanced-focus rounded-md"
                    />
                    <Label htmlFor={option.id} className="text-sm font-medium cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Username Generator Settings */}
          <Card className="glass-card shadow-2xl border-0 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20">
              <CardTitle className="text-xl">Username Style</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Style</Label>
                <Select
                  value={usernameSettings.style}
                  onValueChange={(value: "techy" | "natural" | "random") =>
                    setUsernameSettings((prev) => ({ ...prev, style: value }))
                  }
                >
                  <SelectTrigger className="glass-input enhanced-focus rounded-xl border-0 glow-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-0 rounded-xl">
                    <SelectItem value="techy" className="rounded-lg">
                      Techy (e.g., "bytewalker99")
                    </SelectItem>
                    <SelectItem value="natural" className="rounded-lg">
                      Natural (e.g., "silverleaf_aurora")
                    </SelectItem>
                    <SelectItem value="random" className="rounded-lg">
                      Random (e.g., "qxrv99m_helios")
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-white/20 dark:bg-white/10" />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="unique" className="text-base font-semibold">
                    Always unique / never repeated
                  </Label>
                  <p className="text-sm text-muted-foreground">Ensures generated usernames are never duplicated</p>
                </div>
                <Switch
                  id="unique"
                  checked={usernameSettings.alwaysUnique}
                  onCheckedChange={(checked) => setUsernameSettings((prev) => ({ ...prev, alwaysUnique: checked }))}
                  className="enhanced-focus"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <Card className="glass-card shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardContent className="pt-6 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-foreground/70 font-medium">Created by [Your Name] · Part of my Portfolio</p>
              <Button
                variant="outline"
                className="gap-2 glass-input enhanced-focus rounded-xl border-0 glow-border hover:bg-white/20 dark:hover:bg-white/10 bg-transparent"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Full Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
