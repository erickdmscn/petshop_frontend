import { useEffect } from 'react'

export function useEscapeKey(
  isOpen: boolean,
  onClose: () => void,
  enabled: boolean = true,
) {
  useEffect(() => {
    if (!isOpen || !enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, enabled])
}
