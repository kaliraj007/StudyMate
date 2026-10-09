const API_URL = "http://localhost:8080/api/tasks";
const AUTH_URL = "http://localhost:8080/api/auth";

let tasks = [];
let currentFilter = "all";
let searchText = "";
let currentUser = null;


// ========================================
// AUTH ELEMENTS
// ========================================

const authPage = document.getElementById("authPage");
const dashboardPage = document.getElementById("dashboardPage");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const confirmPassword = document.getElementById("confirmPassword");

const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const logoutButton = document.getElementById("logoutButton");

const userName = document.getElementById("userName");


// ========================================
// TASK ELEMENTS
// ========================================

const taskNameInput = document.getElementById("taskName");
const taskPriorityInput = document.getElementById("taskPriority");
const taskDeadlineInput = document.getElementById("taskDeadline");

const addTaskButton = document.getElementById("addTaskButton");

const taskList = document.getElementById("taskList");

const searchTaskInput = document.getElementById("searchTask");

const allButton = document.getElementById("allButton");
const pendingButton = document.getElementById("pendingButton");
const completedButton = document.getElementById("completedButton");

const totalTasksElement = document.getElementById("totalTasks");
const completedTasksElement = document.getElementById("completedTasks");
const pendingTasksElement = document.getElementById("pendingTasks");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");


// ========================================
// SHOW REGISTER
// ========================================

showRegister.addEventListener("click", function () {

    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");

});


// ========================================
// SHOW LOGIN
// ========================================

showLogin.addEventListener("click", function () {

    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");

});


// ========================================
// REGISTER
// ========================================

registerButton.addEventListener("click", async function () {

    const name = registerName.value.trim();
    const email = registerEmail.value.trim();
    const password = registerPassword.value;
    const confirm = confirmPassword.value;


    if (name === "") {
        alert("Please enter your name.");
        return;
    }


    if (name.length < 3) {
        alert("Name must contain at least 3 characters.");
        return;
    }


    if (email === "") {
        alert("Please enter your email.");
        return;
    }


    if (!email.includes("@")) {
        alert("Please enter a valid email.");
        return;
    }


    if (password === "") {
        alert("Please enter a password.");
        return;
    }


    if (password.length < 6) {
        alert("Password must contain at least 6 characters.");
        return;
    }


    if (password !== confirm) {
        alert("Passwords do not match.");
        return;
    }


    try {

        const response = await fetch(
            `${AUTH_URL}/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        if (!response.ok || data === null) {

            alert("Email already registered.");

            return;
        }


        alert("Account created successfully! Please login.");


        registerName.value = "";
        registerEmail.value = "";
        registerPassword.value = "";
        confirmPassword.value = "";


        registerForm.classList.add("hidden");
        loginForm.classList.remove("hidden");


        loginEmail.value = email;

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server. Make sure Spring Boot is running."
        );

    }

});


// ========================================
// LOGIN
// ========================================

loginButton.addEventListener("click", async function () {

    const email = loginEmail.value.trim();
    const password = loginPassword.value;


    if (email === "") {
        alert("Please enter your email.");
        return;
    }


    if (password === "") {
        alert("Please enter your password.");
        return;
    }


    try {

        const response = await fetch(
            `${AUTH_URL}/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        if (!response.ok || data === null) {

            alert("Invalid email or password.");

            return;
        }


        currentUser = data;


        localStorage.setItem(
            "studymateUser",
            JSON.stringify(currentUser)
        );


        showDashboard();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server. Make sure Spring Boot is running."
        );

    }

});


// ========================================
// SHOW DASHBOARD
// ========================================

function showDashboard() {

    authPage.classList.add("hidden");

    dashboardPage.classList.remove("hidden");


    userName.textContent =
        currentUser.name;


    loadTasks();

}


// ========================================
// LOGOUT
// ========================================

logoutButton.addEventListener("click", function () {

    localStorage.removeItem("studymateUser");

    currentUser = null;

    tasks = [];

    dashboardPage.classList.add("hidden");

    authPage.classList.remove("hidden");


    loginEmail.value = "";
    loginPassword.value = "";

    taskList.innerHTML = "";

});


