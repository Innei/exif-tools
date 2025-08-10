/**
 * Apply rotation/flip transformations to an image based on EXIF orientation
 */
export const applyExifRotation = (
  dataUrl: string,
  orientation: number,
): Promise<string> => {
  return new Promise((resolve) => {
    // If orientation is 1 (normal) or undefined, no transformation needed
    if (!orientation || orientation === 1) {
      resolve(dataUrl)
      return
    }

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      // Determine canvas dimensions based on orientation
      if (orientation >= 5 && orientation <= 8) {
        // Rotated 90° - swap width and height
        canvas.width = img.height
        canvas.height = img.width
      } else {
        canvas.width = img.width
        canvas.height = img.height
      }

      // Apply transformations based on orientation value
      switch (orientation) {
        case 2: {
          // Flipped horizontally
          ctx.transform(-1, 0, 0, 1, canvas.width, 0)
          break
        }
        case 3: {
          // Rotated 180°
          ctx.transform(-1, 0, 0, -1, canvas.width, canvas.height)
          break
        }
        case 4: {
          // Flipped vertically
          ctx.transform(1, 0, 0, -1, 0, canvas.height)
          break
        }
        case 5: {
          // Rotated 90° CCW, flipped horizontally
          ctx.transform(0, 1, 1, 0, 0, 0)
          break
        }
        case 6: {
          // Rotated 90° CW
          ctx.transform(0, 1, -1, 0, canvas.width, 0)
          break
        }
        case 7: {
          // Rotated 90° CW, flipped horizontally
          ctx.transform(0, -1, -1, 0, canvas.width, canvas.height)
          break
        }
        case 8: {
          // Rotated 90° CCW
          ctx.transform(0, -1, 1, 0, 0, canvas.height)
          break
        }
        default: {
          // No transformation
          break
        }
      }

      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/jpeg', 0.95))
    }

    img.src = dataUrl
  })
}
