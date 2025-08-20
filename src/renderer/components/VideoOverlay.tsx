import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';

const VideoContainer = styled.div<{ isVisible: boolean; opacity: number }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  opacity: ${props => props.isVisible ? props.opacity : 0};
  transition: opacity 0.3s ease;
  background: #000;
  overflow: hidden;
  pointer-events: none;
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
`;

const VideoControls = styled.div<{ isVisible: boolean }>`
  position: fixed;
  bottom: 60px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px;
  display: ${props => props.isVisible ? 'flex' : 'none'};
  flex-direction: column;
  gap: 12px;
  z-index: 1000;
  min-width: 200px;
  border: 1px solid #333;
`;

const ControlSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ControlButton = styled.button`
  background: #333;
  border: 1px solid #555;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #404040;
    border-color: #666;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Slider = styled.input`
  flex: 1;
  height: 4px;
  background: #333;
  outline: none;
  border-radius: 2px;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: #007acc;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #007acc;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  background: #007acc;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background: #0088cc;
  }
`;

const StatusText = styled.div`
  color: #ccc;
  font-size: 11px;
  text-align: center;
`;

const SliderLabel = styled.label`
  color: #ccc;
  font-size: 11px;
  min-width: 60px;
`;

const ToggleButton = styled.button<{ isActive: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: ${props => props.isActive ? '#007acc' : '#333'};
  border: 1px solid ${props => props.isActive ? '#0099ff' : '#555'};
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  z-index: 1001;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &:hover {
    background: ${props => props.isActive ? '#0088cc' : '#404040'};
    transform: translateY(-2px);
  }
`;

interface VideoOverlayProps {
  onToggle?: (isVisible: boolean) => void;
}

export const VideoOverlay: React.FC<VideoOverlayProps> = ({ onToggle }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [opacity, setOpacity] = useState(0.3);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => {
      const newValue = !prev;
      if (newValue) {
        setShowControls(true); // Show controls when activating overlay
      }
      onToggle?.(newValue);
      return newValue;
    });
  }, [onToggle]);

  const toggleControls = useCallback(() => {
    setShowControls(prev => !prev);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setIsVisible(true);
      
      // Clean up previous URL
      return () => URL.revokeObjectURL(url);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [isPlaying]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  }, []);

  const handleOpacityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setOpacity(parseFloat(e.target.value));
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  }, []);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      video.volume = volume;
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoSrc, volume]);

  // Keyboard shortcuts - temporarily disabled to fix double typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      
      // Only handle very specific modifier key combinations to avoid interfering with terminal
      // Only handle when NOT in terminal context
      if (target?.closest('.xterm')) {
        return; // Never handle keys when in terminal
      }

      // Only handle modifier key combinations
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'v':
            e.preventDefault();
            toggleVisibility();
            break;
          case 'c':
            if (isVisible) {
              e.preventDefault();
              toggleControls();
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, toggleVisibility, toggleControls]);

  return (
    <>
      <VideoContainer isVisible={isVisible} opacity={opacity}>
        {videoSrc && (
          <VideoElement
            ref={videoRef}
            src={videoSrc}
            loop
            muted={volume === 0}
          />
        )}
      </VideoContainer>

      <VideoControls isVisible={showControls && isVisible}>
        <ControlSection>
          <ControlButton onClick={togglePlayPause}>
            {isPlaying ? '⏸️' : '▶️'} {isPlaying ? 'Pause' : 'Play'}
          </ControlButton>
          
          <FileLabel>
            📁 Load Video
            <FileInput
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
            />
          </FileLabel>
        </ControlSection>

        <ControlSection>
          <SliderLabel>Progress:</SliderLabel>
          <Slider
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSeek}
          />
          <StatusText>{formatTime(currentTime)} / {formatTime(duration)}</StatusText>
        </ControlSection>

        <ControlSection>
          <SliderLabel>Volume:</SliderLabel>
          <Slider
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={handleVolumeChange}
          />
          <StatusText>{Math.round(volume * 100)}%</StatusText>
        </ControlSection>

        <ControlSection>
          <SliderLabel>Opacity:</SliderLabel>
          <Slider
            type="range"
            min={0.1}
            max={1}
            step={0.1}
            value={opacity}
            onChange={handleOpacityChange}
          />
          <StatusText>{Math.round(opacity * 100)}%</StatusText>
        </ControlSection>

        <StatusText>
          Shortcuts: Cmd+V (toggle), Cmd+C (controls)
        </StatusText>
      </VideoControls>

      <ToggleButton 
        isActive={isVisible}
        onClick={toggleVisibility}
        title="Toggle video overlay (Cmd+V)"
      >
        🎥 {isVisible ? 'Hide Video' : 'Show Video'}
      </ToggleButton>
    </>
  );
};