// ========================================
// CHECK SAVED LOGIN
// ========================================

function checkSavedLogin() {

    const savedUser =
        localStorage.getItem("studymateUser");


    if (savedUser) {

        try {

            currentUser =
                JSON.parse(savedUser);


            showDashboard();

        }

        catch (error) {

            localStorage.removeItem("studymateUser");

        }

    }

}


// ========================================
// LOAD USER TASKS
// ========================================

async function loadTasks() {

    if (!currentUser) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}?email=${encodeURIComponent(currentUser.email)}`
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load tasks"
            );

        }


        tasks = await response.json();


        displayTasks();

        updateStatistics();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to load tasks. Make sure Spring Boot is running."
        );

    }

}


// ========================================
// ADD TASK
// ========================================

addTaskButton.addEventListener("click", async function () {

    if (!currentUser) {
        alert("Please login first.");
        return;
    }


    const name =
        taskNameInput.value.trim();

    const priority =
        taskPriorityInput.value;

    const deadline =
        taskDeadlineInput.value;


    if (name === "") {

        alert("Please enter a task name.");

        return;
    }


    if (name.length < 3) {

        alert(
            "Task name must contain at least 3 characters."
        );

        return;
    }


    if (deadline === "") {

        alert("Please select a deadline.");

        return;
    }


    const newTask = {

        name: name,

        priority: priority,

        deadline: deadline,

        completed: false

    };


    try {

        const response = await fetch(
            `${API_URL}?email=${encodeURIComponent(currentUser.email)}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(newTask)
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to create task"
            );

        }


        const savedTask =
            await response.json();


        tasks.push(savedTask);


        taskNameInput.value = "";

        taskPriorityInput.value = "Medium";

        taskDeadlineInput.value = "";


        displayTasks();

        updateStatistics();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to add task. Make sure Spring Boot is running."
        );

    }

});


// ========================================
// DISPLAY TASKS
// ========================================

function displayTasks() {

    taskList.innerHTML = "";


    let filteredTasks =
        [...tasks];


    // FILTER

    if (currentFilter === "pending") {

        filteredTasks =
            filteredTasks.filter(
                task => !task.completed
            );

    }


    if (currentFilter === "completed") {

        filteredTasks =
            filteredTasks.filter(
                task => task.completed
            );

    }


    // SEARCH

    if (searchText !== "") {

        filteredTasks =
            filteredTasks.filter(
                task =>
                    task.name
                        .toLowerCase()
                        .includes(
                            searchText.toLowerCase()
                        )
            );

    }


    // NO TASKS

    if (filteredTasks.length === 0) {

        if (searchText !== "") {

            taskList.innerHTML = `
                <li class="no-task">
                    🔎 No tasks found for "${searchText}"
                </li>
            `;

        }

        else {

            taskList.innerHTML = `
                <li class="no-task">
                    No tasks available.
                </li>
            `;

        }

        return;
    }


    // CREATE TASK ITEMS

    filteredTasks.forEach(task => {

        const li =
            document.createElement("li");


        li.className =
            "task-item";


        if (task.completed) {

            li.classList.add(
                "completed-task"
            );

        }


        if (isOverdue(task)) {

            li.classList.add(
                "overdue-task"
            );

        }


        const priorityClass =
            task.priority.toLowerCase();


        li.innerHTML = `

            <div class="task-info">

                <div class="task-title">

                    <span class="task-name">
                        ${escapeHtml(task.name)}
                    </span>

                    <span class="priority ${priorityClass}">
                        ${task.priority}
                    </span>

                </div>


                <div class="task-deadline">

                    📅 ${formatDate(task.deadline)}

                    ${
                        isOverdue(task)
                            ? '<span class="overdue-label">Overdue</span>'
                            : ""
                    }

                </div>

            </div>


            <div class="task-actions">

                ${
                    task.completed
                        ? `
                            <button
                                class="action-button undo-button"
                                onclick="completeTask(${task.id})"
                            >
                                ↩ Undo
                            </button>
                        `
                        : `
                            <button
                                class="action-button complete-button"
                                onclick="completeTask(${task.id})"
                            >
                                ✓ Complete
                            </button>
                        `
                }


                <button
                    class="action-button edit-button"
                    onclick="editTask(${task.id})"
                >
                    ✏ Edit
                </button>


                <button
                    class="action-button delete-button"
                    onclick="deleteTask(${task.id})"
                >
                    🗑 Delete
                </button>

            </div>

        `;


        taskList.appendChild(li);

    });

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ========================================
// FORMAT DATE
// ========================================

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ========================================
// CHECK OVERDUE
// ========================================

function isOverdue(task) {

    if (task.completed) {
        return false;
    }


    if (!task.deadline) {
        return false;
    }


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const deadline =
        new Date(
            task.deadline + "T00:00:00"
        );


    return deadline < today;

}


// ========================================
// COMPLETE / UNDO TASK
// ========================================

async function completeTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) {
        return;
    }


    const updatedTask = {

        name: task.name,

        priority: task.priority,

        deadline: task.deadline,

        completed: !task.completed

    };


    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(updatedTask)
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to update task"
            );

        }


        const savedTask =
            await response.json();


        const index =
            tasks.findIndex(
                task => task.id === id
            );


        tasks[index] =
            savedTask;


        displayTasks();

        updateStatistics();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to update task."
        );

    }

}


