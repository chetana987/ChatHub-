// Mock data for the chat application

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  unreadCount: number;
}

export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
  contactId: string;
}

export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    lastMessage: "Hey! How was your weekend?",
    timestamp: "2m ago",
    isOnline: true,
    unreadCount: 2,
  },
  {
    id: "2", 
    name: "Alex Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    lastMessage: "Thanks for the help with the project!",
    timestamp: "1h ago",
    isOnline: true,
    unreadCount: 0,
  },
  {
    id: "3",
    name: "Emily Davis",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily", 
    lastMessage: "Can we schedule a meeting for tomorrow?",
    timestamp: "3h ago",
    isOnline: false,
    unreadCount: 1,
  },
  {
    id: "4",
    name: "Michael Brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    lastMessage: "The presentation went really well!",
    timestamp: "1d ago",
    isOnline: false,
    unreadCount: 0,
  },
  {
    id: "5",
    name: "Jessica Taylor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jessica",
    lastMessage: "Let me know when you're free to chat",
    timestamp: "2d ago",
    isOnline: true,
    unreadCount: 0,
  },
];

export const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      text: "Hey Sarah! It was great, went hiking with some friends. How about yours?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      isOwn: true,
      status: "read",
      contactId: "1",
    },
    {
      id: "m2", 
      text: "That sounds amazing! I just stayed in and binge-watched some series on Netflix 😄",
      timestamp: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
      isOwn: false,
      contactId: "1",
    },
    {
      id: "m3",
      text: "Hey! How was your weekend?",
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      isOwn: false,
      contactId: "1",
    },
  ],
  "2": [
    {
      id: "m4",
      text: "No problem! Happy to help anytime. How did the final presentation go?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isOwn: true,
      status: "read",
      contactId: "2",
    },
    {
      id: "m5",
      text: "Thanks for the help with the project!",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      isOwn: false,
      contactId: "2",
    },
  ],
  "3": [
    {
      id: "m6",
      text: "Sure! What time works best for you?",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      isOwn: true,
      status: "delivered",
      contactId: "3",
    },
    {
      id: "m7",
      text: "Can we schedule a meeting for tomorrow?",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      isOwn: false,
      contactId: "3",
    },
  ],
  "4": [
    {
      id: "m8",
      text: "Congratulations! I knew you'd nail it 🎉",
      timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000), // 1 day ago
      isOwn: true,
      status: "read",
      contactId: "4",
    },
    {
      id: "m9",
      text: "The presentation went really well!",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isOwn: false,
      contactId: "4",
    },
  ],
  "5": [
    {
      id: "m10",
      text: "I'm free this afternoon if you want to catch up!",
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
      isOwn: true,
      status: "sent",
      contactId: "5",
    },
    {
      id: "m11",
      text: "Let me know when you're free to chat",
      timestamp: new Date(Date.now() - 47 * 60 * 60 * 1000), // 2 days ago
      isOwn: false,
      contactId: "5",
    },
  ],
};

// Group chat data
export const mockGroupChats = [
  {
    id: "group1",
    name: "Team Project",
    participants: [
      { name: "Alice Johnson", avatar: "/placeholder.svg" },
      { name: "Bob Wilson", avatar: "/placeholder.svg" },
      { name: "Carol Davis", avatar: "/placeholder.svg" }
    ],
    lastMessage: "Let's finalize the design tomorrow",
    timestamp: "2m ago",
    unreadCount: 3,
    isGroup: true
  },
  {
    id: "group2", 
    name: "Family Chat",
    participants: [
      { name: "Mom", avatar: "/placeholder.svg" },
      { name: "Dad", avatar: "/placeholder.svg" },
      { name: "Sister", avatar: "/placeholder.svg" }
    ],
    lastMessage: "Don't forget dinner this Sunday!",
    timestamp: "1h ago",
    unreadCount: 0,
    isGroup: true
  }
];