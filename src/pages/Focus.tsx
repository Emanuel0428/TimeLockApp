import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Brain, Play, Pause, RotateCcw, Tag, Palette, Clock } from "lucide-react";
import Navbar from "../components/Navbar";

const Focus = () => {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState(false);
    const time = 25 * 60; // 25 minutos en segundos

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((25 * 60 - time) / (25 * 60)) * 100;

    return (
        <>
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-[#0F172A] z-40 border-b border-white/10">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-[#F8FAFC]" />
                    </button>
                    <h1 className="text-lg font-semibold text-[#F8FAFC]">Concentrarse</h1>
                    <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <Brain className="w-6 h-6 text-[#4B6FA7]" />
                    </button>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="pt-20 pb-24 px-4 min-h-screen bg-[#0F172A]">
                <div className="max-w-md mx-auto w-full">
                    {/* Botones de configuración */}
                    <div className="flex gap-2 mb-6">
                        <button className="flex-1 py-2 px-3 bg-[#1E293B] text-[#F8FAFC] rounded-lg text-xs font-medium hover:bg-[#2D3E52] transition-colors flex items-center justify-center gap-2">
                            <Tag className="w-4 h-4" />
                            Selección etiqueta
                        </button>
                        <button className="flex-1 py-2 px-3 bg-[#1E293B] text-[#F8FAFC] rounded-lg text-xs font-medium hover:bg-[#2D3E52] transition-colors flex items-center justify-center gap-2">
                            <Palette className="w-4 h-4" />
                            Estilo
                        </button>
                    </div>

                    <div className="flex gap-2 mb-8">
                        <button className="flex-1 py-2 px-3 bg-[#1E293B] text-[#F8FAFC] rounded-lg text-xs font-medium hover:bg-[#2D3E52] transition-colors flex items-center justify-center gap-2">
                            <RotateCcw className="w-4 h-4" />
                            Cuenta regresiva
                        </button>
                        <button className="flex-1 py-2 px-3 bg-[#1E293B] text-[#F8FAFC] rounded-lg text-xs font-medium hover:bg-[#2D3E52] transition-colors flex items-center justify-center gap-2">
                            <Clock className="w-4 h-4" />
                            Agregar tiempo
                        </button>
                    </div>

                    {/* Timer circular */}
                    <div className="flex justify-center items-center mb-8">
                        <div className="relative">
                            {/* Círculo de progreso */}
                            <svg className="w-72 h-72 transform -rotate-90">
                                {/* Círculo de fondo */}
                                <circle
                                    cx="144"
                                    cy="144"
                                    r="130"
                                    stroke="#1E293B"
                                    strokeWidth="8"
                                    fill="none"
                                />
                                {/* Círculo de progreso */}
                                <circle
                                    cx="144"
                                    cy="144"
                                    r="130"
                                    stroke="#4B6FA7"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 130}`}
                                    strokeDashoffset={`${2 * Math.PI * 130 * (1 - progress / 100)}`}
                                    className="transition-all duration-1000"
                                />
                            </svg>
                            {/* Contenido del círculo */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="text-center">
                                    <p className="text-6xl font-bold text-[#F8FAFC] mb-2">{formatTime(time)}</p>
                                    <div className="h-0.5 w-32 bg-[#F8FAFC] mx-auto"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botón de iniciar */}
                    <div className="flex justify-center mb-8">
                        <button
                            onClick={() => setIsActive(!isActive)}
                            className="px-8 py-3 bg-[#1E293B] text-[#F8FAFC] rounded-full text-sm font-semibold hover:bg-[#2D3E52] transition-all flex items-center gap-2"
                        >
                            {isActive ? (
                                <>
                                    <Pause className="w-5 h-5" />
                                    Pausar concentración
                                </>
                            ) : (
                                <>
                                    <Play className="w-5 h-5" />
                                    Empezar concentración
                                </>
                            )}
                        </button>
                    </div>

                    {/* Estadísticas de concentración */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-4 border border-white/10">
                            <p className="text-xs text-[#94A3B8] mb-2">0m</p>
                            <p className="text-sm font-semibold text-[#F8FAFC]">Concentración</p>
                        </div>
                        <div className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-4 border border-white/10">
                            <p className="text-xs text-[#94A3B8] mb-2">0m</p>
                            <p className="text-sm font-semibold text-[#F8FAFC]">Última concentración</p>
                        </div>
                    </div>

                    {/* Información */}
                    <div className="mt-6 bg-[#4B6FA7]/10 rounded-xl p-4 border border-[#4B6FA7]/20">
                        <p className="text-xs text-[#94A3B8] text-center">
                            💡 Durante la sesión de concentración, las aplicaciones seleccionadas estarán bloqueadas
                        </p>
                    </div>
                </div>
            </main>

            <Navbar />
        </>
    );
};

export default Focus;
