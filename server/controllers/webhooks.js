// import { Webhook } from "svix";
// import User from "../models/User.js"

//API Controller Function to Manage Clerk User with database


import { Webhook } from "svix";
import User from "../models/User.js"; // Ensure correct import

export const clerkWebhooks = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    
    // Ensure process.env.CLERK_WEBHOOK_SECRET is set
    if (!process.env.CLERK_WEBHOOK_SECRET) {
      throw new Error("Missing Clerk Webhook Secret.");
    }
    
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const payload = JSON.stringify(req.body);
    
    await whook.verify(payload, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    });

    const { data, type } = req.body;
    console.log("Event Type:", type);

    switch (type) {
      case "user.created":
        if (!data.email_addresses || data.email_addresses.length === 0) {
          console.error("Missing email in user.created event.");
          break;
        }
        const newUser = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url || "",
        };
        console.log("Creating User:", newUser);
        await User.create(newUser);
        break;

      case "user.updated":
        const updatedUserData = {
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url || "",
        };
        console.log("Updating User:", updatedUserData);
        await User.findByIdAndUpdate(data.id, updatedUserData);
        break;

      case "user.deleted":
        console.log("Deleting User:", data.id);
        await User.findByIdAndDelete(data.id);
        break;

      default:
        console.warn(`Unhandled event type: ${type}`);
        break;
    }

    res.json({ success: true });

  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};





// export const clerkWebhooks = async(req,res)=>{
//         try{
//            const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
//            await whook.verify(JSON.stringify(req.body),{
//             "svix-id" : req.headers[ "svix-id"],
//             "svix-timestamp" : req.headers[ "svix-timestamp"],
//             "svix-signature" : req.headers[ "svix-signature"]
//            })
//            const {data,type} = req.body
//            switch(type){
//                 case 'user.created' : {
//                     const userData = {
//                         _id : data.id,
//                         email : data.email_addresses[0].email_address,
//                         name : data.first_name + " "+ data.last_name,
//                         imageUrl : data.image_url,
//                     }
//                     await User.create(userData)
//                     res.json({})
//                     break;
//                 }
//                 case 'user.updated' : {
//                     const userData = {
//                         email : data.email_addresses[0].email_address,
//                         name : data.first_name + " "+ data.last_name,
//                         imageUrl : data.image_url,
//                     }
//                     await User.findByIdAndUpdate(data.id,userData)
//                     res.json({})
//                     break;
//                 }
//                 case 'user.deleted' : {
//                     await User.findByIdAndDelete(data.id)
//                     res.json({})
//                     break;
//                 }
//                 default :
//                    break;
//            }
//         }catch(error){
//              res.json({success:false,message : error.message})
//         }
// }