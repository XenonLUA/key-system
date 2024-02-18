import mongoose from 'mongoose';
import axios from 'axios';
import { obfuscateVerifyId, deobfuscateVerifyId } from './obfuscation';
import { DISCORD_WEBHOOK_KEYSYSTEM_LOGS } from '../../config.js';

const verifyIdSchema = new mongoose.Schema({
  verifyid: String,
  stage: {
    type: String,
    enum: ['stage1', 'stage2', 'stage3'],
    default: 'stage1',
  },
  provider: {
    type: String,
    enum: ['linkvertise', 'workink'],
    default: 'linkvertise',
  },
  createdAt: { type: Date, expires: 1200, default: Date.now },
});

const VerifyId = mongoose.models.VerifyId || mongoose.model('VerifyId', verifyIdSchema);

function generateRandomVerifyId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 10;
  let verifyId = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    verifyId += characters.charAt(randomIndex);
  }

  return verifyId;
}

async function sendDiscordWebhook(embed) {
  try {
    await axios.post(DISCORD_WEBHOOK_KEYSYSTEM_LOGS, { embeds: [embed] });
  } catch (error) {
    console.error('Failed to send Discord webhook:', error);
  }
}

export default async function handler(req, res) {
  const { authorization, verifyid } = req.headers;

  if (!authorization || authorization !== process.env.auth) {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
    return;
  }

  if (req.method === 'POST') {
    try {
      if (!verifyid) {
        const { provider } = req.body;
        const newVerifyId = new VerifyId({
          verifyid: generateRandomVerifyId(),
          stage: 'stage1',
          provider: provider || 'linkvertise',
        });
        await newVerifyId.save();
        const obfuscatedVerifyId = obfuscateVerifyId(newVerifyId.verifyid);
        const deobfuscatedVerifyId = deobfuscateVerifyId(newVerifyId.verifyid);

        const embed = {
          title: 'New Verify ID created',
          description: 'A new Verify ID has been created.',
          fields: [
            { name: 'Verify ID', value: deobfuscatedVerifyId, inline: true },
            { name: 'Stage', value: newVerifyId.stage, inline: true },
            { name: 'Provider', value: newVerifyId.provider, inline: true },
          ],
          timestamp: new Date().toISOString(),
        };

        await sendDiscordWebhook(embed);

        res.status(201).json({
          status: 'success',
          message: '201 | Verify ID created',
          data: {
            verifyid: obfuscatedVerifyId,
            stage: newVerifyId.stage,
            provider: newVerifyId.provider,
          },
        });
      } else {
        const existingVerifyId = await VerifyId.findOne({ verifyid });

        if (!existingVerifyId) {
          res.status(404).json({ status: 'error', message: '404 | Verify ID not found' });
          return;
        }

        if (existingVerifyId.stage === 'stage1') {
          await VerifyId.deleteOne({ verifyid });
          const newVerifyId = new VerifyId({
            verifyid: generateRandomVerifyId(),
            stage: 'stage2',
            provider: existingVerifyId.provider,
          });
          await newVerifyId.save();
          const obfuscatedVerifyId = obfuscateVerifyId(newVerifyId.verifyid);
          const deobfuscatedVerifyId = deobfuscateVerifyId(newVerifyId.verifyid);

          const embed = {
            title: 'Verify ID stage updated',
            description: 'The Verify ID stage has been updated.',
            fields: [
              { name: 'Verify ID', value: deobfuscatedVerifyId, inline: true },
              { name: 'Stage', value: newVerifyId.stage, inline: true },
              { name: 'Provider', value: newVerifyId.provider, inline: true },
            ],
            timestamp: new Date().toISOString(),
          };

          await sendDiscordWebhook(embed);

          res.status(201).json({
            status: 'success',
            message: '201 | Verify ID created',
            data: {
              verifyid: obfuscatedVerifyId,
              stage: newVerifyId.stage,
              provider: newVerifyId.provider,
            },
          });
        } else if (existingVerifyId.stage === 'stage2') {
          await VerifyId.deleteOne({ verifyid });
          const newVerifyId = new VerifyId({
            verifyid: generateRandomVerifyId(),
            stage: 'stage3',
            provider: existingVerifyId.provider,
          });
          await newVerifyId.save();
          const obfuscatedVerifyId = obfuscateVerifyId(newVerifyId.verifyid);
          const deobfuscatedVerifyId = deobfuscateVerifyId(newVerifyId.verifyid);

          const embed = {
            title: 'Verify ID stage updated',
            description: 'The Verify ID stage has been updated.',
            fields: [
              { name: 'Verify ID', value: deobfuscatedVerifyId, inline: true },
              { name: 'Stage', value: newVerifyId.stage, inline: true },
              { name: 'Provider', value: newVerifyId.provider, inline: true },
            ],
            timestamp: new Date().toISOString(),
          };

          await sendDiscordWebhook(embed);

          res.status(201).json({
            status: 'success',
            message: '201 | Verify ID created',
            data: {
              verifyid: obfuscatedVerifyId,
              stage: newVerifyId.stage,
              provider: newVerifyId.provider,
            },
          });
        } else {
          res.status(400).json({ status: 'error', message: '400 | Invalid operation' });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ status: 'error', message: '500 | Internal Server Error' });
    }
  } else {
    res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }
}