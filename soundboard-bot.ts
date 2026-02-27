const { Revoice, MediaPlayer } = require('revoice.js');
import fs from 'fs';

let connection: any;
let media: any;

export async function join(): Promise<void> {
  const revoice = new Revoice('rkLjdCkyQkBIr42OzYhYsgjmXiWF-jIO8ruB0ZhVT9Eni4HP7_D7FckTlGoErJtd');
  connection = await revoice.join('01KJDNQM1W5EYB8VCZRZWJRDJZ');
  media = new MediaPlayer();
  connection.on('join', () => {
    // playing audio does only work after the the bot joined the voice channel
    connection.play(media);

    // play('thankyou');
  });
}

export function play(soundName: string): boolean {
  const filePath = `./public/${soundName}.ogg`;
  if (fs.existsSync(filePath)) {
    media.playStream(fs.createReadStream(filePath));
    return true;
  }
  return false;
}
