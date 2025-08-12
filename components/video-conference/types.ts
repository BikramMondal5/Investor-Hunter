// Types for video conferencing components

export interface Participant {
  id: string;
  name: string;
  role: 'Host' | 'Entrepreneur' | 'Investor' | 'Guest';
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeaking?: boolean;
  isScreenSharing?: boolean;
  avatarUrl?: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isSystemMessage?: boolean;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'pdf' | 'document';
}

export type VirtualBackgroundType = 'none' | 'blur' | 'background';
