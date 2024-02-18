# Open Source Key System

## Description

This is an open-source key system built using Next.js and MongoDB, with Linkvertise integration for monetization.

## Getting Started

To use this key system, follow these instructions:

1. Clone the repository to your local machine:
    ```bash
    git clone https://github.com/WavaDev/key-system.git
    ```

2. Install dependencies by running:
    ```bash
    npm install
    ```

3. Build the application:
    ```bash
    npm run build
    ```

4. Start the application:
    ```bash
    npm start
    ```

If you wish to make modifications to the code, you can run the development server:

```bash
npm run dev
```

## Configuration

Before running the application, ensure you edit the `.env` file:

```plaintext
NEXTAUTH_URL=https://example.com
MONGODB_URI=YOUR_MONGODB_DATABASE_URL
```

Replace `YOUR_MONGODB_DATABASE_URL` with your MongoDB database URL.

Also, edit the `config.js` file:

```javascript
const main_url = 'YOUR_MAIN_URL'; // The Main URL/Root URL, for example: https://example.com
const linkvertise_ID = 'YOUR_LINKVERTISE_ID'; // Your Linkvertise ID, required for monetization.
const adminWhitelist = ['YOUR_DISCORD_ID']; // Your Discord ID and other admins who have permissions to access the Admin Panel.
const DISCORD_CLIENT_ID = 'YOUR_DISCORD_CLIENT_ID'; // Your Discord Client ID for Discord Admin Login.
const DISCORD_CLIENT_SECRET = 'YOUR_DISCORD_CLIENT_SECRET'; // Your Discord Client Secret for Discord Admin Login.
const secret = 'YOUR_SECRET'; // For enhanced security, used for admin login with Discord.
const DISCORD_WEBHOOK_LOGIN = 'YOUR_DISCORD_WEBHOOK_LOGIN'; // Webhook URL for admin login logs.
const DISCORD_WEBHOOK_KEYSYSTEM_LOGS = 'YOUR_DISCORD_WEBHOOK_KEYSYSTEM_LOGS'; // Webhook URL for key system logs.
```

Replace placeholders with your actual values.

## Usage

You can check if a key is valid by sending a GET request to the following URL:

```
https://example.com/api/keyids?keyid=[the key]
```

This application runs on port `3100`, and the admin panel is accessible at:

```
https://example.com/admin
```

To set up Discord authentication, add the callback URL in your Discord application settings:

```
https://example.com/api/auth/callback/discord
```

## Preview:
![image](https://github.com/WavaDev/key-system/assets/127393002/5eaf8325-33e0-43eb-a96d-551cdc768dce)
![image](https://github.com/WavaDev/key-system/assets/127393002/767c5c22-4080-4d3b-93ec-89318e1f539f)
![image](https://github.com/WavaDev/key-system/assets/127393002/2082747d-9f70-4d64-ac03-194f7f79d9a6)
![image](https://github.com/WavaDev/key-system/assets/127393002/e0885a42-b876-4652-89be-d4895c66cbae)
![image](https://github.com/WavaDev/key-system/assets/127393002/dc77888b-5bb2-4baf-aa02-92d864b6f9fa)

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

Made with ❤️ by [WavaDev](https://github.com/WavaDev) using Next.js
