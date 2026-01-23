import dotenv from 'dotenv';
dotenv.config();

const vars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_CALLBACK_URL', 'SESSION_SECRET'];
vars.forEach(v => console.log(`${v}: ${process.env[v] ? 'EXISTS' : 'MISSING'}`));
