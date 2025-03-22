import { Webhook } from "svix";
import User from "../models/User.js";
import express from "express";

const app = express();
app.use(express.json()); // Ensure JSON parsing

// API Controller Function to Manage Clerk User with database

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });
    const { data, type } = req.body;
    //new
    await WebhookLog.create({ eventType: type, requestBody: req.body });

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        // await User.create(userData)
        // res.json({})
        // break;
        const user = await User.create(userData);
        res
          .status(201)
          .json({ success: true, message: "User created", data: user });
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        // await User.findByIdAndUpdate(data.id,userData)
        // res.json({})
        // break;
        const user = await User.findByIdAndUpdate(data.id, userData, {
          new: true,
        });
        res
          .status(200)
          .json({ success: true, message: "User updated", data: user });
        break;
      }
      case "user.deleted": {
        // await User.findByIdAndDelete(data.id);
        // res.json({});
        // break;
        await User.findByIdAndDelete(data.id);
        res.status(200).json({ success: true, message: "User deleted" });
        break;
      }
      default:
        // break;
        res.status(400).json({ success: false, message: "Invalid event type" });
        break;
    }
  } catch (error) {
    // res.json({ success: false, message: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
};
