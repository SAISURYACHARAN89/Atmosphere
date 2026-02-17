import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ZCompanyProfileForm } from "@/types/portfolio";

interface Round {
  id: number;
  amount: string;
  investor: string;
}

interface Props {
  formData: ZCompanyProfileForm;
  handleFormChange: (key: string, value: unknown) => void;
}

const FinancialProfileSection = ({
  formData,
  handleFormChange,
}: Props) => {
  const { toast } = useToast();

  const addRound = () => {
    const newRoundId = formData?.fundingRounds?.length + 1 || 1;

    handleFormChange("fundingRounds", [
      ...(formData?.fundingRounds || []),
      { id: newRoundId, amount: "", investor: "" },
    ]);
  };

  const removeRound = (id: number) => {
    if (formData?.fundingRounds?.length <= 1) return;

    handleFormChange(
      "fundingRounds",
      formData?.fundingRounds?.filter((r) => r.id !== id)
    );
  };

  const updateRound = (
    id: number,
    field: "amount" | "investor",
    value: string
  ) => {
    handleFormChange(
      "fundingRounds",
      formData?.fundingRounds?.map((round) =>
        round.id === id ? { ...round, [field]: value } : round
      )
    );
  };

  const handleSave = () => {
    toast({
      title: "Financials saved",
      description: "Financial profile saved successfully.",
    });
  };

  return (
    <div className="space-y-4">
      {/* Revenue */}
      <div>
        <label className="block text-xs text-muted-foreground mb-2">
          Revenue
        </label>
        <Select
          value={formData.revenueType}
          onValueChange={(val) =>
            handleFormChange("revenueType", val)
          }
        >
          <SelectTrigger className="bg-input border-border">
            <SelectValue placeholder="Select revenue type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pre-revenue">
              Pre-revenue
            </SelectItem>
            <SelectItem value="revenue-generating">
              Revenue generating
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Funding Type */}
      <div className="flex gap-3">
        <Button
          variant={
            formData.fundingMethod === "bootstrapped"
              ? "secondary"
              : "outline"
          }
          className="flex-1 border-border"
          onClick={() =>
            handleFormChange("fundingMethod", "bootstrapped")
          }
        >
          Bootstrapped
        </Button>

        <Button
          variant={
            formData.fundingMethod === "capital-raised"
              ? "secondary"
              : "outline"
          }
          className="flex-1 border-border"
          onClick={() =>
            handleFormChange("fundingMethod", "capital-raised")
          }
        >
          Capital raised
        </Button>
      </div>

      {/* Rounds */}
      {formData.fundingMethod === "capital-raised" && (
        <div className="space-y-4">
          {formData?.fundingRounds?.map((round) => (
            <div key={round.id} className="space-y-3 pb-4">
              <div className="flex justify-between">
                <label className="text-sm font-medium">
                  Round {round.id}
                </label>

                {formData?.fundingRounds?.length > 1 && (
                  <button
                    onClick={() => removeRound(round.id)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center border border-border rounded-md bg-input">
                <span className="px-3 text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  value={round.amount}
                  onChange={(e) =>
                    updateRound(
                      round.id,
                      "amount",
                      e.target.value
                    )
                  }
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0"
                />
                <span className="px-3 text-muted-foreground">
                  USD
                </span>
              </div>

              <Input
                placeholder="Investor name"
                value={round.investor}
                onChange={(e) =>
                  updateRound(
                    round.id,
                    "investor",
                    e.target.value
                  )
                }
                className="bg-input border-border"
              />
            </div>
          ))}

          <Button
            onClick={addRound}
            variant="outline"
            className="w-full border-border"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Round
          </Button>
        </div>
      )}

      <Button
        onClick={handleSave}
        variant="secondary"
        className="w-full"
      >
        Save Financials
      </Button>
    </div>
  );
};

export default FinancialProfileSection;
