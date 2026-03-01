import { useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()

    return (
        <nav className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-6">
            <div className="flex items-center justify-around gap-4 px-8 bg-linear-to-r from-[#0a1929] to-[#131F37] rounded-full shadow-lg shadow-black/20">
                {/* Home */}
                <button
                    onClick={() => navigate('/')}
                    className="w-14 h-14 flex items-center justify-center rounded-lg hover:bg-[#1E293B] transition-colors"
                    aria-label="Inicio"
                >
                    <svg
                        className="w-7 h-7 text-[#4B6FA7]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                    </svg>
                </button>

                {/* Proceso/Estadísticas */}
                <button
                    className="w-14 h-14 flex items-center justify-center rounded-lg hover:bg-[#1E293B] transition-colors"
                    aria-label="Proceso"
                >
                    <svg
                        className="w-7 h-7 text-[#4B6FA7]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6l4 2"
                        />
                    </svg>
                </button>

                {/* Configuración */}
                <button
                    onClick={() => navigate('/settings')}
                    className="w-14 h-14 flex items-center justify-center rounded-lg hover:bg-[#1E293B] transition-colors"
                    aria-label="Configuración"
                >
                    <svg
                        className="w-7 h-7 text-[#4B6FA7]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                </button>
            </div>
        </nav>
    )
}

export default Navbar
