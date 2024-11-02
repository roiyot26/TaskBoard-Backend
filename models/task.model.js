import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: Number, required: true },
    createdAt: { type: Number, required: true }
});

const taskBoard = mongoose.model('TaskBoard', taskSchema);

export default taskBoard;