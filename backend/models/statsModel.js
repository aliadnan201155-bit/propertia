import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  ipAddress: {
    type: String,
    required: false
  },
  endpoint: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  responseTime: {
    type: Number,
    required: true
  },
  statusCode: {
    type: Number,
    required: true
  }
}, { timestamps: true });

// Index for better query performance
statsSchema.index({ propertyId: 1 });
statsSchema.index({ userId: 1 });
statsSchema.index({ endpoint: 1, timestamp: -1 });
statsSchema.index({ method: 1 });
statsSchema.index({ statusCode: 1 });

const Stats = mongoose.model('Stats', statsSchema);

export default Stats;