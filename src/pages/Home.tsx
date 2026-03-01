import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone, BarChart3, Footprints, Armchair, Unlock, Timer } from "lucide-react";
import QuickAccess from "../components/QuickAccess";
import Navbar from "../components/Navbar";

const Home = () => {
    const navigate = useNavigate();
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
            <main className="pt-16 pb-24 px-3 md:px-4 min-h-screen bg-[#0F172A]">
                <div className="max-w-md mx-auto w-full">
                    {/* Navegación de fecha */}
                    <div className="flex items-center justify-between mb-6 py-4 px-2">
                        <button className="p-2 rounded-lg bg-linear-to-br from-[#2D3E52] to-[#1E293B] hover:from-[#3d4e62] hover:to-[#2d3d4b] transition-all duration-200">
                            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h2 className="text-sm md:text-base font-medium text-[#F8FAFC]">
                            {formatDate(currentDate)}
                        </h2>
                        <button className="p-2 rounded-lg bg-linear-to-br from-[#2D3E52] to-[#1E293B] hover:from-[#3d4e62] hover:to-[#2d3d4b] transition-all duration-200">
                            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Grid de estadísticas */}
                    <div className="grid grid-cols-2 gap-3 px-2">
                        {/* Recogidas */}
                        <button
                            onClick={() => navigate('/pickups')}
                            className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-5 md:p-6 flex flex-col justify-between aspect-square shadow-lg border border-white/10 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-transform active:scale-95 cursor-pointer">
                            <div className="flex justify-center items-center grow">
                                <Smartphone className="w-12 h-12 md:w-14 md:h-14 text-[#4B6FA7]" strokeWidth={1.5} />
                            </div>
                            <div className="text-left mt-auto">
                                <p className="text-[#F8FAFC] text-[10px] md:text-xs mb-1 font-semibold">Recogidas</p>
                                <p className="text-[#F8FAFC] text-lg md:text-xl font-bold">1 Tiempo</p>
                            </div>
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent" style={{animation: 'shine 4s infinite'}}></div>
                        </button>

                        {/* Uso Promedio */}
                        <button
                            onClick={() => navigate('/average-use')}
                            className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-5 md:p-6 flex flex-col justify-between aspect-square shadow-lg border border-white/10 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-transform active:scale-95 cursor-pointer">
                            <div className="flex justify-center items-center grow">
                                <BarChart3 className="w-12 h-12 md:w-14 md:h-14 text-[#4B6FA7]" strokeWidth={1.5} />
                            </div>
                            <div className="text-left mt-auto">
                                <p className="text-[#F8FAFC] text-[10px] md:text-xs mb-1 font-semibold">Uso Promedio</p>
                                <p className="text-[#F8FAFC] text-lg md:text-xl font-bold">1 M</p>
                            </div>
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent" style={{animation: 'shine 4s infinite'}}></div>
                        </button>

                        {/* Mientras Caminas */}
                        <button
                            onClick={() => navigate('/walking-use')}
                            className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-5 md:p-6 flex flex-col justify-between aspect-square shadow-lg border border-white/10 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-transform active:scale-95 cursor-pointer">
                            <div className="flex justify-center items-center grow">
                                <Footprints className="w-12 h-12 md:w-14 md:h-14 text-[#4B6FA7]" strokeWidth={1.5} />
                            </div>
                            <div className="text-left mt-auto">
                                <p className="text-[#F8FAFC] text-[10px] md:text-xs mb-1 font-semibold">Mientras Caminas</p>
                                <p className="text-[#F8FAFC] text-lg md:text-xl font-bold">37 M</p>
                            </div>
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent" style={{animation: 'shine 4s infinite'}}></div>
                        </button>

                        {/* Vida estacionaria */}
                        <button
                            onClick={() => navigate('/stationary-life')}
                            className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-5 md:p-6 flex flex-col justify-between aspect-square shadow-lg border border-white/10 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-transform active:scale-95 cursor-pointer">
                            <div className="flex justify-center items-center grow">
                                <Armchair className="w-12 h-12 md:w-14 md:h-14 text-[#4B6FA7]" strokeWidth={1.5} />
                            </div>
                            <div className="text-left mt-auto">
                                <p className="text-[#F8FAFC] text-[10px] md:text-xs mb-1 font-semibold">Vida estacionaria</p>
                                <p className="text-[#F8FAFC] text-lg md:text-xl font-bold">5 h 57 M</p>
                            </div>
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent" style={{animation: 'shine 4s infinite'}}></div>
                        </button>

                        {/* Adelantar Bloqueos */}
                        <button
                            onClick={() => navigate('/unlock-advance')}
                            className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-5 md:p-6 flex flex-col justify-between aspect-square shadow-lg border border-white/10 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-transform active:scale-95 cursor-pointer">
                            <div className="flex justify-center items-center grow">
                                <Unlock className="w-12 h-12 md:w-14 md:h-14 text-[#4B6FA7]" strokeWidth={1.5} />
                            </div>
                            <div className="text-left mt-auto">
                                <p className="text-[#F8FAFC] text-[10px] md:text-xs mb-1 font-semibold">Adelantar Bloqueos</p>
                                <p className="text-[#F8FAFC] text-[9px] md:text-[10px] leading-tight">Usa tokens para adelantar tu proceso</p>
                            </div>
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent" style={{animation: 'shine 4s infinite'}}></div>
                        </button>

                        {/* Uso continuo */}
                        <button
                            onClick={() => navigate('/continuous-use')}
                            className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-5 md:p-6 flex flex-col justify-between aspect-square shadow-lg border border-white/10 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-transform active:scale-95 cursor-pointer">
                            <div className="flex justify-center items-center grow">
                                <Timer className="w-12 h-12 md:w-14 md:h-14 text-[#4B6FA7]" strokeWidth={1.5} />
                            </div>
                            <div className="text-left mt-auto">
                                <p className="text-[#F8FAFC] text-[10px] md:text-xs mb-1 font-semibold">Uso continuo</p>
                                <p className="text-[#F8FAFC] text-lg md:text-xl font-bold">2 H 33 M</p>
                            </div>
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent" style={{animation: 'shine 4s infinite'}}></div>
                        </button>
                    </div>
                </div>
            </main>

            <Navbar />
        </>
    )
}

export default Home
