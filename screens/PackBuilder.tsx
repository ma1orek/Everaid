import { useState, useEffect } from "react";
import { Pack, Umbrella } from "../data/models";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { saveCustomPack, exportPack, generateQRTiles, getPackSteps, CustomPack } from "../utils/packManager";
import { QRModal } from "../components/QRModal";
import { toast } from "sonner@2.0.3";
import { Plus, Minus } from "lucide-react";
import { generatePack, PackDraft } from "../utils/aiClient";
import { CATEGORY_OPTIONS, URGENCY_OPTIONS } from "../components/PackBuilder/constants";
import { 
  PackData, 
  validateBasics, 
  validateSteps, 
  mapCategoryToUmbrella, 
  mapUrgency, 
  generateMockPackData 
} from "../components/PackBuilder/helpers";
import { PreviewCard } from "../components/PackBuilder/PreviewCard";
import { AIGenerationSection } from "../components/PackBuilder/AIGenerationSection";

interface PackBuilderProps {
  onNavigate: (screen: string, data?: any) => void;
  pack?: Pack | CustomPack;
  mode?: string;
}

export function PackBuilder({ onNavigate, pack, mode }: PackBuilderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [packData, setPackData] = useState<PackData>({
    umbrella: "",
    title: "",
    oneLiner: "",
    detailedDescription: "",
    cta: "",
    urgency: "",
    etaMin: 1,
    icon: "ri-tools-line",
    steps: [{ title: "", desc: "" }]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [qrTiles, setQrTiles] = useState<string[]>([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Initialize with existing pack data if editing
  useEffect(() => {
    if (pack && (mode === "edit" || mode === "duplicate")) {
      const existingSteps = getPackSteps(pack.id) || [];
      setPackData({
        umbrella: pack.umbrella || pack.category as Umbrella,
        title: mode === "duplicate" ? `${pack.title} Copy` : pack.title,
        oneLiner: pack.oneLiner || pack.description,
        detailedDescription: pack.detailedDescription || "",
        cta: pack.cta,
        urgency: pack.urgency,
        etaMin: pack.etaMin || pack.duration,
        icon: pack.icon || "ri-tools-line",
        steps: existingSteps.length > 0 ? existingSteps : [{ title: "", desc: "" }]
      });
    }
  }, [pack, mode]);

  const addStep = () => {
    setPackData(prev => ({
      ...prev,
      steps: [...prev.steps, { title: "", desc: "" }]
    }));
  };

  const removeStep = (index: number) => {
    if (packData.steps.length > 1) {
      setPackData(prev => ({
        ...prev,
        steps: prev.steps.filter((_, i) => i !== index)
      }));
    }
  };

  const updateStep = (index: number, field: string, value: string | number) => {
    setPackData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === index ? { ...step, [field]: value } : step
      )
    }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const newErrors = validateBasics(packData);
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      const newErrors = validateSteps(packData);
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        setCurrentStep(3);
      }
    }
  };

  const handleSave = () => {
    const newErrors = validateSteps(packData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        const savedPack = saveCustomPack({
          umbrella: packData.umbrella as Umbrella,
          title: packData.title,
          oneLiner: packData.oneLiner,
          detailedDescription: packData.detailedDescription,
          cta: packData.cta,
          urgency: packData.urgency as "emergency" | "warning" | "info",
          etaMin: packData.etaMin,
          icon: packData.icon,
          steps: packData.steps.filter(step => step.title.trim())
        });
        
        toast("Pack saved successfully!");
        onNavigate("home");
      } catch (error) {
        toast("Failed to save pack. Please try again.");
        console.error("Error saving pack:", error);
      }
    }
  };
  
  const handleShare = () => {
    const newErrors = validateSteps(packData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        // Create a temporary pack for export
        const tempPack = saveCustomPack({
          umbrella: packData.umbrella as Umbrella,
          title: packData.title,
          oneLiner: packData.oneLiner,
          detailedDescription: packData.detailedDescription,
          cta: packData.cta,
          urgency: packData.urgency as "emergency" | "warning" | "info",
          etaMin: packData.etaMin,
          icon: packData.icon,
          steps: packData.steps.filter(step => step.title.trim())
        });
        
        const steps = getPackSteps(tempPack.id);
        if (steps) {
          const packContent = exportPack(tempPack, steps);
          
          // Create downloadable file
          const blob = new Blob([packContent], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${packData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.everpack`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast("Pack exported successfully!");
        }
      } catch (error) {
        toast("Failed to export pack. Please try again.");
        console.error("Error exporting pack:", error);
      }
    }
  };
  
  const handleQR = () => {
    const newErrors = validateSteps(packData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        // Create a temporary pack for QR generation
        const tempPack = saveCustomPack({
          umbrella: packData.umbrella as Umbrella,
          title: packData.title,
          oneLiner: packData.oneLiner,
          detailedDescription: packData.detailedDescription,
          cta: packData.cta,
          urgency: packData.urgency as "emergency" | "warning" | "info",
          etaMin: packData.etaMin,
          icon: packData.icon,
          steps: packData.steps.filter(step => step.title.trim())
        });
        
        const steps = getPackSteps(tempPack.id);
        if (steps) {
          const packContent = exportPack(tempPack, steps);
          const tiles = generateQRTiles(packContent);
          
          setQrTiles(tiles);
          setShowQRModal(true);
          toast(`Pack converted to ${tiles.length} QR tiles!`);
        }
      } catch (error) {
        toast("Failed to generate QR code. Please try again.");
        console.error("Error generating QR:", error);
      }
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please describe what kind of pack you want to create");
      return;
    }

    setIsGenerating(true);
    
    try {
      const draft = await generatePack(aiPrompt.trim());

      // Map PackDraft to our form format
      const mappedData = {
        umbrella: mapCategoryToUmbrella(draft.category),
        title: draft.title,
        oneLiner: draft.oneLiner,
        detailedDescription: "",
        cta: "Get Started",
        urgency: mapUrgency(draft.urgency),
        etaMin: draft.estMinutes,
        steps: draft.steps.map(step => ({
          title: step.title,
          desc: step.description,
          ...(step.timerSeconds ? { timerSec: step.timerSeconds } : {})
        }))
      };
      
      // Auto-fill form fields
      setPackData(prev => ({
        ...prev,
        ...mappedData
      }));

      toast.success("Pack details generated! You can edit them below.");
      setAiPrompt("");
      
    } catch (e) {
      // Fallback to mock generation
      try {
        const fallbackData = generateMockPackData(aiPrompt);
        setPackData(prev => ({
          ...prev,
          ...fallbackData
        }));
        toast.error("AI error. Using fallback generation.");
        setAiPrompt("");
      } catch (fallbackError) {
        toast.error("AI error. Try again.");
      }
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-[#131314] relative size-full overflow-hidden">
      {/* Header */}
      <div className="absolute box-border content-stretch flex flex-row items-center justify-between left-4 p-0 top-[20px] w-[396px] z-50">
        <button 
          onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onNavigate("home")}
          className="relative shrink-0 size-6"
        >
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z" fill="#8F8F8F" />
          </svg>
        </button>
        
        <div className="font-['REM:SemiBold',_sans-serif] font-semibold text-[#ffffff] text-[20px]">
          {mode === "edit" ? "Edit Pack" : mode === "duplicate" ? "Duplicate Pack" : "Create Pack"}
        </div>
        
        <div className="w-6 h-6" />
      </div>

      {/* Progress Indicator */}
      <div className="absolute left-4 right-4 top-[70px] flex gap-2">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`h-1 flex-1 rounded-full ${
              step <= currentStep ? "bg-[#ffffff]" : "bg-[#2a2b2c]"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-col h-full relative">
        {/* Spacer for header and progress */}
        <div className="h-[100px] shrink-0" />
        
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 min-h-0"
             style={{ paddingBottom: '120px' }}>
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* AI Generation Section */}
            <AIGenerationSection 
              aiPrompt={aiPrompt}
              setAiPrompt={setAiPrompt}
              isGenerating={isGenerating}
              onGenerate={handleAIGenerate}
            />

            <div className="bg-[#1e1f20] rounded-[20px] p-6 space-y-6">
              <h3 className="font-['REM:SemiBold',_sans-serif] font-semibold text-[#ffffff] text-[18px]">Pack Details</h3>
              
              {/* Category */}
              <div>
                <label className="block font-['REM:Medium',_sans-serif] font-medium text-[#ffffff] text-[14px] mb-2">
                  Category *
                </label>
                <Select 
                  value={packData.umbrella} 
                  onValueChange={(value) => setPackData(prev => ({ ...prev, umbrella: value as Umbrella }))}
                >
                  <SelectTrigger className="bg-[#131314] border-[#2a2b2c] text-[#ffffff]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#131314] border-[#2a2b2c]">
                    {CATEGORY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-[#ffffff]">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.umbrella && <p className="text-[#FF6265] text-[12px] mt-1">{errors.umbrella}</p>}
              </div>

              {/* Title */}
              <div>
                <label className="block font-['REM:Medium',_sans-serif] font-medium text-[#ffffff] text-[14px] mb-2">
                  Title * ({packData.title.length}/32)
                </label>
                <Input
                  value={packData.title}
                  onChange={(e) => setPackData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Emergency pack title"
                  className="bg-[#131314] border-[#2a2b2c] text-[#ffffff]"
                  maxLength={32}
                />
                {errors.title && <p className="text-[#FF6265] text-[12px] mt-1">{errors.title}</p>}
              </div>

              {/* One-liner */}
              <div>
                <label className="block font-['REM:Medium',_sans-serif] font-medium text-[#ffffff] text-[14px] mb-2">
                  One-liner * ({packData.oneLiner.length}/90)
                </label>
                <Textarea
                  value={packData.oneLiner}
                  onChange={(e) => setPackData(prev => ({ ...prev, oneLiner: e.target.value }))}
                  placeholder="Brief description in one sentence"
                  className="bg-[#131314] border-[#2a2b2c] text-[#ffffff] resize-none h-auto min-h-[60px] break-words"
                  maxLength={90}
                  rows={2}
                  style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                />
                {errors.oneLiner && <p className="text-[#FF6265] text-[12px] mt-1">{errors.oneLiner}</p>}
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block font-['REM:Medium',_sans-serif] font-medium text-[#ffffff] text-[14px] mb-2">
                  Detailed Description (optional) ({packData.detailedDescription.length}/300)
                </label>
                <Textarea
                  value={packData.detailedDescription}
                  onChange={(e) => setPackData(prev => ({ ...prev, detailedDescription: e.target.value }))}
                  placeholder="More detailed explanation of the procedure and what to expect"
                  className="bg-[#131314] border-[#2a2b2c] text-[#ffffff] resize-none h-auto min-h-[80px] break-words"
                  maxLength={300}
                  rows={3}
                  style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                />
                {errors.detailedDescription && <p className="text-[#FF6265] text-[12px] mt-1">{errors.detailedDescription}</p>}
              </div>

              {/* CTA */}
              <div>
                <label className="block font-['REM:Medium',_sans-serif] font-medium text-[#ffffff] text-[14px] mb-2">
                  Action Button * ({packData.cta.length}/16)
                </label>
                <Input
                  value={packData.cta}
                  onChange={(e) => setPackData(prev => ({ ...prev, cta: e.target.value }))}
                  placeholder="Action verb"
                  className="bg-[#131314] border-[#2a2b2c] text-[#ffffff]"
                  maxLength={16}
                />
                {errors.cta && <p className="text-[#FF6265] text-[12px] mt-1">{errors.cta}</p>}
              </div>

              {/* Urgency */}
              <div>
                <label className="block font-['REM:Medium',_sans-serif] font-medium text-[#ffffff] text-[14px] mb-2">
                  Urgency *
                </label>
                <Select 
                  value={packData.urgency} 
                  onValueChange={(value) => setPackData(prev => ({ ...prev, urgency: value as "emergency" | "warning" | "info" }))}
                >
                  <SelectTrigger className="bg-[#131314] border-[#2a2b2c] text-[#ffffff]">
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#131314] border-[#2a2b2c]">
                    {URGENCY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-[#ffffff]">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.urgency && <p className="text-[#FF6265] text-[12px] mt-1">{errors.urgency}</p>}
              </div>

              {/* ETA */}
              <div>
                <label className="block font-['REM:Medium',_sans-serif] font-medium text-[#ffffff] text-[14px] mb-2">
                  Estimated Time (minutes) *
                </label>
                <Input
                  type="number"
                  value={packData.etaMin}
                  onChange={(e) => setPackData(prev => ({ ...prev, etaMin: parseInt(e.target.value) || 1 }))}
                  min={1}
                  max={60}
                  className="bg-[#131314] border-[#2a2b2c] text-[#ffffff]"
                />
                {errors.etaMin && <p className="text-[#FF6265] text-[12px] mt-1">{errors.etaMin}</p>}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-[#1e1f20] rounded-[20px] p-6">
              <h3 className="font-['REM:SemiBold',_sans-serif] font-semibold text-[#ffffff] text-[18px] mb-4">Preview</h3>
              <PreviewCard packData={packData} />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-[#1e1f20] rounded-[20px] p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-['REM:SemiBold',_sans-serif] font-semibold text-[#ffffff] text-[18px]">Steps</h3>
                <Button
                  onClick={addStep}
                  className="bg-[#131314] hover:bg-[#2a2b2c] text-[#ffffff] p-2 h-auto"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {errors.steps && <p className="text-[#FF6265] text-[12px]">{errors.steps}</p>}

              <div className="space-y-4">
                {packData.steps.map((step, index) => (
                  <div key={index} className="bg-[#131314] rounded-[12px] p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-['REM:Medium',_sans-serif] font-medium text-[#ffffff] text-[14px]">
                        Step {index + 1}
                      </span>
                      {packData.steps.length > 1 && (
                        <Button
                          onClick={() => removeStep(index)}
                          className="bg-transparent hover:bg-[#2a2b2c] text-[#8f8f8f] p-1 h-auto"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div>
                      <label className="block font-['REM:Medium',_sans-serif] font-medium text-[#ffffff] text-[14px] mb-2">
                        Title * ({step.title.length}/40)
                      </label>
                      <Input
                        value={step.title}
                        onChange={(e) => updateStep(index, 'title', e.target.value)}
                        placeholder="Step title"
                        className="bg-[#1e1f20] border-[#2a2b2c] text-[#ffffff]"
                        maxLength={40}
                      />
                      {errors[`step${index}Title`] && (
                        <p className="text-[#FF6265] text-[12px] mt-1">{errors[`step${index}Title`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-['REM:Medium',_sans-serif] font-medium text-[#ffffff] text-[14px] mb-2">
                        Description * ({step.desc.length}/140)
                      </label>
                      <Textarea
                        value={step.desc}
                        onChange={(e) => updateStep(index, 'desc', e.target.value)}
                        placeholder="Step description"
                        className="bg-[#1e1f20] border-[#2a2b2c] text-[#ffffff] resize-none h-auto min-h-[60px] break-words"
                        maxLength={140}
                        rows={2}
                        style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                      />
                      {errors[`step${index}Desc`] && (
                        <p className="text-[#FF6265] text-[12px] mt-1">{errors[`step${index}Desc`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-['REM:Medium',_sans-serif] font-medium text-[#ffffff] text-[14px] mb-2">
                        Timer (optional, seconds)
                      </label>
                      <Input
                        type="number"
                        value={step.timerSec || ""}
                        onChange={(e) => updateStep(index, 'timerSec', parseInt(e.target.value) || undefined)}
                        placeholder="Timer duration in seconds"
                        className="bg-[#1e1f20] border-[#2a2b2c] text-[#ffffff]"
                        min={1}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-[#1e1f20] rounded-[20px] p-6 space-y-6">
              <h3 className="font-['REM:SemiBold',_sans-serif] font-semibold text-[#ffffff] text-[18px]">Review & Save</h3>
              
              <PreviewCard packData={packData} />

              <div className="space-y-3">
                <Button
                  onClick={handleSave}
                  className="w-full bg-[#34C759] hover:bg-[#34C759]/80 text-[#ffffff] rounded-[12px] h-11 font-['REM:SemiBold',_sans-serif] font-semibold"
                >
                  Save Pack
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleShare}
                    className="bg-[#131314] hover:bg-[#2a2b2c] text-[#ffffff] rounded-[12px] h-11 font-['REM:SemiBold',_sans-serif] font-semibold"
                  >
                    Export
                  </Button>
                  
                  <Button
                    onClick={handleQR}
                    className="bg-[#131314] hover:bg-[#2a2b2c] text-[#ffffff] rounded-[12px] h-11 font-['REM:SemiBold',_sans-serif] font-semibold"
                  >
                    QR Code
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
        
        {/* Bottom Navigation */}
        <div className="shrink-0 p-4 border-t border-[#2a2b2c] bg-[#131314]">
          <div className="flex justify-between">
            <Button
              onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onNavigate("home")}
              className="bg-[#2a2b2c] hover:bg-[#3a3b3c] text-[#ffffff] px-6 py-2 rounded-[12px] font-['REM:Medium',_sans-serif] font-medium"
            >
              {currentStep === 1 ? "Cancel" : "Back"}
            </Button>
            
            {currentStep < 3 && (
              <Button
                onClick={handleNext}
                className="bg-[#0A84FF] hover:bg-[#0A84FF]/80 text-[#ffffff] px-6 py-2 rounded-[12px] font-['REM:Medium',_sans-serif] font-medium"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQRModal && (
        <QRModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          qrTiles={qrTiles}
        />
      )}

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}