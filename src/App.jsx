import { useState } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'

function App() {
  const [scannedData, setScannedData] = useState('')
  const [error, setError] = useState('')

  const handleScan = (result) => {
    if (result && result.length > 0) {
      setScannedData(result[0].rawValue)
      setError('')
    }
  }

  const handleError = (err) => {
    setError(err?.message || 'Error accessing camera')
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 md:py-16 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <div className="scanner-box relative w-full aspect-square max-w-md mx-auto mb-6 bg-black overflow-hidden rounded-xl">
            <Scanner
              onScan={handleScan}
              onError={handleError}
              constraints={{
                facingMode: 'environment'
              }}
              styles={{
                container: {
                  width: '100%',
                  height: '100%',
                  position: 'relative'
                },
                video: {
                  objectFit: 'cover'
                }
              }}
            />

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
