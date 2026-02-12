// Opportunities.tsx
import React, { useState } from "react";
import {
  Filter,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Users,
  ChevronDown,
  X,
  Briefcase,
  Mail,
  Plus,
  Loader2,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetGrants } from "@/hooks/misc/useGetGrants";
import { formatDate, getTimeAgo } from "@/utils/misc";
import { useGetEvents } from "@/hooks/misc/useGetEvents";
import { useGetJobs } from "@/hooks/jobs/useGetJobs";
import { ZCreateJobPayload, ZEvent, ZJob } from "@/types/misc";
import { useCreateJob } from "@/hooks/jobs/useCreateJob";
import { toast } from "sonner";

interface Grant {
  id: string;
  name: string;
  organization: string;
  sector: string;
  location: string;
  amount: string;
  deadline: string;
  type: "grant" | "incubator" | "accelerator";
  description: string;
  url: string;
}

interface Event {
  id: string;
  name: string;
  organizer: string;
  sector: string;
  location: string;
  date: string;
  type:
  | "physical"
  | "virtual"
  | "hybrid"
  | "e-summit"
  | "conference"
  | "workshop"
  | "networking";
  description: string;
  attendees: string;
  url: string;
}

interface StartupRolePosting {
  id: string;
  startupName: string;
  startupLogo?: string;
  roleTitle: string;
  sector: string;
  location: string;
  companyType: string;
  isRemote: boolean;
  employmentType: "Full-time" | "Part-time";
  compensation: string;
  description: string;
  requirements: string;
  applicantsCount: number;
  customQuestions: string[];
}

const sectors = [
  "Verified Startup",

];
const companytype = [
  "Artificial Intelligence",
  "Blockchain",
  "HealthTech",
  "FinTech",
  "EdTech",
  "AgriTech",
  "AI Research",
  "Retail",
  "Manufacturing",
  "AI Research",
]

const locations = [
  "All Locations",
  "USA",
  "UK",
  "Europe",
  "Asia",
  "Global",
  "Germany",
  "Singapore",
  "San Francisco, USA",
  "Online",
  "London",
  "Berlin, Germany",
  "Amsterdam, Netherlands",
  "Dubai, UAE",
  "Tokyo, Japan",
  "New York",
];

const grantTypes = ["all", "grant", "incubator", "accelerator"];
const eventTypes = [
  "all",
  "physical",
  "virtual",
  "hybrid",
  "e-summit",
  "conference",
  "workshop",
  "networking",
];
const remoteOptions = ["all", "remote", "on-site"];
const employmentOptions = ["all", "Full-time", "Part-time"];

/* ---------------------------
   Helper functions
   --------------------------- */
const getGrantTypeBadge = (type: string) => {
  switch (type) {
    case "grant":
      return "default";
    case "incubator":
      return "secondary";
    case "accelerator":
      return "outline";
    default:
      return "default";
  }
};

const getEventTypeBadge = (type: string) => {
  switch (type) {
    case "physical":
      return "default";
    case "virtual":
      return "secondary";
    case "hybrid":
      return "outline";
    default:
      return "default";
  }
};

/* ---------------------------
   RoleCard Component
   --------------------------- */
type RoleCardProps = {
  posting: ZJob;
  isMyAd?: boolean;
  expanded?: boolean;
  onExpand?: () => void;
};

