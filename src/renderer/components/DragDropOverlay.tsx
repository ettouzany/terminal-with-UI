import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const DropOverlay = styled.div<{ isVisible: boolean; isDragOver: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.isDragOver 
    ? 'rgba(0, 122, 204, 0.1)' 
    : 'rgba(0, 0, 0, 0.3)'
  };
  backdrop-filter: blur(4px);
  z-index: 999;
  display: ${props => props.isVisible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  pointer-events: ${props => props.isVisible ? 'all' : 'none'};
  transition: all 0.2s ease;
`;

const DropZone = styled.div<{ isDragOver: boolean }>`
  background: ${props => props.isDragOver 
    ? 'rgba(0, 122, 204, 0.2)' 
    : 'rgba(45, 45, 45, 0.9)'
  };
  border: 3px dashed ${props => props.isDragOver ? '#007acc' : '#666'};
  border-radius: 12px;
  padding: 60px 40px;
  text-align: center;
  color: ${props => props.isDragOver ? '#007acc' : '#cccccc'};
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
  max-width: 400px;
  transform: ${props => props.isDragOver ? 'scale(1.05)' : 'scale(1)'};
`;

const DropIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.8;
`;

const DropTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
`;

const DropDescription = styled.p`
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
  line-height: 1.4;
`;

const FileTypeList = styled.div`
  margin-top: 16px;
  font-size: 12px;
  opacity: 0.6;
`;

interface DragDropOverlayProps {
  onFileDrop: (files: FileList) => void;
  onTextDrop?: (text: string) => void;
}

export const DragDropOverlay: React.FC<DragDropOverlayProps> = ({ 
  onFileDrop, 
  onTextDrop 
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragCounter(prev => prev + 1);
    
    if (e.dataTransfer?.types.includes('Files') || e.dataTransfer?.types.includes('text/plain')) {
      setIsDragActive(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragActive(false);
        setIsDragOver(false);
      }
      return newCounter;
    });
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
    
    setIsDragOver(true);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragActive(false);
    setIsDragOver(false);
    setDragCounter(0);
    
    if (e.dataTransfer) {
      const files = e.dataTransfer.files;
      const text = e.dataTransfer.getData('text/plain');
      
      if (files.length > 0) {
        onFileDrop(files);
      } else if (text && onTextDrop) {
        onTextDrop(text);
      }
    }
  }, [onFileDrop, onTextDrop]);

  useEffect(() => {
    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);
    
    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  const handleOverlayClick = () => {
    setIsDragActive(false);
    setIsDragOver(false);
    setDragCounter(0);
  };

  return (
    <DropOverlay 
      isVisible={isDragActive} 
      isDragOver={isDragOver}
      onClick={handleOverlayClick}
    >
      <DropZone isDragOver={isDragOver}>
        <DropIcon>
          {isDragOver ? '📂' : '📁'}
        </DropIcon>
        <DropTitle>
          {isDragOver ? 'Drop to import' : 'Drop files here'}
        </DropTitle>
        <DropDescription>
          {isDragOver 
            ? 'Release to add files to terminal'
            : 'Drag files or folders to auto-fill their paths'
          }
        </DropDescription>
        <FileTypeList>
          Supports: All file types, folders, and text
        </FileTypeList>
      </DropZone>
    </DropOverlay>
  );
};