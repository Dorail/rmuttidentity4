import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now }
}, {
    collection: 'settings',
    timestamps: true
});

const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);

export default Setting;
