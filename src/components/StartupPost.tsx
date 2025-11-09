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
    revenueGenerating: boolean;
    fundsRaised: string;
    currentInvestors: string[];
    lookingToDilute: boolean;
    dilutionAmount?: string;
    images: string[];
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
    <Card className="overflow-hidden border-border/50 bg-card shadow-sm">
      {/* Header - Clickable */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => navigate(`/company/${company.id}`, { state: { from: '/' } })}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-border/50">
            <AvatarImage src={company.logo} alt={company.name} />
            <AvatarFallback className="bg-muted text-foreground">{company.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-base">{company.name}</h3>
              <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                company.revenueGenerating 
                  ? 'bg-success/10 text-success' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {company.revenueGenerating ? 'Revenue Generating' : 'Pre-Revenue'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Carousel */}
      <div className="relative bg-muted">
        <img
          src={company.images[currentImageIndex]}
          alt={`${company.name} ${currentImageIndex + 1}`}
          className="w-full aspect-[4/3] object-cover"
        />
        
        {/* Seeking Investment Badge */}
        {company.lookingToDilute && company.dilutionAmount && (
          <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
            Seeking: {company.dilutionAmount}
          </div>
        )}
        
        {/* Image Indicators */}
        {company.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {company.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Company Info */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Funds Raised</span>
            <p className="font-semibold text-sm">{company.fundsRaised}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Investors</span>
            <p className="font-semibold text-sm">{company.currentInvestors.length}</p>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Current Investors</span>
          <p className="text-sm">{company.currentInvestors.join(", ")}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 pt-0">
        <div className="flex items-center gap-4 pt-3 border-t border-border/50">
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
              className={`h-5 w-5 transition-colors ${
                liked ? "fill-accent text-accent" : "text-foreground group-hover:text-accent"
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
              className={`h-5 w-5 transition-colors ${
                crowned ? "fill-primary text-primary" : "text-foreground group-hover:text-primary"
              }`}
            />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent group"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle className="h-5 w-5 text-foreground group-hover:text-accent transition-colors" />
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
              className={`h-5 w-5 transition-colors ${
                saved ? "fill-foreground" : "text-foreground group-hover:fill-muted-foreground"
              }`}
            />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent group"
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 className="h-5 w-5 text-foreground group-hover:text-accent transition-colors" />
          </Button>
        </div>

        {/* Counts */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
          <span>{likes} likes</span>
          <span>{crowns} crowns</span>
          <span>{comments} comments</span>
        </div>
      </div>
    </Card>
  );
};

export default StartupPost;
