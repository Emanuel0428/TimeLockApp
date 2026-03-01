import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Timer, Share2, X } from "lucide-react";
import Navbar from "../components/Navbar";

const ContinuousUse = () => {
    const navigate = useNavigate();
    const [currentDate] = useState(new Date(2026, 1, 6)); // 6 febrero, 2026
    const [activeTab, setActiveTab] = useState("Semana");

    const formatDate = (date: Date) => {
        const day = date.getDate();
        const month = date.toLocaleString('es-ES', { month: 'long' });
        const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
        return `${day} ${month}, ${dayName.charAt(0).toUpperCase() + dayName.slice(1)}`;
    };

    // Datos de ejemplo para el gráfico
    const weekData = [
        { day: 'Lun', value: 0 },
        { day: 'Mar', value: 0 },
        { day: 'Mie', value: 0 },
        { day: 'Jue', value: 0 },
        { day: 'Vie', value: 0 },
        { day: 'Sab', value: 0 }
    ];

    const maxValue = 8;

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
                    <h1 className="text-lg font-semibold text-[#F8FAFC]">Uso Continuo</h1>
                    <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <Timer className="w-6 h-6 text-[#4B6FA7]" />
                    </button>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="pt-20 pb-24 px-4 min-h-screen bg-[#0F172A]">
                <div className="max-w-md mx-auto w-full">
                    {/* Mensaje informativo */}
                    <div className="mb-4 text-center">
                        <p className="text-sm text-[#94A3B8]">No hay registros hoy</p>
                    </div>

                    {/* Navegación de fecha */}
                    <div className="flex items-center justify-between mb-6 py-3">
                        <button className="p-2 rounded-lg bg-[#1E293B] hover:bg-[#2D3E52] transition-colors">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h2 className="text-sm font-medium text-[#F8FAFC]">
                            {formatDate(currentDate)}
                        </h2>
                        <button className="p-2 rounded-lg bg-[#1E293B] hover:bg-[#2D3E52] transition-colors">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Gráfico de barras */}
                    <div className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-6 mb-6 border border-white/10">
                        <div className="flex items-end justify-between h-48 gap-3">
                            {weekData.map((item, index) => (
                                <div key={index} className="flex flex-col items-center flex-1 h-full">
                                    <div className="flex-1 w-full flex items-end justify-center">
                                        <div
                                            className="w-full bg-linear-to-t from-[#4B6FA7] to-[#6B8FC7] rounded-t-lg"
                                            style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: item.value > 0 ? '8px' : '0' }}
                                        />
                                    </div>
                                    <span className="text-xs text-[#94A3B8] mt-2">{item.day}</span>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-4 pt-4 border-t border-white/10">
                            <p className="text-xs text-[#94A3B8]">Categoría</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        {["Semana", "Día", "Mes", "Año"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === tab
                                        ? "bg-[#4B6FA7] text-white"
                                        : "bg-[#1E293B] text-[#94A3B8] hover:bg-[#2D3E52]"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Estadísticas */}
                    <div className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-6 mb-6 border border-white/10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm text-[#94A3B8] mb-1">Promedio diario</p>
                                <p className="text-sm text-[#94A3B8]">Sesión más corta</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-[#94A3B8] mb-1">Total semanal</p>
                                <p className="text-sm text-[#94A3B8]">Sesión más larga</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-end pt-4 border-t border-white/10">
                            <p className="text-base font-semibold text-[#F8FAFC]">2 H 33 M</p>
                            <p className="text-base font-semibold text-[#F8FAFC]">-</p>
                        </div>
                    </div>

                    {/* Mensaje inferior */}
                    <div className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-6 border border-white/10">
                        <h3 className="text-base font-semibold text-[#F8FAFC] mb-3 text-center">Uso Continuo</h3>
                        <p className="text-sm text-center text-[#94A3B8] leading-relaxed mb-4">
                            El tiempo más largo que usaste tu dispositivo sin interrupciones significativas.
                        </p>
                        <div className="bg-[#4B6FA7]/10 rounded-lg p-3 border border-[#4B6FA7]/20">
                            <p className="text-xs text-[#94A3B8] text-center">
                                💡 Tomar descansos regulares ayuda a reducir la fatiga visual y mejorar tu bienestar
                            </p>
                        </div>
                        <div className="flex justify-center gap-4 mt-6">
                            <button className="p-3 rounded-lg bg-[#1E293B] hover:bg-[#2D3E52] transition-colors">
                                <Share2 className="w-5 h-5 text-[#4B6FA7]" />
                            </button>
                            <button className="p-3 rounded-lg bg-[#1E293B] hover:bg-[#2D3E52] transition-colors">
                                <X className="w-5 h-5 text-[#4B6FA7]" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Navbar />
        </>
    );
};

export default ContinuousUse;
