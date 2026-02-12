import { useState, useEffect, useRef } from "react";
import { ChevronDown, Clock, Users, Plus, Video, X, Search, BadgeCheck, Loader2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useGetMyFollowers } from "@/hooks/profile/useGetMyFollowers";
import { useGetMeetings } from "@/hooks/meeting/useGetMeetings";
import { useCreateMeeting } from "@/hooks/meeting/useCreateMeeting";
import { toast } from "sonner";
import { set } from "date-fns";
import useDebounce from "@/hooks/useDebounce";

type MeetingType = "public" | "followers" | "private";
type CategoryType = "pitch" | "networking";

const industryTags = [
  "AI", "ML", "Fintech", "HealthTech", "EV", "SaaS", "E-commerce", "EdTech", "AgriTech",
  "Blockchain", "IoT", "CleanTech", "FoodTech", "PropTech", "InsurTech", "LegalTech",
  "MarTech", "RetailTech", "TravelTech", "Logistics", "Cybersecurity", "Gaming", "Media", "SpaceTech"
];

// ➤ FORMAT TIME TO AM/PM
function formatAMPM(isoTime: string) {
  const date = new Date(isoTime);

  const h = date.getHours();
  const m = date.getMinutes();

  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;

  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}


function MeetingCard({
  meeting,
  onJoin,
  joinLabel,
  disabled,
  isInQueue,
  queuePosition,
  estimatedSlot,
  showRemove,
  onRemove,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  console.log(meeting)

  const getClockLabel = () => {
  const start = new Date(meeting.startTime);
  const end = new Date(meeting.endTime);
  const now = new Date();

  if (now >= start && now <= end) return "Ongoing";

  return `Starts at ${formatAMPM(meeting.startTime)}`;
};

  return (
    <div
      className="
    relative              /* THIS FIXES THE ISSUE */
    bg-[#0d0d0d]
    border border-[#272727]
    rounded-2xl
    px-4
    py-4
    shadow-[0px_3px_12px_rgba(0,0,0,0.5)]
    w-full
    overflow-hidden        /* prevents escape */
  "
    >

      {/* REMOVE BUTTON (ONLY ON MY MEETINGS) */}
      {showRemove && (
        <button onClick={onRemove} className="absolute right-2 translate-y-20 w-4 h-4 flex items-center justify-center rounded-full">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}


      {/* ROW 1 — AVATAR + TITLE + JOIN BUTTON */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-white/10">
            <AvatarImage src={meeting.organizer.avatarUrl} />
            <AvatarFallback>{meeting.organizer.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div>
            <p className="text-sm font-medium text-foreground w-[180px] truncate">
              {meeting.title}
            </p>

            <div className="flex items-center gap-1 mt-0.5">
              <p className="text-xs text-muted-foreground">by {meeting.organizer.username}</p>
              {meeting.isVerified && (
                <BadgeCheck className="w-3.5 h-3.5 text-primary" />
              )}
            </div>
          </div>
        </div>

        {/* JOIN BUTTON (BIG ROUND PILL) */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={onJoin}
            disabled={disabled}
            className="
            bg-[#2C2C2C]
            px-5
            py-1.5
            rounded-full
            text-xs
            font-semibold
            ml-5
            text-white
            shrink-0
          "
          >
            {joinLabel}
          </button>
          
        </div>
      </div>

      {/* ROW 2 — INDUSTRIES + PITCH TAG */}
      <div className="flex items-center mt-2 justify-start gap-3">

        {/* LEFT GROUP: Industry Tags, Eligible, and Clock/Time (Tight Grouping) */}
        {/* Using gap-3 to separate the block of tags from the clock information */}
        <div className="flex items-center gap-3">
            
          {/* Sub-Group 1: Tags and Eligible (Tight Gap) */}
          <div className="flex items-center gap-1.5 flex-wrap">
            
            {meeting.eligible && (
              <span
                className="
                        px-2
                        py-[2px]
                        bg-green-700/20
                        text-green-500
                        text-[11px]
                        rounded-md
                    "
              >
                Eligible
              </span>
            )}
          </div>

          {/* Sub-Group 2: Clock and Time (Immediately beside the tags) */}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="shrink-0">{getClockLabel()}</span>
          </div>

        </div>

        {/* RIGHT GROUP: Users/Participants and Pitch Tag (Far Right End) */}
        {/* Using gap-3 to separate the two right-end elements */}
        <div className="flex items-center w-full">

          {/* LEFT — Users */}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Users className="w-2.5 h-2.5" />
            {meeting?.participantsCount || 0}
          </div>

          {/* RIGHT — Pitch badge */}
          <span
            className="
    px-2
    py-[2px]
    bg-blue-600/5
    text-gray-400
    text-[11px]
    rounded-md
    ml-auto
    min-w-[70px]   /* MAKE BOTH EQUAL WIDTH */
    text-center
  "
          >
            {meeting.category === "pitch" ? "Pitch" : "Networking"}
          </span>

        </div>

      </div>

      {/* ROW 3 — TIME + PARTICIPANTS
      <div className="flex items-center justify-end text-xs text-muted-foreground">
        
        
      </div> */}

      {/* QUEUE INFO (FOR MY MEETINGS TAB) */}
      {typeof queuePosition !== "undefined" && (
        <div className="mt-2 text-xs">
          <div>
            <b>Queue Position:</b> {queuePosition}
          </div>
          <div>
            <b>Estimated:</b> {estimatedSlot}
          </div>
          <div className="text-muted-foreground">Subject to change</div>
        </div>
      )}

      {/* EXPANDABLE DESCRIPTION SECTION */}
      {meeting.description && (
        <div className="pt-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-left"
          >
            {/* <span className="text-xs font-medium text-foreground">View more</span> */}
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>

          {isExpanded && (
            <div>

              {meeting?.industries?.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="
                        px-2
                        py-[2px]
                        bg-white/10
                        text-white/80
                        text-[10px]
                        rounded-md
                    "
                >
                  {tag}
                </span>
              ))}
            
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              {meeting.description}
            </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


function NoMeetings() {
  return (
    <div className="text-center py-12">
      <Video className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
      <p className="text-sm text-muted-foreground">No meetings found</p>
    </div>
  );
}

const initalData={
  title: "",
  description: "",
  scheduledAt: "",
  startTime: "",
  endTime: "",
  duration: 60,
  location: "",
  participants: [],

  meetingType: "public",
  category: "pitch",
  pitchDuration: 5,
  participantType: "all",
  verifiedOnly: "no",

  industries: [] as string[],
  maxParticipants: 50,
}

// Custom Tab Button Component with Animated Underline
const TabButton = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 
          ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
  >
    {label}
    {/* Animated Underline */}
    <span
      className={`absolute bottom-0 left-0 h-[2px] bg-foreground transition-all duration-300 ease-in-out 
              ${isActive ? "w-full" : "w-0"}`}
    />
  </button>
);


const Meetings = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"public" | "my-meetings">("public");
  const {data: meetingsData, isPending: isMeetingPending} = useGetMeetings( activeTab === "public" ? "all":  "my-meetings" );

  const [launchExpanded, setLaunchExpanded] = useState(false);
  const { mutate: createMeetingMutation, isPending: isCreateMeetingPending } = useCreateMeeting();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);

  const [meetingPayload, setMeetingPayload] = useState(initalData);

  const [myMeetings, setMyMeetings] = useState<number[]>([]);
  const [inQueue, setInQueue] = useState<number[]>([]);

  const debouncedQuery = useDebounce(searchQuery, 400);

  const handleLaunchMeeting = () => {
    try {
      if (!meetingPayload.title) {
        toast.error("Meeting title is required");
        return;
      }

      if (!meetingPayload.startTime || !meetingPayload.endTime) {
        toast.error("Please select date and time");
        return;
      }

      const start = new Date(meetingPayload.startTime);
      const end = new Date(meetingPayload.endTime);

      const diffMs = end.getTime() - start.getTime();
      if (diffMs <= 0) {
        toast.error("End time must be after start time");
        return;
      }

      const duration = Math.ceil(diffMs / 60000);

      const payload = {
        ...meetingPayload,
        duration,
      };
      createMeetingMutation(payload);
      setMeetingPayload(initalData);
      setLaunchExpanded(false);
    } catch (err) {
      console.error("Launch meeting failed:", err);
      toast.error("Failed to launch meeting");
    }
  };
  // Focus search bar when it appears
  useEffect(() => {
    if (showSearchBar && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchBar]);

  const toggleIndustry = (industry: string) => {
    const prev = meetingPayload.industries;
    updateMeeting(
      "industries",
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry].slice(0, 3),
    );
  };

  const filteredMeetings = isMeetingPending
    ? []
    : meetingsData.filter((m) => {
        const s = debouncedQuery.toLowerCase();
        return (
          m.title.toLowerCase().includes(s) ||
          m.organizer.username.toLowerCase().includes(s)
        );
      });

  const updateMeeting = (key: string, value: any) => {
    setMeetingPayload((prev) => ({ ...prev, [key]: value }));
  };

  const handleJoin = (id: number) => {
    if (!myMeetings.includes(id)) {
      setMyMeetings((prev) => [...prev, id]);
      setInQueue((prev) => [...prev, id]);
    }
    setActiveTab("my-meetings");
  };

const handleDateTimeChange = (
  type: "date" | "time",
  value: string
) => {
  if (!value) return; 

  const current = meetingPayload.startTime
    ? new Date(meetingPayload.startTime)
    : new Date();

  if (type === "date") {
    const [y, m, d] = value.split("-").map(Number);
    if (!y || !m || !d) return;

    current.setFullYear(y, m - 1, d);
  } else {
    const [h, min] = value.split(":").map(Number);
    if (h === undefined || min === undefined) return;

    current.setHours(h, min);
  }

  const end = new Date(current.getTime() + 60 * 60000);

  setMeetingPayload((prev) => ({
    ...prev,
    scheduledAt: current.toISOString(),
    startTime: current.toISOString(),
    endTime: end.toISOString(),
  }));
};


  const handleRemove = (id: number) => {
    setMyMeetings((prev) => prev.filter((x) => x !== id));
    setInQueue((prev) => prev.filter((x) => x !== id));
  };

  const handleToggleSearch = () => {
    // Clear search and hide bar
    if (showSearchBar) {
      setSearchQuery("");
    }
    setShowSearchBar(prev => !prev);
  }

  const handleGoToVideo = () => navigate("/video");

  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="max-w-2xl mx-auto">
        <div className="p-4 space-y-4">
          {/* Launch Meeting (Existing) */}
          <div>
            <button
              onClick={() => setLaunchExpanded(!launchExpanded)}
              className="w-full flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold">Launch meeting</span>
              </div>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${launchExpanded ? "rotate-180" : ""}`}
              />
            </button>

            {launchExpanded && (
              <div className="mt-3 p-4 bg-muted/30 border border-borde  r rounded-xl space-y-3">
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input
                    className="mt-1 h-9 bg-background"
                    placeholder="Meeting title"
                    value={meetingPayload.title}
                    onChange={(e) => updateMeeting("title", e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-xs">Description (Optional)</Label>
                  <textarea
                    className="mt-1 w-full min-h-[80px] bg-background border border-border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Add a description..."
                    value={meetingPayload.description}
                    onChange={(e) =>
                      updateMeeting("description", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Date</Label>
                    <Input
                      type="date"
                      className="mt-1 h-9 bg-background"
                      onChange={(e) =>
                        handleDateTimeChange("date", e?.target?.value)
                      }
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Time</Label>
                    <Input
                      type="time"
                      className="mt-1 h-9 bg-background"
                      onChange={(e) =>
                        handleDateTimeChange("time", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Type</Label>
                  <div className="grid grid-cols-2 gap-10 mt-1">
                    <Button
                      size="sm"
                      variant={
                        meetingPayload.meetingType === "public"
                          ? "default"
                          : "outline"
                      }
                      onClick={() => updateMeeting("meetingType", "public")}
                    >
                      Public
                    </Button>

                    <Button
                      size="sm"
                      variant={
                        meetingPayload.meetingType === "private"
                          ? "default"
                          : "outline"
                      }
                      onClick={() => updateMeeting("meetingType", "private")}
                    >
                      Private
                    </Button>
                  </div>
                </div>

                {meetingPayload?.meetingType === "public" && (
                  <div>
                    <Label className="text-xs">Category</Label>
                    <div className="grid grid-cols-2 gap-10 mt-1">
                      <Button
                        size="sm"
                        variant={
                          meetingPayload?.category === "pitch"
                            ? "default"
                            : "outline"
                        }
                        onClick={() => updateMeeting("category", "pitch")}
                      >
                        Pitch Meeting
                      </Button>

                      <Button
                        size="sm"
                        variant={
                          meetingPayload?.category === "networking"
                            ? "default"
                            : "outline"
                        }
                        onClick={() => updateMeeting("category", "networking")}
                      >
                        Networking
                      </Button>
                    </div>
                  </div>
                )}

                {meetingPayload?.meetingType === "public" &&
                  meetingPayload?.category === "pitch" && (
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label className="text-xs">Time per pitch</Label>
                        <span className="text-xs">
                          {meetingPayload.pitchDuration || 10} min
                        </span>
                      </div>

                      <Slider
                        min={1}
                        max={60}
                        step={1}
                        value={[meetingPayload.pitchDuration || 10]}
                        onValueChange={(val) =>
                          updateMeeting("pitchDuration", val[0])
                        }
                      />
                    </div>
                  )}

                <div>
                  <Label className="text-xs">Industries (max 3)</Label>
                  <ScrollArea className="h-20 mt-1 border rounded-md p-2 bg-background">
                    <div className="flex flex-wrap gap-1.5">
                      {industryTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleIndustry(tag)}
                          disabled={
                            !meetingPayload.industries.includes(tag) &&
                            meetingPayload.industries.length >= 3
                          }
                          className={`px-2 py-1 text-xs rounded-md ${
                            meetingPayload.industries.includes(tag)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <Label className="text-xs">Max participants</Label>
                    <span className="text-xs">
                      {meetingPayload.maxParticipants}
                    </span>
                  </div>

                  <Slider
                    min={5}
                    max={100}
                    step={5}
                    value={[meetingPayload.maxParticipants]}
                    onValueChange={(val) =>
                      updateMeeting("maxParticipants", val[0])
                    }
                  />
                </div>

                <Button
                  className="w-full h-9"
                  onClick={handleLaunchMeeting}
                  disabled={isCreateMeetingPending}
                >
                  {isCreateMeetingPending ? (
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  ) : (
                    "Launch Meeting"
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Search Bar Toggle */}
          {showSearchBar && (
            <div className="relative mb-3">
              <Input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search meetings by title or host..."
                className="h-10 pl-4 pr-10 rounded-lg"
              />
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          )}

          {/* Tabs and Search Icon */}
          <div className="flex items-end justify-between  mb-3">
            <div className="flex gap-4">
              <TabButton
                label="All"
                isActive={activeTab === "public"}
                onClick={() => setActiveTab("public")}
              />
              <TabButton
                label="My meetings"
                isActive={activeTab === "my-meetings"}
                onClick={() => setActiveTab("my-meetings")}
              />
            </div>

            <button
              onClick={handleToggleSearch}
              className="flex items-center justify-center w-10 h-10 transition-colors text-muted-foreground hover:text-foreground"
            >
              {showSearchBar ? (
                <X className="w-5 h-5" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Public List */}
          {activeTab === "public" && (
            <div className="space-y-2.5">
              {isMeetingPending ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 mx-auto text-muted-foreground/50 animate-spin" />
                </div>
              ) : (
                <>
                  {filteredMeetings.map((m) => (
                    <MeetingCard
                      key={m._id}
                      meeting={m}
                      onJoin={() => handleJoin(m._id)}
                      joinLabel="Join"
                      disabled={false}
                      isInQueue={false}
                      showRemove={false}
                    />
                  ))}
                </>
              )}
              {!isMeetingPending &&filteredMeetings.length === 0 && <NoMeetings />}
            </div>
          )}

          {/* My Meetings */}
          {activeTab === "my-meetings" && (
            <div className="space-y-2.5">
              {isMeetingPending ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 mx-auto text-muted-foreground/50 animate-spin" />
                </div>
              ) : (
                <>
                  {filteredMeetings?.map((m) => {
                    return (
                      <MeetingCard
                        key={m._id}
                        meeting={m}
                        joinLabel="Queued"
                        isInQueue={true}
                        disabled={true}
                        showRemove={true}
                        onRemove={() => handleRemove(m._id)}
                        onJoin={handleGoToVideo}
                      />
                    );
                  })}
                </>
              )}
              {!isMeetingPending && filteredMeetings.length === 0 && <NoMeetings />}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Meetings;
