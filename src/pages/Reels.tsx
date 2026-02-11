import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useReels } from "@/hooks/reels/useGetReels";
import ReelCard from "@/components/ui/ReelCard";

const ReelsList = () => {
  const navigate = useNavigate();
  const { data: reelsData } = useReels(20, 0);

  const reels = reelsData?.reels || [];

  return (
    <div className="fixed inset-0 bg-black pb-16">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 text-white"
      >
        <ChevronLeft size={32} />
      </button>

      <div className="h-full w-full overflow-y-scroll max-w-2xl mx-auto snap-y snap-mandatory pb-16">
        {reels.map((reel, index) => (
          <ReelCard key={reel._id} reel={reel} index={index} />
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default ReelsList;
