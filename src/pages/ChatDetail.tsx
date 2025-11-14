import { ArrowLeft, Send, Plus, Image as ImageIcon, Smile } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: number;
  text: string;
  sender: "me" | "them";
  timestamp: string;
  image?: string;
}

interface Contact {
  id: string;
  name: string;
  type: "user" | "group";
  members?: number;
}

const ChatDetail = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messageText, setMessageText] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Dummy contacts data
  const contacts: Record<string, Contact> = {
    "1": { id: "1", name: "Aditya chowdary", type: "user" },
    "2": { id: "2", name: "Ramesh paul", type: "user" },
    "3": { id: "3", name: "Priya Sharma", type: "user" },
    "4": { id: "4", name: "Vikram Singh", type: "user" },
    "5": { id: "5", name: "Ananya Desai", type: "user" },
    "6": { id: "6", name: "Karthik Reddy", type: "user" },
    "7": { id: "7", name: "Neha Gupta", type: "user" },
    "g1": { id: "g1", name: "Startup Founders Network", type: "group", members: 156 },
    "g2": { id: "g2", name: "Tech Investors Hub", type: "group", members: 89 },
    "g3": { id: "g3", name: "AI & ML Enthusiasts", type: "group", members: 234 },
  };

  const contact = contacts[chatId || "1"];

  // Initialize with dummy messages
  useState(() => {
    const dummyMessages: ChatMessage[] = [
      {
        id: 1,
        text: "Hey! How are you doing?",
        sender: "them",
        timestamp: "10:30 AM",
      },
      {
        id: 2,
        text: "I'm doing great! Thanks for asking. How about you?",
        sender: "me",
        timestamp: "10:32 AM",
      },
      {
        id: 3,
        text: "Would love to discuss the new startup opportunity",
        sender: "them",
        timestamp: "10:35 AM",
      },
      {
        id: 4,
        text: "Absolutely! Let's schedule a call this week.",
        sender: "me",
        timestamp: "10:38 AM",
      },
    ];
    setChatMessages(dummyMessages);
  });

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: ChatMessage = {
      id: chatMessages.length + 1,
      text: messageText,
      sender: "me",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessageText("");

    // Simulate response after 1 second
    setTimeout(() => {
      const responses = [
        "That sounds interesting!",
        "I agree with you on that.",
        "Let me think about it.",
        "Great idea!",
        "When can we discuss this further?",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const responseMessage: ChatMessage = {
        id: chatMessages.length + 2,
        text: randomResponse,
        sender: "them",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      };
      setChatMessages((prev) => [...prev, responseMessage]);
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageMessage: ChatMessage = {
        id: chatMessages.length + 1,
        text: "",
        sender: "me",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        image: event.target?.result as string,
      };
      setChatMessages([...chatMessages, imageMessage]);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-b border-border/50 z-50">
        <div className="max-w-2xl mx-auto flex items-center px-4 h-14">
          <button
            onClick={() => navigate("/messages")}
            className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div className="flex-1 flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {contact?.name?.charAt(0) || "?"}
              </span>
            </div>
            <div className="text-center">
              <h1 className="text-base font-semibold">{contact?.name || "Unknown"}</h1>
              {contact?.type === "group" && (
                <p className="text-xs text-muted-foreground">
                  {contact.members} members
                </p>
              )}
            </div>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 pt-14 pb-20 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  message.sender === "me"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Uploaded"
                    className="rounded-lg mb-2 max-w-full"
                  />
                )}
                {message.text && <p className="text-sm">{message.text}</p>}
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "me"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border/50 pb-safe">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0"
            >
              <Plus className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0"
            >
              <ImageIcon className="w-5 h-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="pr-10 rounded-full"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2"
              >
                <Smile className="w-5 h-5 text-muted-foreground" />
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="flex-shrink-0 rounded-full"
              disabled={!messageText.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;
