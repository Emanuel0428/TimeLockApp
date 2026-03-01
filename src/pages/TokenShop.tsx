import { useNavigate } from "react-router-dom";
import { ChevronLeft, ShoppingBag, Coins, Sparkles, Zap, Crown, Star, TrendingUp } from "lucide-react";
import Navbar from "../components/Navbar";
import QuickAccess from "../components/QuickAccess";

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
        <>
            <QuickAccess />

            <main className="pt-16 pb-24 px-3 md:px-4 min-h-screen bg-[#0F172A]">
                <div className="max-w-md mx-auto w-full">
                    <div className="flex items-center justify-between mb-4 py-4 px-2">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-lg bg-linear-to-br from-[#2D3E52] to-[#1E293B] hover:from-[#3d4e62] hover:to-[#2d3d4b] transition-all duration-200"
                        >
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </button>
                        <h1 className="text-sm md:text-base font-medium text-[#F8FAFC]">Tienda de Tokens</h1>
                        <div className="w-9 md:w-10" />
                    </div>

                    <section className="bg-linear-to-br from-[#131F37] to-[#0F172A] rounded-2xl p-4 md:p-5 shadow-lg border border-white/10 relative overflow-hidden mb-4">
                        <div className="flex items-center justify-between relative">
                            <div>
                                <p className="text-[#F8FAFC]/70 text-xs md:text-sm">Tu Balance</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Coins className="w-6 h-6 text-[#4B6FA7]" />
                                    <span className="text-3xl font-bold text-[#F8FAFC]">{currentBalance}</span>
                                    <span className="text-[#F8FAFC]/90 text-base">Tokens</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-2xl bg-linear-to-br from-[#2D3E52] to-[#1E293B] border border-white/10">
                                <ShoppingBag className="w-8 h-8 text-[#4B6FA7]" />
                            </div>
                        </div>
                    </section>

                    <section className="mb-4 bg-linear-to-br from-[#131F37] to-[#0F172A] rounded-2xl p-4 border border-white/10 relative overflow-hidden">
                        <div className="flex items-start gap-3 relative">
                            <TrendingUp className="w-5 h-5 text-[#4B6FA7] mt-0.5 shrink-0" />
                            <div>
                                <h3 className="text-[#F8FAFC] text-sm font-semibold mb-1">
                                    ¿No aguantas tener tanto tiempo tus apps bloqueadas?
                                </h3>
                                <p className="text-xs text-[#94A3B8]">
                                    ¡Compra tokens para desbloquear tus apps antes del tiempo indicado! Cuanto más grande el paquete, mayor el descuento.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="grid grid-cols-2 gap-3 px-2">
                        {packages.map((pkg) => {
                            const originalPrice = calculateOriginalPrice(pkg.price, pkg.discount);
                            const pricePerToken = (pkg.price / pkg.tokens).toFixed(0);
                            const isPremium = pkg.id === 5;
                            const isHighlighted = pkg.id === 2 || pkg.id === 5;

                            return (
                                <button
                                    key={pkg.id}
                                    className={`bg-linear-to-br from-[#131F37] to-[#0F172A] rounded-2xl p-4 md:p-5 shadow-lg border border-white/10 relative overflow-hidden group hover:scale-105 transition-transform active:scale-95 cursor-pointer text-left ${isPremium ? 'col-span-2 border-[#4B6FA7]/50' : ''} ${isHighlighted ? 'animate-pulse-highlight' : ''}`}
                                >
                                    {pkg.badge && (
                                        <span className={`absolute top-3 right-3 ${pkg.badgeColor} text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg`}>
                                            {pkg.badge}
                                        </span>
                                    )}

                                    <div className="relative flex flex-col gap-3 h-full justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`${isPremium ? 'bg-linear-to-br from-yellow-400 to-orange-500' : 'bg-linear-to-br from-[#2D3E52] to-[#1E293B]'} rounded-2xl p-3 border border-white/10`}>
                                                <div className="text-[#F8FAFC]">{pkg.icon}</div>
                                            </div>
                                            <div>
                                                <p className="text-[#F8FAFC] text-lg md:text-xl font-bold leading-none">{pkg.tokens}</p>
                                                <p className="text-[#F8FAFC] text-[10px] md:text-xs font-semibold">Tokens</p>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-end gap-2">
                                                <span className="text-[#F8FAFC] text-base md:text-lg font-bold">${pkg.price.toLocaleString()}</span>
                                                {originalPrice && (
                                                    <span className="text-[#94A3B8] text-[10px] md:text-xs line-through">
                                                        ${originalPrice.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[#94A3B8] text-[9px] md:text-[10px]">${pricePerToken} por token</span>
                                                {pkg.discount && (
                                                    <span className="text-[9px] md:text-[10px] font-bold text-[#4B6FA7] bg-[#4B6FA7]/10 px-2 py-0.5 rounded-full border border-[#4B6FA7]/20">
                                                        -{pkg.discount}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </section>

                    <section className="mt-4 mx-2 bg-linear-to-br from-[#131F37] to-[#0F172A] rounded-2xl p-4 border border-white/10 relative overflow-hidden">
                        <p className="relative text-sm text-[#F8FAFC] text-center font-medium">
                            Los tokens te permiten adelantar desbloqueos de apps
                        </p>
                        <p className="relative text-xs text-[#94A3B8] text-center mt-1">
                            1 token = 1 minuto adelantado
                        </p>
                    </section>
                </div>
            </main>

            <Navbar />
        </>
    );
}
