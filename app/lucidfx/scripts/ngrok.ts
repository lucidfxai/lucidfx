import { exec } from 'child_process';
import dotenv from 'dotenv';

// Load the environment variables from the .env file
dotenv.config();

const authToken = process.env.NGROK_AUTH_TOKEN;

exec(`ngrok authtoken ${authToken}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }

  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});

