const path = require("path");
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Home route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// CREATE: Add a new user
app.post("/api/users", async (req, res) => {
    try {
        const { userUniqueId, userName, userEmail, userAge } = req.body;

        const newUser = await User.create({
            userUniqueId,
            userName,
            userEmail,
            userAge
        });

        res.status(201).json({
            message: "User added successfully",
            data: newUser
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "User ID or email already exists"
            });
        }

        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Error adding user",
            error: error.message
        });
    }
});

// READ: Get all users
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching users"
        });
    }
});

// READ: Get a user by ID
app.get("/api/users/:id", async (req, res) => {
    try {
        const user = await User.findOne({
            userUniqueId: req.params.id
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({ data: user });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching user"
        });
    }
});

// UPDATE: Update a user
app.put("/api/users/:id", async (req, res) => {
    try {
        const { userName, userEmail, userAge } = req.body;

        const user = await User.findOneAndUpdate(
            { userUniqueId: req.params.id },
            { userName, userEmail, userAge },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User updated successfully",
            data: user
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Error updating user"
        });
    }
});

// DELETE: Delete a user
app.delete("/api/users/:id", async (req, res) => {
    try {
        const user = await User.findOneAndDelete({
            userUniqueId: req.params.id
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting user"
        });
    }
});

// Start server only after connecting to MongoDB
async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

startServer();
