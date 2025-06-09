import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import axios from 'axios';
import { getApiUrl } from '../config/Config';
import './main.css';

function Main() {
  const projectSectionRef = useRef(null);
  const commentSectionRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [newSubtask, setNewSubtask] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Fetch projects and comments on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${getApiUrl()}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data.projects.map(p => ({
          ...p,
          showTasks: false,
          tasks: p.tasks.map(t => ({ ...t, id: t._id })),
        })));
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };

    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('${getApiUrl()}/api/comments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(response.data.comments);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    fetchProjects();
    fetchComments();

    // GSAP animations
    const hasAnimated = sessionStorage.getItem('efficaWorkspaceAnimationsRun');
    if (!hasAnimated) {
      gsap.fromTo(
        projectSectionRef.current.querySelectorAll('.project-card'),
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out' }
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
      sessionStorage.setItem('efficaWorkspaceAnimationsRun', 'true');
    }

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

  const handleProjectInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProject = async () => {
    if (newProject.title.trim() && newProject.description.trim()) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${getApiUrl()}/api/projects`, newProject, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects([...projects, { ...response.data.project, showTasks: false, tasks: [] }]);
        setNewProject({ title: '', description: '' });
        gsap.fromTo(
          `.project-card-${response.data.project._id}`,
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        );
      } catch (err) {
        console.error('Error adding project:', err);
      }
    }
  };

  const handleSubtaskInputChange = (projectId, e) => {
    const { name, value } = e.target;
    setNewSubtask((prev) => ({
      ...prev,
      [projectId]: { ...prev[projectId], [name]: value },
    }));
  };

  const handleAddSubtask = async (projectId) => {
    const subtaskData = newSubtask[projectId] || { title: '', assignee: '', dueDate: '' };
    if (subtaskData.title.trim() && subtaskData.assignee.trim() && subtaskData.dueDate.trim()) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${getApiUrl()}/api/projects/${projectId}/tasks`,
          subtaskData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjects(
          projects.map((project) =>
            project._id === projectId
              ? {
                  ...project,
                  tasks: response.data.project.tasks.map(t => ({ ...t, id: t._id })),
                }
              : project
          )
        );
        setNewSubtask((prev) => ({ ...prev, [projectId]: { title: '', assignee: '', dueDate: '' } }));
        gsap.fromTo(
          `.project-card-${projectId} .task-card:last-child`,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        );
      } catch (err) {
        console.error('Error adding task:', err);
      }
    }
  };

  const toggleTasks = (projectId) => {
    setProjects(
      projects.map((project) =>
        project._id === projectId ? { ...project, showTasks: !project.showTasks } : project
      )
    );
  };

  const handleMarkComplete = async (projectId, taskId) => {
    try {
      const project = projects.find((p) => p._id === projectId);
      const task = project.tasks.find((t) => t.id === taskId);
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${getApiUrl()}/api/projects/${projectId}/tasks/${taskId}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(
        projects.map((project) =>
          project._id === projectId
            ? {
                ...project,
                tasks: response.data.project.tasks.map(t => ({ ...t, id: t._id })),
              }
            : project
        )
      );
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handlePostComment = async () => {
    if (newComment.trim()) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          '${getApiUrl()}/api/comments',
          { text: newComment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setComments([...comments, response.data.comment]);
        setNewComment('');
        gsap.fromTo(
          '.comment:last-child',
          { x: 100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        );
      } catch (err) {
        console.error('Error posting comment:', err);
      }
    }
  };

  return (
    <div className="workspace">
      <header className="workspace-header">
        <h1 className="welcome">Welcome! To EFFICA</h1>
        <p className="workspace-subtitle">Collaborate Seamlessly, Created by Anurag Chandra</p>
      </header>

      <section className="dashboard">
        <div className="project-form-section">
          <h2 className="section-title">Add New Project</h2>
          <div className="project-form">
            <input
              type="text"
              name="title"
              value={newProject.title}
              onChange={handleProjectInputChange}
              placeholder="Project Title"
              className="form-input"
            />
            <textarea
              name="description"
              value={newProject.description}
              onChange={handleProjectInputChange}
              placeholder="Project Description"
              rows="5"
              className="form-textarea"
            ></textarea>
            <button className="action-button" onClick={handleAddProject}>
              Add Project
            </button>
          </div>
        </div>

        <div className="project-section" ref={projectSectionRef}>
          <h2 className="section-title">Projects</h2>
          <div className="project-grid">
            {projects.map((project) => (
              <div className={`project-card project-card-${project._id}`} key={project._id}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <button className="action-button" onClick={() => toggleTasks(project._id)}>
                  {project.showTasks ? 'Hide Tasks' : 'Show Tasks'}
                </button>
                {project.showTasks && (
                  <div className="task-list">
                    {project.tasks.length > 0 ? (
                      project.tasks.map((task) => (
                        <div className="task-card" key={task.id}>
                          <h4>{task.title}</h4>
                          <p>Assigned to: {task.assignee}</p>
                          <p>Due: {task.dueDate}</p>
                          <button
                            className="action-button"
                            onClick={() => handleMarkComplete(project._id, task.id)}
                            style={{ backgroundColor: task.completed ? '#666666' : '#ff416c' }}
                          >
                            {task.completed ? 'Completed' : 'Mark Complete'}
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No tasks yet.</p>
                    )}
                    <div className="subtask-form">
                      <h4>Add Subtask</h4>
                      <input
                        type="text"
                        name="title"
                        value={newSubtask[project._id]?.title || ''}
                        onChange={(e) => handleSubtaskInputChange(project._id, e)}
                        placeholder="Subtask Title"
                        className="form-input"
                      />
                      <input
                        type="text"
                        name="assignee"
                        value={newSubtask[project._id]?.assignee || ''}
                        onChange={(e) => handleSubtaskInputChange(project._id, e)}
                        placeholder="Assignee (e.g., @User)"
                        className="form-input"
                      />
                      <input
                        type="text"
                        name="dueDate"
                        value={newSubtask[project._id]?.dueDate || ''}
                        onChange={(e) => handleSubtaskInputChange(project._id, e)}
                        placeholder="Due Date (e.g., June 1, 2025)"
                        className="form-input"
                      />
                      <button className="action-button" onClick={() => handleAddSubtask(project._id)}>
                        Add Subtask
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="comment-section" ref={commentSectionRef}>
          <h2 className="section-title">Team Discussion</h2>
          <div className="comment-feed">
            {comments.map((comment, index) => (
              <div className="comment" key={index}>
                <p>
                  <strong>{comment.user}</strong>: {comment.text}
                </p>
                <span className="comment-time">{new Date(comment.time).toLocaleString()}</span>
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

      <footer className="workspace-footer">
        <p>Effica © 2025 | Crafted by <strong>Anurag Chandra</strong></p>
      </footer>
    </div>
  );
}

export default Main;
