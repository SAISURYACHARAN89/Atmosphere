import { useState } from "react";
import { Search as SearchIcon, X, Plus } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const categories = [
  "AI", "Manufacturing", "ML", "B2B", "SaaS", "Fintech", "HealthTech", 
  "EV", "D2C", "Robotics", "SpaceTech", "Angel Investor", "VC", 
  "Delhi", "Bangalore", "Mumbai", "EdTech", "CleanTech", "AgriTech",
  "E-commerce", "BlockChain", "IoT", "DeepTech", "Hyderabad", "Pune"
];

const investorData = [
  {
    id: 1,
    name: "Ankit Mehra",
    image: "/placeholder.svg",
    subtitle: "Invested in 8 startups",
    tags: ["AI", "SaaS", "Fintech"]
  },
  {
    id: 2,
    name: "Priya Sharma",
    image: "/placeholder.svg",
    subtitle: "Angel Investor • Invested in 12 startups",
    tags: ["HealthTech", "EdTech", "B2B"]
  },
  {
    id: 3,
    name: "Rahul Verma",
    image: "/placeholder.svg",
    subtitle: "VC Partner • Invested in 15 startups",
    tags: ["Fintech", "EV", "Manufacturing"]
  },
  {
    id: 4,
    name: "Sneha Kapoor",
    image: "/placeholder.svg",
    subtitle: "Invested in 6 startups",
    tags: ["D2C", "E-commerce", "SaaS"]
  },
  {
    id: 5,
    name: "Vikram Singh",
    image: "/placeholder.svg",
    subtitle: "Angel Investor • Invested in 20 startups",
    tags: ["AI", "ML", "DeepTech"]
  },
  {
    id: 6,
    name: "Neha Gupta",
    image: "/placeholder.svg",
    subtitle: "Invested in 9 startups",
    tags: ["HealthTech", "Robotics", "IoT"]
  }
];

const startupData = [
  {
    id: 1,
    name: "SkyDrop",
    logo: "/placeholder.svg",
    tagline: "India's first drone delivery company",
    tags: ["Logistics", "DroneTech", "AI"]
  },
  {
    id: 2,
    name: "FinEase",
    logo: "/placeholder.svg",
    tagline: "Making credit accessible for all",
    tags: ["Fintech", "B2B", "SaaS"]
  },
  {
    id: 3,
    name: "HealthAI",
    logo: "/placeholder.svg",
    tagline: "AI-powered diagnostics platform",
    tags: ["HealthTech", "AI", "ML"]
  },
  {
    id: 4,
    name: "EduVerse",
    logo: "/placeholder.svg",
    tagline: "Personalized learning for every student",
    tags: ["EdTech", "SaaS", "B2C"]
  },
  {
    id: 5,
    name: "GreenCharge",
    logo: "/placeholder.svg",
    tagline: "Building EV charging infrastructure",
    tags: ["EV", "CleanTech", "Infrastructure"]
  },
  {
    id: 6,
    name: "FarmTech Solutions",
    logo: "/placeholder.svg",
    tagline: "Smart farming for modern agriculture",
    tags: ["AgriTech", "IoT", "B2B"]
  },
  {
    id: 7,
    name: "StyleBox",
    logo: "/placeholder.svg",
    tagline: "Curated fashion delivered monthly",
    tags: ["D2C", "E-commerce", "Fashion"]
  },
  {
    id: 8,
    name: "RoboAssist",
    logo: "/placeholder.svg",
    tagline: "Industrial automation made simple",
    tags: ["Robotics", "Manufacturing", "B2B"]
  }
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedCategories([]);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />
      
      <main className="pt-14 px-4 max-w-2xl mx-auto">
        {/* Search Bar */}
        <div className="mt-6 mb-6">
          <div className="relative">
            <div className="flex items-center gap-3 bg-white rounded-full px-4 py-3 shadow-sm border border-border">
              <SearchIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Search investors, startups, founders…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              />
              {(searchQuery || selectedCategories.length > 0) && (
                <button 
                  onClick={clearSearch}
                  className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Tags Box */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl border border-border p-4 shadow-sm max-h-48 overflow-auto">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                    selectedCategories.includes(category)
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-background text-foreground border-foreground hover:bg-muted'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results */}
        {(searchQuery || selectedCategories.length > 0) && (
          <div className="space-y-6">
            {/* Investors Section */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Investors</h2>
              <div className="space-y-3">
                {investorData.map((investor) => (
                  <div 
                    key={investor.id}
                    className="bg-white rounded-2xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-muted flex-shrink-0 overflow-hidden">
                        <img 
                          src={investor.image} 
                          alt={investor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1">{investor.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{investor.subtitle}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {investor.tags.map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="secondary"
                              className="text-xs px-2 py-0.5"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <button className="flex-shrink-0 w-8 h-8 rounded-full border border-foreground flex items-center justify-center hover:bg-muted transition-colors">
                        <Plus className="w-4 h-4 text-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Startups Section */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Startups</h2>
              <div className="space-y-3">
                {startupData.map((startup) => (
                  <div 
                    key={startup.id}
                    className="bg-white rounded-2xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                        <img 
                          src={startup.logo} 
                          alt={startup.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1">{startup.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{startup.tagline}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {startup.tags.map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="secondary"
                              className="text-xs px-2 py-0.5"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-shrink-0 h-8 px-3 text-xs"
                      >
                        Follow
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!searchQuery && selectedCategories.length === 0 && (
          <div className="text-center py-16">
            <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <p className="text-muted-foreground">
              Start typing or select categories to find investors and startups
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Search;
