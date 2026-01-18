'use client'

import React, { useState, useEffect } from 'react'

/** @description Rolling phrases component that cycles through Anchor 23 standards */
export function RollingPhrases() {
  const phrases = [
    "Manifiesto la belleza que merezco",
    "Atraigo experiencias extraordinarias",
    "Mi confianza irradia elegancia",
    "Soy el estándar de sofisticación",
    "Mi presencia transforma espacios",
    "Vivo con propósito y distinción"
  ]

  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentPhrase((prev) => (prev + 1) % phrases.length)
        setIsAnimating(false)
      }, 300)
    }, 4000) // Cambiar cada 4 segundos

    return () => clearInterval(interval)
  }, [phrases.length])

  return (
    <div className="rolling-phrases">
      <div className={`phrase-container ${isAnimating ? 'animating' : ''}`}>
        <p className="phrase">
          {phrases[currentPhrase]}
        </p>
        <div className="phrase-underline"></div>
      </div>

      <style jsx>{`
        .rolling-phrases {
          position: relative;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .phrase-container {
          position: relative;
          text-align: center;
        }

        .phrase {
          font-size: 1.125rem;
          font-weight: 300;
          color: #6f5e4f;
          margin: 0;
          letter-spacing: 0.5px;
          font-style: italic;
          transition: all 0.3s ease;
        }

        .phrase-underline {
          height: 2px;
          background: linear-gradient(90deg, #8B4513, #DAA520, #8B4513);
          width: 0;
          margin: 8px auto 0;
          border-radius: 1px;
          transition: width 0.6s ease;
        }

        .phrase-container:not(.animating) .phrase-underline {
          width: 80px;
        }

        .animating .phrase {
          opacity: 0;
          transform: translateY(-10px);
        }

        @media (min-width: 768px) {
          .rolling-phrases {
            height: 80px;
          }

          .phrase {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}