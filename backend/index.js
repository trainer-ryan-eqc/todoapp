// --------------------------- ↓ SETTING UP DEPENDENCIES ↓ --------------------------------

const express = require('express'); // Enables use of Express.js
const cors = require('cors'); // Enables Cross Origin Resource Sharing
const mongoose = require('mongoose'); // Enable mongoose (MongoDB library) to be able to connect to database
require("dotenv").config(); // Enables use of .env file


// ---------------------------- ↓ INITIAL APP CONFIGURATION ↓ -----------------------------

const port = process.env.PORT || 3000; // Uses port number on device to serve the backend
const app = express();  // Using Express.js to power the app



// -------------------------------- ↓ MIDDLEWARE SETUP ↓ -----------------------------------

app.use(express.json());  // Uses express in JSON format
app.use(cors('*')); // Enables use of CORS - * means every domain is now allowed acces to this server to send and receive data - not secure - * is for development only



// ----------------------- ↓ DATABASE CONNECTION + APP STARTUP ↓ --------------------------

(async () => {
    try {
        mongoose.set("autoIndex", false);

        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected!");

        await Task.syncIndexes();
        console.log("✅ Indexes created!");

        app.listen(port, () => {
            console.log(`✅ To Do App listening on port ${port}`);
        });
    } catch (error) {
        console.error("❌ Startup error:", error);
        process.exit(1);
    }
})();



// Define the task Schema 
const taskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    dueDate: {type: Date, required: true},
    createdOn:{type: Date, required: true, default: Date.now},
    completed: {type: Boolean, required: true, default: false}
});


// Define indexes for performance optimization and sorting
taskSchema.index({ dueDate: 1 });
taskSchema.index({ dateCreated: 1 });


// From the Schema - we will create a database Model.
const Task = mongoose.model("Task", taskSchema);



// ------------------------------------ ↓ TASK ROUTES ↓ ------------------------------------

// Get all the tasks ↓
app.get('/tasks', async (req, res) => {
    try {
        const { sortBy } = req.query; // ?sortBy=dueDate or ?sortBy=dateCreated

        let sortOption = {};

        if (sortBy === "dueDate") {
            sortOption = { dueDate: 1 }; // Ascending
        } else if (sortBy === "dateCreated") {
            sortOption = { dateCreated: 1 };
        }

        const tasks = await Task.find({}).sort(sortOption);
        res.json(tasks);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error grabbing tasks!" });
    }
});




// Create a new task and add it to the array ↓
app.post('/tasks/todo', async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;

        const taskData = { title, description, dueDate };
        const createTask = new Task(taskData);
        const newTask = await createTask.save();

        res.json(newTask);
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error creating a task!" });
    }
});





// To 'complete' the task and move columns ↓
app.patch('/tasks/complete/:id', async (req, res) => {
    try {
        const { completed } = req.body;
        const taskId = req.params.id;

        const completedTask = await Task.findByIdAndUpdate(taskId, { completed }, { new: true });

        if (!completedTask) {
            return res.status(404).json({ message: "Task not found!" });
        }

        res.json({ task: completedTask, message: "Task set to complete!" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error setting task to complete!" });
    }
});





// To make the task 'not complete' and move columns ↓
app.patch('/tasks/notComplete/:id', async (req, res) => {
    try {
        const { completed } = req.body;
        const taskId = req.params.id;

        const taskNotComplete = await Task.findByIdAndUpdate(taskId, { completed }, { new: true });

        if (!taskNotComplete) {
            return res.status(404).json({ message: "Task not found!" });
        }

        res.json({ task: taskNotComplete, message: "Task set to not complete!" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error setting task to not complete!" });
    }
});





// To delete the task ↓
app.delete('/tasks/delete/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found!" });
        }

        res.json({ task: deletedTask, message: "Task deleted successfully!" });
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error deleting the task!" });
    }
});





// To edit the task ↓
app.put('/tasks/update/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const { title, description, dueDate } = req.body;

        const taskData = { title, description, dueDate };
        const updatedTask = await Task.findByIdAndUpdate(taskId, taskData, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found!" });
        }

        res.json({ task: updatedTask, message: "Task updated successfully!" });
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error updating the task!" });
    }
});