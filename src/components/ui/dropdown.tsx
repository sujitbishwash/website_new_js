import { theme } from "@/styles/theme";
import { ChevronDown } from "lucide-react";
import {  FC, useEffect, useRef, useState } from "react";

// Props for the Dropdown component
interface DropdownProps {
  label: string;
  value: string;
  onChange: (e: React.MouseEvent<HTMLLIElement>) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
  id: string;
}

// Custom Dropdown Component
const Dropdown: FC<DropdownProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
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

  const handleOptionClick = (e: React.MouseEvent<HTMLLIElement>) => {
    onChange(e);
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-2 pl-1 text-muted-foreground"
      >
        {label}
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          id={id}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full flex justify-between items-center text-left rounded-xl px-4 py-3 focus:outline-none focus:ring-1  transition-colors cursor-pointer disabled:cursor-not-allowed ${
            value ? "text-foreground" : "text-muted-foreground"
          } ${isOpen ? "border border-blue-400" : "border border-border"}`}
        >
          <span>{value || placeholder}</span>
          <ChevronDown />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-10 mt-2 w-full bg-card rounded-md shadow-lg border-border border">
            <ul className="py-1 max-h-60 overflow-auto">
              {options.map((option) => (
                <li
                  key={option}
                  onClick={handleOptionClick}
                  className={`px-4 py-2 text-sm cursor-pointer transition-colors text-foreground ${value === option ? `bg-border-medium` : 'transparent'}`}
                  onMouseEnter={(e) => {
                    if (value !== option) {
                      e.currentTarget.style.backgroundColor = theme.dividerHigh;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (value !== option) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
