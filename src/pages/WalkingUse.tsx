import { useNavigate } from "react-router-dom";
import { ChevronLeft, Footprints } from "lucide-react";
import Navbar from "../components/Navbar";

const WalkingUse = () => {
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
                    <h1 className="text-lg font-semibold text-[#F8FAFC]">Mientras Caminas</h1>
                    <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <Footprints className="w-6 h-6 text-[#4B6FA7]" />
                    </button>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="pt-20 pb-24 px-4 min-h-screen bg-[#0F172A]">
                <div className="max-w-md mx-auto w-full flex flex-col items-center justify-center min-h-[70vh]">
                    {/* Icono central */}
                    <div className="mb-8">
                        <div className="w-32 h-32 rounded-full bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 border border-white/10 flex items-center justify-center">
                            <Footprints className="w-16 h-16 text-[#4B6FA7]" strokeWidth={1.5} />
                        </div>
                    </div>

                    {/* Tiempo */}
                    <div className="text-center mb-8">
                        <p className="text-4xl font-bold text-[#F8FAFC] mb-2">37 M</p>
                        <p className="text-sm text-[#94A3B8]">Tiempo usando el teléfono mientras caminas</p>
                    </div>

                    {/* Card informativa */}
                    <div className="w-full bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-6 border border-white/10">
                        <h3 className="text-base font-semibold text-[#F8FAFC] mb-3">¿Qué es esto?</h3>
                        <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">
                            Esta métrica te muestra cuánto tiempo usas tu dispositivo mientras estás en movimiento o caminando.
                        </p>
                        <p className="text-sm text-[#94A3B8] leading-relaxed">
                            Usar el teléfono mientras caminas puede ser peligroso y afectar tu concentración. Intenta reducir este tiempo para mejorar tu seguridad.
                        </p>
                    </div>

                    {/* Consejo */}
                    <div className="w-full mt-6 bg-[#4B6FA7]/10 rounded-xl p-4 border border-[#4B6FA7]/20">
                        <p className="text-xs text-[#94A3B8] text-center">
                            💡 <span className="font-semibold">Consejo:</span> Detente en un lugar seguro si necesitas usar tu teléfono
                        </p>
                    </div>
                </div>
            </main>

            <Navbar />
        </>
    );
};

export default WalkingUse;
