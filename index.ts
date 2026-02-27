import type { FormDataEntryValue } from 'bun';
import index from './index.html';
import { join, play } from './soundboard-bot';
import { Client } from 'stoat.js';

const server = Bun.serve({
  port: 3001,
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
  console.log(message.content);
  try {
    if (message.content?.startsWith('/play')) {
      const soundName = message.content.split('/play ')[1];
      console.log(soundName);
      const didPlay = play(soundName!);
      if (!didPlay) {
        message.channel?.sendMessage('The sound could not be found.');
      }
    }
  } catch (e) {
    console.error(e);
    message.channel?.sendMessage('something went wrong, use "/play [sound-name]".');
  }
});

client.loginBot('rkLjdCkyQkBIr42OzYhYsgjmXiWF-jIO8ruB0ZhVT9Eni4HP7_D7FckTlGoErJtd');
