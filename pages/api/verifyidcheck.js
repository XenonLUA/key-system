import mongoose from 'mongoose';
import '../../server/db';

const VerifyId = mongoose.models.VerifyId || mongoose.model('VerifyId');

export default async function handler(req, res) {
  const { verifyid } = req.query;

  const existingVerifyId = await VerifyId.findOne({ verifyid });

  if (!existingVerifyId) {
    res.status(404).json({ status: 'error', message: '404 | Verify ID not found' });
    return;
  }

  res.status(200).json({
    status: 'success',
    message: '200 | Verify ID retrieved',
    data: {
      stage: existingVerifyId.stage,
      provider: existingVerifyId.provider,
    },
  });
}
