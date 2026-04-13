import * as AuthService from './auth.service.js';

export const register = async (req, res) => {
  try {
    const admin = await AuthService.registerAdmin(req.body);

    res.status(201).json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { admin, token } = await AuthService.loginAdmin(req.body);

    res.json({
      success: true,
      token,
      admin
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};