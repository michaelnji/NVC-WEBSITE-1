"use client"

import React, { useMemo, useState } from "react"
import Image from "next/image"

type Props = {
  src: string
  alt: string
  className?: string
  wrapperClassName?: string
  priority?: boolean
  eager?: boolean
  unoptimized?: boolean
  sizes?: string
}

const loadedImagesGlobal = new Set<string>()

export default function ImageWithSkeleton({ src, alt, className = "", wrapperClassName = "", priority = false, eager = false, unoptimized, sizes = "100vw" }: Props) {
  const wasLoaded = useMemo(() => loadedImagesGlobal.has(src), [src])
  const [loaded, setLoaded] = useState<boolean>(wasLoaded)
  const [errored, setErrored] = useState<boolean>(false)

  return (
    <div className={`relative overflow-hidden rounded-inherit ${wrapperClassName}`}>
      <div
        aria-hidden
        className={`absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-inherit transition-opacity duration-200 ${
          loaded || errored ? "opacity-0" : "opacity-100"
        }`}
      />
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={eager ? "eager" : undefined}
        onLoad={() => {
          loadedImagesGlobal.add(src)
          setLoaded(true)
        }}
        onError={() => {
          setErrored(true)
          setLoaded(true)
        }}
        className={`object-cover transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        unoptimized={unoptimized}
      />
    </div>
  )
}
