import { createSlice } from '@reduxjs/toolkit';
import GratingLayout from '../layoutMaps/gratingLayout.json';
import StaticLayout from '../layoutMaps/StaticLayout.json';


const extractShapes = (layout) => {
  const shapes = layout.shapes;
  const offset = layout.offset || {x: 0, y: 0};

  return shapes.map(shape => {
    return {
      ...shape,
      x: shape.x + offset.x,
      y: shape.y + offset.y,
    };
  });

}

export const layoutSlice = createSlice({
  name: "layout", // The name of the slice (prefixes the action types)
  initialState: {
      grating:{
        svgSize: {
          width: 500,
          height: 500,
        },
        viewPort: {
          offsetX: -1000,
          offsetY: -1000,
          width: 2000,
          height: 2000,
        },
        unitsPerPixel: 0.001,
        shapes:extractShapes(GratingLayout), 
        staticShapes: extractShapes(StaticLayout)
      }
  }, // Initial state for this slice
  reducers: {
    initializeLayoutMaps: (state, action) => {
      loadLayout(state, GratingLayout, 'grating');
    },

  },

});



