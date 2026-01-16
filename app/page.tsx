"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Copy, RefreshCw, Moon, Sun, ExternalLink, Download, History } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { StarryBackground } from "@/components/starry-background"
import { SkyBackground } from "@/components/sky-background"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PasswordSettings {
  length: number
  includeNumbers: boolean
  includeSymbols: boolean
  includeUppercase: boolean
  includeLowercase: boolean
}

interface HistoryItem {
  username: string
  password: string
  timestamp: number
}

// Data for username generation
const ANIMALS = [
  "Panda", "Tiger", "Eagle", "Lion", "Wolf", "Bear", "Fox", "Hawk", "Shark", "Whale",
  "Dolphin", "Falcon", "Owl", "Lynx", "Cobra", "Viper", "Raven", "Crow", "Stag", "Boar",
  "Otter", "Badger", "Seal", "Swan", "Crane", "Koala", "Sloth", "Gecko", "Iguana", "Zebra"
]

const ACTIONS = [
  "Jump", "Run", "Fly", "Swim", "Dash", "Hunt", "Sleep", "Climb", "Dive", "Roar",
  "Howl", "Soar", "Glance", "Strike", "Bite", "Scratch", "Gaze", "Walk", "Sprint", "Leap",
  "Roll", "Spin", "Glide", "Hover", "Crawl", "Hide", "Seek", "Chase", "Catch", "Hold"
]

