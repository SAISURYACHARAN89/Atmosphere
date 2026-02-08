import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { verifyEmail } from "@/lib/api/auth";

const SignupConfirm = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!code) {
      toast({
        title: "Missing Code",
        description: "Please enter the confirmation code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const authInfo = localStorage.getItem("authInfo");
    const parsedAuthInfo = JSON.parse(authInfo || "{}");

    const { id: userId, email, username } = parsedAuthInfo;

    if (!userId || !username || !email) {
      toast({
        title: "Error",
        description: "Signup session expired. Please start again.",
        variant: "destructive",
      });
      navigate("/signup");
      return;
    }

   try {
    setLoading(true);

    const res = await verifyEmail(code, email);

    if (!res?.success) {
      throw new Error(
        res?.error || "Failed to verify code."
      );
    }

    toast({
      title: "Success",
      description: "Account created successfully!",
    });

    localStorage.setItem("newAccount", "true");
    // navigate("/profile");
  } catch (error) {
    toast({
      title: "Error",
      description:
        error instanceof Error
          ? error.message
          : "Failed to verify code.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Enter confirmation code
          </h2>
          <p className="text-sm text-muted-foreground">
            We've sent a code to your email
          </p>
        </div>

        <Input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-12 text-center text-lg tracking-widest"
          maxLength={6}
        />

        <Button 
          onClick={handleConfirm} 
          className="w-full h-12"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm"}
        </Button>
      </div>
    </div>
  );
};

export default SignupConfirm;