// Create a consistent Chat type definition

export interface BaseChat {
  id: string;
  name: string;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  unreadCount: number;
}

export interface DirectChat extends BaseChat {
  type: 'direct';
  participants: {
    id: string;
    name: string;
  }[];
}

export interface GroupChat extends BaseChat {
  type: 'batch' | 'all';
  batchId?: string; // Only for batch type
}

export type Chat = DirectChat | GroupChat;