const RoleCard: React.FC<RoleCardProps> = ({ posting, isMyAd = false, expanded = false, onExpand }) => {
  const [showApplyBox, setShowApplyBox] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [applied, setApplied] = useState(false);
  const [count, setCount] = useState(posting?.applicantCount || 0);
  const [questionAnswers, setQuestionAnswers] = useState<string[]>(
    posting?.customQuestions?.map(() => "") || []
  );

  const handleSubmit = () => {
    const hasQuestions = posting.customQuestions.some((q) => q.trim() !== "");
    const answered = questionAnswers.every((ans, i) =>
      posting.customQuestions[i] ? ans.trim() !== "" : true
    );

    if (hasQuestions && !answered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setApplied(true);
    setCount((prev) => prev + 1);
  };

  const tags = posting.requirements.split(",").map((s) => s.trim());

  return (
    <div className="bg-background border border-border rounded-xl p-4 hover:border-primary/50 transition-all">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm text-foreground truncate">{posting.startupName}</p>
            {isMyAd && <Badge variant="secondary" className="text-[8px] px-1.5 py-0.5 flex-shrink-0">My Ad</Badge>}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{posting.sector}</p>
        </div>
      </div>

      {/* Role & Details */}
      <div className="mb-3 space-y-2">
        <p className="font-semibold text-sm text-foreground line-clamp-2">{posting.title}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{posting.locationType}</span>
          </div>
          <span className={posting.isRemote ? "text-primary" : ""}>{posting.isRemote ? "Remote" : "On-site"}</span>
        </div>
      </div>

      {/* Description with More/Less */}
      <div className="mb-3">
        <p className={`text-xs text-muted-foreground ${showFullDescription ? "" : "line-clamp-2"}`}>
          {posting.description}
        </p>
        {posting?.description?.length > 100 && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-xs text-primary hover:text-primary/80 mt-1 font-medium"
          >
            {showFullDescription ? "Less" : "More"}
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {tags.map((tag, idx) => (
          <Badge key={idx} variant="outline" className="text-[10px] px-2 py-0.5">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <button
          onClick={onExpand}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
          <span>{count} applicants</span>
        </button>
        <div className="text-xs font-medium text-foreground">
          {posting.employmentType} • {posting.isRemote ? "Remote" : "On-site"}
        </div>
      </div>

      {/* Expanded Section */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-border space-y-3">
          {!applied ? (
            <>
              {/* Questions */}
              <div className="space-y-3">
                {posting.customQuestions.map((q, i) => (
                  <div key={i} className="space-y-1.5">
                    <Label className="text-xs font-medium">{q}</Label>
                    <Textarea
                      value={questionAnswers[i]}
                      onChange={(e) => {
                        const updated = [...questionAnswers];
                        updated[i] = e.target.value;
                        setQuestionAnswers(updated);
                      }}
                      placeholder="Your answer..."
                      className="text-xs h-20 resize-none"
                    />
                  </div>
                ))}
              </div>

              {/* File Upload */}
              <div>
                <Label className="text-xs font-medium">Attach Resume (Optional)</Label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setUploadedFile(e.target.files?.[0] ?? null)}
                  className="text-xs w-full mt-1"
                />
                {uploadedFile && <p className="text-[10px] text-muted-foreground mt-1">{uploadedFile.name}</p>}
              </div>

              {/* Send Button */}
              <Button
                size="sm"
                onClick={handleSubmit}
                className="w-full h-8 text-xs"
              >
                Send Application
              </Button>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-green-600 font-medium">✓ Application Sent Successfully</p>
              <p className="text-[10px] text-muted-foreground mt-1">You can track your application in My Jobs</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export const initialJobPosting = {
  startupName: "",
  roleTitle: "",
  sector: "Artificial Intelligence",
  location: "",
  isRemote: false,
  employmentType: "Full-time" as "Full-time" | "Part-time",
  compensation: "",
  description: "",
  requirements: "",
  customQuestions: ["", "", ""],
};

/* ---------------------------
   Main Opportunities component
   --------------------------- */
const Opportunities: React.FC = () => {
  const [grantSector, setGrantSector] = useState<string>("All Sectors");
  const [grantType, setGrantType] = useState<string>("all");
  const [eventSector, setEventSector] = useState<string>("All Sectors");
  const [eventType, setEventType] = useState<string>("all");
  const [eventLocation, setEventLocation] = useState<string>("All Locations");
  const [teamSector, setTeamSector] = useState<string>("All Sectors");
  const [teamLocation, setTeamLocation] = useState<string>("All Locations");
  const [teamRemote, setTeamRemote] = useState<string>("all");
  const [teamEmploymentType, setTeamEmploymentType] = useState<string>("all");

  const [grantTypeOpen, setGrantTypeOpen] = useState(false);
  const [grantSectorOpen, setGrantSectorOpen] = useState(false);
  const [eventTypeOpen, setEventTypeOpen] = useState(false);
  const [eventSectorOpen, setEventSectorOpen] = useState(false);
  const [eventLocationOpen, setEventLocationOpen] = useState(false);
  const [teamSectorOpen, setTeamSectorOpen] = useState(false);
  const [teamLocationOpen, setTeamLocationOpen] = useState(false);
  const [teamRemoteOpen, setTeamRemoteOpen] = useState(false);
  const [teamEmploymentOpen, setTeamEmploymentOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("team");

  const {grants: grantsData, isLoading:isGrantsLoading} = useGetGrants();
  const {events: eventsData, isLoading:isEventsLoading} = useGetEvents();
  const {jobs: jobsData, isLoading:isJobsLoading} = useGetJobs();
  const {mutateAsync: createJob, isPending:isCreatingJob} = useCreateJob();

  const [showTeamFilters, setShowTeamFilters] = useState(false);
  const [expandedPostingId, setExpandedPostingId] = useState<string | null>(null);

  // User created job postings
  const [userPostings, setUserPostings] = useState<StartupRolePosting[]>([]);
  const [createAdOpen, setCreateAdOpen] = useState(false);
  const [newPosting, setNewPosting] = useState(initialJobPosting);

  const filteredGrants = !isGrantsLoading && grantsData ? grantsData.filter((grant) => {
    const sectorMatch = grantSector === "All Sectors" || grant.sector === grantSector;
    const typeMatch = grantType === "all" || grant.type === grantType;
    return sectorMatch && typeMatch;
  }) : [];
  const filteredEvents = !isEventsLoading && eventsData ? eventsData.filter((event) => {
    const sectorMatch = eventSector === "All Sectors" || event.sector === eventSector;
    const typeMatch = eventType === "all" || event.type === eventType;
    const locationMatch =
      eventLocation === "All Locations" ||
      event.location.includes(eventLocation) ||
      eventLocation.includes(event.location);
    return sectorMatch && typeMatch && locationMatch;
  }): []

const handleCreatePosting = async () => {
  try {
    const posting: ZCreateJobPayload = {
      startupName: newPosting.startupName,
      title: newPosting.roleTitle,
      sector: newPosting.sector,
      locationType: newPosting.location,
      isRemote: newPosting.isRemote,
      employmentType: newPosting.employmentType,
      compensation: newPosting.compensation,
      description: newPosting.description,
      requirements: newPosting.requirements,
      customQuestions: newPosting.customQuestions.filter(
        (q) => q.trim() !== ""
      ),
    };

    const res = await createJob(posting);

    setNewPosting(initialJobPosting);
    setCreateAdOpen(false);

  } catch (error) {
    const message =error?.message ||
      "Something Went Wrong";

    toast.error(message);
  }
};

  // const allRolePostings = [...userPostings, ...jobsData];
  const allRolePostings = isJobsLoading ? [] : jobsData?.jobs;


  const filteredRolePostings = isJobsLoading ? [] : allRolePostings.filter((posting) => {
    const sectorMatch = teamSector === "All Sectors" || posting.sector === teamSector;
    const locationMatch =
      teamLocation === "All Locations" ||
      posting.location.includes(teamLocation) ||
      teamLocation === "Global";
    const remoteMatch =
      teamRemote === "all" ||
      (teamRemote === "remote" && posting.isRemote) ||
      (teamRemote === "on-site" && !posting.isRemote);
    const employmentMatch = teamEmploymentType === "all" || posting.employmentType === teamEmploymentType;
    return sectorMatch && locationMatch && remoteMatch && employmentMatch;
  });
  

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl md:max-w-5xl mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3 mb-6 h-12 bg-muted/50 rounded-2xl p-1">
            <TabsTrigger
              value="grants"
              className="text-sm font-medium rounded-xl data-[state=active]:bg-background"
            >
              Grants
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="text-sm font-medium rounded-xl data-[state=active]:bg-background"
            >
              Events
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="text-sm font-medium rounded-xl data-[state=active]:bg-background"
            >
              Jobs
            </TabsTrigger>
            {/* <TabsTrigger value="myteams" className="text-sm font-medium rounded-xl data-[state=active]:bg-background">My Teams</TabsTrigger> */}
          </TabsList>
          <TabsContent value="myteams" className="space-y-4">
            <div className="text-sm text-muted-foreground py-2">
              {userPostings.length}{" "}
              {userPostings.length === 1 ? "position" : "positions"} posted by
              you
            </div>

            <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
              {userPostings.map((posting) => (
                <RoleCard key={posting.id} posting={posting} isMyAd={true} />
              ))}
            </div>

            {userPostings.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>You haven't posted any team roles yet</p>
              </div>
            )}
          </TabsContent>

          {/* GRANTS TAB */}
          <TabsContent value="grants" className="space-y-4">
            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Total grants: {filteredGrants.length}
              </div>
              <Dialog
                open={grantTypeOpen || grantSectorOpen}
                onOpenChange={(open) => {
                  if (!open) {
                    setGrantTypeOpen(false);
                    setGrantSectorOpen(false);
                  } else {
                    setGrantTypeOpen(true);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-[300px] w-72 p-0">
                  <div className="space-y-0">
                    <Collapsible
                      open={grantTypeOpen}
                      onOpenChange={setGrantTypeOpen}
                      defaultOpen
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                          <span className="text-sm font-medium">Type</span>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 transition-transform",
                              grantTypeOpen && "rotate-180",
                            )}
                          />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="flex flex-wrap gap-2 px-4 pb-3">
                          {grantTypes.map((type) => (
                            <button
                              key={type}
                              onClick={() => setGrantType(type)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                                grantType === type
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted hover:bg-muted/80",
                              )}
                            >
                              {type === "all"
                                ? "All"
                                : type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    <Collapsible
                      open={grantSectorOpen}
                      onOpenChange={setGrantSectorOpen}
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-t border-border">
                          <span className="text-sm font-medium">Sector</span>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 transition-transform",
                              grantSectorOpen && "rotate-180",
                            )}
                          />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="flex flex-wrap gap-2 px-4 pb-3">
                          {sectors.map((sector) => (
                            <button
                              key={sector}
                              onClick={() => setGrantSector(sector)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                                grantSector === sector
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted hover:bg-muted/80",
                              )}
                            >
                              {sector}
                            </button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Grants List */}
            <div className="space-y-3">
              {filteredGrants.map((grant) => (
                <div
                  key={grant._id}
                  className="bg-background border border-border rounded-lg p-4 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-foreground">
                        {grant.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {grant.organization}
                      </p>
                    </div>
                    <Badge
                      variant={getGrantTypeBadge(grant.type)}
                      className="text-[10px] px-2 py-0.5 flex-shrink-0"
                    >
                      {grant.type}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {grant.description}
                  </p>

                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3 pb-3 border-b border-border">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{grant.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(grant.deadline)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm text-foreground">
                      {grant.amount}
                    </div>
                    <a
                      href={grant?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="default"
                        size="sm"
                        className="h-7 text-xs gap-1"
                      >
                        Apply
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </a>
                  </div>
                </div>
              ))}

              {filteredGrants.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No grants found</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* EVENTS TAB */}
          <TabsContent value="events" className="space-y-4">
            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Total events: {filteredEvents.length}
              </div>
              <Dialog
                open={eventTypeOpen || eventSectorOpen || eventLocationOpen}
                onOpenChange={(open) => {
                  if (!open) {
                    setEventTypeOpen(false);
                    setEventSectorOpen(false);
                    setEventLocationOpen(false);
                  } else {
                    setEventTypeOpen(true);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-[350px] w-72 p-0">
                  <div className="space-y-0">
                    <Collapsible
                      open={eventTypeOpen}
                      onOpenChange={setEventTypeOpen}
                      defaultOpen
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                          <span className="text-sm font-medium">Type</span>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 transition-transform",
                              eventTypeOpen && "rotate-180",
                            )}
                          />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="flex flex-wrap gap-2 px-4 pb-3">
                          {eventTypes.map((type) => (
                            <button
                              key={type}
                              onClick={() => setEventType(type)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                                eventType === type
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted hover:bg-muted/80",
                              )}
                            >
                              {type === "all"
                                ? "All"
                                : type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    <Collapsible
                      open={eventSectorOpen}
                      onOpenChange={setEventSectorOpen}
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-t border-border">
                          <span className="text-sm font-medium">Sector</span>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 transition-transform",
                              eventSectorOpen && "rotate-180",
                            )}
                          />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="flex flex-wrap gap-2 px-4 pb-3">
                          {sectors.map((sector) => (
                            <button
                              key={sector}
                              onClick={() => setEventSector(sector)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                                eventSector === sector
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted hover:bg-muted/80",
                              )}
                            >
                              {sector}
                            </button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    <Collapsible
                      open={eventLocationOpen}
                      onOpenChange={setEventLocationOpen}
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-t border-border">
                          <span className="text-sm font-medium">Location</span>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 transition-transform",
                              eventLocationOpen && "rotate-180",
                            )}
                          />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="flex flex-wrap gap-2 px-4 pb-3">
                          {locations.map((location) => (
                            <button
                              key={location}
                              onClick={() => setEventLocation(location)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                                eventLocation === location
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted hover:bg-muted/80",
                              )}
                            >
                              {location}
                            </button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Events List */}
            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-background border border-border rounded-lg p-4 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-foreground">
                        {event.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {event.organizer}
                      </p>
                    </div>
                    <Badge
                      variant={getEventTypeBadge(event.type)}
                      className="text-[10px] px-2 py-0.5 flex-shrink-0"
                    >
                      Event
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {event.description}
                  </p>

                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3 pb-3 border-b border-border">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    {/* <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{event.attendees}</span>
                    </div> */}
                  </div>

                  <div className="flex items-center justify-end">
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="default"
                        size="sm"
                        className="h-7 text-xs gap-1"
                      >
                        Register
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </a>
                  </div>
                </div>
              ))}

              {filteredEvents.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No events found</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* TEAM TAB */}
          <TabsContent value="team" className="space-y-4">
            <Dialog open={createAdOpen} onOpenChange={setCreateAdOpen}>
              <div className="flex items-center gap-3">
                <DialogTrigger asChild>
                  <Button className="flex-1 gap-2">
                    <Plus className="w-4 h-4" />
                    Create Job Ad
                  </Button>
                </DialogTrigger>

                {/* NEW BUTTON — switches to My Teams tab */}
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setActiveTab("myteams")}
                >
                  My Jobs
                </Button>
              </div>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Job Posting</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="startupName">Startup Name</Label>
                    <Input
                      id="startupName"
                      value={newPosting.startupName}
                      onChange={(e) =>
                        setNewPosting({
                          ...newPosting,
                          startupName: e.target.value,
                        })
                      }
                      placeholder="Enter your startup name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roleTitle">Role Title</Label>
                    <Input
                      id="roleTitle"
                      value={newPosting.roleTitle}
                      onChange={(e) =>
                        setNewPosting({
                          ...newPosting,
                          roleTitle: e.target.value,
                        })
                      }
                      placeholder="e.g., Co-Founder & CTO"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sector">Sector</Label>
                    <Select
                      value={newPosting.sector}
                      onValueChange={(value) =>
                        setNewPosting({ ...newPosting, sector: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors
                          .filter((s) => s !== "All Sectors")
                          .map((sector) => (
                            <SelectItem key={sector} value={sector}>
                              {sector}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newPosting.location}
                      onChange={(e) =>
                        setNewPosting({
                          ...newPosting,
                          location: e.target.value,
                        })
                      }
                      placeholder="e.g., San Francisco, USA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employmentType">Employment Type</Label>
                    <Select
                      value={newPosting.employmentType}
                      onValueChange={(value: "Full-time" | "Part-time") =>
                        setNewPosting({ ...newPosting, employmentType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isRemote"
                      checked={newPosting.isRemote}
                      onChange={(e) =>
                        setNewPosting({
                          ...newPosting,
                          isRemote: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    <Label htmlFor="isRemote">Remote Position</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="compensation">Compensation</Label>
                    <Input
                      id="compensation"
                      value={newPosting.compensation}
                      onChange={(e) =>
                        setNewPosting({
                          ...newPosting,
                          compensation: e.target.value,
                        })
                      }
                      placeholder="e.g., Equity (15-20%) + Competitive Salary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newPosting.description}
                      onChange={(e) =>
                        setNewPosting({
                          ...newPosting,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe the role and your startup"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requirements</Label>
                    <Textarea
                      id="requirements"
                      value={newPosting.requirements}
                      onChange={(e) =>
                        setNewPosting({
                          ...newPosting,
                          requirements: e.target.value,
                        })
                      }
                      placeholder="What are you looking for?"
                      rows={3}
                    />
                  </div>

                  {/* Custom Questions Section */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <Label className="text-sm font-medium">
                      Custom Questions (Optional, max 3)
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Add up to 3 questions for applicants to answer
                    </p>

                    {[0, 1, 2].map((index) => (
                      <div key={index} className="space-y-2">
                        <Label
                          htmlFor={`question-${index}`}
                          className="text-xs"
                        >
                          Question {index + 1}
                        </Label>
                        <Input
                          id={`question-${index}`}
                          value={newPosting.customQuestions[index]}
                          onChange={(e) => {
                            const newQuestions = [
                              ...newPosting.customQuestions,
                            ];
                            newQuestions[index] = e.target.value;
                            setNewPosting({
                              ...newPosting,
                              customQuestions: newQuestions,
                            });
                          }}
                          placeholder={`Enter question ${index + 1} (optional)`}
                        />
                      </div>
                    ))}
                  </div>
                  <Button onClick={handleCreatePosting} className="w-full">
                    {isCreatingJob ? (
                      <Loader2 className="h-5 w-5 animate-spin mx-auto mt-10" />
                    ) : (
                      "Create Posting"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="space-y-3">
              {/* FILTER TRIGGER */}

              {/* FILTER SHEET */}
              <Dialog open={showTeamFilters} onOpenChange={setShowTeamFilters}>
                <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl bg-card border-border p-4">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                      Filters
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-3 pt-3">
                    {/* SECTOR */}
                    <Collapsible
                      open={teamSectorOpen}
                      onOpenChange={setTeamSectorOpen}
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors">
                          <span className="text-sm font-medium">
                            Sector: {teamSector}
                          </span>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 transition-transform",
                              teamSectorOpen && "rotate-180",
                            )}
                          />
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-lg mt-2 max-h-[300px] overflow-y-auto">
                          {sectors.map((sector) => (
                            <button
                              key={sector}
                              onClick={() => {
                                setTeamSector(sector);
                                setTeamSectorOpen(false);
                              }}
                              className={cn(
                                "px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left",
                                teamSector === sector
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-card hover:bg-muted border border-border",
                              )}
                            >
                              {sector}
                            </button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* LOCATION */}
                    <Collapsible
                      open={teamLocationOpen}
                      onOpenChange={setTeamLocationOpen}
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors">
                          <span className="text-sm font-medium">
                            Location: {teamLocation}
                          </span>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 transition-transform",
                              teamLocationOpen && "rotate-180",
                            )}
                          />
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-lg mt-2 max-h-[300px] overflow-y-auto">
                          {locations.map((location) => (
                            <button
                              key={location}
                              onClick={() => {
                                setTeamLocation(location);
                                setTeamLocationOpen(false);
                              }}
                              className={cn(
                                "px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left",
                                teamLocation === location
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-card hover:bg-muted border border-border",
                              )}
                            >
                              {location}
                            </button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* WORK MODE */}
                    <Collapsible
                      open={teamRemoteOpen}
                      onOpenChange={setTeamRemoteOpen}
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors">
                          <span className="text-sm font-medium">
                            Work Mode:{" "}
                            {teamRemote === "all"
                              ? "All"
                              : teamRemote === "remote"
                                ? "Remote"
                                : "On-site"}
                          </span>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 transition-transform",
                              teamRemoteOpen && "rotate-180",
                            )}
                          />
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="flex gap-2 p-3 bg-muted/30 rounded-lg mt-2">
                          {remoteOptions.map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                setTeamRemote(option);
                                setTeamRemoteOpen(false);
                              }}
                              className={cn(
                                "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
                                teamRemote === option
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-card hover:bg-muted border border-border",
                              )}
                            >
                              {option === "all"
                                ? "All"
                                : option === "remote"
                                  ? "Remote"
                                  : "On-site"}
                            </button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* EMPLOYMENT TYPE */}
                    <Collapsible
                      open={teamEmploymentOpen}
                      onOpenChange={setTeamEmploymentOpen}
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors">
                          <span className="text-sm font-medium">
                            Type:{" "}
                            {teamEmploymentType === "all"
                              ? "All"
                              : teamEmploymentType}
                          </span>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 transition-transform",
                              teamEmploymentOpen && "rotate-180",
                            )}
                          />
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="flex gap-2 p-3 bg-muted/30 rounded-lg mt-2">
                          {employmentOptions.map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                setTeamEmploymentType(option);
                                setTeamEmploymentOpen(false);
                              }}
                              className={cn(
                                "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                teamEmploymentType === option
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-card hover:bg-muted border border-border",
                              )}
                            >
                              {option === "all" ? "All" : option}
                            </button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* CLEAR FILTERS */}
                    {(teamSector !== "All Sectors" ||
                      teamLocation !== "All Locations" ||
                      teamRemote !== "all" ||
                      teamEmploymentType !== "all") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setTeamSector("All Sectors");
                          setTeamLocation("All Locations");
                          setTeamRemote("all");
                          setTeamEmploymentType("all");
                        }}
                        className="w-full gap-2"
                      >
                        <X className="w-3 h-3" />
                        Clear all filters
                      </Button>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground py-2">
              {filteredRolePostings.length}{" "}
              {filteredRolePostings.length === 1 ? "position" : "positions"}{" "}
              available
              <div
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground cursor-pointer"
                onClick={() => setShowTeamFilters(true)}
              >
                <Filter className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
              {isJobsLoading ? (
                <div className="h-20 w-full justify-center items-center">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto mt-10" />
                </div>
              ) : (
                <>
                  {filteredRolePostings.map((posting) => {
                    // const isMyAd = posting?.id?.startsWith("user-");
                    const isExpanded = expandedPostingId === posting._id;
                    return (
                      <RoleCard
                        key={posting._id}
                        posting={posting}
                        isMyAd={false}
                        expanded={isExpanded}
                        onExpand={() =>
                          setExpandedPostingId(isExpanded ? null : posting._id)
                        }
                      />
                    );
                  })}
                </>
              )}
            </div>

            {!isJobsLoading && filteredRolePostings.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No positions found with current filters</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default Opportunities;