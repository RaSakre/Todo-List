
const tasksList = document.querySelector(".tasks__list");
const doneList = document.querySelector(".done-list");
const taskTodoLength = document.querySelector(".tasks-todo-length");
const tasksDoneLegnth = document.querySelector(".tasks-done-length");
const addTaskButton = document.querySelector(".header__form-button");
const taskForm = document.forms["task-form"];
const taskInput = taskForm.elements["task-name"];
const taskTemplate = document.getElementById("task-template").content;
const completedTaskTemplate = document.getElementById(
  "completed-task-template"
).content;

function createTask (title, id, completed) {
	const taskContent = taskTemplate
	.querySelector(".todo-task")
	.cloneNode(true);
const task = taskContent.closest(".task");
tasksList.append(task);
taskContent.querySelector(".task-text").textContent = title;
taskTodoLength.textContent = tasksList.children.length;                
	const deleteIcon = taskContent.querySelector(".task-delete-button");   
	deleteIcon.addEventListener('click', function(){
		deleteTask(deleteIcon, id )
	})
	const completeIcon = taskContent.querySelector(".task-complete-button");
	completeIcon.addEventListener('click', function(){
		completeTask(completeIcon, id)
	})
	if(completed){
	const taskCompleteContent = completedTaskTemplate.querySelector('.todo-task').cloneNode(true)    // Клик по кнопке галочки перемещает задачу в список выполненных
	const completedTask = taskCompleteContent.closest('.task')
	const taskText = task.querySelector('.task-text').textContent;
	const completedTaskText = completedTask.querySelector('.task-text')
	completedTaskText.textContent = taskText
	doneList.append(completedTask)
	completedTaskText.classList.add('done-task-text')
	task.remove()
	tasksDoneLegnth.textContent = doneList.children.length
	taskTodoLength.textContent = tasksList.children.length
	}
}

taskTodoLength.textContent = tasksList.children.length;
tasksDoneLegnth.textContent = doneList.children.length;



function completeTask(button, id) {
	patchRequest(id).then(() =>{
		const task = button.closest('.task')
		const taskCompleteContent = completedTaskTemplate.querySelector('.todo-task').cloneNode(true)    // Клик по кнопке галочки перемещает задачу в список выполненных
		const completedTask = taskCompleteContent.closest('.task')
		task.remove()
		const taskText = task.querySelector('.task-text').textContent;
		const completedTaskText = completedTask.querySelector('.task-text')
		completedTaskText.textContent = taskText
		doneList.append(completedTask)
		completedTaskText.classList.add('done-task-text')
		tasksDoneLegnth.textContent = doneList.children.length
		taskTodoLength.textContent = tasksList.children.length
	})
}


function patchRequest(id){
	return fetch (`http://localhost:8000/todos/${id}`, {
		method: 'PATCH',
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			completed: true
		})
	}).then(checkServerState)
}


function deleteTask (button, id){
const task = button.closest('.todo-task')
deleteRequest(id).then(() =>{
task.remove()
taskTodoLength.textContent = tasksList.children.length;
})
}



function deleteRequest(id) {
	return fetch (`http://localhost:8000/todos/${id}`, {
		method: 'DELETE',
		headers: {
			"Content-Type": "application/json",
		}
	}).then(checkServerState)
}

taskForm.addEventListener("submit", formAddTaskSubmit);

function formAddTaskSubmit(evt) {
  evt.preventDefault();
  postRequest(taskInput.value).then((data) => {
		const taskContent = taskTemplate
		.querySelector(".todo-task")
		.cloneNode(true);
	const task = taskContent.closest(".task");
	tasksList.append(task);
	taskContent.querySelector(".task-text").textContent = data.title;
	taskTodoLength.textContent = tasksList.children.length;
	taskForm.reset();
		const completeButton = taskContent.querySelector('.task-complete-button')
		completeButton.addEventListener('click', function(){
			completeTask(completeButton, data.id)
		})
		const deleteButton = taskContent.querySelector('.task-delete-button')
		deleteButton.addEventListener('click', function(){
			deleteTask(deleteButton, data.id)
		})
	})
}

function addTaskToList(taskTitle) {

}

function postRequest(inputValue) {
  return fetch("http://localhost:8000/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: inputValue,
      completed: false,
    }),
  }).then(checkServerState);
}

function getRequest() {
	return fetch("http://localhost:8000/todos")
		.then((res) => res.json())
		.then((data) => data);
}

getRequest().then((data) => {
	data.forEach(function(el){
		createTask(el.title, el.id, el.completed)
	})
})

function getId() {	
	return fetch("http://localhost:8000/todos")
.then((res) => res.json())
.then((data) => data);
}

getId().then((data) => {
	
})


function checkServerState(res) {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(`Ошибка ${res.status}`);
  }
}

fetch('http://localhost:8000/todos')