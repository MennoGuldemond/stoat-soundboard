import { join, play, getSoundNames } from './soundboard-bot';
import { Client } from 'stoat.js';
import 'dotenv/config';

const server = Bun.serve({
  port: process.env.PORT || 3000,
  async fetch(req, server) {
    const url = new URL(req.url);

    if (url.pathname === '/') {
      return new Response(Bun.file('index.html'));
    }

    if (url.pathname === '/upload' && req.method === 'POST') {
      const formData = await req.formData();
      const file = formData.get('audio') as File;

      if (!file) {
        return new Response('No file uploaded', { status: 400 });
      }

      // Save the file to disk
      const filePath = `./public/${file.name}`;
      await Bun.write(filePath, await file.arrayBuffer());

      return new Response(`File uploaded: ${file.name}`);
    }

    return new Response('Not found', { status: 404 });
  },
});

console.log(`Server running on http://${server.hostname}:${server.port}`);

const client = new Client();

client.on('ready', async () => {
  console.info(`Logged in as ${client.user!.username}!`);
  await join();
});

client.on('messageCreate', async (message) => {
  try {
    console.log(message.content);
    if (message.content?.startsWith('/play')) {
      const soundName = message.content.split('/play ')[1];
      console.log(soundName);
      const didPlay = play(soundName!);
      if (!didPlay) {
        await message.channel?.sendMessage(`The sound "${soundName}" could not be found.`);
      }
    } else if (message.content === '/sounds') {
      const sounds = getSoundNames();
      let response = 'Available sounds:\n\n';
      sounds.forEach((sound) => {
        response += `${sound}\n`;
      });
      await message.channel?.sendMessage(response);
    } else if (message.content === '/help') {
      await message.channel?.sendMessage(
        'Type "/sounds" to see all available sounds.\nType "/play [soundname]" to play a sound.',
      );
    }
  } catch (e) {
    console.error('Error in messageCreate:', e);
    await message.channel?.sendMessage('something went wrong, use "/play [sound-name]".');
  }
});

client.loginBot(process.env.BOT_TOKEN!);
