import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem('tempo-theme')
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    localStorage.setItem('tempo-theme', theme)
  }, [theme])

  return {
    theme,
    toggleTheme: () => setTheme((current) => current === 'light' ? 'dark' : 'light'),
  }
}
