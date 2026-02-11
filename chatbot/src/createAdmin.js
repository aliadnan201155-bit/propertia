
// import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';
// import { User } from './models/user.model.js'; 
// import dotenv from 'dotenv'; 
// dotenv.config();

// const createAdminUser = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI);
//         console.log('MongoDB se connect ho gaye.');
//         const adminUsername = 'admin_super'; 
//         const adminEmail = 'superadmin@yourdomain.com'; 
//         const adminPassword = 'SuperSecureAdminPassword123!'; 

//         const existingAdmin = await User.findOne({ $or: [{ username: adminUsername }, { email: adminEmail }] });
//         if (existingAdmin) {
//             console.log(`Error: Admin user with username '${adminUsername}' or email '${adminEmail}' pehle se maujood hai.`);
//             return;
//         }
//         const newAdmin = await User.create({
//             username: adminUsername,
//             email: adminEmail,
//             password: adminPassword, 
//             role: 'admin',
//             fullName: 'Super Admin Account' 
//         });

//         console.log('Naya Admin user safalta-poorvak ban gaya:', newAdmin);
//         console.log('Admin Username:', newAdmin.username);
//         console.log('Admin Email:', newAdmin.email);
//         console.log('Admin Role:', newAdmin.role);

//     } catch (error) {
//         console.error('Admin user banane mein error aayi:', error);
//     } finally {
//         await mongoose.disconnect();
//         console.log('MongoDB se disconnect ho gaye.');
//     }
// };

// createAdminUser();
