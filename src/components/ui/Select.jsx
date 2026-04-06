import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = "",
    className = "",
    labelClassName = "",
    containerClassName = ""
}) => {
    return (
        <div className={`flex flex-col gap-2.5 ${containerClassName}`}>
            {label && (
                <label className={`text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 ${labelClassName}`}>
                    {label}
                </label>
            )}
            <div className="relative group">
                <select
                    value={value}
                    onChange={onChange}
                    className={`w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold uppercase tracking-widest text-slate-700 appearance-none cursor-pointer outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/30 ${className}`}
                >
                    {placeholder && <option value="" disabled>{placeholder}</option>}
                    {options.map((option) => {
                        const isObject = typeof option === 'object';
                        const val = isObject ? option.value : option;
                        const labelText = isObject ? option.label : option;
                        return (
                            <option key={val} value={val} className="py-2 text-slate-900 bg-white">
                                {labelText}
                            </option>
                        );
                    })}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <ChevronDown size={14} strokeWidth={3} />
                </div>
            </div>
        </div>
    );
};

export default Select;
