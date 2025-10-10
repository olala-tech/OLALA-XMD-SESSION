const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');

const { makeid } = require('./id');
const QRCode = require('qrcode');
const express = require('express');
const fs = require('fs');
const pino = require('pino');

const {
    default: RubyConnect,
    useMultiFileAuthState,
    Browsers,
    delay
} = require('@whiskeysockets/baileys');

const router = express.Router();

// Utility to safely remove directories
function clearTemp(path) {
    if (!fs.existsSync(path)) return;
    fs.rmSync(path, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();

    async function OLALA-TECH-XMD() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);

        try {
            const client = RubyConnect({
                auth: state,
                logger: pino({ level: 'silent' }),
                browser: Browsers.macOS('Desktop'),
                printQRInTerminal: false
            });

            client.ev.on('creds.update', saveCreds);

            client.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
                // Show QR in response
                if (qr) {
                    return res.end(await QRCode.toBuffer(qr));
                }

                if (connection === 'open') {
                    await client.sendMessage(client.user.id, { text: '🔐 Generating your session_id... please wait.' });
                    await delay(50000);

                    const creds = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    await delay(8000);

                    const b64data = Buffer.from(creds).toString('base64');
                    const sessionMsg = await client.sendMessage(client.user.id, { text: b64data });

                    const info = `
「 OLALA-TECH-XMD SESSION 」

✨ Successfully linked to your WhatsApp account!  
🚫 Do not share this session_id with anyone.  

📌 Use it in the SESSION environment variable during deployment.  
📞 Need help? Contact: https://wa.me/254101457182 

⚡ Stay safe & keep coding smart.  
`;

                    await client.sendMessage(client.user.id, { text: info }, { quoted: sessionMsg });

                    await delay(100);
                    await client.ws.close();
                    clearTemp('./temp/' + id);
                } 
                else if (connection === 'close' && lastDisconnect?.error?.output?.statusCode !== 401) {
                    await delay(10000);
                    OLALA-TECH-XMD();
                }
            });
        } catch (err) {
            console.error('Error:', err);
            clearTemp('./temp/' + id);

            if (!res.headersSent) {
                res.json({ code: 'Service Currently Unavailable' });
            }
        }
    }

    return await OLALA-TECH-XMD();
});

module.exports = router;