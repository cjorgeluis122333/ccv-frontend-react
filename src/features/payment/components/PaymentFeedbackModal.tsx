interface PaymentFeedbackModalProps {
    isOpen: boolean;
    isSuccess: boolean;
    message: string;
    onClose: () => void;
}

export const PaymentFeedbackModal = ({ isOpen, isSuccess, message, onClose }: PaymentFeedbackModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border-2
                ${isSuccess ? 'border-emerald-500/20' : 'border-rose-500/20'}
            `}>
                <div className={`p-8 text-center bg-gradient-to-b ${isSuccess ? 'from-emerald-50 to-white' : 'from-rose-50 to-white'}`}>
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 shadow-inner border-4
                        ${isSuccess ? 'bg-emerald-100 text-emerald-500 border-white shadow-emerald-200/50' : 'bg-rose-100 text-rose-500 border-white shadow-rose-200/50'}
                    `}>
                        <span className={`material-symbols-rounded block ${isSuccess ? 'text-4xl' : 'text-4xl'}`}>
                            {isSuccess ? 'check_circle' : 'error'}
                        </span>
                    </div>

                    <h3 className={`text-xl font-black mb-2
                        ${isSuccess ? 'text-emerald-700' : 'text-rose-700'}
                    `}>
                        {isSuccess ? 'Pago Completado' : 'Error en el Pago'}
                    </h3>
                    
                    <p className="text-sm font-medium text-slate-600 mb-8 leading-relaxed">
                        {message}
                    </p>

                    <button
                        onClick={onClose}
                        className={`w-full py-3.5 rounded-xl font-bold text-white shadow-sm transition-all active:scale-95
                            ${isSuccess 
                                ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' 
                                : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                            }
                        `}
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
};
