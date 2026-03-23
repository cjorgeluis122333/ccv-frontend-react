interface PaymentFeedbackModalProps {
    isOpen: boolean;
    variant: 'success' | 'error' | 'warning';
    message: string;
    title?: string;
    onClose: () => void;
}

export const PaymentFeedbackModal = ({ isOpen, variant, message, title, onClose }: PaymentFeedbackModalProps) => {
    if (!isOpen) return null;

    const isSuccess = variant === 'success';
    const isWarning = variant === 'warning';
    const borderClasses = isSuccess
        ? 'border-emerald-500/20'
        : isWarning
            ? 'border-amber-500/20'
            : 'border-rose-500/20';
    const gradientClasses = isSuccess
        ? 'from-emerald-50 to-white'
        : isWarning
            ? 'from-amber-50 to-white'
            : 'from-rose-50 to-white';
    const iconClasses = isSuccess
        ? 'bg-emerald-100 text-emerald-500 border-white shadow-emerald-200/50'
        : isWarning
            ? 'bg-amber-100 text-amber-500 border-white shadow-amber-200/50'
            : 'bg-rose-100 text-rose-500 border-white shadow-rose-200/50';
    const titleClasses = isSuccess
        ? 'text-emerald-700'
        : isWarning
            ? 'text-amber-700'
            : 'text-rose-700';
    const buttonClasses = isSuccess
        ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
        : isWarning
            ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
            : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20';
    const icon = isSuccess ? 'check_circle' : isWarning ? 'warning' : 'error';
    const resolvedTitle = title || (isSuccess ? 'Pago Completado' : isWarning ? 'Advertencia de Pago' : 'Error en el Pago');

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border-2 ${borderClasses}`}>
                <div className={`p-8 text-center bg-gradient-to-b ${gradientClasses}`}>
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 shadow-inner border-4 ${iconClasses}`}>
                        <span className="material-symbols-rounded block text-4xl">
                            {icon}
                        </span>
                    </div>

                    <h3 className={`text-xl font-black mb-2 ${titleClasses}`}>
                        {resolvedTitle}
                    </h3>

                    <p className="text-sm font-medium text-slate-600 mb-8 leading-relaxed">
                        {message}
                    </p>

                    <button
                        onClick={onClose}
                        className={`w-full py-3.5 rounded-xl font-bold text-white shadow-sm transition-all active:scale-95 ${buttonClasses}`}
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
};
