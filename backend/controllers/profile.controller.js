import { User } from '../models/user.model.js';

export const UserInfoController = {
  update: async (req, res) => {
    try {
      const allowedFields = ["name", "company", "jobTitle", "phone", "bio"];
      const updates = {};

      // Filter only allowed fields to prevent unintended updates
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      // If no valid field found in request body
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }

      // Update the logged-in user's profile
      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        updates,
        { new: true, select: "-password -resetPasswordToken -verificationToken" }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating profile:", error.message);
      res.status(500).json({ message: "Error updating profile" });
    }
  },
};
