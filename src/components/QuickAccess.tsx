import { useState } from 'react'

function QuickAccess() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [calendarOpen, setCalendarOpen] = useState(false)

    return (
        <>
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md">
                <div className="flex items-center justify-between px-4 py-3">
                    {/* Menú Hamburguesa */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-black dark:bg-white transition-colors hover:opacity-80"
                        aria-label="Menú"
                    >
                        <div className="space-y-1.5">
                            <span className="block w-5 h-0.5 bg-white dark:bg-black"></span>
                            <span className="block w-5 h-0.5 bg-white dark:bg-black"></span>
                            <span className="block w-5 h-0.5 bg-white dark:bg-black"></span>
                        </div>
                    </button>

                    {/* Logo/Título */}
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                        TimeLock
                    </h1>

                    {/* Icono Calendario */}
                    <button
                        onClick={() => setCalendarOpen(!calendarOpen)}
                        className="w-10 h-10 flex items-center justify-center transition-colors hover:opacity-80"
                        aria-label="Calendario"
                    >
                        <svg
                            className="w-7 h-7 text-gray-900 dark:text-white"
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
                    <div className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menú</h2>
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <ul className="space-y-4">
                                <li>
                                    <a href="/" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors">
                                        Inicio
                                    </a>
                                </li>
                                <li>
                                    <a href="/login" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors">
                                        Iniciar Sesión
                                    </a>
                                </li>
                                <li>
                                    <a href="/register" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors">
                                        Registrarse
                                    </a>
                                </li>
                                <li>
                                    <a href="/profile" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors">
                                        Perfil
                                    </a>
                                </li>
                                <li>
                                    <a href="/settings" className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors">
                                        Configuración
                                    </a>
                                </li>
                            </ul>
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
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 w-11/12 max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Calendario</h2>
                                <button
                                    onClick={() => setCalendarOpen(false)}
                                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Vista simple de calendario */}
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        Febrero 2026
                                    </h3>
                                </div>

                                {/* Días de la semana */}
                                <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
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
                                            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                                i + 1 === 24
                                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                                    : 'text-gray-900 dark:text-white'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
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

