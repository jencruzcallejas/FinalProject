import express from "express";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";
import {
    createEntry,
    getAllEntries,
    getEntryById,
    updateEntry,
    deleteEntry,
} from "../controllers/diaryController.js";
const router = express.Router();
/**
* @route GET /api/diary
* @desc Fetch all diary entries
* @access Public (Authentication will be added in Part 2)
*/
router.get("/", ensureAuthenticated, getAllEntries);

/**
* @route GET /api/diary/:id
* @desc Fetch a specific diary entry by ID
* @access Public (Authentication will be added in Part 2)
*/
router.get("/:id", ensureAuthenticated, getEntryById);

/**
 * @route POST /api/diary
 * @desc Create a new diary entry
 * @access Public
 */
router.post("/", ensureAuthenticated, createEntry);

/**
 * @route PUT /api/diary/:id
 * @desc Update an existing diary entry
 * @access Public
 */
router.put("/:id", ensureAuthenticated, updateEntry);

/**
 * @route DELETE /api/diary/:id
 * @desc Delete an existing diary entry
 * @access Public
 */
router.delete("/:id", ensureAuthenticated, deleteEntry);

export default router;