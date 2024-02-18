import mongoose from 'mongoose';
import '../../server/db';

const Key = mongoose.models.Key || mongoose.model('Key');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;
    if (authHeader !== process.env.auth) {
      res.status(401).json({ status: 'error', message: '401 | Unauthorized' });
      return;
    }

    try {
      const keyIds = await Key.find({});
      const data = keyIds.map((keyId) => ({
        _id: keyId._id.toString(),
        keyid: keyId.keyid,
        ip: keyId.ip,
        createdAt: keyId.createdAt,
      }));

      res.status(200).json({
        status: 'success',
        message: '200 | Key IDs retrieved',
        data,
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: '500 | Internal Server Error' });
    }
  } else {
    res
      .status(405)
      .json({ status: 'error', message: '405 | Method Not Allowed' });
  }
}