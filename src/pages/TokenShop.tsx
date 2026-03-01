import { useNavigate } from "react-router-dom";
import { ChevronLeft, ShoppingBag, Coins, Sparkles, Zap, Crown, Star, TrendingUp } from "lucide-react";
import Navbar from "../components/Navbar";

interface TokenPackage {
    id: number;
    tokens: number;
    price: number;
    discount?: number;
    badge?: string;
    badgeColor?: string;
    icon: React.ReactNode;
}

export default function TokenShop() {
    const navigate = useNavigate();
    const currentBalance = 127; // Balance actual del usuario

    const packages: TokenPackage[] = [
        {
            id: 1,
            tokens: 50,
            price: 1500,
            icon: <Coins className="w-8 h-8" />
        },
        {
            id: 2,
            tokens: 200,
            price: 5000,
            discount: 17,
            badge: "Popular",
            badgeColor: "bg-blue-500",
            icon: <Star className="w-8 h-8" />
        },
        {
            id: 3,
            tokens: 500,
            price: 10000,
            discount: 33,
            badge: "Mejor Valor",
            badgeColor: "bg-purple-500",
            icon: <Sparkles className="w-8 h-8" />
        },
        {
            id: 4,
            tokens: 1000,
            price: 18000,
            discount: 40,
            icon: <Zap className="w-8 h-8" />
        },
        {
            id: 5,
            tokens: 2500,
            price: 37500,
            discount: 50,
            badge: "Premium",
            badgeColor: "bg-gradient-to-r from-yellow-400 to-orange-500",
            icon: <Crown className="w-10 h-10" />
        }
    ];

    const calculateOriginalPrice = (price: number, discount?: number) => {
        if (!discount) return null;
        return Math.round(price / (1 - discount / 100));
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] pb-24">
            {/* Header */}
            <div className="bg-linear-to-br from-[#1E293B] to-[#0F172A] p-4 sticky top-0 z-10 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold">Tienda de Tokens</h1>
                    <div className="w-10" />
                </div>

                {/* Balance Card */}
                <div className="bg-linear-to-r from-[#4B6FA7] to-[#6B8FD7] rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/70 text-sm">Tu Balance</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Coins className="w-6 h-6 text-yellow-300" />
                                <span className="text-3xl font-bold text-white">{currentBalance}</span>
                                <span className="text-white/90 text-lg">Tokens</span>
                            </div>
                        </div>
                        <ShoppingBag className="w-12 h-12 text-white/30" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Info Banner */}
                <div className="mb-6 p-4 bg-linear-to-r from-[#1E293B] to-[#334155] rounded-xl border border-[#4B6FA7]/30">
                    <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-[#4B6FA7] mt-0.5 shrink-0" />
                        <div>
                            <h3 className="font-semibold text-[#F8FAFC] mb-1">
                                ¿No aguantas tener tanto tiempo tus apps bloqueadas?
                            </h3>
                            <p className="text-sm text-[#94A3B8]">
                                ¡Compra tokens para desbloquear tus apps antes del tiempo indicado! 
                                Cuanto más grande el paquete, mayor el descuento.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Packages Grid */}
                <div className="space-y-4">
                    {packages.map((pkg) => {
                        const originalPrice = calculateOriginalPrice(pkg.price, pkg.discount);
                        const pricePerToken = (pkg.price / pkg.tokens).toFixed(0);
                        const isPremium = pkg.id === 5;

                        return (
                            <button
                                key={pkg.id}
                                className={`w-full bg-linear-to-br from-[#1E293B] to-[#0F172A] rounded-xl p-4 border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl relative overflow-hidden group ${
                                    isPremium 
                                        ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/20' 
                                        : 'border-white/10 hover:border-[#4B6FA7]/50'
                                }`}
                            >
                                {/* Shine Effect */}
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                {/* Badge */}
                                {pkg.badge && (
                                    <div className={`absolute top-3 right-3 ${pkg.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                                        {pkg.badge}
                                    </div>
                                )}

                                <div className="flex items-center gap-4 relative">
                                    {/* Icon */}
                                    <div className={`${
                                        isPremium 
                                            ? 'bg-linear-to-br from-yellow-400 to-orange-500' 
                                            : 'bg-linear-to-br from-[#4B6FA7] to-[#6B8FD7]'
                                    } rounded-2xl p-4 shrink-0 shadow-lg`}>
                                        <div className="text-white">
                                            {pkg.icon}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 text-left">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-2xl font-bold text-[#F8FAFC]">
                                                {pkg.tokens}
                                            </span>
                                            <span className="text-[#94A3B8]">Tokens</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold text-[#4B6FA7]">
                                                ${pkg.price.toLocaleString()}
                                            </span>
                                            {originalPrice && (
                                                <span className="text-sm text-[#94A3B8] line-through">
                                                    ${originalPrice.toLocaleString()}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-xs text-[#94A3B8]">
                                                ${pricePerToken} por token
                                            </span>
                                            {pkg.discount && (
                                                <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                                                    -{pkg.discount}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Footer Info */}
                <div className="mt-6 p-4 bg-[#1E293B]/50 rounded-xl border border-white/5">
                    <p className="text-sm text-[#94A3B8] text-center">
                        Los tokens te permiten adelantar desbloqueos de apps
                    </p>
                    <p className="text-xs text-[#94A3B8]/70 text-center mt-1">
                        1 token = 1 minuto adelantado
                    </p>
                </div>
            </div>

            <Navbar />
        </div>
    );
}
