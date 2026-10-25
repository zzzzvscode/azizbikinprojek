import { useSound } from '../context/SoundContext'
import { Volume2, VolumeX } from 'lucide-react'

export default function SoundToggle() {
  const { soundEnabled, toggleSound } = useSound()

  return (
    <button
      type="button"
      className="cyber-theme-toggle"
      onClick={toggleSound}
      aria-label={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
      title={soundEnabled ? 'SFX: Aktif (Klik untuk mute)' : 'SFX: Mute (Klik untuk aktifkan)'}
    >
      <span className="toggle-glow" />
      <span className="toggle-icon-wrap">
        {soundEnabled ? (
          <Volume2 size={16} className="icon-moon" />
        ) : (
          <VolumeX size={16} style={{ color: '#94a3b8' }} />
        )}
      </span>
    </button>
  )
}
