import { useNavigate } from "react-router-dom";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Eye, Bookmark, Users, MapPin, TrendingUp, DollarSign, Target } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();

  // Mock investor data
  const investorData = {
    name: "John Anderson",
    username: "@johnanderson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    bio: "Angel investor | Early stage startup enthusiast | Focus on AI & SaaS",
    location: "San Francisco, CA",
    stats: {
      followers: 2847,
      following: 342,
      postsSaved: 156,
      profileViews: 1893
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      <main className="pt-14 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Professional Header Section */}
          <div className="bg-card border-b">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20 border-2 border-border">
                    <AvatarImage src={investorData.avatar} alt={investorData.name} />
                    <AvatarFallback className="text-xl bg-muted">
                      {investorData.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h1 className="text-xl font-semibold text-foreground mb-1">
                      {investorData.name}
                    </h1>
                    <p className="text-sm text-muted-foreground mb-2">
                      {investorData.username}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {investorData.location}
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {/* Navigate to settings */}}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>

              <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                {investorData.bio}
              </p>

              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 border-t">
              <button className="p-4 text-center hover:bg-muted/50 transition-colors">
                <p className="text-lg font-semibold text-foreground">
                  {formatNumber(investorData.stats.followers)}
                </p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </button>
              <button className="p-4 text-center hover:bg-muted/50 transition-colors border-l">
                <p className="text-lg font-semibold text-foreground">
                  {formatNumber(investorData.stats.following)}
                </p>
                <p className="text-xs text-muted-foreground">Following</p>
              </button>
              <button className="p-4 text-center hover:bg-muted/50 transition-colors border-l">
                <p className="text-lg font-semibold text-foreground">
                  {formatNumber(investorData.stats.postsSaved)}
                </p>
                <p className="text-xs text-muted-foreground">Saved</p>
              </button>
              <button className="p-4 text-center hover:bg-muted/50 transition-colors border-l">
                <p className="text-lg font-semibold text-foreground">
                  {formatNumber(investorData.stats.profileViews)}
                </p>
                <p className="text-xs text-muted-foreground">Views</p>
              </button>
            </div>
          </div>

          {/* Tabbed Content Section */}
          <div className="mt-6">
            <Tabs defaultValue="insights" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-6">
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="criteria">Criteria</TabsTrigger>
              </TabsList>

              {/* Insights Tab */}
              <TabsContent value="insights" className="space-y-4 px-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Activity Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Profile Reach</span>
                      <span className="text-sm font-semibold text-foreground">
                        {formatNumber(investorData.stats.profileViews)} views
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Engagement Rate</span>
                      <span className="text-sm font-semibold text-foreground">8.4%</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Saved Opportunities</span>
                      <span className="text-sm font-semibold text-foreground">
                        {investorData.stats.postsSaved} startups
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Eye className="h-4 w-4 text-primary" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <p className="text-foreground font-medium">Viewed 12 startup profiles</p>
                        <p className="text-xs text-muted-foreground">Last 7 days</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-foreground font-medium">Saved 5 opportunities</p>
                        <p className="text-xs text-muted-foreground">Last 7 days</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-foreground font-medium">Connected with 8 founders</p>
                        <p className="text-xs text-muted-foreground">Last 30 days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Portfolio Tab */}
              <TabsContent value="portfolio" className="space-y-4 px-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bookmark className="h-4 w-4 text-primary" />
                      Investment Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Total Investments</span>
                      <span className="text-sm font-semibold text-foreground">23</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Active Startups</span>
                      <span className="text-sm font-semibold text-foreground">19</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Success Rate</span>
                      <span className="text-sm font-semibold text-green-600">82%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Top Performing Sectors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {["AI & ML", "SaaS", "FinTech"].map((sector, idx) => (
                        <div key={sector} className="flex justify-between items-center">
                          <span className="text-sm text-foreground">{sector}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full" 
                                style={{ width: `${[85, 72, 68][idx]}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-8">
                              {[85, 72, 68][idx]}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Criteria Tab */}
              <TabsContent value="criteria" className="space-y-4 px-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      Investment Criteria
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">
                        Preferred Industries
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["AI & ML", "SaaS", "FinTech", "HealthTech"].map(tag => (
                          <span 
                            key={tag}
                            className="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-md font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-sm font-medium text-foreground mb-1">Stage Preference</p>
                      <p className="text-sm text-muted-foreground">Pre-seed, Seed, Series A</p>
                    </div>

                    <div className="pt-2">
                      <p className="text-sm font-medium text-foreground mb-1">Geographic Focus</p>
                      <p className="text-sm text-muted-foreground">North America, Europe</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Investment Range
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Typical Check Size</span>
                      <span className="text-sm font-semibold text-foreground">$50K - $500K</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t">
                      <span className="text-sm text-muted-foreground">Sweet Spot</span>
                      <span className="text-sm font-semibold text-foreground">$150K - $250K</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
