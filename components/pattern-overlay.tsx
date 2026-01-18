import React from 'react'

interface PatternOverlayProps {
  variant?: 'diagonal' | 'circles' | 'waves' | 'hexagons'
  opacity?: number
  className?: string
}

/** @description Elegant pattern overlay component */
export function PatternOverlay({
  variant = 'diagonal',
  opacity = 0.1,
  className = ''
}: PatternOverlayProps) {
  const getPatternStyle = () => {
    switch (variant) {
      case 'diagonal':
        return {
          backgroundImage: `
            linear-gradient(45deg, currentColor 1px, transparent 1px),
            linear-gradient(-45deg, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }
      case 'circles':
        return {
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }
      case 'waves':
        return {
          backgroundImage: `
            radial-gradient(ellipse 60% 40%, currentColor 1px, transparent 1px),
            radial-gradient(ellipse 40% 60%, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }
      case 'hexagons':
        return {
          backgroundImage: `
            linear-gradient(60deg, currentColor 1px, transparent 1px),
            linear-gradient(-60deg, currentColor 1px, transparent 1px),
            linear-gradient(120deg, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '25px 43px'
        }
      default:
        return {}
    }
  }

  return (
    <div
      className={`pattern-overlay ${className}`}
      style={{
        ...getPatternStyle(),
        opacity,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  )
}