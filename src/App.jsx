import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/About';
import Contact from './pages/Contact';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hardwareSlice, loadHardwareConfiguration } from './reducers/HardwareReducer';

const App = () => {
  const dispatch = useDispatch();


  // Load hardware configuration from JSON once when the app starts
  useEffect(() => {
    dispatch(loadHardwareConfiguration());
  }, [dispatch]);

  return (
    <div className="App">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  </div>
    
   
  );
};

export default App;