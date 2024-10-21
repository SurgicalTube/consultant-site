import React from 'react';
import Hero3D from './components/Hero3D';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <section id="home">
        <Hero3D />
      </section>
      <section id="services">
        <h2>Our Services</h2>
        {/* Add services content here */}
      </section>
      <section id="about">
        <h2>About Us</h2>
        {/* Add about content here */}
      </section>
      <section id="contact">
        <h2>Contact Us</h2>
        {/* Add contact form or information here */}
      </section>
    </div>
  );
}

export default App;
