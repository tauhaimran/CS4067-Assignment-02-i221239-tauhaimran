const express = require("express");
const router = express.Router();
const Event = require("../models/Events");

// Create a new event
async function createEvent(req, res) {
  try {
    const event = await Event.create(req.body);
    console.log(`Event created with ID: ${event._id}`);
    res.status(201).json(event);
  } catch (error) {
    console.error(`Error creating event: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
}

// Get all events
async function getAllEvents(req, res) {
  try {
    const events = await Event.find();
    console.log(`Retrieved ${events.length} events`);
    res.json(events);
  } catch (error) {
    console.error(`Error retrieving events: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
}

// Get a single event by ID 
async function getEventById(req, res) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      console.log(`Event not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: "Event not found" });
    }
    console.log(`Retrieved event with ID: ${req.params.id}`);
    res.json(event);
  } catch (error) {
    console.error(`Error retrieving event ${req.params.id}: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
}

// Update an event
async function updateEvent(req, res) {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) {
      console.log(`Event not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: "Event not found" });
    }
    console.log(`Updated event with ID: ${req.params.id}`);
    res.json(event);
  } catch (error) {
    console.error(`Error updating event ${req.params.id}: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
}

// Delete an event
async function deleteEvent(req, res) {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      console.log(`Event not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: "Event not found" });
    }
    console.log(`Deleted event with ID: ${req.params.id}`);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(`Error deleting event ${req.params.id}: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
}

// ✅ Define Routes
router.post("/", createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
