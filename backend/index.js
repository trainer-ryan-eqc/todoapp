const express = require('express');    // Enables use of express.js
const mongoose = require('mongoose');  // Enables use of MongoDB Database
const cors = require('cors');  // This is used when deploying front end and backend on different servers
const path = require('path'); // This enables the backend server to connect to the the front end and serve the HTML pages
const bcrypt = require('bcrypt');  // enables the hashing of passwords
require('dotenv').config(); //Enables the use of .env file - to store sensitive data
const port = 3000;  // Port number the app is running on: http://localhost:3000

const app = express();  // Allows you to use the express.js framework for running the app (API's etc.)





app.use(express.json()); // middleware - translates incoming JSON formats to easy-to-read Javascript objects example: from JSON { "example": "This is an example" } → to Javascript Object { example: "This is an example"}
app.use(cors("*"));







// Connecting to MongoDB database
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))    // Logging the connection
.catch(err => console.error('MongoDB Connection Error: ', err));  // Logging the error if unable to connect

// Database Schema (MongoDB)

// defining data structure within database

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    dueDate: {type: Date, required: true},
    completed: {type: Boolean, required: true}
});
const Task = mongoose.model("Task", taskSchema);





// ----------------------- ↓ PAGE SERVING/DISPLAY ↓ ---------------------------  SSR - Server side Rendering

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

app.get('/features', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/features.html'));
});

app.get('/pricing', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pricing.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/signup.html'));
});





// ----------------------- ↓ ROUTES ↓ ---------------------------

//--------------------- TASK HANDLING ↓ ---------------------


// To create new tasks and save them to the database - (without users)
app.post('/tasks', async (req, res) => {
    try {
        const { title, description, dueDate, completed } = req.body;

        if (!title || !description || !dueDate) {
            return res.status(400).json({ Error: 'All fields required' });
        }

        const taskData = { title, description, dueDate, completed };
        const createTask = new Task(taskData);
        const saveTask = await createTask.save();

        res.status(200).json({ message: 'Save successful', task: saveTask });

    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json();
    }
});





// To retrieve tasks from the database and display them on the front end - (without users)
app.get('/tasks', async (req, res) => {
    try {
        const response = await Task.find({});

        console.log(response);
        res.json(response);
        
    } catch (error) {
        console.error('Backend error:', error);
        res.status(500).json({ error: 'Error grabbing tasks!' });
    }
});





// To 'complete' the task and move columns ↓   
app.patch('/tasks/complete/:id', async (req, res) => {
    try {
        const { completed } = req.body;
        const taskId = req.params.id;

        const response = await Task.findByIdAndUpdate(taskId, { completed }, { new: true });

        if (!response) {
            return res.status(404).json({ message: 'Task not found' });
        }

        console.log(response);
        res.json(response);
        
    } 
    catch (error) {
        console.error('Error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});






// To make the task 'not complete' and move columns ↓
app.patch('/tasks/notComplete/:id', async (req, res) => {
    try {
       const { completed } = req.body; 
       const taskId = req.params.id;

       const response = await Task.findByIdAndUpdate(taskId, { completed }, { new: false });

       if (!response) {
        return res.status(404).json({ message: "Task not found!" });
       }

       console.log(response);
       res.json({ task: response, message: "Task set to 'Not Complete'" });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal server error!" });
    }
});





// To delete the task  ↓ 
app.delete('/tasks/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const response = await Task.findByIdAndDelete(taskId);

        if (!response) {
            return res.status(404).json({ message: 'Task not found!' });
        }

        console.log(response);
        res.json({ task: response, message: 'Task deleted successfully!' });

    } catch (error) {
        console.error('Error deleting task', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
});






// To edit exisiting task and update
app.patch('/tasks/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const { title, description, dueDate, completed } = req.body;  // Extract data from front end request

        if (!title || !description || !dueDate) {
            return res.status(400).json({ Error: 'All fields required!' })
        }

        const taskData = { title, description, dueDate, completed };
        const response = await Task.findByIdAndUpdate(taskId, taskData, { new: true });

        if (!response) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Update successful!', UpdatedTask: response });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json();
    }
});





app.listen(port, () => {
    console.log(`To Do App listening on port: ${port}`);  // To Do App listening on port: 3000
});