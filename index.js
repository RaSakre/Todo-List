const completeIcon = document.querySelector('.task-complete-button')
const tasksList = document.querySelector('.tasks__list');
const doneList = document.querySelector('.done-list')
const taskTodoLength = document.querySelector('.tasks-todo-length')
const tasksDoneLegnth = document.querySelector('.tasks-done-length')
const addTaskButton = document.querySelector('.header__form-button');
const taskForm = document.forms['task-form']
const taskInput = taskForm.elements['task-name']
const taskTemplate = document.getElementById('task-template').content
const completedTaskTemplate = document.getElementById('completed-task-template').content



taskTodoLength.textContent = tasksList.children.length
tasksDoneLegnth.textContent = doneList.children.length

tasksList.addEventListener('click', function(evt){ 
	const taskCompleteContent = completedTaskTemplate.querySelector('.todo-task').cloneNode(true)		// Клик по кнопке галочки перемещает задачу в список выполненных
	const task = taskCompleteContent.closest('.task')
	if (evt.target.classList.contains('task-complete-button')) {
	const completedTask = evt.target.closest('.task')
	completedTask.remove()
	const taskText = completedTask.querySelector('.task-text').textContent;
	const completedTaskText = task.querySelector('.task-text')
	completedTaskText.textContent = taskText
	doneList.append(task)
	completedTaskText.classList.add('done-task-text')
	tasksDoneLegnth.textContent = doneList.children.length
	taskTodoLength.textContent = tasksList.children.length
	}
})


tasksList.addEventListener('click', function(evt){
  const deleteIcon = evt.target.closest('.task-delete-button')						// Клик по иконке корзинки удаляет задачу из списка
  if (deleteIcon) {
    deleteIcon.closest('.task').remove()
    taskTodoLength.textContent = tasksList.children.length
  }
})

taskForm.addEventListener('submit', formAddTaskSubmit)

function formAddTaskSubmit(evt) {
	evt.preventDefault();
	postRequest(taskInput.value)
	.then((data) =>
	{
		console.log(data)
		const taskContent = taskTemplate.querySelector('.todo-task').cloneNode(true)			// Клик по кнопке добавления задачи добавляет её в список задач
		const task = (taskContent.closest('.task'))
		tasksList.append(task)
		const taskText = (taskContent.querySelector('.task-text').textContent = data.title)
		taskForm.reset()
		taskTodoLength.textContent = tasksList.children.length
	})
}

function postRequest (inputValue) {
	return fetch('http://localhost:3000/todos', {
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			title: inputValue,
			completed: false
		})
	})
	.then(checkServerState)
}

function checkServerState(res) {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(`Ошибка ${res.status}`);
  }
}

function saveTask(data) {
	taskText.textContent = data.title
}









