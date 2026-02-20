import mongoose from 'mongoose';

// 1. Interface
export interface ISurvey {
    role: string;
    prefix: string;
    fullName: string;
    studentId?: string;
    faculty?: string;
    satisfactionLevel: number;
    durationLevel: number;
    locationLevel: number;
    leaderLevel: number;
    suggestion?: string;
    createdAt: Date;
}

// 2. Schema
// Removing generic <ISurvey> to fix "Untyped function calls" error
const SurveySchema = new mongoose.Schema({
    role: { type: String, required: true },
    prefix: { type: String, required: true },
    fullName: { type: String, required: true },
    studentId: { type: String, required: false }, // Optional
    faculty: { type: String, required: false },   // Optional
    satisfactionLevel: { type: Number, required: true },
    durationLevel: { type: Number, required: true },
    locationLevel: { type: Number, required: true },
    leaderLevel: { type: Number, required: true },
    suggestion: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
}, {
    // 3. Options
    collection: 'surveys', // Force collection name to match existing data
    timestamps: true       // Adds createdAt and updatedAt automatic handling
});

// 4. Model (Cached)
// Removing generic <ISurvey> -> casting detailed type if really needed, but generally not required for basic ops
const Survey = mongoose.models.Survey || mongoose.model('Survey', SurveySchema);

export default Survey;
