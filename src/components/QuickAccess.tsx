import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function QuickAccess() {
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem('currentUser')
        setMenuOpen(false)
        navigate('/login')
    }
    const [calendarOpen, setCalendarOpen] = useState(false)

    return (
        <>
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-linear-to-r from-[#131F37] to-[#1a2a3a] shadow-md">
                <div className="flex items-center justify-between px-4 py-3 relative">
                    {/* Menú Hamburguesa */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1E293B] hover:bg-[#2D3E52] transition-colors"
                        aria-label="Menú"
                    >
                        <div className="space-y-1.5">
                            <span className="block w-5 h-0.5 bg-[#4B6FA7]"></span>
                            <span className="block w-5 h-0.5 bg-[#4B6FA7]"></span>
                            <span className="block w-5 h-0.5 bg-[#4B6FA7]"></span>
                        </div>
                    </button>

                    {/* Logo/Título */}
                    <h1 className="text-lg font-bold text-[#F8FAFC]">
                        TimeLock
                    </h1>

                    {/* Icono Calendario */}
                    <button
                        onClick={() => setCalendarOpen(!calendarOpen)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1E293B] hover:bg-[#2D3E52] transition-colors"
                        aria-label="Calendario"
                    >
                        <svg
                            className="w-7 h-7 text-[#4B6FA7]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                            <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                            <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                            <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Sidebar/Menu */}
            {menuOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setMenuOpen(false)}
                    ></div>

                    {/* Sidebar */}
                    <div className="fixed top-0 left-0 h-full w-64 bg-linear-to-b from-[#1E293B] to-[#131F37] shadow-lg z-50 transform transition-transform duration-300">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold text-[#F8FAFC]">Menú</h2>
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    className="text-[#F8FAFC] hover:text-[#F59E0B]"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <ul className="space-y-4">
                                <li>
                                    <Link to="/" className="block py-2 px-4 rounded-lg hover:bg-[#0F172A] text-[#F8FAFC] transition-colors">
                                        Inicio
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/tienda" className="block py-2 px-4 rounded-lg hover:bg-[#0F172A] text-[#F8FAFC] transition-colors">
                                        Tienda de Tokens
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/profile" className="block py-2 px-4 rounded-lg hover:bg-[#0F172A] text-[#F8FAFC] transition-colors">
                                        Perfil
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/settings" className="block py-2 px-4 rounded-lg hover:bg-[#0F172A] text-[#F8FAFC] transition-colors">
                                        Configuración
                                    </Link>
                                </li>
                            </ul>

                            {/* Separador */}
                            <div className="my-4 border-t border-[#2D3E52]"></div>

                            {/* Cerrar sesión */}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-red-500/30 text-red-400 transition-colors font-medium"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="font-medium">Cerrar sesión</span>
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Modal Calendario */}
            {calendarOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setCalendarOpen(false)}
                    ></div>

                    {/* Modal */}
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-linear-to-b from-[#1E293B] to-[#131F37] rounded-lg shadow-2xl z-50 w-11/12 max-w-md border border-[#2D3E52]">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-[#F8FAFC]">Calendario</h2>
                                <button
                                    onClick={() => setCalendarOpen(false)}
                                    className="text-[#F8FAFC] hover:text-[#F59E0B]"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Vista simple de calendario */}
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">
                                        Febrero 2026
                                    </h3>
                                </div>

                                {/* Días de la semana */}
                                <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-[#F8FAFC]">
                                    <div>Dom</div>
                                    <div>Lun</div>
                                    <div>Mar</div>
                                    <div>Mié</div>
                                    <div>Jue</div>
                                    <div>Vie</div>
                                    <div>Sáb</div>
                                </div>

                                {/* Días del mes */}
                                <div className="grid grid-cols-7 gap-2 text-center">
                                    {Array.from({ length: 28 }, (_, i) => (
                                        <button
                                            key={i}
                                            className={`p-2 rounded-lg hover:bg-[#0F172A] transition-colors ${
                                                i + 1 === 24
                                                    ? 'bg-[#1E293B] text-white hover:bg-[#2D3E52]'
                                                    : 'text-[#F8FAFC] hover:bg-[#2D3E52]'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-[#2D3E52]">
                                    <p className="text-sm text-[#F8FAFC] text-center">
                                        Hoy: 24 de Febrero, 2026
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default QuickAccess

