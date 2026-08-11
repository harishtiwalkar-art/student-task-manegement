// LocalStorage Initialization
let tasks = JSON.parse(localStorage.getItem('student_tasks')) || [];

const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const filterStatus = document.getElementById('filter-status');

// Save tasks to LocalStorage and trigger re-render
function saveTasks() {
  localStorage.setItem('student_tasks', JSON.stringify(tasks));
  renderTasks();
}

// Add New Task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const newTask = {
    id: Date.now(),
    title: document.getElementById('task-title').value,
    subject: document.getElementById('task-subject').value,
    date: document.getElementById('task-date').value,
    priority: document.getElementById('task-priority').value,
    completed: false
  };

  tasks.unshift(newTask);
  saveTasks();
  taskForm.reset();
});

// Toggle Task Completion
function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTasks();
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
}

// Update Top Counter Statistics
function updateStats() {
  document.getElementById('total-count').textContent = tasks.length;
  document.getElementById('pending-count').textContent = tasks.filter(t => !t.completed).length;
  document.getElementById('completed-count').textContent = tasks.filter(t => t.completed).length;
}

// Render Tasks to DOM
function renderTasks() {
  taskList.innerHTML = '';
  const filter = filterStatus.value;

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<li style="text-align: center; color: #94a3b8; padding: 1rem;">No tasks found.</li>`;
  }

  filteredTasks.forEach(t => {
    const li = document.createElement('li');
    li.className = `task-item ${t.completed ? 'completed' : ''}`;
    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTask(${t.id})">
        <div class="task-details">
          <span class="task-title">${escapeHtml(t.title)}</span>
          <div class="task-meta">
            <span>📚 ${escapeHtml(t.subject)}</span>
            <span>📅 ${t.date}</span>
            <span class="badge badge-${t.priority}">${t.priority}</span>
          </div>
        </div>
      </div>
      <button class="delete-btn" onclick="deleteTask(${t.id})" aria-label="Delete task">&times;</button>
    `;
    taskList.appendChild(li);
  });

  updateStats();
}

// Helper function to prevent XSS
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, match => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[match]));
}

filterStatus.addEventListener('change', renderTasks);

// Initial Load
renderTasks();