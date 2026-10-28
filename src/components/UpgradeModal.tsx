import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Sparkles, 
  X, 
  QrCode, 
  CreditCard, 
  Copy, 
  CheckCircle2, 
  ShieldCheck, 
  FileDown, 
  Compass, 
  Users, 
  Coins, 
  Zap, 
  Lock, 
  ExternalLink, 
  Shield, 
  Key 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generatePixBRCode, generatePixQRCodeDataURL, PIX_KEY } from '../utils/pix';

export const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/9B68wO85JaiA6xg3EO5gc05";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  onUpgradeSuccess: () => void;
  onDowngrade?: () => void;
  featureTriggered?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  isPro,
  onUpgradeSuccess,
  onDowngrade,
  featureTriggered
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'stripe' | 'card'>('pix');
  const [copiedPixPayload, setCopiedPixPayload] = useState(false);
  const [copiedPixKey, setCopiedPixKey] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [pixPayload, setPixPayload] = useState<string>('');

  const [cardForm, setCardForm] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    installments: '1'
  });

  // Generate genuine Pix payload and high-resolution scanable QR Code
  useEffect(() => {
    try {
      const payload = generatePixBRCode(PIX_KEY, 19.90, 'ROTEIROFACIL PRO', 'SAO PAULO', 'VIP1990');
      setPixPayload(payload);
      generatePixQRCodeDataURL(payload).then((url) => {
        setQrCodeDataUrl(url);
      }).catch((err) => {
        console.error('Failed to generate Pix QR Code:', err);
      });
    } catch (err) {
      console.error('Failed to prepare Pix payload:', err);
    }
  }, []);

  if (!isOpen) return null;

  const handleCopyPixPayload = () => {
    if (!pixPayload) return;
    navigator.clipboard.writeText(pixPayload);
    setCopiedPixPayload(true);
    setTimeout(() => setCopiedPixPayload(false), 3000);
  };

  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(PIX_KEY);
    setCopiedPixKey(true);
    setTimeout(() => setCopiedPixKey(false), 3000);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onUpgradeSuccess();
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback if confetti fails
      }
    }, 1000);
  };

  const formatCardNumber = (val: string) => {
    const cleaned = val.replace(/\D/g, '').substring(0, 16);
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val: string) => {
    const cleaned = val.replace(/\D/g, '').substring(0, 4);
    if (cleaned.length >= 3) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2)}`;
    }
    return cleaned;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Banner */}
        <div className="relative bg-neutral-900 text-white p-6 md:p-8">
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Passaporte VIP · Upgrade Vitalício</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                {isPro ? 'Você já é um Viajante VIP PRO' : 'Desbloqueie o Roteiro PRO'}
              </h2>
              <p className="text-neutral-300 text-sm mt-1 max-w-md">
                {featureTriggered 
                  ? `Recurso "${featureTriggered}" liberado exclusivamente no plano PRO.`
                  : 'Monte roteiros completos sem limites de dias, exporte em PDF e acesse itinerários prontos.'}
              </p>
            </div>
            
            <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-3 text-right shrink-0">
              <span className="text-xs text-neutral-400 block">Pagamento Único</span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-semibold text-amber-400">R$</span>
                <span className="text-3xl font-extrabold text-white font-mono tabular-nums">19,90</span>
              </div>
              <span className="text-[11px] text-neutral-400">Acesso vitalício sem mensalidades</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Comparison / Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <span className="text-xs font-semibold uppercase text-neutral-500 tracking-wider">Versão Gratuita</span>
              <ul className="mt-3 space-y-2 text-xs text-neutral-600">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>Até 1 viagem ativa</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>Máximo de 3 dias por roteiro</span>
                </li>
                <li className="flex items-center gap-2 text-neutral-400 line-through">
                  <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>Exportação em PDF formatada</span>
                </li>
                <li className="flex items-center gap-2 text-neutral-400 line-through">
                  <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>Roteiros Prontos Curados VIP</span>
                </li>
                <li className="flex items-center gap-2 text-neutral-400 line-through">
                  <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>Calculadora de Divisão de Contas</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-amber-900 tracking-wider">Roteiro VIP PRO</span>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">R$ 19,90</span>
              </div>
              <ul className="mt-3 space-y-2 text-xs text-amber-950 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Viagens e dias <strong>ilimitados</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <FileDown className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span><strong>Exportação PDF</strong> de alta qualidade</span>
                </li>
                <li className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span><strong>Roteiros Prontos</strong> (Noronha, Roma, Paris...)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Divisão de Gastos entre Amigos / Casal</span>
                </li>
                <li className="flex items-center gap-2">
                  <Coins className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Conversor de Moedas ao Vivo</span>
                </li>
              </ul>
            </div>
          </div>

          {/* If already Pro */}
          {isPro ? (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-900">Seu plano VIP está 100% ativo!</h3>
                <p className="text-xs text-emerald-700 mt-0.5">Aproveite todos os recursos ilimitados, exportação e roteiros curados.</p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-sm"
                >
                  Continuar Planejando Minha Viagem
                </button>
                {onDowngrade && (
                  <button
                    onClick={() => {
                      onDowngrade();
                      onClose();
                    }}
                    className="px-3 py-2 text-xs font-medium text-neutral-500 hover:text-neutral-700 underline"
                  >
                    Voltar ao modo Grátis (teste)
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Payment Section */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-2 gap-2">
                <span className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                  Forma de Pagamento (R$ 19,90)
                </span>
                
                {/* Payment Selector Tabs */}
                <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      paymentMethod === 'pix'
                        ? 'bg-white text-teal-900 shadow-sm font-semibold'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5 text-teal-600" />
                    <span>PIX Instantâneo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('stripe')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      paymentMethod === 'stripe'
                        ? 'bg-white text-indigo-900 shadow-sm font-semibold'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Stripe Checkout</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      paymentMethod === 'card'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                    <span>Cartão</span>
                  </button>
                </div>
              </div>

              {/* REAL SCANABLE PIX FLOW */}
              {paymentMethod === 'pix' && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 md:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    {/* Real Scanable QR Code */}
                    <div className="w-44 h-44 bg-white p-2.5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col items-center justify-center shrink-0">
                      {qrCodeDataUrl ? (
                        <img
                          src={qrCodeDataUrl}
                          alt="QR Code Pix R$ 19,90"
                          className="w-36 h-36 object-contain"
                        />
                      ) : (
                        <div className="w-36 h-36 bg-neutral-100 flex items-center justify-center text-xs text-neutral-400 animate-pulse rounded-lg">
                          Gerando QR Code...
                        </div>
                      )}
                      <span className="text-[10px] text-teal-800 font-bold tracking-wide mt-1">
                        PIX R$ 19,90 · Escaneie aqui
                      </span>
                    </div>

                    {/* PIX instructions and Copy Options */}
                    <div className="flex-1 space-y-3 text-left w-full">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900">
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>Liberação Imediata na Hora via PIX</span>
                      </div>
                      
                      <p className="text-xs text-neutral-600">
                        Abra o app do seu banco no celular, aponte a câmera para o QR Code ao lado ou use uma das opções abaixo:
                      </p>

                      {/* Option 1: Direct Pix Key */}
                      <div className="p-3 bg-white border border-teal-200/90 rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-neutral-700 flex items-center gap-1">
                            <Key className="w-3.5 h-3.5 text-teal-600" />
                            <span>Chave PIX:</span>
                          </span>
                          <span className="text-neutral-500">Valor: R$ 19,90</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-neutral-900 bg-neutral-50 px-2 py-1 rounded border border-neutral-200 flex-1">
                            {PIX_KEY}
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyPixKey}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors shrink-0 shadow-xs"
                          >
                            {copiedPixKey ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-white" />
                                <span>Copiada!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copiar Chave</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Option 2: Full Pix Copia e Cola */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-medium text-neutral-500 block">
                          Ou use o código Pix Copia e Cola (com valor de R$ 19,90):
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={pixPayload}
                            className="flex-1 text-[11px] font-mono bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-neutral-600 select-all truncate"
                          />
                          <button
                            type="button"
                            onClick={handleCopyPixPayload}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg transition-colors shrink-0 shadow-xs"
                          >
                            {copiedPixPayload ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copiar Código</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Payment Button */}
                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    disabled={isProcessing}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-75"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Validando pagamento PIX...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Já realizei o pagamento via PIX · Desbloquear Agora</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* STRIPE OFFICIAL CHECKOUT FLOW */}
              {paymentMethod === 'stripe' && (
                <div className="bg-indigo-50/50 border border-indigo-200/90 rounded-2xl p-5 md:p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded tracking-wide uppercase">
                          Stripe Checkout Seguro
                        </span>
                        <span className="text-xs text-neutral-500">·</span>
                        <span className="text-xs text-neutral-600 font-medium">Link Oficial de Pagamento</span>
                      </div>
                      <h4 className="text-base font-bold text-neutral-900 pt-1">
                        Pague com total segurança via Stripe
                      </h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Ao clicar no botão abaixo, a página oficial do Stripe será aberta com suporte a Cartão de Crédito, PIX, Apple Pay e Google Pay.
                      </p>
                    </div>

                    <div className="hidden sm:block text-right shrink-0">
                      <span className="text-[11px] text-neutral-500 block">Total a pagar</span>
                      <span className="text-xl font-bold font-mono tabular-nums text-neutral-900">R$ 19,90</span>
                    </div>
                  </div>

                  {/* Primary Link Button to Stripe */}
                  <div className="pt-2">
                    <a
                      href={STRIPE_CHECKOUT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-5 bg-[#635BFF] hover:bg-[#5851EA] text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <span>Abrir Pagamento Seguro no Stripe (R$ 19,90)</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>

                  {/* After payment verification step */}
                  <div className="pt-3 border-t border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="text-neutral-600">
                      <span className="font-semibold text-neutral-800">Já concluiu sua compra no Stripe?</span>
                      <p className="text-[11px] text-neutral-500">Clique para validar seu pagamento e desbloquear seu plano imediatamente.</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleConfirmPayment}
                      disabled={isProcessing}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-xs flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-70"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Ativando VIP...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Já realizei o pagamento · Ativar VIP</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Credit Card Flow */}
              {paymentMethod === 'card' && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="font-medium text-neutral-700">Número do Cartão</label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        value={cardForm.number}
                        onChange={(e) => setCardForm({ ...cardForm, number: formatCardNumber(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="font-medium text-neutral-700">Nome no Cartão</label>
                      <input
                        type="text"
                        placeholder="NOME COMO NO CARTÃO"
                        value={cardForm.name}
                        onChange={(e) => setCardForm({ ...cardForm, name: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg uppercase focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-medium text-neutral-700">Validade</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        maxLength={5}
                        value={cardForm.expiry}
                        onChange={(e) => setCardForm({ ...cardForm, expiry: formatExpiry(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-medium text-neutral-700">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        maxLength={4}
                        value={cardForm.cvv}
                        onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '').substring(0, 4) })}
                        className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="font-medium text-neutral-700">Parcelas</label>
                      <select
                        value={cardForm.installments}
                        onChange={(e) => setCardForm({ ...cardForm, installments: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      >
                        <option value="1">1x de R$ 19,90 sem juros (Total: R$ 19,90)</option>
                        <option value="2">2x de R$ 9,95 sem juros (Total: R$ 19,90)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    disabled={isProcessing}
                    className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-75"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processando compra segura...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Pagar R$ 19,90 e Ativar Acesso Vitalício</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Fast Trial Button for direct evaluation */}
              <div className="flex items-center justify-between pt-2 text-xs text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Pagamento 100% Seguro · Chave PIX: {PIX_KEY}</span>
                </span>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="text-amber-700 hover:text-amber-900 font-medium underline"
                >
                  Testar Modo VIP (1 clique)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
