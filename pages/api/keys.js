import mongoose from 'mongoose';
import fetch from 'node-fetch'; // Import node-fetch for Node.js environment
import '../../server/db';

const keySchema = new mongoose.Schema({
  keyid: String,
  createdAt: { type: Date, expires: '24h', default: Date.now },
  ip: String,
});

const Key = mongoose.models.Key || mongoose.model('Key', keySchema);
const VerifyId = mongoose.models.VerifyId || mongoose.model('VerifyId', verifyIdSchema);

async function isVerifyIdInStage3(verifyid) {
  try {
    const response = await fetch(`https://api.zyno.xyz/api/verifyidcheck?verifyid=${verifyid}`);
    if (response.ok) {
      const responseData = await response.json();
      const { stage } = responseData.data;
      return stage === 'stage3';
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking verifyid:', error);
    return false;
  }
}

export default async function handler(req, res) {
  try {
    if (req.headers.authorization !== process.env.auth) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;
    }

    if (req.method === 'GET') {
      try {
        const keys = await Key.find({}, { keyid: 1 });
        const keyIds = keys.map((key) => key.keyid).join(', ');
        res.status(200).json({ status: 'success', message: '200 | Keys found', data: keyIds });
      } catch (error) {
        console.error('Error occurred during key retrieval:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
    } else if (req.method === 'POST') {
      const verifyid = req.headers.verifyid;
      const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      const isStage3 = await isVerifyIdInStage3(verifyid);

      if (isStage3) {
        try {
          await VerifyId.deleteOne({ verifyid });
          const newKeyId = generateRandomKeyId();
          const keyRecord = new Key({ keyid: newKeyId, ip: userIP });
          await keyRecord.save();
  
          res.status(201).json({ status: 'success', message: '201 | Key generated', data: { keyId: newKeyId, expires: keyRecord.createdAt } });
        } catch (error) {
          console.error('Error occurred during key generation:', error);
          res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
      } else {
        res.status(403).json({ status: 'error', message: 'Forbidden: Verify ID not in stage3' });
      }
    } else {
      res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

const generateRandomKeyId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 25;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
