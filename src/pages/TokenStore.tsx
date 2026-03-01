import QuickAccess from '../components/QuickAccess'
import Navbar from '../components/Navbar'

const packages = [
  { id: 1, tokens: 200, price: 3000 },
  { id: 2, tokens: 1000, price: 15000 },
]

function CoinIcon() {
  return (
    <svg className="w-10 h-10 text-[#1F2937]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <ellipse cx="8" cy="8" rx="4" ry="2" strokeWidth="2" />
      <path strokeWidth="2" d="M4 8v6c0 1.1 1.8 2 4 2s4-.9 4-2V8" />
      <ellipse cx="16" cy="12" rx="4" ry="2" strokeWidth="2" />
      <path strokeWidth="2" d="M12 12v4c0 1.1 1.8 2 4 2s4-.9 4-2v-4" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg className="w-20 h-20 text-[#1F2937]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 9h14l-1 11H6L5 9z" />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 9V7a3 3 0 016 0v2" />
    </svg>
  )
}

const TokenStore = () => {
  return (
    <>
      <QuickAccess />

      <main className="pt-16 pb-24 px-3 min-h-screen bg-[#F3F4F6]">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-center text-sm font-medium text-[#111827] mt-2 mb-5">Tienda de Tokens</h1>

          <section className="bg-white rounded-3xl px-4 py-6 shadow-sm border border-black/10">
            <div className="flex justify-center mb-5">
              <BagIcon />
            </div>

            <div className="bg-black rounded-2xl p-3 grid grid-cols-2 gap-3">
              {packages.map((item) => (
                <button
                  key={item.id}
                  className="bg-white rounded-xl py-4 px-2 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <CoinIcon />
                  <p className="mt-2 text-[11px] text-[#111827] font-medium">{item.tokens} Tokens</p>
                  <p className="text-[11px] text-[#111827]">${item.price}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-8 bg-black rounded-xl p-4 text-white text-center">
            <p className="text-sm font-medium mb-2">¿No aguantas tener tanto tiempo tus apps bloqueadas?</p>
            <p className="text-xs">¡Compra tokens para desbloquear tus apps antes del tiempo indicado!</p>
          </section>
        </div>
      </main>

      <Navbar />
    </>
  )
}

export default TokenStore
