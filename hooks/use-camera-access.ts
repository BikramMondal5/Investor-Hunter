"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface CameraAccessOptions {
  onError?: (error: Error) => void;
  facingMode?: 'user' | 'environment';
  idealWidth?: number;
  idealHeight?: number;
}

export function useCameraAccess(options: CameraAccessOptions = {}) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize available devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
      } catch (err) {
        console.error("Error enumerating devices:", err);
      }
    };

    getDevices();
  }, [hasPermission]);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          width: { ideal: options.idealWidth || 1280 },
          height: { ideal: options.idealHeight || 720 },
          facingMode: options.facingMode || 'user',
          aspectRatio: { ideal: 16/9 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setHasPermission(true);
      return mediaStream;
    } catch (err) {
      console.error("Camera access error:", err);
      const error = err as Error;
      
      let errorMessage = "Failed to access camera";
      if (error instanceof DOMException) {
        if (error.name === 'NotFoundError') {
          errorMessage = "No camera found";
        } else if (error.name === 'NotAllowedError') {
          errorMessage = "Camera access denied";
          setHasPermission(false);
        } else if (error.name === 'NotReadableError') {
          errorMessage = "Camera is already in use";
        }
      }
      
      setError(errorMessage);
      if (options.onError) {
        options.onError(error);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
      setStream(null);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    stream,
    isLoading,
    error,
    devices,
    hasPermission,
    startCamera,
    stopCamera
  };
}
