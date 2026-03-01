import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Unlock, Coins } from "lucide-react";
import Navbar from "../components/Navbar";

const UnlockAdvance = () => {
    const navigate = useNavigate();
    const [tokens] = useState(0);

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
                    <h1 className="text-lg font-semibold text-[#F8FAFC]">Adelantar Bloqueos</h1>
                    <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <Unlock className="w-6 h-6 text-[#4B6FA7]" />
                    </button>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="pt-20 pb-24 px-4 min-h-screen bg-[#0F172A]">
                <div className="max-w-md mx-auto w-full">
                    {/* Tokens disponibles */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center gap-2 bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 px-6 py-3 rounded-full border border-white/10">
                            <Coins className="w-5 h-5 text-[#F8FAFC]" />
                            <span className="text-2xl font-bold text-[#F8FAFC]">{tokens}</span>
                            <span className="text-sm text-[#94A3B8]">tokens</span>
                        </div>
                    </div>

                    {/* Explicación */}
                    <div className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-6 mb-6 border border-white/10">
                        <h2 className="text-lg font-semibold text-[#F8FAFC] mb-3">¿Qué son los tokens?</h2>
                        <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">
                            Los tokens te permiten adelantar el proceso de desbloqueo de aplicaciones bloqueadas. Cada token te da 1 hora de uso sin restricciones.
                        </p>
                        <p className="text-sm text-[#94A3B8] leading-relaxed">
                            Gana tokens completando desafíos, manteniendo buenos hábitos digitales o alcanzando tus objetivos de concentración.
                        </p>
                    </div>

                    {/* Cómo ganar tokens */}
                    <div className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-6 mb-6 border border-white/10">
                        <h3 className="text-base font-semibold text-[#F8FAFC] mb-4">Gana tokens</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-[#1E293B] rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-[#4B6FA7] flex items-center justify-center shrink-0">
                                    <span className="text-white font-bold">1</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-[#F8FAFC]">Completa una sesión de concentración</p>
                                    <p className="text-xs text-[#94A3B8]">25 minutos = 1 token</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-[#1E293B] rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-[#4B6FA7] flex items-center justify-center shrink-0">
                                    <span className="text-white font-bold">2</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-[#F8FAFC]">Reduce tu tiempo de pantalla</p>
                                    <p className="text-xs text-[#94A3B8]">-30% esta semana = 3 tokens</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-[#1E293B] rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-[#4B6FA7] flex items-center justify-center shrink-0">
                                    <span className="text-white font-bold">3</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-[#F8FAFC]">Cumple tus objetivos diarios</p>
                                    <p className="text-xs text-[#94A3B8]">7 días seguidos = 5 tokens</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botón de acción */}
                    <button 
                        disabled={tokens === 0}
                        className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
                            tokens > 0 
                                ? 'bg-[#4B6FA7] hover:bg-[#5B7FB7] active:scale-95' 
                                : 'bg-[#1E293B] text-[#94A3B8] cursor-not-allowed opacity-50'
                        }`}
                    >
                        {tokens > 0 ? 'Usar token' : 'No tienes tokens disponibles'}
                    </button>

                    {/* Mensaje adicional */}
                    <p className="text-center text-xs text-[#94A3B8] mt-4">
                        Usa tus tokens con sabiduría. Úsalos solo cuando realmente los necesites.
                    </p>
                </div>
            </main>

            <Navbar />
        </>
    );
};

export default UnlockAdvance;
