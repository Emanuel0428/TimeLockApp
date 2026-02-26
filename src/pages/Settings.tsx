import { useState } from 'react';
import QuickAccess from '../components/QuickAccess';
import Navbar from '../components/Navbar';

const Settings = () => {
    const [challenges, setChallenges] = useState({
        screenTime: false,
        pickupTimes: false,
        sleepMore: false,
        continuousUse: false,
        noWalkingGame: false,
        dailyReport: false
    });

    const toggleChallenge = (key: keyof typeof challenges) => {
        setChallenges(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <>
            <QuickAccess />
            
            <main className="pt-16 pb-24 px-4 min-h-screen bg-[#0F172A]">
                <div className="max-w-md mx-auto">
                    <h1 className="text-3xl font-bold text-[#F8FAFC] mb-6 text-center">
                        Configuración
                    </h1>

                    {/* Tarjeta promocional */}
                    <div className="bg-[#131F37] rounded-2xl p-6 mb-6 text-center border border-[#2D3E52]\">
                        <h2 className="text-[#F8FAFC] text-xl font-bold mb-4">
                            ¡La vida es mejor con timelock!
                        </h2>
                        <button className="bg-[#1E293B] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#2D3E52] transition-colors">
                            Ver detalles
                        </button>
                    </div>

                    {/* Lista de desafíos */}
                    <div className="space-y-3">
                        {/* Desafío tiempo en pantalla */}
                        <button
                            onClick={() => toggleChallenge('screenTime')}
                            className="w-full bg-[#1E293B] rounded-2xl p-4 flex items-center justify-between hover:bg-[#2D3E52] transition-colors"
                        >
                            <span className="text-[#F8FAFC] font-medium">Desafío tiempo en pantalla</span>
                            <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                                challenges.screenTime ? 'bg-[#1E293B]' : 'bg-[#64748B]'
                            } relative`}>
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                                    challenges.screenTime ? 'transform translate-x-6' : ''
                                }`}></div>
                            </div>
                        </button>

                        {/* Desafío tiempos de recogida */}
                        <button
                            onClick={() => toggleChallenge('pickupTimes')}
                            className="w-full bg-[#1E293B] rounded-2xl p-4 flex items-center justify-between hover:bg-[#2D3E52] transition-colors"
                        >
                            <span className="text-[#F8FAFC] font-medium">Desafío tiempos de recogida</span>
                            <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                                challenges.pickupTimes ? 'bg-[#1E293B]' : 'bg-[#64748B]'
                            } relative`}>
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                                    challenges.pickupTimes ? 'transform translate-x-6' : ''
                                }`}></div>
                            </div>
                        </button>

                        {/* Desafío dormir más */}
                        <button
                            onClick={() => toggleChallenge('sleepMore')}
                            className="w-full bg-[#1E293B] rounded-2xl p-4 flex items-center justify-between hover:bg-[#2D3E52] transition-colors"
                        >
                            <span className="text-[#F8FAFC] font-medium">Desafío dormir más</span>
                            <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                                challenges.sleepMore ? 'bg-[#1E293B]' : 'bg-[#64748B]'
                            } relative`}>
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                                    challenges.sleepMore ? 'transform translate-x-6' : ''
                                }`}></div>
                            </div>
                        </button>

                        {/* Desafío de uso continuo */}
                        <button
                            onClick={() => toggleChallenge('continuousUse')}
                            className="w-full bg-[#1E293B] rounded-2xl p-4 flex items-center justify-between hover:bg-[#2D3E52] transition-colors"
                        >
                            <span className="text-[#F8FAFC] font-medium">Desafío de uso continuo</span>
                            <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                                challenges.continuousUse ? 'bg-[#1E293B]' : 'bg-[#64748B]'
                            } relative`}>
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                                    challenges.continuousUse ? 'transform translate-x-6' : ''
                                }`}></div>
                            </div>
                        </button>

                        {/* No juegues mientras caminas */}
                        <button
                            onClick={() => toggleChallenge('noWalkingGame')}
                            className="w-full bg-[#1E293B] rounded-2xl p-4 flex items-center justify-between hover:bg-[#2D3E52] transition-colors"
                        >
                            <span className="text-[#F8FAFC] font-medium">No juegues mientras caminas</span>
                            <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                                challenges.noWalkingGame ? 'bg-[#1E293B]' : 'bg-[#64748B]'
                            } relative`}>
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                                    challenges.noWalkingGame ? 'transform translate-x-6' : ''
                                }`}></div>
                            </div>
                        </button>

                        {/* Informe diario de información */}
                        <button
                            onClick={() => toggleChallenge('dailyReport')}
                            className="w-full bg-[#1E293B] rounded-2xl p-4 flex items-center justify-between hover:bg-[#2D3E52] transition-colors"
                        >
                            <span className="text-[#F8FAFC] font-medium">Informe diario de información</span>
                            <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                                challenges.dailyReport ? 'bg-[#1E293B]' : 'bg-[#64748B]'
                            } relative`}>
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                                    challenges.dailyReport ? 'transform translate-x-6' : ''
                                }`}></div>
                            </div>
                        </button>
                    </div>
                </div>
            </main>

            <Navbar />
        </>
    );
};

export default Settings;
