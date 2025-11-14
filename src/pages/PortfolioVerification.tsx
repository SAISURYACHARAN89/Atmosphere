import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, Plus, Upload, Clock } from "lucide-react";
import { toast } from "sonner";

const PortfolioVerification = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<"list" | "form" | "upload">("list");
  const [investmentData, setInvestmentData] = useState({
    companyName: "",
    investmentPercentage: "",
    investmentAmount: "",
    investmentDate: ""
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Dummy portfolio data
  const dummyInvestments = [
    { company: "TechStart Inc.", percentage: "15%", amount: "$50,000", date: "Jan 15, 2024" },
    { company: "GreenEnergy Co.", percentage: "8%", amount: "$30,000", date: "Feb 22, 2024" },
    { company: "HealthTech Labs", percentage: "12%", amount: "$45,000", date: "Mar 10, 2024" }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleFormSubmit = () => {
    setView("upload");
  };

  const handleFinalSubmit = () => {
    toast.success("Investment submitted for verification");
    setView("list");
    setInvestmentData({
      companyName: "",
      investmentPercentage: "",
      investmentAmount: "",
      investmentDate: ""
    });
    setSelectedFiles([]);
  };

  const handleBack = () => {
    if (view === "upload") {
      setView("form");
    } else if (view === "form") {
      setView("list");
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
            <h1 className="text-base font-semibold text-foreground">
              {view === "list" ? "My Portfolio" : view === "form" ? "Investment Details" : "Upload Documents"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {view === "list" ? "Verified investments" : view === "form" ? "Add investment information" : "Upload proof of investment"}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {view === "list" && (
          <div className="space-y-4">
            <div className="space-y-3">
              {dummyInvestments.map((investment, index) => (
                <div key={index} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground">{investment.company}</h3>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span>{investment.percentage}</span>
                        <span>•</span>
                        <span>{investment.amount}</span>
                      </div>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-foreground flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <span className="px-2 py-0.5 bg-muted rounded text-foreground">Verified</span>
                    <span>•</span>
                    <span>{investment.date}</span>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setView("form")}
              variant="outline"
              className="w-full h-11 text-sm font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to My Portfolio
            </Button>
          </div>
        )}

        {view === "form" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-medium">
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  value={investmentData.companyName}
                  onChange={(e) => setInvestmentData({ ...investmentData, companyName: e.target.value })}
                  placeholder="Enter company name"
                  className="h-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="investmentPercentage" className="text-sm font-medium">
                    Ownership %
                  </Label>
                  <Input
                    id="investmentPercentage"
                    value={investmentData.investmentPercentage}
                    onChange={(e) => setInvestmentData({ ...investmentData, investmentPercentage: e.target.value })}
                    placeholder="e.g., 15%"
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investmentAmount" className="text-sm font-medium">
                    Amount
                  </Label>
                  <Input
                    id="investmentAmount"
                    value={investmentData.investmentAmount}
                    onChange={(e) => setInvestmentData({ ...investmentData, investmentAmount: e.target.value })}
                    placeholder="e.g., $50,000"
                    className="h-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="investmentDate" className="text-sm font-medium">
                  Investment Date
                </Label>
                <Input
                  id="investmentDate"
                  type="date"
                  value={investmentData.investmentDate}
                  onChange={(e) => setInvestmentData({ ...investmentData, investmentDate: e.target.value })}
                  className="h-10"
                />
              </div>
            </div>

            <Button
              onClick={handleFormSubmit}
              size="lg"
              className="w-full h-11 text-sm font-medium"
            >
              Continue to Upload Documents
            </Button>
          </div>
        )}

        {view === "upload" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                <Upload className="h-8 w-8 text-foreground" strokeWidth={1.5} />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Upload Documents</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Upload proof of investment for {investmentData.companyName || "this company"}
              </p>
            </div>

            <div className="space-y-3">
              <div className="border border-dashed border-border rounded-lg p-8 text-center hover:border-foreground/50 transition-colors cursor-pointer">
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  id="portfolio-upload"
                />
                <label htmlFor="portfolio-upload" className="cursor-pointer block">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-sm font-medium text-foreground mb-1">
                    {selectedFiles.length > 0
                      ? `${selectedFiles.length} file(s) selected`
                      : "Choose investment documents"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Term sheets, agreements, bank statements (PDF, JPG, PNG)
                  </p>
                </label>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
                <Clock className="h-5 w-5 text-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Manual Verification</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Documents will be verified within 6 hours. You'll be notified once the review is complete.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleFinalSubmit}
              size="lg"
              className="w-full h-11 text-sm font-medium"
            >
              Submit for Verification
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioVerification;
