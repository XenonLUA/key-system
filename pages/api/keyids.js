import mongoose from 'mongoose';
import '../../server/db';

const keySchema = new mongoose.Schema({
  keyid: String,
  ip: String, 
  createdAt: { type: Date, expires: '24h', default: Date.now }
});

const Key = mongoose.models.Key || mongoose.model('Key', keySchema);

export default async function handler(req, res) {
  const { keyid } = req.query;
  const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const existingKey = await Key.findOne({ keyid });

  if (!existingKey) {
    res.status(404).json({ status: 'error', message: '404 | Key ID not found' });
    return;
  }

  if (existingKey.ip === userIP) {
    res.status(200).json({
      status: 'success',
      message: '200 | Key ID is valid',
      data: {
        keyid: existingKey.keyid,
        status: 'true',
      },
    });
  } else {
    res.status(403).json({ status: 'error', message: '403 | Blocked - IP does not match' });
  }
}
