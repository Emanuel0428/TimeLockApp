import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ShoppingBag,
  Coins,
  Sparkles,
  Zap,
  Crown,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import QuickAccess from "../components/QuickAccess";
import { useMetrics } from "../context/MetricsContext";
import { addLedgerEntry, uid } from "../lib/storage";

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
  const { tokenBalance, refreshBalance } = useMetrics();

  const [selectedPkg, setSelectedPkg] = useState<TokenPackage | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardError, setCardError] = useState("");
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const packages: TokenPackage[] = [
    {
      id: 1,
      tokens: 5,
      price: 2000,
      icon: <Coins className="w-8 h-8" />,
    },
    {
      id: 2,
      tokens: 20,
      price: 5000,
      discount: 17,
      badge: "Popular",
      badgeColor: "bg-blue-500",
      icon: <Star className="w-8 h-8" />,
    },
    {
      id: 3,
      tokens: 50,
      price: 10000,
      discount: 33,
      badge: "Mejor Valor",
      badgeColor: "bg-purple-500",
      icon: <Sparkles className="w-8 h-8" />,
    },
    {
      id: 4,
      tokens: 100,
      price: 18000,
      discount: 40,
      icon: <Zap className="w-8 h-8" />,
    },
    {
      id: 5,
      tokens: 300,
      price: 37500,
      discount: 50,
      badge: "Premium",
      badgeColor: "bg-gradient-to-r from-yellow-400 to-orange-500",
      icon: <Crown className="w-10 h-10" />,
    },
  ];

  const calculateOriginalPrice = (price: number, discount?: number) => {
    if (!discount) return null;
    return Math.round(price / (1 - discount / 100));
  };

  const openModal = (pkg: TokenPackage) => {
    setSelectedPkg(pkg);
    setCardNumber("");
    setCvv("");
    setCardError("");
    setPurchaseSuccess(false);
  };

  const closeModal = () => {
    setSelectedPkg(null);
    setCardNumber("");
    setCvv("");
    setCardError("");
    setPurchaseSuccess(false);
  };

  const handlePurchase = () => {
    setCardError("");

    // Validate card: 13-19 digits
    const cleanCard = cardNumber.replace(/\s/g, "");
    if (!/^\d{13,19}$/.test(cleanCard)) {
      setCardError("Número de tarjeta debe tener entre 13 y 19 dígitos");
      return;
    }

    // Validate CVV: 3-4 digits
    if (!/^\d{3,4}$/.test(cvv)) {
      setCardError("CVV debe tener 3 ó 4 dígitos");
      return;
    }

    if (!selectedPkg) return;

    // Create purchase ledger entry
    addLedgerEntry({
      id: uid(),
      timestamp: Date.now(),
      type: "purchase",
      amount: selectedPkg.tokens,
      reason: `Compra: ${selectedPkg.tokens} tokens por $${selectedPkg.price.toLocaleString()}`,
    });

    refreshBalance();
    setPurchaseSuccess(true);

    // Close after success animation
    setTimeout(() => {
      closeModal();
    }, 1500);
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
            <h1 className="text-sm md:text-base font-medium text-[#F8FAFC]">
              Tienda de Tokens
            </h1>
            <div className="w-9 md:w-10" />
          </div>

          <section className="bg-linear-to-br from-[#131F37] to-[#0F172A] rounded-2xl p-4 md:p-5 shadow-lg border border-white/10 relative overflow-hidden mb-4">
            <div className="flex items-center justify-between relative">
              <div>
                <p className="text-[#F8FAFC]/70 text-xs md:text-sm">
                  Tu Balance
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Coins className="w-6 h-6 text-[#4B6FA7]" />
                  <span className="text-3xl font-bold text-[#F8FAFC]">
                    {tokenBalance}
                  </span>
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
                  ¡Compra tokens para desbloquear tus apps antes del tiempo
                  indicado! Cuanto más grande el paquete, mayor el descuento.
                </p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3 px-2">
            {packages.map((pkg) => {
              const originalPrice = calculateOriginalPrice(
                pkg.price,
                pkg.discount,
              );
              const pricePerToken = (pkg.price / pkg.tokens).toFixed(0);
              const isPremium = pkg.id === 5;
              const isHighlighted = pkg.id === 2 || pkg.id === 5;

              return (
                <button
                  key={pkg.id}
                  onClick={() => openModal(pkg)}
                  className={`bg-linear-to-br from-[#131F37] to-[#0F172A] rounded-2xl p-4 md:p-5 shadow-lg border border-white/10 relative overflow-hidden group hover:scale-105 transition-transform active:scale-95 cursor-pointer text-left ${isPremium ? "col-span-2 border-[#4B6FA7]/50" : ""} ${isHighlighted ? "animate-pulse-highlight" : ""}`}
                >
                  {pkg.badge && (
                    <span
                      className={`absolute top-3 right-3 ${pkg.badgeColor} text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg`}
                    >
                      {pkg.badge}
                    </span>
                  )}

                  <div className="relative flex flex-col gap-3 h-full justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`${isPremium ? "bg-linear-to-br from-yellow-400 to-orange-500" : "bg-linear-to-br from-[#2D3E52] to-[#1E293B]"} rounded-2xl p-3 border border-white/10`}
                      >
                        <div className="text-[#F8FAFC]">{pkg.icon}</div>
                      </div>
                      <div>
                        <p className="text-[#F8FAFC] text-lg md:text-xl font-bold leading-none">
                          {pkg.tokens}
                        </p>
                        <p className="text-[#F8FAFC] text-[10px] md:text-xs font-semibold">
                          Tokens
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-end gap-2">
                        <span className="text-[#F8FAFC] text-base md:text-lg font-bold">
                          ${pkg.price.toLocaleString()}
                        </span>
                        {originalPrice && (
                          <span className="text-[#94A3B8] text-[10px] md:text-xs line-through">
                            ${originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[#94A3B8] text-[9px] md:text-[10px]">
                          ${pricePerToken} por token
                        </span>
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

      {/* Purchase Modal */}
      {selectedPkg && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50"
            onClick={closeModal}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-linear-to-br from-[#1E293B] to-[#0F172A] rounded-2xl shadow-2xl z-50 w-11/12 max-w-sm border border-white/10">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-[#F8FAFC]">
                  Comprar Tokens
                </h2>
                <button
                  onClick={closeModal}
                  className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {purchaseSuccess ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">✅</div>
                  <p className="text-[#F8FAFC] font-semibold text-lg">
                    ¡Compra exitosa!
                  </p>
                  <p className="text-[#94A3B8] text-sm mt-2">
                    +{selectedPkg.tokens} tokens añadidos
                  </p>
                </div>
              ) : (
                <>
                  {/* Package info */}
                  <div className="bg-[#131F37] rounded-xl p-4 mb-6 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Coins className="w-6 h-6 text-[#4B6FA7]" />
                        <div>
                          <p className="text-[#F8FAFC] font-bold text-lg">
                            {selectedPkg.tokens} Tokens
                          </p>
                          <p className="text-[#94A3B8] text-xs">
                            ${selectedPkg.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-[#94A3B8] mb-1 block">
                        Número de tarjeta
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(e.target.value.replace(/[^\d\s]/g, ""))
                        }
                        placeholder="1234 5678 9012 3456"
                        maxLength={23}
                        className="w-full px-4 py-3 rounded-lg bg-[#131F37] border border-white/10 text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#4B6FA7] text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#94A3B8] mb-1 block">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) =>
                          setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-4 py-3 rounded-lg bg-[#131F37] border border-white/10 text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#4B6FA7] text-sm"
                      />
                    </div>
                  </div>

                  {cardError && (
                    <p className="text-red-400 text-xs mt-3 bg-red-500/10 px-3 py-2 rounded-lg">
                      {cardError}
                    </p>
                  )}

                  <button
                    onClick={handlePurchase}
                    className="w-full mt-6 py-3 bg-linear-to-r from-[#4B6FA7] to-[#6B8FD7] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#4B6FA7]/30 active:scale-95 transition-all"
                  >
                    Aprobar compra
                  </button>

                  <p className="text-[10px] text-[#94A3B8] text-center mt-3">
                    Los datos de tu tarjeta no se almacenan
                  </p>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <Navbar />
    </>
  );
}
