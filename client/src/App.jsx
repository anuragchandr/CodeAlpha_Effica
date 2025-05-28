import { useState } from 'react'
import './App.css'
import Header from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Auth from './components/Auth.jsx';
import Footer from './components/Footer.jsx';
import About from './components/Aboust.jsx';
import Contact from './components/Contact.jsx';
import './components/mycss.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './components/Main.jsx';
function App() {
  const username = "guest";
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="app">
            <div className="navbar">
              <Header />
            </div>
            <div className="main-layout">
              <aside className="sidebar">
                <Sidebar />
              </aside>
              <main className="content">
                <Auth />
              </main>
            </div>
            <div className="credi">
              <Footer/>
            </div>
          </div>


        } />

        <Route path="/about" element={
          <div className="app">
            <div className="navbar">
              <Header />
            </div>
            <div className="main-layout">
              <aside className="sidebar">
                <Sidebar />
              </aside>
              <main className="content">
                <About />
              </main>
            </div>
            <div className="credi">
              <Footer/>
            </div>
          </div>
        } />
        <Route path="/contact" element={
          <div className="app">
            <div className="navbar">
              <Header />
            </div>
            <div className="main-layout">
              <aside className="sidebar">
                <Sidebar />
              </aside>
              <main className="content" id="scrollable-content">
                <Contact />
              </main>
            </div>

          </div>
        } />
        <Route path="/auth" element={
          <div className="app">
            <div className="navbar">
              <Header />
            </div>
            <div className="main-layout">
              <aside className="sidebar">
                <Sidebar />
              </aside>
              <main className="content">
                <Auth />
              </main>
            </div>
            <div className="credi">
              <Footer/>
            </div>
          </div>
        } />
        <Route path="*" element={
          <div className="app">
            <div className="navbar">
              <Header />
            </div>
            <div className="main-layout">
              <aside className="sidebar">
                <Sidebar />
              </aside>
              <main className="content">
                <h1>404 Not Found</h1>
              </main>
            </div>
            <div className="credi">
              <Footer/>
            </div>
          </div>
        } />
        <Route path="main" element={
          <div className="app">
          <MainPage />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
