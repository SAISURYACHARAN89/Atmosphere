import { useState } from "react";
import PortfolioHeader from "@/components/Ph2";
import ExpandableSection from "@/components/ExpandableSection";
import CompanyProfileSection from "@/components/CompanyProfileSection";
import FinancialProfileSection from "@/components/FinancialProfileSection";
import RaiseRoundSection from "@/components/RaiseRoundSection";
import CompanySummaryCard from "@/components/CompanySummaryCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader, Loader2, Upload } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useSaveStartupProfile } from "@/hooks/portfolio/useSavePortfolioDetails";
import { useGetStartupProfile } from "@/hooks/portfolio/useGetStartupProfile";
import { toast } from "sonner";

const Index = () => {
  const user= useAppStore(s=>s.user);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);
  // const { data:startupProfileData}= useGetStartupProfile(user?._id);
  const { mutate: saveProfile, isPending } = useSaveStartupProfile();

  const [form, setForm] = useState({
    companyProfile: "",
    about: "",
    location: "",
    companyType: "",
    selectedIndustries: [] as string[],
    establishedOn: "",
    website: "",
    teamMembers: [{ id: 1, username: "", role: "", userId: "" }],
  });

  const handleFormChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  console.log(form)

  const handleToggle = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sendForVerification = async () => {
  if (!consentGiven) {
    toast.error("Consent required");
    return;
  }

  try {
    const payload = {
      companyName: form.companyProfile,
      about: form.about,
      location: form.location,
      companyType: form.companyType,
      industries: form.selectedIndustries,
      website: form.website,
      establishedOn: form.establishedOn,

      teamMembers: form.teamMembers.map((m) => ({
        name: m.username,
        username: m.username,
        role: m.role,
        userId: m.userId,
      })),

      fundingRounds: [],
      financialProfile: {},

      roundType: form.roundType,
      stage: form.roundType,
      requiredCapital: form.requiredCapital,
    };

    await saveProfile(payload);

    alert("Sent for verification");
  } catch (error: any) {
    alert(error?.message || "Failed to submit");
  }
};


  return (
    <div className="min-h-screen bg-background text-foreground">
      <PortfolioHeader />
      
      {/* <CompanySummaryCard /> */}
      
      <main className="max-w-2xl mx-auto">
        <ExpandableSection 
          title="Company profile"
          isExpanded={expandedSection === "company"}
          onToggle={() => handleToggle("company")}
        >
          <CompanyProfileSection formData={form} handleFormChange={handleFormChange} />
        </ExpandableSection>

        <ExpandableSection 
          title="Financial profile"
          isExpanded={expandedSection === "financial"}
          onToggle={() => handleToggle("financial")}
        >
          <FinancialProfileSection formData={form} handleFormChange={handleFormChange} />
        </ExpandableSection>

        <ExpandableSection 
          title="Raise a round"
          isExpanded={expandedSection === "raise"}
          onToggle={() => handleToggle("raise")}
        >
          <RaiseRoundSection />
        </ExpandableSection>

        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 border border-border rounded-md">
              <Checkbox 
                id="consent" 
                checked={consentGiven}
                onCheckedChange={(checked) => setConsentGiven(checked === true)}
                className="mt-1 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <label 
                htmlFor="consent" 
                className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
              >
                I hereby consent to the collection, processing, and verification of the information and documents provided. I understand that all submitted materials will be reviewed for accuracy and compliance purposes.
              </label>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-muted-foreground text-center">
                Upload any supporting documents
              </p>
              <Button 
                variant="outline" 
                className="w-full border-border hover:bg-accent disabled:opacity-50"
                disabled={!consentGiven}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
          
          <Button 
            variant="secondary"
            className="w-full"
            disabled={!consentGiven}
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : "Send for Verification"}
          </Button>
          
          <p className="text-sm text-muted-foreground text-center">
            All submitted documents will be reviewed and updated automatically.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;