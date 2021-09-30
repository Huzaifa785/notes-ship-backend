const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const authenticateUser = require("../middleware/authenticateUser");
const Note = require("../models/Note");

// Fetch all notes using GET method at the endpoint: /api/notes/all-notes
router.get("/all-notes", [authenticateUser], async (req, res) => {
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);
});

// Add a new note using POST method at the endpoint: /api/notes/add-note
router.post(
  "/add-note",
  [authenticateUser],
  [
    body("title", "Your title must be at least 3 characters long").isLength({
      min: 3,
    }),
    body(
      "description",
      "Your description must be at least 7 characters long"
    ).isLength({ min: 7 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const saveNote = await note.save();

      res.json(saveNote);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  }
);

// Update an new note using PUT method at the endpoint: /api/notes/update-note/:id
router.put("/update-note/:id", [authenticateUser], async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(400).json({ message: "Note not found!" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Permission denied!" });
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.json(note);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

// Delete a new note using DELETE method at the endpoint: /api/notes/delete-note/:id
router.delete("/delete-note/:id", [authenticateUser], async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    // Find the note to be deleted
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(400).json({ message: "Note not found!" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Permission denied!" });
    }

    note = await Note.findByIdAndDelete(req.params.id);

    res.json("Note deleted successfully!");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

module.exports = router;
