const { Revoice, MediaPlayer } = require('revoice.js');
import fs from 'fs';
import path from 'path';

let connection: any;
let media: any;
const publicDir = './public';

export async function join(): Promise<void> {
  const revoice = new Revoice(process.env.BOT_TOKEN);
  connection = await revoice.join(process.env.CHANNEL_ID);
  media = new MediaPlayer();
  connection.on('join', () => {
    // playing audio does only work after the the bot joined the voice channel
    connection.play(media);

    // play('thankyou');
  });
}

export function play(soundName: string): boolean {
  const filePath = `${publicDir}/${soundName}.ogg`;
  if (fs.existsSync(filePath)) {
    media.playStream(fs.createReadStream(filePath));
    return true;
  }
  return false;
}

/** Retuns the names of all sound files (wihout the extension) */
export function getSoundNames(): string[] {
  try {
    const files = fs.readdirSync(publicDir);
    return files
      .filter((file) => fs.statSync(path.join(publicDir, file)).isFile())
      .map((file) => path.parse(file).name);
  } catch (err) {
    console.error('Error reading public directory:', err);
    return [];
  }
}
