import React, { useEffect, useState } from 'react';
import '../styles/TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [project, setProject] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
      setFilteredTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    setFilteredTasks(tasks.filter(task => {
      return (!search || task['Task Name'].toLowerCase().includes(search.toLowerCase()) || task.Description.toLowerCase().includes(search.toLowerCase())) &&
             (!status || task.Status === status) &&
             (!project || task.Project === project);
    }));
  }, [search, status, project, tasks]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // This function now expects an event and optionally a taskId
  const handleStatusChange = (taskId = null) => (event) => {
    const newStatus = event.target.value;
    console.log("we are calling this method successfuly");
    if (taskId) {
      // This is a task-specific status change
      console.log("we are updating task status");
      updateTaskStatus(taskId, newStatus);
    } else {
      // This is a global filter status change
      console.log("filtering by status");
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
        fields: {
          Status: newStatus
        }
      };
  
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) throw new Error('Failed to update task status');
  
      await fetchTasks();

      const updatedTasks = filteredTasks.map(task => {
        if (task.id === taskId) {
          return {...task, Status: newStatus};
        }
        return task;
      });
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
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) => (
            <div key={index} className="task">
              <h3>{task['Task Name']   || 'No Title'}</h3>
              <div className="task-project">
                {task.Project || 'No Project'}
              </div>
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
                  <select
                    className={getStatusClassName(task.Status)}
                    value={task.Status}
                    onChange={handleStatusChange(task.id)}>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div class="loading-container">
            <div id="loadingIndicator" class="loading-indicator"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
