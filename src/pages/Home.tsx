import { useState } from "react";
import QuickAccess from "../components/QuickAccess";
import Navbar from "../components/Navbar";

const Home = () => {
    const [currentDate] = useState(new Date(2026, 1, 6)); // 6 febrero, 2026

    const formatDate = (date: Date) => {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const day = date.getDate();
        const month = date.toLocaleString('es-ES', { month: 'long' });
        const dayName = days[date.getDay()];
        return `${day} ${month}, ${dayName}`;
    };

    return (
        <>
            <QuickAccess />
            
            {/* Contenido principal */}
            <main className="pt-16 pb-24 px-3 md:px-4 min-h-screen bg-gray-50">
                <div className="max-w-md mx-auto w-full">
                    {/* Navegación de fecha */}
                    <div className="flex items-center justify-between mb-6 py-4 px-2">
                        <button className="p-2 rounded-lg hover:bg-gray-200 transition-all duration-200">
                            <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h2 className="text-sm md:text-base font-medium text-gray-900">
                            {formatDate(currentDate)}
                        </h2>
                        <button className="p-2 rounded-lg hover:bg-gray-200 transition-all duration-200">
                            <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Grid de estadísticas */}
                    <div className="grid grid-cols-2 gap-3 px-2">
                        {/* Recogidas */}
                        <div className="bg-black rounded-2xl p-4 md:p-6 flex flex-col justify-between aspect-square shadow-lg">
                            <div className="flex justify-center mb-2 md:mb-4">
                                <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <rect x="5" y="2" width="14" height="20" rx="2" strokeWidth="2" />
                                    <line x1="9" y1="7" x2="15" y2="7" strokeWidth="2" />
                                    <line x1="9" y1="11" x2="15" y2="11" strokeWidth="2" />
                                    <line x1="9" y1="15" x2="13" y2="15" strokeWidth="2" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-white text-[10px] md:text-xs mb-1">Recogidas</p>
                                <p className="text-white text-lg md:text-xl font-semibold">1 Tiempo</p>
                            </div>
                        </div>

                        {/* Uso Promedio */}
                        <div className="bg-black rounded-2xl p-4 md:p-6 flex flex-col justify-between aspect-square shadow-lg">
                            <div className="flex justify-center mb-2 md:mb-4">
                                <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <rect x="7" y="4" width="10" height="16" rx="2" strokeWidth="2" />
                                    <line x1="11" y1="17" x2="11" y2="17" strokeWidth="2" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-white text-[10px] md:text-xs mb-1">Uso Promedio</p>
                                <p className="text-white text-lg md:text-xl font-semibold">1 M</p>
                            </div>
                        </div>

                        {/* Mientras Caminas */}
                        <div className="bg-black rounded-2xl p-4 md:p-6 flex flex-col justify-between aspect-square shadow-lg">
                            <div className="flex justify-center mb-2 md:mb-4">
                                <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7l-8 8m4-8v8m4-4H8" />
                                    <circle cx="12" cy="5" r="2" strokeWidth="2" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 12l-2 7m8-7l2 7" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-white text-[10px] md:text-xs mb-1">Mientras Caminas</p>
                                <p className="text-white text-lg md:text-xl font-semibold">37 M</p>
                            </div>
                        </div>

                        {/* Vida estacionaria */}
                        <div className="bg-black rounded-2xl p-4 md:p-6 flex flex-col justify-between aspect-square shadow-lg">
                            <div className="flex justify-center mb-2 md:mb-4">
                                <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                                    <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-white text-[10px] md:text-xs mb-1">Vida estacionaria</p>
                                <p className="text-white text-lg md:text-xl font-semibold">5 h 57 M</p>
                            </div>
                        </div>

                        {/* Adelantar Bloqueos */}
                        <div className="bg-black rounded-2xl p-4 md:p-6 flex flex-col justify-between aspect-square shadow-lg">
                            <div className="flex justify-center mb-2 md:mb-4">
                                <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <rect x="8" y="11" width="8" height="10" rx="1" strokeWidth="2" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-white text-[10px] md:text-xs mb-1">Adelantar Bloqueos</p>
                                <p className="text-white text-[9px] md:text-[10px] leading-tight">Usa tokens para adelantar tu proceso</p>
                            </div>
                        </div>

                        {/* Uso continuo */}
                        <div className="bg-black rounded-2xl p-4 md:p-6 flex flex-col justify-between aspect-square shadow-lg">
                            <div className="flex justify-center mb-2 md:mb-4">
                                <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <rect x="5" y="2" width="14" height="20" rx="2" strokeWidth="2" />
                                    <line x1="9" y1="7" x2="15" y2="7" strokeWidth="2" />
                                    <line x1="9" y1="11" x2="15" y2="11" strokeWidth="2" />
                                    <line x1="9" y1="15" x2="13" y2="15" strokeWidth="2" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-white text-[10px] md:text-xs mb-1">Uso continuo</p>
                                <p className="text-white text-lg md:text-xl font-semibold">2 H 33 M</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Navbar />
        </>
    )
}

export default Home
