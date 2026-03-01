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

                {/* Módulo concentración*/}
                <button
                    onClick={() => navigate('/focus')}
                    className="w-14 h-14 flex items-center justify-center rounded-lg hover:bg-[#1E293B] transition-colors"
                    aria-label="Módulo concentración"
                >
                    <svg
                        className="w-7 h-7 text-[#4B6FA7]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 18V5" />
                        <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" />
                        <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" />
                        <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" />
                        <path d="M18 18a4 4 0 0 0 2-7.464" />
                        <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" />
                        <path d="M6 18a4 4 0 0 1-2-7.464" />
                        <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" />
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
