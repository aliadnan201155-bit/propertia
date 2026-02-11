import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { sendEmail, templates } from '../utils/email.js';
import jwt from 'jsonwebtoken';

const generateTokens = async (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

export const register = asyncHandler(async (req, res) => {
  try {
    const { email, fullName, password, role, phoneNumber, location } = req.body;
    if (!['buyer', 'seller', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Only buyer and seller roles are allowed to register'
      });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }
    const user = await User.create({ fullName, email, password, role, phoneNumber, location });
    const safeUser = user.toObject();
    delete safeUser.password;
    // Try to send welcome email (do not fail registration if email fails)
    try {
      const tpl = templates.welcome({ fullName: user.fullName });
      const info = await sendEmail({ to: user.email, subject: tpl.subject, text: tpl.text });
      if (info?.previewUrl) console.info('Welcome email preview:', info.previewUrl);
    } catch (err) {
      console.error('Failed to send welcome email:', err.message || err);
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: safeUser
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  const user = await User.findOne({
    email: email
  });

  if (!user || !(await user.isPasswordCorrect(password))) {
    return res.status(401).json({ message: "Invalid credentials (email or password incorrect)." });
  }

  const { accessToken, refreshToken } = await generateTokens(user);
  const isProd = process.env.NODE_ENV === 'production';

  const options = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'None' : 'Lax',
  };


  const loggedInUser = user.toObject();
  delete loggedInUser.password;
  delete loggedInUser.refreshToken;

  res.status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json({
      success: true,
      message: "Login successful",
      data: { accessToken, refreshToken, user: loggedInUser }
    });
});


export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
  const options = { httpOnly: true, secure: true };
  res.clearCookie('accessToken', options).clearCookie('refreshToken', options);
  res.status(200).json({
    success: true,
    message: "Logged out"
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  };

  const isMatch = await user.isPasswordCorrect(oldPassword);
  if (!isMatch) {
    return res.status(401).json({ message: "Old password is incorrect" });
  };

  user.password = newPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password changed successfully"
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = req.body;
  const allowedFields = ['fullName', 'phoneNumber', 'email'];
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  };

  allowedFields.forEach((field) => {
    if (updates[field]) {
      user[field] = updates[field];
    }
  });

  await user.save();
  res.status(200).json({
    success: true,
    message: "Profile updated",
    data: user
  });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({ message: "Unauthorized request: Refresh token not found" });
    }

    // Verify the refresh token
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find user with this refresh token
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token: User not found" });
    }

    // Check if incoming refresh token matches the one in DB
    if (incomingRefreshToken !== user.refreshToken) {
      return res.status(401).json({ message: "Refresh token is expired or used" });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user);

    const isProd = process.env.NODE_ENV === 'production';

    const options = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'None' : 'Lax',
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json({
        success: true,
        message: "Access token refreshed",
        data: { accessToken, refreshToken: newRefreshToken }
      });
  } catch (error) {
    res.status(401).json({ message: error?.message || "Invalid refresh token" });
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(
      {
        success: true,
        message: "Current user fetched successfully",
        data: user
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details", error: error.message });
  }
});
