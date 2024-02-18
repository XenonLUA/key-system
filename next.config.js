/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      auth: process.env.auth === 'dkwos8d62bs92kd2osn2nsid2oszbgwxi2md229dmcb29d8xaowiswnz' ? 'true' : 'false',
    },
  };
  
  module.exports = nextConfig;