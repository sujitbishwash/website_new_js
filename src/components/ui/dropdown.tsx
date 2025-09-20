import { theme } from "@/styles/theme";
import { ChevronDown } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";

// Props for the Dropdown component
export interface DropdownProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  defaultPosition?:number;
  id: string;
}

// Custom Dropdown Component
const Dropdown: FC<DropdownProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  defaultPosition,
  disabled = false,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Effect to handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium mb-2 pl-1 text-muted-foreground"
        >
          {label}
        </label>
      )}

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          id={id}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full flex justify-between items-center text-left rounded-xl px-4 py-3 focus:outline-none focus:ring-1 bg-background-subtle transition-colors cursor-pointer disabled:cursor-not-allowed ${
            value ? "text-foreground" : "text-muted-foreground"
          } ${isOpen ? "border border-blue-400" : "border border-border"}`}
        >
          <span>{value || (defaultPosition?options[defaultPosition]: placeholder)}</span>
          <ChevronDown className="ml-4"/>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-10 mt-2 w-full bg-card rounded-md shadow-lg border-border border">
            <div className="py-1 max-h-60 overflow-auto">
              {options.map((option) => (
                <div
                  key={option}
                  className={`px-4 py-2 text-sm cursor-pointer transition-colors text-foreground ${
                    value === option ? "bg-border" : "hover:bg-border/50"
                  }`}
                  onClick={() => handleOptionClick(option)}
                  
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
