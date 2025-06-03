import mongoose from 'mongoose';

const airdropSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
 reward: {
  type: String,
  
},
  status: {
    type: String,
    enum: ['pending', 'received'],
    default: 'pending'
  },
 
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },

});

export default mongoose.model('Airdrop', airdropSchema);
