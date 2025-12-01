'use client'

import { useState } from 'react'
import Image from 'next/image'

type TemplateImageGalleryProps = {
  title: string
  images: string[]
}

export function TemplateImageGallery({ title, images }: TemplateImageGalleryProps) {
  const validImages = images.filter(Boolean)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!validImages.length) {
    return (
      <div className="relative aspect-[4/3] w-full rounded-xl bg-gray-100" />
    )
  }

  const showPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
  }

  const showNext = () => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length)
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={validImages[currentIndex]}
          alt={title}
          fill
          className="object-cover"
          priority
        />

        {validImages.length > 1 && (
          <>
            <button
              type="button"
              className="absolute left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
              onClick={showPrev}
            >
              ‹
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
              onClick={showNext}
            >
              ›
            </button>
          </>
        )}
      </div>

      {validImages.length > 1 && (
        <div className="flex gap-2">
          {validImages.slice(0, 4).map((img, index) => (
            <button
              key={img + index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`relative h-14 flex-1 overflow-hidden rounded-lg border ${
                currentIndex === index ? 'border-primary' : 'border-transparent'
              }`}
            >
              <Image src={img} alt={title} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}


