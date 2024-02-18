import mongoose from 'mongoose';
import '../../server/db';

const VerifyId = mongoose.models.VerifyId || mongoose.model('VerifyId');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;
    if (authHeader !== process.env.auth) {
      res
        .status(401)
        .json({ status: 'error', message: '401 | Unauthorized' });
      return;
    }

    const verifyIds = await VerifyId.find({});

    const data = verifyIds.map((verifyId) => ({
      _id: verifyId._id,
      verifyid: verifyId.verifyid,
      stage: verifyId.stage,
      provider: verifyId.provider,
      createdAt: verifyId.createdAt,
    }));

    res.status(200).json({
      status: 'success',
      message: '200 | Verify IDs retrieved',
      data,
    });
  } else {
    res
      .status(405)
      .json({ status: 'error', message: '405 | Method Not Allowed' });
  }
}