// ========================================
// EDIT TASK
// ========================================

async function editTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) {
        return;
    }


    const newName =
        prompt(
            "Enter new task name:",
            task.name
        );


    if (newName === null) {
        return;
    }


    const trimmedName =
        newName.trim();


    if (trimmedName === "") {

        alert(
            "Task name cannot be empty."
        );

        return;
    }


    if (trimmedName.length < 3) {

        alert(
            "Task name must contain at least 3 characters."
        );

        return;
    }


    const updatedTask = {

        name: trimmedName,

        priority: task.priority,

        deadline: task.deadline,

        completed: task.completed

    };


    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(updatedTask)
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to edit task"
            );

        }


        const savedTask =
            await response.json();


        const index =
            tasks.findIndex(
                task => task.id === id
            );


        tasks[index] =
            savedTask;


        displayTasks();

        updateStatistics();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to edit task."
        );

    }

}


// ========================================
// DELETE TASK
// ========================================

async function deleteTask(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to delete task"
            );

        }


        tasks =
            tasks.filter(
                task => task.id !== id
            );


        displayTasks();

        updateStatistics();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to delete task."
        );

    }

}


// ========================================
// UPDATE STATISTICS
// ========================================

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const pending =
        total - completed;


    totalTasksElement.textContent =
        total;


    completedTasksElement.textContent =
        completed;


    pendingTasksElement.textContent =
        pending;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    progressFill.style.width =
        percentage + "%";


    progressText.textContent =
        percentage + "% Completed";

}


// ========================================
// SEARCH
// ========================================

searchTaskInput.addEventListener(
    "input",
    function () {

        searchText =
            searchTaskInput.value.trim();

        displayTasks();

    }
);


// ========================================
// FILTER BUTTONS
// ========================================

allButton.addEventListener(
    "click",
    function () {

        currentFilter = "all";

        setActiveButton(allButton);

        displayTasks();

    }
);


pendingButton.addEventListener(
    "click",
    function () {

        currentFilter = "pending";

        setActiveButton(pendingButton);

        displayTasks();

    }
);


completedButton.addEventListener(
    "click",
    function () {

        currentFilter = "completed";

        setActiveButton(completedButton);

        displayTasks();

    }
);


// ========================================
// SET ACTIVE FILTER BUTTON
// ========================================

function setActiveButton(activeButton) {

    allButton.classList.remove(
        "active"
    );

    pendingButton.classList.remove(
        "active"
    );

    completedButton.classList.remove(
        "active"
    );


    activeButton.classList.add(
        "active"
    );

}


// ========================================
// START APPLICATION
// ========================================

checkSavedLogin();