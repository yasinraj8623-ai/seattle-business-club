import { forwardRef, SelectHTMLAttributes } from "react";

import ChevronDownIcon from "@/components/icons/ChevronDownIcon";

const inputClass =
  "w-full rounded-xs border border border-[#1F1F1F] bg-[rgba(11,11,19,0.70)] px-4 py-3 text-sm text-white placeholder:text-[#8C8C8C] leading-5 outline-none transition-colors focus:border-[#4A5DF9]";

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  wrapperClassName?: string;
}

const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ className, wrapperClassName, children, ...props }, ref) => {
    return (
      <div className={`relative w-full ${wrapperClassName ?? ""}`}>
        <select ref={ref} {...props} className={`${inputClass} appearance-none pr-10 ${className ?? ""}`}>
          {children}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40" />
      </div>
    );
  },
);

SelectInput.displayName = "SelectInput";

export default SelectInput;
