// ------------------ ↓ GLOBAL VARIABLES (ALLOWED TO BE USED IN EVERY FUNCTION ONWARDS) ↓ ------------------

const taskForm = document.getElementById("taskForm");
const url = "http://localhost:3000";


// ----------------------------------------- ↓ GENERAL FUNCTIONS ↓ -----------------------------------------

function resetForm() {
    taskForm.reset();
}


// ----------------------------- ↓ GENERAL EVENT LISTENERS (TRIGGERS) ↓ ---------------------------------

const sortButton = document.getElementById("sortSelect");
// Reset tasks to be sorted by default when the page loads
window.addEventListener("DOMContentLoaded", () => {
    sortButton.value = "default";
});

sortButton.addEventListener("change", () => {
    displayTasks();
});


// resets form and gets tasks and displays them when window loads/refreshes
window.addEventListener("DOMContentLoaded", () => {
    displayTasks();
});


// ----------------------------- ↓ EVENT LISTENERS (TRIGGERS) FOR TASKS ↓ ---------------------------------

// To be used for all event listeners fo each task action
const toDoList = document.getElementById("toDoList");
const completedList = document.getElementById("completedList");


// To create a task on form submission
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    createNewTask();
});


// To complete a task
toDoList.addEventListener("click", (event) => {
    if (event.target.classList.contains("done")) {
        const taskId = event.target.getAttribute("data-id");
        completeTask(taskId);
    }
});


// To NOT complete a task
completedList.addEventListener("click", (event) => {
    if (event.target.classList.contains("notDone")) {
        const taskId = event.target.getAttribute("data-id");
        taskNotCompleted(taskId);
    }
});


// Deleting a task
[toDoList, completedList].forEach(list => {
    list.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete")) {
            const taskId = event.target.getAttribute("data-id");
            deleteTask(taskId);
        }
    });
});


// Editing the task
toDoList.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit")) {
        const taskId = event.target.getAttribute("data-id");
        const taskTitle = event.target.getAttribute("data-title");
        const taskDescription = event.target.getAttribute("data-description");
        const taskDueDate = new Date(event.target.getAttribute("data-due-date"));

        const editTaskName = document.getElementById("editTaskName");
        const editTaskDescription = document.getElementById("editTaskDescription");
        const editDueDate = document.getElementById("editDueDate");
        const saveChangesButton = document.getElementById("saveChangesButton");

        editTaskName.value = taskTitle;
        editTaskDescription.value = taskDescription;

        // This is to convert the date format back to the ISO 8601 standard so that is able to be read by <input type="date">
        const formattedDueDate = taskDueDate.toISOString().split("T")[0];

        editDueDate.value = formattedDueDate;

        saveChangesButton.addEventListener("click", async () => {
            await editTask(taskId);

            const editTaskModal = bootstrap.Modal.getInstance(document.getElementById("editTaskWindow"));
            editTaskModal.hide();
        }, { once: true });
    }
});


// --------------------------------------------- ↓ TASK FUNCTIONS ↓ ---------------------------------------------


