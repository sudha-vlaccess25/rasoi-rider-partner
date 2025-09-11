import React from 'react';

const Modal = ({ isOpen, onClose, title, children, type }) => {
    if (!isOpen) return null;

    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'bg-green-100' : 'bg-red-100';
    const borderColor = isSuccess ? 'border-green-500' : 'border-red-500';
    const titleColor = isSuccess ? 'text-green-800' : 'text-red-800';
    const buttonColor = isSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className={`bg-white rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out scale-95 animate-scale-in`}>
                <div className={`p-6 border-b-4 ${borderColor} ${bgColor} rounded-t-lg`}>
                    <h3 className={`text-2xl font-bold ${titleColor}`}>{title}</h3>
                </div>
                <div className="p-6 text-gray-700">
                    {children}
                </div>
                <div className="p-4 bg-gray-50 rounded-b-lg text-right">
                    <button
                        onClick={onClose}
                        className={`text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 ${buttonColor}`}
                    >
                        Close
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Modal;