import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { WidgetProps } from '../../../shared/types';

const WidgetContainer = styled.div`
  background: #2d2d2d;
  border-radius: 8px;
  padding: 16px;
  color: #ffffff;
  border: 1px solid #404040;
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

const WidgetTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
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
  margin-bottom: 12px;

  &:hover {
    background: #0088cc;
  }
`;

const ControlSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const ControlButton = styled.button`
  background: #333;
  border: 1px solid #555;
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
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
  height: 3px;
  background: #333;
  outline: none;
  border-radius: 2px;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: #007acc;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: #007acc;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

const SliderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
`;

const SliderLabel = styled.label`
  color: #ccc;
  font-size: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatusText = styled.div`
  color: #999;
  font-size: 10px;
  text-align: center;
  margin-top: 8px;
  line-height: 1.4;
`;

// Global video container that renders behind everything
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

interface VideoBackgroundWidgetProps extends WidgetProps {
  widgetId?: string;
  onRemove?: () => void;
}

export const VideoBackgroundWidget: React.FC<VideoBackgroundWidgetProps> = ({ widgetId, onRemove, config, onConfigChange }) => {
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [opacity, setOpacity] = useState(0.3);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setIsActive(true);
      
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

  const toggleActive = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

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

  // Apply CSS class to terminal for transparency when active
  useEffect(() => {
    const terminalWrapper = document.querySelector('.xterm');
    if (terminalWrapper) {
      if (isActive) {
        terminalWrapper.classList.add('video-overlay-active');
      } else {
        terminalWrapper.classList.remove('video-overlay-active');
      }
    }

    // Cleanup on unmount
    return () => {
      const terminalWrapper = document.querySelector('.xterm');
      if (terminalWrapper) {
        terminalWrapper.classList.remove('video-overlay-active');
      }
    };
  }, [isActive]);

  return (
    <>
      <WidgetContainer>
        <WidgetHeader>
          <WidgetTitle>🎥 Video Background</WidgetTitle>
        </WidgetHeader>

        <FileLabel>
          📁 Load Video
          <FileInput
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
          />
        </FileLabel>

        {videoSrc && (
          <>
            <ControlSection>
              <ControlButton onClick={toggleActive}>
                {isActive ? '👁️ Hide' : '👁️ Show'}
              </ControlButton>
              <ControlButton onClick={togglePlayPause} disabled={!isActive}>
                {isPlaying ? '⏸️' : '▶️'}
              </ControlButton>
            </ControlSection>

            <SliderSection>
              <SliderLabel>
                Progress: <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              </SliderLabel>
              <Slider
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                disabled={!isActive}
              />
            </SliderSection>

            <SliderSection>
              <SliderLabel>
                Volume: <span>{Math.round(volume * 100)}%</span>
              </SliderLabel>
              <Slider
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={volume}
                onChange={handleVolumeChange}
                disabled={!isActive}
              />
            </SliderSection>

            <SliderSection>
              <SliderLabel>
                Opacity: <span>{Math.round(opacity * 100)}%</span>
              </SliderLabel>
              <Slider
                type="range"
                min={0.1}
                max={1}
                step={0.1}
                value={opacity}
                onChange={handleOpacityChange}
                disabled={!isActive}
              />
            </SliderSection>
          </>
        )}

        <StatusText>
          {!videoSrc && "Load a video to start"}
          {videoSrc && !isActive && "Video loaded - click Show to activate"}
          {videoSrc && isActive && "Video active behind terminal"}
        </StatusText>
      </WidgetContainer>

      {/* Global video overlay */}
      {videoSrc && (
        <VideoContainer isVisible={isActive} opacity={opacity}>
          <VideoElement
            ref={videoRef}
            src={videoSrc}
            loop
            muted={volume === 0}
          />
        </VideoContainer>
      )}
    </>
  );
};