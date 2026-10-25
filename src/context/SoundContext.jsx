import { createContext, useContext, useState, useEffect } from 'react'
import { sfx } from '../utils/sfx'

const SoundContext = createContext()

export function SoundProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('portfolio-sound') !== 'disabled'
  })

  useEffect(() => {
    localStorage.setItem('portfolio-sound', soundEnabled ? 'enabled' : 'disabled')
  }, [soundEnabled])

  const toggleSound = () => {
    setSoundEnabled(prev => !prev)
  }

  const playSfx = (name, ...args) => {
    if (!soundEnabled) return
    if (sfx[name]) {
      sfx[name](...args)
    }
  }

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, playSfx }}>
      <div
        style={{ display: 'contents' }}
        onClickCapture={(event) => {
          if (!soundEnabled || !(event.target instanceof Element)) return
          const control = event.target.closest('button, a, [role="button"]')
          if (!control || control.disabled || control.getAttribute('aria-disabled') === 'true') return
          sfx.click()
        }}
      >
        {children}
      </div>
    </SoundContext.Provider>
  )
}

export function useSound() {
  const ctx = useContext(SoundContext)
  if (!ctx) throw new Error('useSound must be used within SoundProvider')
  return ctx
}