// --------- Get tasks --------- 
async function displayTasks() {
    try {
        const sortSelect = document.getElementById("sortSelect");
        const sortBy = sortSelect.value; // due date, date created, or default

        let query = "";
        if (sortBy !== "default") {
            query = `?sortBy=${sortBy}`;
        }

        const response = await fetch(`${url}/tasks${query}`);
        const data = await response.json();

        function formatTask(task) {
            const li = document.createElement("li");
            li.classList.add("p-3", "mt-2", "shadow-sm", "card");
            li.innerHTML = task.completed ?
            // how are we displaying the completed tasks?
            `
            <div class="d-flex justify-content-between align-items-start">
                <h4 class="col-11 text-decoration-line-through opacity-50">${task.title}</h4>
                <button data-id="${task._id}" type="button" class="btn-close delete" aria-label="Close"></button>
            </div>
            <p class="text-decoration-line-through opacity-50">${task.description}</p>
            <p class="text-decoration-line-through opacity-50"><strong>Due: </strong>${new Date(task.dueDate).toLocaleDateString()}</p>
            <div class="d-flex justify-content-between align-items-end">
                <div>
                    <button data-id="${task._id}" type="button" class="btn btn-dark shadow-sm notDone">Not done</button>
                </div>
                <p class="m-0 text-decoration-line-through opacity-50"><strong>Created on: </strong>${new Date(task.createdOn).toLocaleDateString()}</p>
            </div>
            `
            :
            // how are we displaying the tasks that aren't yet completed?
            `
            <div class="d-flex justify-content-between align-items-start">
                <h4 class="col-11">${task.title}</h4>
                <button data-id="${task._id}" type="button" class="btn-close delete" aria-label="Close"></button>
            </div>
            <p>${task.description}</p>
            <p><strong>Due: </strong>${new Date(task.dueDate).toLocaleDateString()}</p>
            <div class="d-flex justify-content-between align-items-end">
                <div>   
                    <button data-id="${task._id}" data-title="${task.title}" data-description="${task.description}" data-due-date="${task.dueDate}" data-bs-toggle="modal" data-bs-target="#editTaskWindow" class="btn btn-dark shadow-sm edit" type="button">Edit</button>
                    <button data-id="${task._id}" type="button" class="btn btn-dark shadow-sm done">Done</button>
                </div>
                <p class="m-0"><strong>Created on: </strong>${new Date(task.createdOn).toLocaleDateString()}</p>
            </div>
            `;
            return li;
        }

        toDoList.innerHTML = "";
        completedList.innerHTML = "";

        const tasks = data;
        
        tasks.forEach(task => {
            task.completed ? completedList.appendChild(formatTask(task)) : toDoList.appendChild(formatTask(task));
        });

        resetForm();
        
    } catch (error) {
        console.error("Error:", error);
    }
}




// -------- Create task --------
async function createNewTask() {
    try {
        const taskDetails = {
            title: document.getElementById("taskName").value.trim(),
            description: document.getElementById("taskDescription").value.trim(),
            dueDate: document.getElementById("dueDate").value.trim(),
        }

        if (!taskDetails.title || !taskDetails.description || !taskDetails.dueDate) {
            return alert("All fields required!");
        }

        const response = await fetch(`${url}/tasks/todo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskDetails)
        });

        if (!response.ok) {
            throw new Error(`Failed to create task!: ${response.status}`);
        }

        const data = await response.json();
        console.log("New task created", data);
        displayTasks();

    } catch (error) {
       console.error("Error:", error);
    }
}




// -------- Complete task --------
async function completeTask(taskId) {
    try {
        const response = await fetch(`${url}/tasks/complete/${taskId}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ completed: true })
        });

        if (!response.ok) {
            throw new Error(`Failed to complete the task: ${response.status}`);
        }

        const data = await response.json();
        console.log("Task completed", data);
        displayTasks();

    } catch (error) {
        console.error("Error:", error);
    }
}




// -------- To NOT complete a task --------
async function taskNotCompleted(taskId) {
    try {
        const response = await fetch(`${url}/tasks/notComplete/${taskId}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ completed: false })
        });

        if (!response.ok) {
            throw new Error(`Failed to set the task to not complete: ${response.status}`);
        }

        const data = await response.json();
        console.log("Task set to 'not complete'", data);
        displayTasks();
    } catch (error) {
        console.error("Error:", error);
    }
}




// -------- Deleting a Task --------
async function deleteTask(taskId) {
    try {
        const response = await fetch(`${url}/tasks/delete/${taskId}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to delete the task: ${response.status}`);
        }

        const data = await response.json();
        console.log("Task deleted", data);
        displayTasks();

    } catch (error) {
        console.error("Error:", error);
    }
}




// Enables editing of the task
async function editTask(taskId) {

    const updatedDetails = {     
        title: document.getElementById('editTaskName').value.trim(),
        description: document.getElementById('editTaskDescription').value.trim(),
        dueDate: document.getElementById('editDueDate').value
    };

    try {
        const response = await fetch(`${url}/tasks/update/${taskId}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedDetails)
        });

        if (!response.ok) {
            throw new Error(`Failed to edit task: ${response.status}`);
        }

        const data = await response.json();
        console.log("Edited task:", data);
        displayTasks();
        
    } catch (error) {
        console.error("Error:", error);
    }
}
