import multer from "multer";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from 'bcrypt';
import cloudinaryInstance from '../config/cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// ================== Cloudinary Setup ==================
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryInstance,
  params: {
    folder: 'employee-Images',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    public_id: (req, file) => Date.now() + '-' + file.originalname,
  },
});
const upload = multer({ storage });

// ================== Add Employee ==================
const addEmployee = async (req, res) => {
  try {
    const {
      name, email, employeeId, dob, gender, maritalStatus,
      designation, department, salary, password, role,
    } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(404).json({ success: false, error: "User already registered in emp" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const profileImage = req.file ? req.file.path : '';

    const newUser = new User({
      name, email, password: hashPassword, role, profileImage
    });
    const savedUser = await newUser.save();

    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId, dob, gender, maritalStatus,
      designation, department, salary,
    });
    await newEmployee.save();

    return res.status(200).json({ success: true, message: "Employee Created" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Add Employee Server Error" });
  }
};

// ================== Get All Employees ==================
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate('userId', { password: 0 })
      .populate("department");
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res.status(500).json({ success: false, error: "get employees server error" });
  }
};

// ================== Get One Employee ==================
const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    let employee = await Employee.findById({ _id: id })
      .populate('userId', { password: 0 })
      .populate("department");

    if (!employee) {
      employee = await Employee.findOne({ userId: id })
        .populate('userId', { password: 0 })
        .populate("department");
    }

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    return res.status(500).json({ success: false, error: "get employee server error" });
  }
};

// ================== Update Employee ==================
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, maritalStatus, designation, department, salary } = req.body;

    const employee = await Employee.findById({ _id: id });
    if (!employee) return res.status(404).json({ success: false, error: "employee not found" });

    const user = await User.findById({ _id: employee.userId });
    if (!user) return res.status(404).json({ success: false, error: "user not found" });

    const updateUser = await User.findByIdAndUpdate({ _id: employee.userId }, { name, email });
    const updateEmployee = await Employee.findByIdAndUpdate({ _id: id }, {
      maritalStatus, designation, salary, department
    });

    if (!updateEmployee || !updateUser) {
      return res.status(404).json({ success: false, error: "document not found" });
    }

    return res.status(200).json({ success: true, message: "Employee Updated" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "update employee server error" });
  }
};

// ================== Employees by Department ==================
const fetchEmployeesByDepID = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.find({ department: id });
    return res.status(200).json({ success: true, employee });
  } catch (error) {
    return res.status(500).json({ success: false, error: "get employeesByDepID server error" });
  }
};



// ================== Export ==================
export {
  addEmployee,
  upload,
  getEmployees,
  getEmployee,
  updateEmployee,
  fetchEmployeesByDepID,
};