'use client'

import React, { useState, useEffect } from 'react'
import { AnimatedLogo } from './animated-logo'

/** @description Elegant loading screen with Anchor 23 branding */
export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [showLogo, setShowLogo] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          // Start fade out from top
          setIsFadingOut(true)
          // Complete after fade out animation
          setTimeout(() => onComplete(), 800)
          return 100
        }
        return prev + Math.random() * 12 + 8 // Faster progress
      })
    }, 120) // Faster interval

    // Show logo immediately (fast fade in)
    setShowLogo(true)

    return () => {
      clearInterval(progressInterval)
    }
  }, [onComplete])

  return (
    <div className={`loading-screen ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="loading-content">
        {showLogo && (
          <div className="logo-wrapper">
            <svg
              viewBox="0 0 160 110"
              className="loading-logo"
            >
              <g className="loading-anchor-group">
                <path
                  d="m 243.91061,490.07237 c -14.90708,-20.76527 -40.32932,-38.4875 -72.46962,-50.51961 -6.28037,-2.35113 -18.82672,-6.82739 -27.88083,-9.94725 -26.58857,-9.1619 -41.30507,-16.6129 -58.331488,-29.53333 C 61.948377,382.40597 45.952738,359.43239 36.175195,329.61973 31.523123,315.43512 27.748747,295.05759 28.346836,287.35515 l 0.358542,-4.61742 8.564133,5.67181 c 17.36555,11.50076 46.202142,24.17699 72.956399,32.07091 6.95761,2.05286 12.50649,4.24632 12.33087,4.87435 -0.17562,0.62804 -2.82456,2.39475 -5.88665,3.92604 -10.99498,5.49858 -27.443714,4.43247 -46.080425,-2.98665 -3.96919,-1.58011 -7.405462,-2.6842 -7.636123,-2.45354 -0.733091,0.7331 8.423453,18.11108 13.820007,26.22861 6.692697,10.0673 20.30956,24.52092 29.977331,31.81955 13.28709,10.03091 31.4128,18.34633 64.69007,29.67743 32.46139,11.05328 49.71037,18.63784 59.69045,26.24654 l 6.02195,4.59101 -0.31253,-19.52332 -0.31242,-19.52333 -7.99319,-2.55382 c -8.69798,-2.77901 -17.71738,-7.05988 -17.66851,-8.38597 0.0171,-0.45828 3.48344,-2.37476 7.70338,-4.25887 9.02318,-4.02858 14.84235,-8.8019 16.98658,-13.93357 1.02073,-2.44313 1.54554,-8.63027 1.55114,-18.288 l 0.0114,-14.59572 5.22252,-6.56584 c 2.87241,-3.6112 5.60849,-6.56584 6.08008,-6.56584 0.47171,0 2.99928,2.89079 5.61694,6.42397 l 4.75983,6.42395 v 13.4163 c 0,7.37896 0.34337,15.13294 0.76301,17.23107 1.21074,6.0538 9.83699,13.83192 18.97482,17.10906 4.21709,1.51242 7.66741,3.13118 7.66741,3.59724 0,1.40969 -10.95798,6.50426 -17.85291,8.30017 -3.55972,0.92721 -6.66393,1.87743 -6.89813,2.1116 -0.2342,0.23416 -0.28479,9.22125 -0.11305,19.97131 l 0.31311,19.54557 7.42225,-5.20492 c 14.2352,-9.98251 28.50487,-15.97591 69.08404,-29.01591 32.15697,-10.33354 51.17096,-21.00285 68.8865,-38.65433 5.44702,-5.42731 12.3286,-13.51773 15.29236,-17.97873 6.31188,-9.50047 15.28048,-26.39644 14.45147,-27.22542 -0.31619,-0.31622 -4.13888,0.91353 -8.49471,2.7328 -16.38628,6.84381 -33.37216,7.63073 -45.31663,2.0994 -3.6112,-1.6723 -6.56584,-3.47968 -6.56584,-4.01639"
                  fill="#E9E1D8"
                  transform="scale(0.25) translate(-200,-150)"
                />
              </g>
            </svg>
            <h2 className="loading-text">ANCHOR:23</h2>
          </div>
        )}

        <div className="loading-bar">
          <div
            className="loading-progress"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <style jsx>{`
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #3F362E;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: screenFadeIn 0.3s ease-out;
        }

        .loading-screen.fade-out {
          animation: screenFadeOutUp 0.8s ease-in forwards;
        }

        .loading-content {
          text-align: center;
          color: white;
        }

        .logo-wrapper {
          margin-bottom: 3rem;
          animation: logoFadeIn 1s ease-out 0.3s both;
        }

        .loading-logo {
          width: 160px;
          height: 110px;
          margin: 0 auto 1rem;
          filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.4));
        }

        .loading-anchor-group {
          opacity: 1;
        }

        .loading-text {
          font-size: 2rem;
          font-weight: 300;
          letter-spacing: 2px;
          margin: 0;
          animation: textGlow 2s ease-in-out infinite alternate;
        }

        .loading-bar {
          width: 200px;
          height: 3px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          overflow: hidden;
          margin: 2rem auto 0;
        }

        .loading-progress {
          height: 100%;
          background: #E9E1D8;
          border-radius: 2px;
          transition: width 0.2s ease;
          box-shadow: 0 0 8px rgba(233, 225, 216, 0.3);
        }

        @keyframes screenFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes screenFadeOutUp {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px);
          }
        }

        @keyframes logoFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes logoPulse {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        @keyframes textGlow {
          0% {
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
          }
          100% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6);
          }
        }



        @media (min-width: 768px) {
          .loading-logo {
            width: 160px;
            height: 160px;
          }

          .loading-text {
            font-size: 2.5rem;
          }

          .loading-bar {
            width: 300px;
          }
        }
      `}</style>
    </div>
  )
}