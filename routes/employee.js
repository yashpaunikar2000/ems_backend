import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  addEmployee,
  upload,
  getEmployees,
  getEmployee,
  updateEmployee,
  fetchEmployeesByDepID,
} from '../controllers/employeeController.js';

const router = express.Router();

// 📌 Employee Routes
router.get('/', authMiddleware, getEmployees);
router.post('/add', authMiddleware, upload.single('image'), addEmployee);
router.get('/:id', authMiddleware, getEmployee);
router.put('/:id', authMiddleware, updateEmployee);
router.get('/department/:id', authMiddleware, fetchEmployeesByDepID);


export default router;