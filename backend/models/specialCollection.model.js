import mongoose from 'mongoose';

const specialCollectionSchema = new mongoose.Schema({
  wasteType: { type: String, required: true },
  chooseDate: { type: Date, required: true },
  wasteDescription: { type: String, required: true },
  emergencyCollection: { type: Boolean, default: false },
  status: { type: String, default: 'Pending' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

const SpecialCollection = mongoose.model('SpecialCollection', specialCollectionSchema);
export default SpecialCollection;
