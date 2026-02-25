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
            
            <main className="pt-16 pb-24 px-4 min-h-screen bg-gray-50">
                <div className="max-w-md mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Configuración
                    </h1>

                    {/* Tarjeta promocional */}
                    <div className="bg-black rounded-2xl p-6 mb-6 text-center">
                        <h2 className="text-white text-xl font-bold mb-4">
                            ¡La vida es mejor con timelock!
                        </h2>
                        <button className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                            Ver detalles
                        </button>
                    </div>

                    {/* Lista de desafíos */}
                    <div className="space-y-3">
                        {/* Desafío tiempo en pantalla */}
                        <button
                            onClick={() => toggleChallenge('screenTime')}
                            className="w-full bg-black rounded-2xl p-4 flex items-center justify-between hover:bg-gray-900 transition-colors"
                        >
                            <span className="text-white font-medium">Desafío tiempo en pantalla</span>
                            <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                                challenges.screenTime ? 'bg-blue-500' : 'bg-gray-600'
                            } relative`}>
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                                    challenges.screenTime ? 'transform translate-x-6' : ''
                                }`}></div>
                            </div>
                        </button>

                        {/* Desafío tiempos de recogida */}
                        <button
                            onClick={() => toggleChallenge('pickupTimes')}
                            className="w-full bg-black rounded-2xl p-4 flex items-center justify-between hover:bg-gray-900 transition-colors"
                        >
                            <span className="text-white font-medium">Desafío tiempos de recogida</span>
                            <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                                challenges.pickupTimes ? 'bg-blue-500' : 'bg-gray-600'
                            } relative`}>
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                                    challenges.pickupTimes ? 'transform translate-x-6' : ''
                                }`}></div>
                            </div>
                        </button>

                        {/* Desafío dormir más */}
                        <button
                            onClick={() => toggleChallenge('sleepMore')}
                            className="w-full bg-black rounded-2xl p-4 flex items-center justify-between hover:bg-gray-900 transition-colors"
                        >
                            <span className="text-white font-medium">Desafío dormir más</span>
                            <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                                challenges.sleepMore ? 'bg-blue-500' : 'bg-gray-600'
                            } relative`}>
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                                    challenges.sleepMore ? 'transform translate-x-6' : ''
                                }`}></div>
                            </div>
                        </button>

                        {/* Desafío de uso continuo */}
                        <button
                            onClick={() => toggleChallenge('continuousUse')}
                            className="w-full bg-black rounded-2xl p-4 flex items-center justify-between hover:bg-gray-900 transition-colors"
                        >
                            <span className="text-white font-medium">Desafío de uso continuo</span>
                            <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                                challenges.continuousUse ? 'bg-blue-500' : 'bg-gray-600'
                            } relative`}>
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                                    challenges.continuousUse ? 'transform translate-x-6' : ''
                                }`}></div>
                            </div>
                        </button>

                        {/* No juegues mientras caminas */}
                        <button
                            onClick={() => toggleChallenge('noWalkingGame')}
                            className="w-full bg-black rounded-2xl p-4 flex items-center justify-between hover:bg-gray-900 transition-colors"
                        >
                            <span className="text-white font-medium">No juegues mientras caminas</span>
                            <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                                challenges.noWalkingGame ? 'bg-blue-500' : 'bg-gray-600'
                            } relative`}>
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                                    challenges.noWalkingGame ? 'transform translate-x-6' : ''
                                }`}></div>
                            </div>
                        </button>

                        {/* Informe diario de información */}
                        <button
                            onClick={() => toggleChallenge('dailyReport')}
                            className="w-full bg-black rounded-2xl p-4 flex items-center justify-between hover:bg-gray-900 transition-colors"
                        >
                            <span className="text-white font-medium">Informe diario de información</span>
                            <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                                challenges.dailyReport ? 'bg-blue-500' : 'bg-gray-600'
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
