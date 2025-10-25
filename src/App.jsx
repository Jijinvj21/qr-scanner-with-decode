import { useState, useEffect, useRef } from 'react'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'

function App() {
  const [scannedData, setScannedData] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const scannerRef = useRef(null)
  const html5QrCodeRef = useRef(null)
  const isScannerInitialized = useRef(false) // Prevent double initialization

  // Initialize scanner
  useEffect(() => {
    // Prevent double initialization (React StrictMode runs effects twice in dev)
    if (isScannerInitialized.current) {
      return
    }

    isScannerInitialized.current = true
    let html5QrCode = null
    let isScanning = false

    const config = {
      fps: 20,  // Increased from 10 for faster detection
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      disableFlip: false,
      formatsToSupport: [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.AZTEC,
        Html5QrcodeSupportedFormats.CODABAR,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.CODE_93,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.DATA_MATRIX,
        Html5QrcodeSupportedFormats.MAXICODE,
        Html5QrcodeSupportedFormats.ITF,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.PDF_417,
        Html5QrcodeSupportedFormats.RSS_14,
        Html5QrcodeSupportedFormats.RSS_EXPANDED,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,
      ],
    }

    const onScanSuccess = (decodedText, decodedResult) => {
      console.log('QR Code detected:', decodedText)
      console.log('Result:', decodedResult)
      if (decodedText && decodedText.trim() !== '') {
        setScannedData(decodedText)
        setError('')
      }
    }

    const onScanFailure = (error) => {
      // Silently ignore NotFoundException (no QR code in view)
      // This is normal when camera is searching
    }

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode('qr-reader')
        html5QrCodeRef.current = html5QrCode

        await html5QrCode.start(
          { facingMode: 'environment' },
          config,
          onScanSuccess,
          onScanFailure
        )

        isScanning = true
        setIsLoading(false)
        setError('')
      } catch (err) {
        console.error('Scanner start error:', err)
        setIsLoading(false)
        setError(err?.message || 'Error accessing camera')
      }
    }

    // Only start if element exists and not already scanning
    const element = document.getElementById('qr-reader')
    if (element && !isScanning) {
      startScanner()
    }

    // Cleanup on unmount
    return () => {
      isScannerInitialized.current = false
      if (html5QrCode && isScanning) {
        html5QrCode
          .stop()
          .then(() => {
            html5QrCode.clear()
          })
          .catch((err) => console.error('Error stopping scanner:', err))
      }
    }
  }, []) // Empty dependency array - only run once

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 md:py-16 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <div className="scanner-box relative w-full aspect-square max-w-md mx-auto mb-6 bg-black overflow-hidden rounded-xl">
            {/* HTML5 QR Code Scanner Container */}
            <div id="qr-reader" ref={scannerRef} className="w-full h-full"></div>

            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-20">
                <div className="loading-spinner mb-4">
                  <svg className="animate-spin h-12 w-12 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="text-white text-sm font-medium">Initializing Camera...</p>
                <p className="text-gray-400 text-xs mt-2">Please allow camera access</p>
              </div>
            )}

            {/* Corner brackets overlay */}
            <div className="scanner-overlay absolute inset-0 w-full h-full pointer-events-none z-10">
              <svg className="scanner-corners absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 237 237" fill="none">
                <g clipPath="url(#clip0_511_3453)">
                  <path d="M0 7.40625C0 5.44199 0.780299 3.55818 2.16924 2.16924C3.55818 0.780299 5.44199 0 7.40625 0L51.8438 0C53.808 0 55.6918 0.780299 57.0808 2.16924C58.4697 3.55818 59.25 5.44199 59.25 7.40625C59.25 9.37051 58.4697 11.2543 57.0808 12.6433C55.6918 14.0322 53.808 14.8125 51.8438 14.8125H14.8125V51.8438C14.8125 53.808 14.0322 55.6918 12.6433 57.0808C11.2543 58.4697 9.37051 59.25 7.40625 59.25C5.44199 59.25 3.55818 58.4697 2.16924 57.0808C0.780299 55.6918 0 53.808 0 51.8438V7.40625ZM177.75 7.40625C177.75 5.44199 178.53 3.55818 179.919 2.16924C181.308 0.780299 183.192 0 185.156 0L229.594 0C231.558 0 233.442 0.780299 234.831 2.16924C236.22 3.55818 237 5.44199 237 7.40625V51.8438C237 53.808 236.22 55.6918 234.831 57.0808C233.442 58.4697 231.558 59.25 229.594 59.25C227.629 59.25 225.746 58.4697 224.357 57.0808C222.968 55.6918 222.188 53.808 222.188 51.8438V14.8125H185.156C183.192 14.8125 181.308 14.0322 179.919 12.6433C178.53 11.2543 177.75 9.37051 177.75 7.40625ZM7.40625 177.75C9.37051 177.75 11.2543 178.53 12.6433 179.919C14.0322 181.308 14.8125 183.192 14.8125 185.156V222.188H51.8438C53.808 222.188 55.6918 222.968 57.0808 224.357C58.4697 225.746 59.25 227.629 59.25 229.594C59.25 231.558 58.4697 233.442 57.0808 234.831C55.6918 236.22 53.808 237 51.8438 237H7.40625C5.44199 237 3.55818 236.22 2.16924 234.831C0.780299 233.442 0 231.558 0 229.594V185.156C0 183.192 0.780299 181.308 2.16924 179.919C3.55818 178.53 5.44199 177.75 7.40625 177.75ZM229.594 177.75C231.558 177.75 233.442 178.53 234.831 179.919C236.22 181.308 237 183.192 237 185.156V229.594C237 231.558 236.22 233.442 234.831 234.831C233.442 236.22 231.558 237 229.594 237H185.156C183.192 237 181.308 236.22 179.919 234.831C178.53 233.442 177.75 231.558 177.75 229.594C177.75 227.629 178.53 225.746 179.919 224.357C181.308 222.968 183.192 222.188 185.156 222.188H222.188V185.156C222.188 183.192 222.968 181.308 224.357 179.919C225.746 178.53 227.629 177.75 229.594 177.75Z" fill="url(#paint0_linear_511_3453)" />
                  <path d="M4.6084 118.5L234.367 116.525" stroke="url(#paint1_linear_511_3453)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                  <linearGradient id="paint0_linear_511_3453" x1="-3.39305e-06" y1="-186.727" x2="472.551" y2="-35.679" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#D8C6AA" />
                    <stop offset="0.932752" stopColor="#C97E05" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_511_3453" x1="4.6084" y1="114.969" x2="4.97329" y2="128.538" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#D8C6AA" />
                    <stop offset="0.932752" stopColor="#C97E05" />
                  </linearGradient>
                  <clipPath id="clip0_511_3453">
                    <rect width="237" height="237" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>

          <p className="text-base text-white text-center m-0 px-4 leading-normal">Scan any QR code to Check-in Athletes</p>

          {/* Scanner Status Indicator */}
          {!isLoading && !error && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-green-400 font-medium">Scanner Ready</p>
            </div>
          )}
        </div>

        {error && (
          <div className="px-6 py-4 bg-red-950/50 border border-red-500 rounded-lg mb-4">
            <p className="text-red-400 text-sm m-0 text-center">⚠️ {error}</p>
          </div>
        )}

        {scannedData && (
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">Scanned Data:</h2>
            <div className="bg-black p-4 rounded-lg border border-neutral-800">
              <p className="text-white text-base break-all m-0 font-mono leading-relaxed">{scannedData}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