export default function SecureGen() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Generator State
  const [generatedUsername, setGeneratedUsername] = useState("")
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([])
  
  // Settings
  const [passwordSettings, setPasswordSettings] = useState<PasswordSettings>({
    length: 12, // Default to 12, range 8-16
    includeNumbers: true,
    includeSymbols: true,
    includeUppercase: true,
    includeLowercase: true,
  })

  useEffect(() => {
    setMounted(true)
    generateNew()
  }, [])

  const generatePassword = (settings: PasswordSettings): string => {
    let charset = ""
    if (settings.includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (settings.includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (settings.includeNumbers) charset += "0123456789"
    if (settings.includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (charset === "") return "" // Fallback or handle null case

    let password = ""
    for (let i = 0; i < settings.length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password
  }

  const generateUsername = (): string => {
    const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)]
    // Ensure uniqueness could be handled by checking history, 
    // but with 30x30 = 900 combos, collisions are possible. 
    // Appending a random digit might help if strict global uniqueness isn't required 
    // beyond the session or if the user simply wants a unique string.
    // The requirement says "combination of an animal and an action".
    // We will stick to AnimalAction for now.
    return `${animal}${action}`
  }

  const generateNew = async () => {
    setIsGenerating(true)
    
    // Simulate a brief calculation delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300))

    let newUsername = generateUsername()
    // Simple collision check within current session history to try to maintain uniqueness
    // Maximum attempts to avoid infinite loop if pool is exhausted (unlikely with this pool size for a single session)
    let attempts = 0
    while (history.some(item => item.username === newUsername) && attempts < 10) {
      newUsername = generateUsername()
      attempts++
    }

    const newPassword = generatePassword(passwordSettings)

    setGeneratedUsername(newUsername)
    setGeneratedPassword(newPassword)
    
    // Add to history
    const newItem: HistoryItem = {
      username: newUsername,
      password: newPassword,
      timestamp: Date.now()
    }
    setHistory(prev => [newItem, ...prev])

    setIsGenerating(false)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const exportHistory = () => {
    const content = history.map(item => 
      `Username: ${item.username}\nPassword: ${item.password}\nGenerated: ${new Date(item.timestamp).toLocaleString()}\n-------------------`
    ).join("\n\n")
    
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "securegen_history.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Theme-based backgrounds */}
      {theme === "dark" ? <StarryBackground /> : <SkyBackground />}

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl flex-grow">
        
        {/* Header - Pill Shaped */}
        <header className="flex justify-center mb-8">
            <div className="glass-card rounded-full px-6 py-3 flex items-center gap-4 shadow-lg border border-white/10 bg-background/20 backdrop-blur-md">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                SecureGen
                </h1>
                <Separator orientation="vertical" className="h-6 bg-foreground/20" />
                <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full h-8 w-8 hover:bg-foreground/10"
                aria-label="Toggle theme"
                >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
            </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Generator Column */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Generated Output Card */}
                <Card className="glass-card shadow-xl border-0 rounded-2xl overflow-hidden backdrop-blur-xl bg-background/40">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-b border-border/50">
                    <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">Current Session</span>
                    <Button
                        onClick={generateNew}
                        disabled={isGenerating}
                        className="gap-2 rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                        <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                        Generate
                    </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    <div className="space-y-2">
                        <Label className="text-muted-foreground ml-1">Username</Label>
                        <div className="flex gap-2">
                            <Input
                            value={generatedUsername}
                            readOnly
                            className="font-mono text-lg glass-input border-white/10 bg-background/50 h-12"
                            />
                            <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(generatedUsername)}
                            className="h-12 w-12 rounded-lg border-white/10 hover:bg-background/50"
                            >
                            <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-muted-foreground ml-1">Password</Label>
                        <div className="flex gap-2">
                            <Input
                            value={generatedPassword}
                            readOnly
                            className="font-mono text-lg glass-input border-white/10 bg-background/50 h-12"
                            />
                            <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(generatedPassword)}
                            className="h-12 w-12 rounded-lg border-white/10 hover:bg-background/50"
                            >
                            <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
                </Card>

                {/* Settings Panel */}
                <Card className="glass-card shadow-xl border-0 rounded-2xl overflow-hidden backdrop-blur-xl bg-background/40">
                    <CardHeader className="border-b border-border/50">
                        <CardTitle className="text-lg">Password Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label>Length: {passwordSettings.length}</Label>
                            </div>
                            <Slider
                                value={[passwordSettings.length]}
                                onValueChange={(val) => setPasswordSettings(prev => ({ ...prev, length: val[0] }))}
                                min={8}
                                max={16}
                                step={1}
                                className="py-4"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: "numbers", label: "Numbers (0-9)", key: "includeNumbers" },
                                { id: "symbols", label: "Symbols (!@#$)", key: "includeSymbols" },
                                { id: "uppercase", label: "Uppercase (A-Z)", key: "includeUppercase" },
                                { id: "lowercase", label: "Lowercase (a-z)", key: "includeLowercase" },
                            ].map((opt) => (
                                <div key={opt.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={opt.id}
                                        checked={passwordSettings[opt.key as keyof PasswordSettings] as boolean}
                                        onCheckedChange={(checked) => 
                                            setPasswordSettings(prev => ({ ...prev, [opt.key]: checked === true }))
                                        }
                                    />
                                    <Label htmlFor={opt.id} className="cursor-pointer">{opt.label}</Label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* History Column */}
            <div className="space-y-6">
                <Card className="glass-card shadow-xl border-0 rounded-2xl overflow-hidden backdrop-blur-xl bg-background/40 h-full flex flex-col">
                    <CardHeader className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-b border-border/50 flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="flex items-center gap-2">
                            <History className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-lg">Session History</CardTitle>
                        </div>
                        {history.length > 0 && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={exportHistory}
                                className="h-8 gap-2"
                            >
                                <Download className="h-3 w-3" />
                                Export
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="p-0 flex-grow">
                        <ScrollArea className="h-[500px] w-full p-4">
                            {history.length === 0 ? (
                                <div className="text-center text-muted-foreground py-12">
                                    No history yet.
                                    <br />
                                    Generate some credentials!
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {history.map((item, idx) => (
                                        <div key={idx} className="p-3 rounded-xl bg-background/30 border border-white/5 space-y-2 hover:bg-background/50 transition-colors">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-semibold">{item.username}</span>
                                                <span className="text-xs text-muted-foreground tabular-nums">
                                                    {new Date(item.timestamp).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <div className="text-xs font-mono bg-black/20 rounded px-2 py-1 truncate">
                                                {item.password}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>SecureGen · Designed for Security</p>
        </div>

      </div>
    </div>
  )
}

