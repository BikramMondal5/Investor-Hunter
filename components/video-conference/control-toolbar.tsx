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
  DialogDescription,
  DialogFooter,
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
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
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
            onClick={() => setShowLeaveConfirmation(true)}
            aria-label="Leave meeting"
          >
            <PhoneOff size={24} />
          </Button>
        </div>
      </div>

      {/* Settings dialog - Increased size for more professional look */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-[#EAEAEA] max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ minWidth: '550px' }}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Meeting Settings</DialogTitle>
            <DialogDescription className="text-[#9E9E9E]">
              Configure your audio, video, and meeting preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-3">
              <h3 className="text-base font-medium">Audio Settings</h3>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-sm mb-1 block text-[#9E9E9E]">Microphone</label>
                  <select className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-md p-3 text-sm w-full">
                    <option>Default Microphone</option>
                    <option>Built-in Microphone</option>
                    <option>External Microphone</option>
                  </select>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-[#9E9E9E]">Input Volume</label>
                    <span className="text-sm text-[#9E9E9E]">75%</span>
                  </div>
                  <div className="h-2 w-full bg-[#2A2A2A] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#4F46E5] to-[#9333EA] w-3/4" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-[#9E9E9E]">Noise Suppression</label>
                    <span className="text-sm text-[#4F46E5]">Enabled</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-medium">Video Settings</h3>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-sm mb-1 block text-[#9E9E9E]">Camera</label>
                  <select className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-md p-3 text-sm w-full">
                    <option>Default Camera</option>
                    <option>Built-in Webcam</option>
                    <option>External Camera</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-[#9E9E9E]">Preview</label>
                  <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-md h-40 flex items-center justify-center">
                    <span className="text-[#9E9E9E]">Camera preview disabled</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-[#9E9E9E]">Video Quality</label>
                    <span className="text-sm text-[#9E9E9E]">HD (720p)</span>
                  </div>
                  <select 
                    className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-md p-3 text-sm w-full"
                    defaultValue="HD (720p)"
                  >
                    <option>Standard (480p)</option>
                    <option>HD (720p)</option>
                    <option>Full HD (1080p)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-medium">General Settings</h3>
              <div className="flex flex-col gap-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-md p-3">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded bg-[#0D0D0D] border-[#2A2A2A]" 
                    checked={showSelfView}
                    onChange={(e) => setShowSelfView(e.target.checked)}
                  />
                  <span>Show self view</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded bg-[#0D0D0D] border-[#2A2A2A]" 
                    checked={keyboardShortcutsEnabled}
                    onChange={(e) => setKeyboardShortcutsEnabled(e.target.checked)}
                  />
                  <span>Enable keyboard shortcuts</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded bg-[#0D0D0D] border-[#2A2A2A]" 
                    checked={highContrastMode}
                    onChange={(e) => setHighContrastMode(e.target.checked)}
                  />
                  <span>High contrast mode</span>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4 sticky bottom-0 bg-[#1A1A1A] mt-auto pb-2">
            <Button 
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white"
              onClick={() => setShowSettings(false)}
            >
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave confirmation dialog */}
      <Dialog open={showLeaveConfirmation} onOpenChange={setShowLeaveConfirmation}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-[#EAEAEA] max-w-lg max-h-[90vh] overflow-y-auto" style={{ minWidth: '450px' }}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">Leave Meeting?</DialogTitle>
            <DialogDescription className="text-[#9E9E9E] text-center pt-2">
              Are you sure you want to leave the internal interview session? This will end your connection to the meeting.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-5">
            <div className="bg-[#131313] rounded-full p-4 inline-block">
              <PhoneOff size={40} className="text-[#EF4444]" />
            </div>
          </div>
          <DialogFooter className="sm:justify-center gap-3 pt-4 sticky bottom-0 bg-[#1A1A1A] mt-auto pb-2">
            <Button 
              variant="outline"
              className="border-[#2A2A2A] hover:bg-[#2A2A2A] text-[#EAEAEA]"
              onClick={() => setShowLeaveConfirmation(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white min-w-[120px]"
              onClick={() => {
                setShowLeaveConfirmation(false);
                if (onLeave) onLeave();
              }}
            >
              Leave Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
