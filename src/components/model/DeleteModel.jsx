import React from 'react';
import Modal from '../ui/Modal';

export default function DeleteModel({ isOpen, onClose, onConfirm, itemType = '', title = "Delete Item", itemName }) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
        >
            <div className="space-y-4">
                <p className="text-sm text-slate-600">
                    Are you sure you want to delete this {itemType} {itemName ? 'item' : 'record'}? This action cannot be undone.
                </p>

                {itemName && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 font-medium break-words">
                        {itemName}
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 border border-border bg-white rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all active:scale-95"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    );
}