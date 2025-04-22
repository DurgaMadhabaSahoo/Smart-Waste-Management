import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema({
  time: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['done', 'notdone'],
    default: 'notdone',
  },
  // code: {
  //   type: String,
  //   required: true,
  //   match: /^\d{6}$/, 
  // },
  garbageCollectorId: {
    type: String, 
    default: null, 
  },
  weight: {
    type: Number, 
    default: null, 
  },
  type: {
    type: String, 
    default: null, 
  },
  special: {
    type: Boolean,
    default: false, 
  },
  truckNumber: {
    type: String, 
    default: null, 
  },
}, {
  timestamps: true,
});

const Schedule = mongoose.model('Schedule', ScheduleSchema);

export default Schedule;