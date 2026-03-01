import { useNavigate } from "react-router-dom";
import { ChevronLeft, Armchair } from "lucide-react";
import Navbar from "../components/Navbar";

const StationaryLife = () => {
    const navigate = useNavigate();

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
                    <h1 className="text-lg font-semibold text-[#F8FAFC]">Vida Estacionaria</h1>
                    <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <Armchair className="w-6 h-6 text-[#4B6FA7]" />
                    </button>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="pt-20 pb-24 px-4 min-h-screen bg-[#0F172A]">
                <div className="max-w-md mx-auto w-full flex flex-col items-center justify-center min-h-[70vh]">
                    {/* Icono central */}
                    <div className="mb-8">
                        <div className="w-32 h-32 rounded-full bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 border border-white/10 flex items-center justify-center">
                            <Armchair className="w-16 h-16 text-[#4B6FA7]" strokeWidth={1.5} />
                        </div>
                    </div>

                    {/* Tiempo */}
                    <div className="text-center mb-8">
                        <p className="text-4xl font-bold text-[#F8FAFC] mb-2">5 h 57 M</p>
                        <p className="text-sm text-[#94A3B8]">Tiempo en dispositivo sin movimiento</p>
                    </div>

                    {/* Card informativa */}
                    <div className="w-full bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-6 border border-white/10">
                        <h3 className="text-base font-semibold text-[#F8FAFC] mb-3">¿Qué es esto?</h3>
                        <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">
                            Esta métrica registra el tiempo que pasas usando tu dispositivo mientras estás sentado o sin moverte significativamente.
                        </p>
                        <p className="text-sm text-[#94A3B8] leading-relaxed">
                            Un tiempo prolongado de vida estacionaria puede afectar tu salud. Considera tomar descansos regulares y moverte más.
                        </p>
                    </div>

                    {/* Consejo */}
                    <div className="w-full mt-6 bg-[#4B6FA7]/10 rounded-xl p-4 border border-[#4B6FA7]/20">
                        <p className="text-xs text-[#94A3B8] text-center">
                            💡 <span className="font-semibold">Consejo:</span> Levántate cada 30-60 minutos para estirar y moverte
                        </p>
                    </div>

                    {/* Estadística adicional */}
                    <div className="w-full mt-4 grid grid-cols-2 gap-3">
                        <div className="bg-[#1E293B] rounded-xl p-4 text-center">
                            <p className="text-xs text-[#94A3B8] mb-1">Hoy</p>
                            <p className="text-lg font-bold text-[#F8FAFC]">5h 57m</p>
                        </div>
                        <div className="bg-[#1E293B] rounded-xl p-4 text-center">
                            <p className="text-xs text-[#94A3B8] mb-1">Promedio semanal</p>
                            <p className="text-lg font-bold text-[#F8FAFC]">4h 30m</p>
                        </div>
                    </div>
                </div>
            </main>

            <Navbar />
        </>
    );
};

export default StationaryLife;
