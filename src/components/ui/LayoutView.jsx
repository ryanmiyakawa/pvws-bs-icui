import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fromEvent } from 'rxjs';
import { filter, throttleTime } from 'rxjs/operators';

const LayoutView = ({ 
  SVG,
  setTarget,
  routeKeyboardHardwareControls,
  unitsPerPixel = 1,
  svgSize = { width: 500, height: 500 },
  viewPort = { offsetX: -1000, offsetY: -1000, width: 2000, height: 2000 },
}) => {

  const SVG_WIDTH = svgSize.width;
  const SVG_HEIGHT = svgSize.height;

  const svgScaleX = viewPort.width / SVG_WIDTH;
  const svgScaleY = viewPort.height / SVG_HEIGHT;
  const svgOffsetX = viewPort.offsetX / svgScaleX;
  const svgOffsetY = viewPort.offsetY / svgScaleY;

  const initialZoom = 4;

  const divWidth = 600;
  const divHeight = 600;

  const svgWidthPx = SVG_WIDTH / svgScaleX * initialZoom;
  const svgHeightPx = SVG_HEIGHT / svgScaleY * initialZoom;
  const xOffset = viewPort.offsetX / svgScaleX * initialZoom;
  const yOffset = viewPort.offsetY / svgScaleY * initialZoom;

  const svgInitialOffsetX = (divWidth - svgWidthPx) / 2 + xOffset;
  const svgInitialOffsetY = (divHeight - svgHeightPx) / 2 + yOffset;

  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [zoom, setZoom] = useState(initialZoom);
  const [offset, setOffset] = useState({ x: svgInitialOffsetX, y: svgInitialOffsetY });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialOffset, setInitialOffset] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);  // Track if the view is focused

  // Reset zoom and offset to initial values
  const resetView = () => {
    setZoom(initialZoom);
    setOffset({ x: svgInitialOffsetX, y: svgInitialOffsetY });
  };
  const showReset = zoom !== initialZoom || offset.x !== svgInitialOffsetX || offset.y !== svgInitialOffsetY;

  // Handle drag start
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialOffset({ ...offset });
    containerRef.current.focus();  // Manually focus the div on interaction
  };

  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle dragging
  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setOffset({
      x: initialOffset.x + deltaX,
      y: initialOffset.y + deltaY,
    });
  };

  // Attach mouse events for dragging
  useEffect(() => {
    const mouseMove$ = fromEvent(window, 'mousemove').subscribe(handleMouseMove);
    const mouseUp$ = fromEvent(window, 'mouseup').subscribe(handleMouseUp);

    return () => {
      mouseMove$.unsubscribe();
      mouseUp$.unsubscribe();
    };
  }, [isDragging, dragStart, initialOffset]);

  // Handle zoom with wheel
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY);

      const newZoom = Math.max(1, Math.min(10, zoom - delta * 0.1));
      if (newZoom === zoom) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - offset.x) / zoom;
      const mouseY = (e.clientY - rect.top - offset.y) / zoom;

      setOffset((prevOffset) => ({
        x: prevOffset.x - mouseX * (newZoom - zoom),
        y: prevOffset.y - mouseY * (newZoom - zoom),
      }));

      setZoom(newZoom);
    };

    const containerElement = containerRef.current;
    containerElement.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      containerElement.removeEventListener('wheel', handleWheel);
    };
  }, [zoom, offset]);

  // Handle keydown for specific keys
  const handleKeyDown = (e) => {
    if (isFocused) {
      const { key, shiftKey } = e;
      const validKeys = ['j', 'k', 'l', 'h', 'y', 'i', 'J', 'K', 'L', 'H', 'Y', 'I'];
      if (!validKeys.includes(key)) return;
      
      routeKeyboardHardwareControls(key);
    }
  };

  // Add and remove keydown event listener based on focus state
  useEffect(() => {
    if (isFocused) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFocused]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden border w-full h-full"
      onMouseDown={handleMouseDown} // Start dragging on mouse down
      onFocus={() => setIsFocused(true)}   // Set focus when user interacts with the view
      onBlur={() => setIsFocused(false)}   // Remove focus when user clicks away
      tabIndex={0}  // Enable focus events on the div
    >
      {/* Button to reset view */}
      {showReset && 
        <button
          onClick={resetView}
          className="absolute bottom-2 left-2 p-1 bg-orange-800 text-gray-100 text-sm z-10"
        >
          Reset
        </button>
      }

      {isFocused && 
        <button
          className="absolute bottom-2 right-2 p-1 bg-teal-800 text-gray-100 text-sm z-10"
        >
          Keyboard Controls
        </button>}
    
      <div
        ref={svgRef}
        className="absolute"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: 'top left',
          width: `${SVG_WIDTH}px`,
          height: `${SVG_HEIGHT}px`,
        }}
      >
        <SVG width="100%" height="100%" />
      </div>
    </div>
  );
};

export default LayoutView;
