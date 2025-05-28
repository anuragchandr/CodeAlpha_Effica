import React from 'react';
import './about.css';
function About() {
  return (
    <section className="about">
      <h1>About Effica</h1>
      <p>
        Effica is a revolutionary project management tool designed by <strong>Anurag Chandra</strong>,
        blending the collaborative spirit of a social media network with powerful task management features.
      </p>
      <p>
        With Effica, users can create group projects, assign tasks, and communicate seamlessly—just like
        connecting on a social platform. Comment on tasks, share updates, and work together in real-time
        to bring your ideas to life.
      </p>
      <h2>Key Features</h2>
      <ul>
        <li>Create and manage group projects with ease.</li>
        <li>Assign tasks to team members and track progress.</li>
        <li>Engage in real-time discussions with comments and mentions.</li>
        <li>Enjoy a social media-like interface for intuitive collaboration.</li>
      </ul>
      <p>
        Inspired by the vision of Anurag Chandra, Effica empowers teams to work smarter, not harder.
      </p>
    </section>
  );
}

export default About;