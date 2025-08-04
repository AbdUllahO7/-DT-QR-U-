import { useState, useCallback, useRef } from 'react';

interface UseCarouselOptions {
  totalItems: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

interface CarouselHandlers {
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
}

export const useCarousel = ({ totalItems, autoPlay = false, autoPlayInterval = 3000 }: UseCarouselOptions) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Touch/Drag işlemleri
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
    setIsDragging(true);
    
    // Auto-play'i durdur
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50; // minimum swipe distance
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide(); // swipe left
      } else {
        prevSlide(); // swipe right
      }
    }
    
    setIsDragging(false);
    
    // Auto-play'i yeniden başlat
    if (autoPlay) {
      autoPlayRef.current = window.setInterval(nextSlide, autoPlayInterval);
    }
  }, [startX, currentX, isDragging, nextSlide, prevSlide, autoPlay, autoPlayInterval]);

  // Mouse drag işlemleri
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setStartX(e.clientX);
    setCurrentX(e.clientX);
    setIsDragging(true);
    
    // Auto-play'i durdur
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    
    setIsDragging(false);
    
    // Auto-play'i yeniden başlat
    if (autoPlay) {
      autoPlayRef.current = window.setInterval(nextSlide, autoPlayInterval);
    }
  }, [startX, currentX, isDragging, nextSlide, prevSlide, autoPlay, autoPlayInterval]);

  const handlers: CarouselHandlers = {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };

  return {
    currentSlide,
    isDragging,
    carouselRef,
    nextSlide,
    prevSlide,
    goToSlide,
    handlers,
  };
}; 