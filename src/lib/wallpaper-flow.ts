import { toast } from './toast'
import {
  applySignals,
  currentSignals,
  paletteFromFile,
  resetSignals,
} from './wallpaper'

// The part of wallpaper mode that talks to the person: read the image,
// recolour the page, say so, and offer an undo. Loaded only when needed.
export async function setWallpaper(file: File) {
  const before = currentSignals()
  const hadSaved = (() => {
    try {
      return localStorage.getItem('signals') !== null
    } catch {
      return false
    }
  })()

  let palette
  try {
    palette = await paletteFromFile(file)
  } catch {
    toast({ text: 'That image could not be read.' })
    return
  }
  if (!palette) {
    toast({
      text: 'That image is nearly grey, so there is nothing to take. The signals stay as they are.',
    })
    return
  }
  applySignals(palette)
  toast({
    text: 'Signals taken from your wallpaper.',
    swatches: palette,
    action: {
      label: 'Undo',
      run: () => (hadSaved ? applySignals(before) : resetSignals()),
    },
  })
}

export function pickWallpaper() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.addEventListener('change', () => {
    const file = input.files?.[0]
    if (file) void setWallpaper(file)
  })
  input.click()
}

export function restoreSignals() {
  resetSignals()
  toast({ text: 'Signals back to ember, mint and azure.' })
}
