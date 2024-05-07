import React, { useEffect, useState } from 'react';
import '../styles/TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [project, setProject] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [timeoutError, setTimeoutError] = useState(false);
  //const [timerId, setTimerId] = useState(null);

  useEffect(() => {

  
    const fetchTasks = async () => {
      setIsLoading(true);
      setTimeoutError(false);
  
      try {
        const response = await fetch('/api/tasks');
        const data = await response.json();
        setTasks(data);
        setFilteredTasks(data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        setTimeoutError(true);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchTasks();
  
    let timerId = setTimeout(() => {
      if (tasks.length === 0 && !timeoutError) {
        setTimeoutError(true);
      }
    }, 5000);
  
    return () => clearTimeout(timerId);
  }, []);

  useEffect(() => {
    const filtered = tasks.filter(task => {
      return (!search || task['Task Name'].toLowerCase().includes(search.toLowerCase()) || task.Description.toLowerCase().includes(search.toLowerCase())) &&
             (!status || task.Status === status) &&
             (!project || task.Project === project);
    });
    setFilteredTasks(filtered);
    if (!filtered.length && !isLoading) {
      setTimeoutError(true);
    } else {
      setTimeoutError(false);
    }
  }, [search, status, project, tasks]); // Ensure all these dependencies are correct
  

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleStatusChange = (taskId = null) => (event) => {
    const newStatus = event.target.value;
    if (taskId) {
      updateTaskStatus(taskId, newStatus);
    } else {
      setStatus(newStatus);
    }
  };

  const handleProjectChange = (e) => {
    setProject(e.target.value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusClassName = (status) => {
    return `status-select ${status.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const endpoint = '/api/updateTask';
      const payload = {
        id: taskId,
        fields: { Status: newStatus }
      };

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to update task status');

      await fetchTasks();

      const updatedTasks = filteredTasks.map(task => task.id === taskId ? { ...task, Status: newStatus } : task);
      setFilteredTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="task-list">
      <h1>My Tasks</h1>
      <div className="filters">
        <input type="text" placeholder="Search by task name..." aria-label="Search tasks" value={search} onChange={handleSearchChange} />
        <select aria-label="Filter by status" value={status} onChange={handleStatusChange()}>
          <option value="">All Statuses</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <select aria-label="Filter by project" value={project} onChange={handleProjectChange}>
          <option value="">All Projects</option>
          {[...new Set(tasks.map(task => task.Project))].map((proj, index) => (
            <option key={index} value={proj}>{proj}</option>
          ))}
        </select>
      </div>
      <div className="task-container">
        {isLoading ? (
          <div className="loading-container">
            <div id="loadingIndicator" className="loading-indicator"></div>
          </div>
        ) : timeoutError ? (
          <div>No data found... try double-checking your spelling</div>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) => (
            <div key={index} className="task">
              <h3>{task['Task Name'] || 'No Title'}</h3>
              <div className="task-project">{task.Project || 'No Project'}</div>
              <div className="task-details">
                <div className="task-info">
                  <span className="label">Description</span>
                  <p>{task.Description || 'No Description'}</p>
                </div>
                <div className="task-info">
                  <span className="label">Deadline</span>
                  <p>{formatDate(task.Deadline) || 'No Deadline'}</p>
                </div>
                <div className="task-info">
                  <span className="label">Priority</span>
                  <p>{task.Priority || 'No Priority'}</p>
                </div>
                <div className="task-info">
                  <select className={getStatusClassName(task.Status)} value={task.Status} onChange={handleStatusChange(task.id)}>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="loading-container">
            <div id="loadingIndicator" className="loading-indicator"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
