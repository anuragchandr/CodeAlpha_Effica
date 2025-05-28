// src/pages/MainPage.jsx
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './main.css';
import { useNavigate } from 'react-router-dom';

function Main() {
  const projectSectionRef = useRef(null);
  const taskSectionRef = useRef(null);
  const commentSectionRef = useRef(null);
  const navigate = useNavigate();

  // State for tasks
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Design Homepage', assignee: '@Anurag', dueDate: 'June 5, 2025', completed: false },
    { id: 2, title: 'API Integration', assignee: '@TeamDev', dueDate: 'June 10, 2025', completed: false },
  ]);

  // State for comments
  const [comments, setComments] = useState([
    { user: '@Anurag', text: 'Great progress on the homepage design!', time: '2h ago' },
    { user: '@TeamDev', text: 'Need feedback on API endpoints.', time: '1h ago' },
  ]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Prevent animations on refresh
    const hasAnimated = sessionStorage.getItem('efficaAnimationsRun');
    if (!hasAnimated) {
      gsap.fromTo(
        projectSectionRef.current.querySelectorAll('.project-card'),
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out' }
      );
      gsap.fromTo(
        taskSectionRef.current.querySelectorAll('.task-card'),
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out', delay: 0.3 }
      );
      gsap.fromTo(
        commentSectionRef.current.querySelectorAll('.comment'),
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.5 }
      );
      gsap.fromTo(
        commentSectionRef.current.querySelector('.comment-input'),
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.7 }
      );
      sessionStorage.setItem('efficaAnimationsRun', 'true');
    }

    // Button hover animations
    const buttons = document.querySelectorAll('.action-button');
    buttons.forEach((button) => {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, { scale: 1.1, backgroundColor: '#ff6691', duration: 0.3, ease: 'power2.out' });
      });
      button.addEventListener('mouseleave', () => {
        gsap.to(button, { scale: 1, backgroundColor: '#ff416c', duration: 0.3, ease: 'power2.out' });
      });
    });
  }, []);

  const handleMarkComplete = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const handlePostComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { user: '@User', text: newComment, time: 'Now' }]);
      setNewComment('');
    }
  };

  return (
    <div className="main-page">
      <header className="main-header">
        <h1 className="main-title">Effica</h1>
        <p className="main-subtitle">A Project Management Revolution by Anurag Chandra</p>
      </header>

      <section className="dashboard">
        {/* Project List */}
        <div className="project-section" ref={projectSectionRef}>
          <h2 className="section-title">Projects</h2>
          <div className="project-grid">
            {[
              { id: 1, title: 'Website Redesign', description: 'Redesign company website with modern UI.' },
              { id: 2, title: 'App Development', description: 'Build a mobile app for Effica.' },
              { id: 3, title: 'Marketing Campaign', description: 'Launch social media campaign.' },
            ].map((project) => (
              <div className="project-card" key={project.id}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <button className="action-button" onClick={() => navigate(`/projects/${project.id}/tasks`)}>
                  View Tasks
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="task-section" ref={taskSectionRef}>
          <h2 className="section-title">Tasks</h2>
          <div className="task-list">
            {tasks.map((task) => (
              <div className="task-card" key={task.id}>
                <h4>{task.title}</h4>
                <p>Assigned to: {task.assignee}</p>
                <p>Due: {task.dueDate}</p>
                <button
                  className="action-button"
                  onClick={() => handleMarkComplete(task.id)}
                  style={{ backgroundColor: task.completed ? '#666666' : '#ff416c' }}
                >
                  {task.completed ? 'Completed' : 'Mark Complete'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Comment Section */}
        <div className="comment-section" ref={commentSectionRef}>
          <h2 className="section-title">Comments</h2>
          <div className="comment-feed">
            {comments.map((comment, index) => (
              <div className="comment" key={index}>
                <p>
                  <strong>{comment.user}</strong>: {comment.text}
                </p>
                <span className="comment-time">{comment.time}</span>
              </div>
            ))}
          </div>
          <div className="comment-input">
            <textarea
              placeholder="Add a comment..."
              rows="3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <button className="action-button" onClick={handlePostComment}>
              Post
            </button>
          </div>
        </div>
      </section>

      <footer className="main-footer">
        <p>Effica © 2025 | Created by <strong>Anurag Chandra</strong></p>
      </footer>
    </div>
  );
}

export default Main;