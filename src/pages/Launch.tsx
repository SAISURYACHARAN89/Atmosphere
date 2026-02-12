import { useState, useEffect } from "react";
import { ChevronDown, Code, TrendingUp, Filter, ChevronRight, Flame, Heart } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHottestStartups } from "@/hooks/misc/useHottestStartups";
import { ZStartup, ZTopStartup } from "@/types/startups";
import { HottestStartupsSkeleton } from "@/components/ui/skeleton";

type FilterDay = "today" | "Last 7 days" ;

const industryTags = [
  "AI", "ML", "Fintech", "HealthTech", "EV", "SaaS", 
  "E-commerce", "EdTech", "AgriTech", "Blockchain", "IoT", "CleanTech",
  "FoodTech", "PropTech", "InsurTech", "LegalTech", "MarTech", "RetailTech",
  "TravelTech", "Logistics", "Cybersecurity", "Gaming", "Media", "SpaceTech"
];

export const colors = [
  "bg-gradient-to-br from-yellow-400 to-orange-500",
  "bg-gradient-to-br from-gray-300 to-gray-500",
  "bg-gradient-to-br from-orange-300 to-yellow-200",
];


const Launch = () => {
  const [filterDay, setFilterDay] = useState<FilterDay>("today");
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 2,
    minutes: 30,
    seconds: 45,
  });
  const [startupTypeFilters, setStartupTypeFilters] = useState<string[]>([]);
  const [startupIndustryFilters, setStartupIndustryFilters] = useState<
    string[]
  >([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const { startups: topStartups, isLoading: startupsLoading } =
    useHottestStartups(7, 7);

  useEffect(() => {
    if (filterDay === "today") {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } else if (prev.hours > 0) {
            return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
          }
          return prev;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [filterDay]);

  const toggleStartupType = (type: string) => {
    setStartupTypeFilters(prev =>
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // const toggleStartupIndustry = (industry: string) => {
  //   setStartupIndustryFilters(prev =>
  //     prev.includes(industry) 
  //       ? prev.filter(i => i !== industry)
  //       : [...prev, industry]
  //   );
  // };

  // const startupTypes = ["Revenue Generating", "Pre-seed", "Seed", "Series A", "Series B", "Series C"];
  // const startupMainFilters = ["AI", "ML", "SaaS", "Manufacturing", "SpaceTech", "Fintech", "HealthTech", "CleanTech"];


  // const filteredStartups = dummyStartups.filter(startup => {
  //   const typeMatch = startupTypeFilters.length === 0 || startupTypeFilters.includes(startup.type);
  //   const industryMatch = startupIndustryFilters.length === 0 || 
  //     startup.industries.some(ind => startupIndustryFilters.includes(ind));
  //   return typeMatch && industryMatch;
  // });

  if(startupsLoading){
    return (
      <div>
        <HottestStartupsSkeleton />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="pt-14 pb-16">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
              <Flame className="w-7 h-7 text-orange-500 animate-pulse" />
              Hottest Startups This Week
            </h2>
            <p className="text-muted-foreground text-sm">
              Discover the top 10 most liked companies in the past 7 days.
            </p>
          </div>

          {/* Podium for Top 3 */}
          <div className="flex items-end justify-center gap-6 mb-10">
            {/* 2nd Place */}
            <div className="flex flex-col items-center w-32">
              <div className={`w-20 h-20 rounded-xl shadow-lg flex items-center justify-center text-2xl font-bold border-4 text-white bg-gradient-to-br from-gray-300 to-gray-500`}>
                <img src={topStartups?.[1]?.profileImage} alt={topStartups?.[1]?.companyName} className="w-full h-full object-cover rounded-xl" />
              </div>
              <div className="bg-gray-300 w-16 h-8 rounded-b-xl flex items-center justify-center mt-[-8px]">
                <span className="font-semibold text-gray-700">2</span>
              </div>
              <div className="mt-2 text-center overflow-hidden">
                <div className="font-semibold text-base truncate">{topStartups?.[1]?.companyName}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">{topStartups?.[1]?.about}</div>
                <div className="flex items-center justify-center gap-1 text-xs mt-1">
                  <Heart className="w-4 h-4 text-pink-500" />
                  {topStartups?.[1]?.likesCount || 0}
                </div>
              </div>
            </div>
            {/* 1st Place */}
            <div className="flex flex-col items-center w-36">
              <div className={`w-24 h-24 rounded-2xl shadow-xl flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-orange-300 to-yellow-200 border-4 border-yellow-400`}>
                <img src={topStartups?.[0]?.profileImage} alt={topStartups?.[0]?.companyName} className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="bg-yellow-400 w-20 h-10 rounded-b-2xl flex items-center justify-center mt-[-10px]">
                <span className="font-bold text-yellow-900 text-lg">1</span>
              </div>
              <div className="mt-2 text-center">
                <div className="font-bold text-lg truncate">{topStartups?.[0]?.companyName}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">{topStartups?.[0]?.about}</div>
                <div className="flex items-center justify-center gap-1 text-xs mt-1">
                  <Heart className="w-4 h-4 text-pink-500" />
                  {topStartups?.[0]?.likesCount || 0}
                </div>
              </div>
            </div>
            {/* 3rd Place */}
            <div className="flex flex-col items-center w-32">
              <div className={`w-20 h-20 rounded-xl shadow-lg flex items-center justify-center text-2xl font-bold text-white border-4 bg-gradient-to-br from-yellow-400 to-orange-500`}>
              < img src={topStartups?.[2]?.profileImage} alt={topStartups?.[2]?.companyName} className="w-full h-full object-cover rounded-xl" />
              </div>
              <div className="bg-orange-300 w-16 h-8 rounded-b-xl flex items-center justify-center mt-[-8px]">
                <span className="font-semibold text-orange-700">3</span>
              </div>
              <div className="mt-2 text-center">
                <div className="font-semibold text-base truncate">{topStartups?.[2]?.companyName}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">{topStartups?.[2]?.about}</div>
                <div className="flex items-center justify-center gap-1 text-xs mt-1">
                  <Heart className="w-4 h-4 text-pink-500" />
                  {topStartups?.[2]?.likesCount || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Grid for 4th-10th */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {topStartups?.slice(3)?.map((startup:ZTopStartup) => (
              <div key={startup._id} className="bg-card border border-border rounded-xl shadow-sm p-4 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white ${startup?.color}`}>
                  {startup?.companyName?.slice(0, 2)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base truncate">{startup.companyName}</div>
                  <div className="text-xs text-muted-foreground truncate">{startup?.about}</div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <Heart className="w-4 h-4 text-pink-500" />
                    {startup?.likesCount || 0}
                  </div>
                </div>
                <Button size="sm" variant="outline" className="rounded-full px-3 py-1 flex items-center gap-1">
                  View
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Launch;
