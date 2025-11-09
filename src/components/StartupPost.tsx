import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Crown, MessageCircle, Bookmark, Share2, ShieldCheck } from "lucide-react";

interface StartupPostProps {
  company: {
    id: string;
    name: string;
    logo: string;
    tagline: string;
    preValuation: string;
    postValuation: string;
    fundsRaised: string;
    currentInvestors: string[];
    lookingToDilute: boolean;
    dilutionAmount?: string;
    fundingGoal?: string;
    images: string[];
    postedTime: string;
  };
}

const StartupPost = ({ company }: StartupPostProps) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [crowned, setCrowned] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(349);
  const [crowns, setCrowns] = useState(19);
  const [comments] = useState(32);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleCrown = () => {
    setCrowned(!crowned);
    setCrowns(crowned ? crowns - 1 : crowns + 1);
  };

  return (
    <Card className="overflow-hidden border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-card">
      {/* Image Carousel - First for visual impact */}
      <div className="relative bg-muted/30">
        <img
          src={company.images[currentImageIndex]}
          alt={`${company.name} ${currentImageIndex + 1}`}
          className="w-full aspect-[4/3] object-cover"
        />
        
        {/* Image Indicators */}
        {company.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {company.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "w-8 bg-white shadow-md"
                    : "w-2 bg-white/60 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Seeking Investment Badge */}
        {company.lookingToDilute && company.dilutionAmount && (
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
            Open to Investment
          </div>
        )}
      </div>

      {/* Header - Clickable */}
      <div 
        className="flex items-center gap-3 px-6 pt-5 pb-3 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => navigate(`/company/${company.id}`, { state: { from: '/' } })}
      >
        <Avatar className="h-12 w-12 ring-2 ring-border">
          <AvatarImage src={company.logo} alt={company.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">{company.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base">{company.name}</h3>
            <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{company.postedTime}</p>
        </div>
      </div>

      {/* Company Details - Clickable */}
      <div 
        className="px-6 pb-4 space-y-4 cursor-pointer"
        onClick={() => navigate(`/company/${company.id}`, { state: { from: '/' } })}
      >
        <p className="text-sm leading-relaxed text-foreground/90">{company.tagline}</p>
        
        {/* Financial Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Pre-Valuation</p>
            <p className="font-bold text-base text-foreground">{company.preValuation}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Post-Valuation</p>
            <p className="font-bold text-base text-foreground">{company.postValuation}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Funds Raised</p>
            <p className="font-bold text-base text-primary">{company.fundsRaised}</p>
          </div>
          {company.fundingGoal && (
            <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Funding Goal</p>
              <p className="font-bold text-base text-foreground">{company.fundingGoal}</p>
            </div>
          )}
        </div>

        {/* Investors Section */}
        <div className="bg-accent/5 rounded-lg p-3 border border-accent/20">
          <p className="text-xs text-muted-foreground mb-1.5 font-medium">Current Investors</p>
          <p className="text-sm text-foreground font-medium">{company.currentInvestors.join(" • ")}</p>
        </div>

        {/* Investment Opportunity */}
        {company.lookingToDilute && company.dilutionAmount && (
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20">
            <p className="text-xs text-muted-foreground mb-1 font-medium">Investment Opportunity</p>
            <p className="font-bold text-sm text-primary">{company.dilutionAmount}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-5 space-y-3 border-t border-border/50 pt-4">
        <div className="flex items-center gap-5">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent group"
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          >
            <Heart
              className={`h-7 w-7 transition-all ${
                liked ? "fill-accent text-accent scale-110" : "text-foreground group-hover:text-accent group-hover:scale-110"
              }`}
            />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent group"
            onClick={(e) => {
              e.stopPropagation();
              handleCrown();
            }}
          >
            <Crown
              className={`h-7 w-7 transition-all ${
                crowned ? "fill-yellow-500 text-yellow-500 scale-110" : "text-foreground group-hover:text-yellow-500 group-hover:scale-110"
              }`}
            />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent group"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle className="h-7 w-7 text-foreground group-hover:text-primary group-hover:scale-110 transition-all" />
          </Button>

          <div className="flex-1" />

          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent group"
            onClick={(e) => {
              e.stopPropagation();
              setSaved(!saved);
            }}
          >
            <Bookmark
              className={`h-7 w-7 transition-all ${
                saved ? "fill-foreground scale-110" : "text-foreground group-hover:scale-110"
              }`}
            />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent group"
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 className="h-7 w-7 text-foreground group-hover:text-primary group-hover:scale-110 transition-all" />
          </Button>
        </div>

        {/* Counts */}
        <div className="flex items-center gap-6 text-sm">
          <span className="font-bold text-foreground">{likes.toLocaleString()} <span className="font-normal text-muted-foreground">likes</span></span>
          <span className="font-bold text-yellow-600">{crowns} <span className="font-normal text-muted-foreground">crowns</span></span>
          <span className="font-medium text-muted-foreground">{comments} comments</span>
        </div>
      </div>
    </Card>
  );
};

export default StartupPost;
