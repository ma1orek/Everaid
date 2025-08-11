import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Wand2, Info } from "lucide-react";

interface AIGenerationSectionProps {
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

export function AIGenerationSection({ 
  aiPrompt, 
  setAiPrompt, 
  isGenerating, 
  onGenerate 
}: AIGenerationSectionProps) {
  return (
    <div className="bg-[#1e1f20] rounded-[20px] p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Wand2 className="w-5 h-5 text-[#0A84FF]" />
        <h3 className="font-['REM:SemiBold',_sans-serif] font-semibold text-[#ffffff] text-[18px]">Generate using AI</h3>
        <span className="bg-[#131314] px-2 py-1 rounded-full text-[#8f8f8f] text-[12px] font-['REM:Medium',_sans-serif] font-medium">
          Optional
        </span>
      </div>
      
      <div className="flex items-start gap-2 p-3 bg-[#131314] rounded-[12px]">
        <Info className="w-4 h-4 text-[#0A84FF] mt-0.5 shrink-0" />
        <div className="text-[13px] text-[#8f8f8f] font-['REM:Regular',_sans-serif]">
          Describe what kind of emergency pack you want to create and AI (powered by your Edge Function) will generate the title, description, category, urgency level, and step-by-step instructions. You can always edit them manually afterwards.
        </div>
      </div>

      <div className="space-y-3">
        <label className="block font-['REM:Medium',_sans-serif] font-medium text-[#ffffff] text-[14px]">
          What do you want to create a guide for?
        </label>
        <Textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="E.g., 'treating a house fire evacuation', 'I cut my hand and it's bleeding a lot', 'car won't start', 'need help in Spanish'"
          className="bg-[#131314] border-[#2a2b2c] text-[#ffffff] resize-none h-auto min-h-[80px] break-words"
          maxLength={600}
          rows={3}
          style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
        />
        <div className="text-[12px] text-[#8f8f8f] text-right">
          {aiPrompt.length}/600
        </div>
      </div>

      <Button
        onClick={onGenerate}
        disabled={!aiPrompt.trim() || isGenerating}
        className="w-full bg-[#0A84FF] hover:bg-[#0A84FF]/80 text-[#ffffff] rounded-[12px] h-11 font-['REM:SemiBold',_sans-serif] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            Generate Pack Details
          </div>
        )}
      </Button>
    </div>
  );
}