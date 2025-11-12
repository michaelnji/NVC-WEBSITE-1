"use client"

import React, { useMemo, useState } from "react"
import Image from "next/image"

type Props = {
  src: string
  alt: string
  className?: string
  wrapperClassName?: string
}

const loadedImagesGlobal = new Set<string>()

export default function ImageWithSkeleton({ src, alt, className = "", wrapperClassName = "" }: Props) {
  const wasLoaded = useMemo(() => loadedImagesGlobal.has(src), [src])
  const [loaded, setLoaded] = useState<boolean>(wasLoaded)
  const [errored, setErrored] = useState<boolean>(false)

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      <div
        aria-hidden
        className={`absolute inset-0 animate-pulse bg-gradient-to-br from-white/10 to-white/5 transition-opacity duration-300 ${
          loaded || errored ? "opacity-0" : "opacity-100"
        }`}
      />
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        sizes="100vw"
        priority={false}
        onLoad={() => {
          loadedImagesGlobal.add(src)
          setLoaded(true)
        }}
        onError={() => {
          setErrored(true)
          setLoaded(true)
        }}
        className={`object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        unoptimized={false}
      />
    </div>
  )
}
