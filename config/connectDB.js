import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        console.log("MONGO_URI:", process.env.MONGODB);      
        const conn = await mongoose.connect(process.env.MONGODB);  
        console.log(`MongoDB Connected 🚀: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.log(`Error Connecting To MongoDB:`, error.message);
        process.exit(1);
    }
};
