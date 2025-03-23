import { Webhook } from "svix";
import User from "../models/User.js";
import express from "express";

const app = express();
app.use(express.json()); // Ensure JSON parsing

// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
  try {
    console.log("Received webhook request:", req.body);
    console.log("Headers:", req.headers);

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    
    console.log("Verifying webhook...");
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });
    console.log("Webhook verification successful.");

    const { data, type } = req.body;
    console.log(`Processing event type: ${type}`);

    // Logging webhook payload
    await WebhookLog.create({ eventType: type, requestBody: req.body });

    switch (type) {
      case "user.created": {
        console.log("Creating user with data:", data);
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        const user = await User.create(userData);
        console.log("User created successfully:", user);
        res.status(201).json({ success: true, message: "User created", data: user });
        break;
      }
      case "user.updated": {
        console.log("Updating user with ID:", data.id);
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        const user = await User.findByIdAndUpdate(data.id, userData, { new: true });
        console.log("User updated successfully:", user);
        res.status(200).json({ success: true, message: "User updated", data: user });
        break;
      }
      case "user.deleted": {
        console.log("Deleting user with ID:", data.id);
        await User.findByIdAndDelete(data.id);
        console.log("User deleted successfully.");
        res.status(200).json({ success: true, message: "User deleted" });
        break;
      }
      default:
        console.log("Invalid event type received:", type);
        res.status(400).json({ success: false, message: "Invalid event type" });
        break;
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// import { Webhook } from "svix";
// import User from "../models/User.js";
// import express from "express";

// const app = express();
// app.use(express.json()); // Ensure JSON parsing

// // API Controller Function to Manage Clerk User with database

// export const clerkWebhooks = async (req, res) => {
//   try {
//     const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
//     await whook.verify(JSON.stringify(req.body), {
//       "svix-id": req.headers["svix-id"],
//       "svix-timestamp": req.headers["svix-timestamp"],
//       "svix-signature": req.headers["svix-signature"],
//     });
//     const { data, type } = req.body;
//     //new
//     await WebhookLog.create({ eventType: type, requestBody: req.body });

//     switch (type) {
//       case "user.created": {
//         const userData = {
//           _id: data.id,
//           email: data.email_addresses[0].email_address,
//           name: data.first_name + " " + data.last_name,
//           imageUrl: data.image_url,
//         };
//         // await User.create(userData)
//         // res.json({})
//         // break;
//         const user = await User.create(userData);
//         res
//           .status(201)
//           .json({ success: true, message: "User created", data: user });
//         break;
//       }
//       case "user.updated": {
//         const userData = {
//           email: data.email_addresses[0].email_address,
//           name: data.first_name + " " + data.last_name,
//           imageUrl: data.image_url,
//         };
//         // await User.findByIdAndUpdate(data.id,userData)
//         // res.json({})
//         // break;
//         const user = await User.findByIdAndUpdate(data.id, userData, {
//           new: true,
//         });
//         res
//           .status(200)
//           .json({ success: true, message: "User updated", data: user });
//         break;
//       }
//       case "user.deleted": {
//         // await User.findByIdAndDelete(data.id);
//         // res.json({});
//         // break;
//         await User.findByIdAndDelete(data.id);
//         res.status(200).json({ success: true, message: "User deleted" });
//         break;
//       }
//       default:
//         // break;
//         res.status(400).json({ success: false, message: "Invalid event type" });
//         break;
//     }
//   } catch (error) {
//     // res.json({ success: false, message: error.message });
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
