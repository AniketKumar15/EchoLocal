import mongoose from "mongoose";

const mongoURI = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, {
            dbName: dbName,
        });
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectToMongo;
