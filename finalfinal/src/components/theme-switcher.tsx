'use client'

import * as React from 'react'
import { Moon, Sun, Palette, Zap, Waves } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()
  const { toast } = useToast()

  const themes = [
    {
      name: 'Solar Harmonics',
      value: 'solar',
      icon: Waves,
      description: 'Warm cosmic energy theme'
    },
    {
      name: 'VibeSync',
      value: 'vibesync', 
      icon: Zap,
      description: 'Cool futuristic theme'
    },
  ]

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    const themeName = themes.find(t => t.value === newTheme)?.name || newTheme
    toast({
      title: "Theme Changed",
      description: `Switched to ${themeName} theme`,
    })
  }

  const handleModeToggle = () => {
    const newMode = theme?.includes('dark') ? 'light' : 'dark'
    const currentTheme = theme?.replace('-dark', '').replace('-light', '') || 'solar'
    setTheme(`${currentTheme}-${newMode}`)
    toast({
      title: "Mode Changed",
      description: `Switched to ${newMode} mode`,
    })
  }

  const getCurrentThemeName = () => {
    if (!theme) return 'Solar Harmonics'
    const themeValue = theme.replace('-dark', '').replace('-light', '')
    return themes.find(t => t.value === themeValue)?.name || 'Solar Harmonics'
  }

  const getCurrentThemeIcon = () => {
    if (!theme) return Waves
    const themeValue = theme.replace('-dark', '').replace('-light', '')
    return themes.find(t => t.value === themeValue)?.icon || Waves
  }

  const isDarkMode = theme?.includes('dark') ?? true

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-gray-600 hover:bg-gray-800">
          {React.createElement(getCurrentThemeIcon(), { className: "h-4 w-4" })}
          <span className="hidden sm:inline-block">{getCurrentThemeName()}</span>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-700">
        <DropdownMenuItem onClick={handleModeToggle} className="gap-2 cursor-pointer hover:bg-gray-800">
          {isDarkMode ? (
            <>
              <Sun className="h-4 w-4" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              <span>Dark Mode</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <div className="px-2 py-1.5 text-sm font-semibold text-gray-400">
          Color Themes
        </div>
        {themes.map((themeOption) => {
          const Icon = themeOption.icon
          const isActive = theme?.includes(themeOption.value) || 
            (!theme && themeOption.value === 'solar')
          
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => handleThemeChange(`${themeOption.value}-${isDarkMode ? 'dark' : 'light'}`)}
              className="gap-2 cursor-pointer hover:bg-gray-800"
            >
              <Icon className="h-4 w-4" />
              <div className="flex flex-col">
                <span className={isActive ? "text-orange-400 font-medium" : ""}>
                  {themeOption.name}
                </span>
                <span className="text-xs text-gray-500">{themeOption.description}</span>
              </div>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-orange-400 rounded-full" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}