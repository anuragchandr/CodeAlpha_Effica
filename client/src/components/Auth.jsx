import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/auth.css';
import { useNavigate } from 'react-router-dom';
function Auth() {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    const handleSignUp = () => container.classList.add('right-panel-active');
    const handleSignIn = () => container.classList.remove('right-panel-active');

    signUpButton?.addEventListener('click', handleSignUp);
    signInButton?.addEventListener('click', handleSignIn);

    return () => {
      signUpButton?.removeEventListener('click', handleSignUp);
      signInButton?.removeEventListener('click', handleSignIn);
    };
  }, []);

  const handleSignupInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!signupData.name || !signupData.email || !signupData.password) {
      setMessage('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      setMessage('Please enter a valid email address');
      return;
    }

    // Password validation
    if (signupData.password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', signupData);
      
      if (response.data) {
        setMessage('Registration successful! Please login.');
        setSignupData({ name: '', email: '', password: '' });
        
        // Switch to login panel
        const container = document.querySelector('.container');
        if (container) {
          container.classList.remove('right-panel-active');
        }
        
        // Optional: Auto-fill login form with registered email
        setLoginData(prev => ({
          ...prev,
          email: signupData.email
        }));
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setMessage('Email already exists. Please use a different email.');
      } else if (error.response?.status === 400) {
        setMessage(error.response.data.message || 'Invalid input data');
      } else {
        setMessage('Registration failed. Please try again later.');
      }
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', loginData);
      if (response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.user.name);
        setMessage('Login successful!');
        setLoginData({ email: '', password: '' });
        // Navigate to main page after successful login
        navigate('/main');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {message && <div className="message">{message}</div>}
      <div className="container" id="container">
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignup}>
            <h1>Create Account</h1>
            <div className="social-container">
              <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              name="name"
              value={signupData.name}
              onChange={handleSignupInputChange}
              placeholder="Name"
              required
            />
            <input
              type="email"
              name="email"
              value={signupData.email}
              onChange={handleSignupInputChange}
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              value={signupData.password}
              onChange={handleSignupInputChange}
              placeholder="Password"
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h1>Sign in</h1>
            <div className="social-container">
              <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your account</span>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleLoginInputChange}
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginInputChange}
              placeholder="Password"
              required
            />
            <a href="#">Forgot your password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" id="signIn">Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" id="signUp">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;