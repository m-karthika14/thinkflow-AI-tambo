import { useState } from 'react';

interface ContextInputProps {
  onContextChange: (context: string) => void;
}

export default function ContextInput({ onContextChange }: ContextInputProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onContextChange(e.target.value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative -top-[2cm]">
      <input
        type="text"
        id="context-input"
        name="context"
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Refine focus / thinking"
        className={`
          w-full px-6 py-3 bg-transparent border rounded-full
          text-gray-300 placeholder-gray-600 text-sm font-light tracking-wide
          transition-all duration-500 outline-none
          ${isFocused
            ? 'border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
            : 'border-gray-700/30 hover:border-gray-600/50'
          }
        `}
      />
    </div>
  );
}
