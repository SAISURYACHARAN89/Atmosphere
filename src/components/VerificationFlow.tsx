import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { CheckCircle2, FileText, Camera, User } from "lucide-react";
import { toast } from "sonner";

interface VerificationFlowProps {
  type: "kyc" | "portfolio" | "company";
  onComplete: () => void;
}

export const VerificationFlow = ({ type, onComplete }: VerificationFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const getStepContent = () => {
    if (type === "kyc") {
      switch (currentStep) {
        case 1:
          return {
            icon: FileText,
            title: "First, let's get to know you",
            description: "Please prepare one of the following documents\nPassport | ID | Resident Card",
            buttonText: "Choose document",
            note: "Most people finish this step under 3 minutes"
          };
        case 2:
          return {
            icon: Camera,
            title: "Upload your ID's back side",
            description: "The card you have sent us has basic, essential information on it's back side.\n\nPlease flip the card and take a photo.",
            buttonText: "Take Photo"
          };
        case 3:
          return {
            icon: User,
            title: "Take a selfie",
            description: "The image should be clear and have your face fully inside the frame.",
            buttonText: "Take a Selfie"
          };
        default:
          return null;
      }
    } else {
      // Portfolio or Company verification
      switch (currentStep) {
        case 1:
          return {
            icon: FileText,
            title: type === "portfolio" ? "Portfolio Verification" : "Company Verification",
            description: type === "portfolio" 
              ? "Please prepare documents showing your investment history"
              : "Please prepare your company incorporation documents",
            buttonText: "Choose document",
            note: "This verification helps establish credibility"
          };
        case 2:
          return {
            icon: FileText,
            title: "Additional Documents",
            description: type === "portfolio"
              ? "Upload proof of previous investments or portfolio statements"
              : "Upload additional company documents or funding proof",
            buttonText: "Upload Documents"
          };
        case 3:
          return {
            icon: CheckCircle2,
            title: "Review & Submit",
            description: "Please review your information and submit for verification.",
            buttonText: "Submit for Review"
          };
        default:
          return null;
      }
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.success("Verification submitted successfully");
      onComplete();
    }
  };

  const stepContent = getStepContent();
  if (!stepContent) return null;

  const Icon = stepContent.icon;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-8 bg-card border-border">
        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Identity doc</span>
            <span className={currentStep >= 2 ? "text-foreground" : ""}>
              {type === "kyc" ? "ID back" : "Documents"}
            </span>
            <span className={currentStep >= 3 ? "text-foreground" : ""}>
              {type === "kyc" ? "Selfie" : "Submit"}
            </span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-2xl border-2 border-primary/20 bg-muted/30 flex items-center justify-center">
            <Icon className="h-16 w-16 text-primary" strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">{stepContent.title}</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {stepContent.description}
          </p>
          {stepContent.note && (
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
              <span className="w-4 h-4 rounded-full border border-muted-foreground flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
              </span>
              {stepContent.note}
            </p>
          )}
        </div>

        {/* Action Button */}
        <Button 
          onClick={handleNext}
          className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90"
        >
          {stepContent.buttonText}
        </Button>
      </Card>
    </div>
  );
};
