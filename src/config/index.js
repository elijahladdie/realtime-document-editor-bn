import mongoose from 'mongoose'; // Import Mongoose
// Connect to MongoDB
export const dbconnection = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch(err => {
            console.error('MongoDB connection error:', err);
        })
};