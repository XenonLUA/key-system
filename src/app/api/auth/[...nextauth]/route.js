import NextAuth from 'next-auth';
import { sign } from 'jsonwebtoken';
import DiscordProvider from 'next-auth/providers/discord';
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, adminWhitelist, secret, DISCORD_WEBHOOK, DISCORD_WEBHOOK_LOGIN } from '../../../../../config.js';
import axios from 'axios';

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: DISCORD_CLIENT_ID,
      clientSecret: DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn(user, account, profile) {
      const profileId = user.profile.id;
      const isAdmin = adminWhitelist.includes(profileId);

      if (profileId && isAdmin) {
        const token = sign(
          {
            userId: profileId,
            isAdmin: true,
            name: user.user.name,
            image: user.user.image,
          },
          secret
        );
        user.token = token;

        const discordEmbed = {
          title: 'Login Attempt',
          description: `User: ${user.user.name}`,
          fields: [
            { name: 'Status', value: 'Success' },
          ],
          thumbnail: {
            url: user.user.image,
          },
          timestamp: new Date().toISOString(),
          footer: {
            text: 'Login Attempt',
          },
        };

        await axios.post(DISCORD_WEBHOOK_LOGIN, { embeds: [discordEmbed] });
        
        return [token, { callbackUrl: '/admin' }];
      } else {
        const discordEmbed = {
          title: 'Login Attempt',
          description: `User: ${user.user.name}`,
          fields: [
            { name: 'Status', value: 'Failed' },
          ],
          thumbnail: {
            url: user.user.image,
          },
          timestamp: new Date().toISOString(),
          footer: {
            text: 'Login Attempt',
          },
        };

        await axios.post(DISCORD_WEBHOOK_LOGIN, { embeds: [discordEmbed] });
        
        return '/NotAllowed';
      }
    },
    async jwt(token, user) {
      if (user) {
        token.isAdmin = adminWhitelist.includes(user.profile.id);
      }
      return token;
    },
    async session(session, token) {
      if (session?.user) {
        session.user.isAdmin = token.isAdmin || false;
        session.user.name = token.name;
        session.user.image = token.image;
      }
      return session;
    },
  },
  secret: secret,
  pages: {
    signIn: "/api/auth/sigin",
  },
});

export { handler as GET, handler as POST };