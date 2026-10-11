import React, { useState } from 'react';
import { MessageSquareCode, CheckCircle2 } from 'lucide-react';

interface VerbalArenaProps {
  payload: any;
  prompt: string;
  onSubmit: (response: any) => void;
  disabled?: boolean;
}

export const VerbalArena: React.FC<VerbalArenaProps> = ({ payload, prompt, onSubmit, disabled }) => {
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const options: string[] = payload.options || [];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalAnswer = textAnswer.trim() || selectedOption;
    if (finalAnswer && !disabled) {
      onSubmit(finalAnswer);
    }
  };

  return (
    <div className="space-y-6">
      {/* Scenario / Riddle Box */}
      <div className="p-6 rounded-2xl bg-graphite-900 border border-graphite-750 space-y-3 shadow-glass">
        <div className="flex items-center space-x-2 text-violet-glow text-xs uppercase font-mono font-bold tracking-wider">
          <MessageSquareCode className="w-4 h-4" />
          <span>Cognitive Scenario & Linguistic Deduction</span>
        </div>
        <p className="text-sm md:text-base text-graphite-200 leading-relaxed font-sans">
          {prompt}
        </p>
      </div>

      {/* Options if provided */}
      {options.length > 0 && (
        <div>
          <h5 className="text-xs font-mono uppercase text-graphite-400 tracking-wider mb-3">
            Choose Valid Semantic Resolution:
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedOption(opt);
                    setTextAnswer(opt);
                  }}
                  disabled={disabled}
                  className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-violet-neon/15 border-violet-neon shadow-violet-glow'
                      : 'bg-graphite-900/60 border-graphite-800 hover:border-graphite-650'
                  }`}
                >
                  <span className="text-sm text-graphite-200 font-medium">{opt}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-violet-glow ml-2 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Natural Language Freeform Response Box */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-xs font-mono text-graphite-400 uppercase tracking-wider">
          Or Express Your Reasoning In Natural Language:
        </label>
        <textarea
          rows={3}
          value={textAnswer}
          onChange={(e) => {
            setTextAnswer(e.target.value);
            setSelectedOption(null);
          }}
          disabled={disabled}
          placeholder="State your deductive conclusion or lateral explanation..."
          className="w-full p-4 rounded-xl bg-graphite-900 border border-graphite-750 text-graphite-100 placeholder-graphite-500 text-sm focus:outline-none focus:border-violet-glow resize-none"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-mono text-graphite-400">
            Cognivista NLP evaluates semantic conceptual fidelity.
          </span>
          <button
            type="submit"
            disabled={(!textAnswer.trim() && selectedOption === null) || disabled}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-semibold text-sm shadow-mint-glow hover:opacity-95 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
          >
            Submit Natural Reasoning
          </button>
        </div>
      </form>
    </div>
  );
};
