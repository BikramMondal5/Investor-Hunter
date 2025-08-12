"use client";

import { useState } from "react";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  ScreenShare, 
  Monitor, 
  Users, 
  MessageSquare,
  Settings, 
  PhoneOff,
  Brush
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { VirtualBackgroundType } from "./types";

interface ControlToolbarProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  showParticipants: boolean;
  showChat: boolean;
  virtualBackground: VirtualBackgroundType;
  onMuteToggle: () => void;
  onVideoToggle: () => void;
  onScreenShareToggle: () => void;
  onParticipantsToggle: () => void;
  onChatToggle: () => void;
  onLeave?: () => void;
  onVirtualBackgroundChange: (type: VirtualBackgroundType) => void;
}

export default function ControlToolbar({
  isMuted,
  isVideoOff,
  isScreenSharing,
  showParticipants,
  showChat,
  virtualBackground,
  onMuteToggle,
  onVideoToggle,
  onScreenShareToggle,
  onParticipantsToggle,
  onChatToggle,
  onLeave,
  onVirtualBackgroundChange,
}: ControlToolbarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [keyboardShortcutsEnabled, setKeyboardShortcutsEnabled] = useState(true);
  const [showSelfView, setShowSelfView] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);

  return (
    <>
      <div className="flex justify-center w-full mb-6">
        <div className="bg-[#1A1A1A] rounded-full px-2 py-2 shadow-lg flex items-center">
          {/* Audio control */}
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "rounded-full mx-1 hover:bg-[#2A2A2A]",
              isMuted ? "bg-[#EF4444]/20 text-[#EF4444] hover:text-[#EF4444]" : "text-[#EAEAEA]"
            )}
            onClick={onMuteToggle}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </Button>

          {/* Video control */}
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "rounded-full mx-1 hover:bg-[#2A2A2A]",
              isVideoOff ? "bg-[#EF4444]/20 text-[#EF4444] hover:text-[#EF4444]" : "text-[#EAEAEA]"
            )}
            onClick={onVideoToggle}
            aria-label={isVideoOff ? "Turn on camera" : "Turn off camera"}
          >
            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
          </Button>

          {/* Screen share control */}
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "rounded-full mx-1 hover:bg-[#2A2A2A]",
              isScreenSharing ? "bg-[#10B981]/20 text-[#10B981] hover:text-[#10B981]" : "text-[#EAEAEA]"
            )}
            onClick={onScreenShareToggle}
            aria-label={isScreenSharing ? "Stop sharing" : "Share screen"}
          >
            {isScreenSharing ? <Monitor size={24} /> : <ScreenShare size={24} />}
          </Button>

          {/* Participants list toggle */}
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "rounded-full mx-1 hover:bg-[#2A2A2A]",
              showParticipants ? "bg-[#4F46E5]/20 text-[#4F46E5] hover:text-[#4F46E5]" : "text-[#EAEAEA]"
            )}
            onClick={onParticipantsToggle}
            aria-label={showParticipants ? "Hide participants" : "Show participants"}
          >
            <Users size={24} />
          </Button>

          {/* Chat toggle */}
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "rounded-full mx-1 hover:bg-[#2A2A2A]",
              showChat ? "bg-[#4F46E5]/20 text-[#4F46E5] hover:text-[#4F46E5]" : "text-[#EAEAEA]"
            )}
            onClick={onChatToggle}
            aria-label={showChat ? "Hide chat" : "Show chat"}
          >
            <MessageSquare size={24} />
          </Button>

          {/* Virtual Background/Effects */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "rounded-full mx-1 hover:bg-[#2A2A2A]",
                  virtualBackground !== 'none' ? "bg-[#9333EA]/20 text-[#9333EA] hover:text-[#9333EA]" : "text-[#EAEAEA]"
                )}
                aria-label="Background effects"
              >
                <Brush size={24} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-[#1A1A1A] border-[#2A2A2A] text-[#EAEAEA]">
              <DropdownMenuItem 
                className={cn(virtualBackground === 'none' && "bg-[#2A2A2A]")}
                onClick={() => onVirtualBackgroundChange('none')}
              >
                No Effect
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={cn(virtualBackground === 'blur' && "bg-[#2A2A2A]")}
                onClick={() => onVirtualBackgroundChange('blur')}
              >
                Background Blur
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={cn(virtualBackground === 'background' && "bg-[#2A2A2A]")}
                onClick={() => onVirtualBackgroundChange('background')}
              >
                Virtual Background
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full mx-1 hover:bg-[#2A2A2A] text-[#EAEAEA]"
            onClick={() => setShowSettings(true)}
            aria-label="Settings"
          >
            <Settings size={24} />
          </Button>

          {/* End call button */}
          <Button
            size="icon"
            className="rounded-full mx-1 bg-[#EF4444] hover:bg-[#DC2626] text-white"
            onClick={onLeave}
            aria-label="Leave meeting"
          >
            <PhoneOff size={24} />
          </Button>
        </div>
      </div>

      {/* Settings dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-[#EAEAEA]">
          <DialogHeader>
            <DialogTitle>Meeting Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Audio Settings</h3>
              <div className="flex flex-col gap-2">
                <select className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-md p-2 text-sm">
                  <option>Default Microphone</option>
                  <option>Built-in Microphone</option>
                </select>
                <div className="h-2 w-full bg-[#2A2A2A] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#4F46E5] to-[#9333EA] w-3/4" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Video Settings</h3>
              <div className="flex flex-col gap-2">
                <select className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-md p-2 text-sm">
                  <option>Default Camera</option>
                  <option>Built-in Webcam</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">General Settings</h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded bg-[#0D0D0D] border-[#2A2A2A]" 
                    checked={showSelfView}
                    onChange={(e) => setShowSelfView(e.target.checked)}
                  />
                  <span className="text-sm">Show self view</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded bg-[#0D0D0D] border-[#2A2A2A]" 
                    checked={keyboardShortcutsEnabled}
                    onChange={(e) => setKeyboardShortcutsEnabled(e.target.checked)}
                  />
                  <span className="text-sm">Enable keyboard shortcuts</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded bg-[#0D0D0D] border-[#2A2A2A]" 
                    checked={highContrastMode}
                    onChange={(e) => setHighContrastMode(e.target.checked)}
                  />
                  <span className="text-sm">High contrast mode</span>
                </label>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
