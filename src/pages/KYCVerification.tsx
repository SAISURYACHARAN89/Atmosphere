import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FileText, Camera, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const KYCVerification = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  const totalSteps = 3;

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdDocument(e.target.files[0]);
    }
  };

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelfie(e.target.files[0]);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.success("KYC verification submitted successfully");
      navigate("/settings");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/settings");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-base font-semibold text-foreground">KYC Verification</h1>
            <p className="text-xs text-muted-foreground">Step {currentStep} of {totalSteps}</p>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4">
          <Progress value={(currentStep / totalSteps) * 100} className="h-1" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                <FileText className="h-8 w-8 text-foreground" strokeWidth={1.5} />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Upload ID Document</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Please upload a government-issued ID (passport, driver's license, or national ID card)
              </p>
            </div>

            <div className="space-y-3">
              <div className="border border-dashed border-border rounded-lg p-8 text-center hover:border-foreground/50 transition-colors cursor-pointer">
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleIdUpload}
                  className="hidden"
                  id="id-upload"
                />
                <label htmlFor="id-upload" className="cursor-pointer block">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-sm font-medium text-foreground mb-1">
                    {idDocument ? idDocument.name : "Choose file"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, or PDF (max 10MB)
                  </p>
                </label>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-xs font-medium text-foreground">Requirements:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Document must be valid and not expired</li>
                  <li>• All corners of the document must be visible</li>
                  <li>• Text must be clearly readable</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                <Camera className="h-8 w-8 text-foreground" strokeWidth={1.5} />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Take a Selfie</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Take a clear photo of yourself for identity verification
              </p>
            </div>

            <div className="space-y-3">
              <div className="border border-dashed border-border rounded-lg p-8 text-center hover:border-foreground/50 transition-colors cursor-pointer">
                <Input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleSelfieUpload}
                  className="hidden"
                  id="selfie-upload"
                />
                <label htmlFor="selfie-upload" className="cursor-pointer block">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-sm font-medium text-foreground mb-1">
                    {selfie ? selfie.name : "Take photo"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Use your device camera
                  </p>
                </label>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-xs font-medium text-foreground">Tips for a good selfie:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Face the camera directly</li>
                  <li>• Ensure good lighting</li>
                  <li>• Remove glasses and hats</li>
                  <li>• Keep a neutral expression</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-foreground" strokeWidth={1.5} />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Review & Submit</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Please review your documents and submit for verification
              </p>
            </div>

            <div className="space-y-3">
              <div className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">ID Document</p>
                    <p className="text-xs text-muted-foreground">{idDocument?.name || "Not uploaded"}</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Selfie Photo</p>
                    <p className="text-xs text-muted-foreground">{selfie?.name || "Not uploaded"}</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-foreground" />
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground">
                  Your documents will be reviewed within 24-48 hours. You'll receive a notification once the verification is complete.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-8">
          <Button
            onClick={handleNext}
            size="lg"
            className="w-full h-11 text-sm font-medium"
          >
            {currentStep === totalSteps ? "Submit for Verification" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KYCVerification;
