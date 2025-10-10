const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
const pino = require('pino');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    version,
    delay,
    makeCacheableSignalKeyStore,
} = require("@whiskeysockets/baileys");

const router = express.Router();

// Helper function to remove files
function removeFile(filePath) {
    if (!fs.existsSync(filePath)) return false;
    fs.rmSync(filePath, { recursive: true, force: true });
}

// Route handler
router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function OLALA-TECH-XMD() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            const client = makeWASocket({
                printQRInTerminal: false,
                version: [2, 3000, 1023223821],
                logger: pino({ level: 'silent' }),
                browser: ['Ubuntu', 'Chrome', '20.0.04'],
                auth: state,
            });

            if (!client.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await client.requestPairingCode(num);

                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            client.ev.on('creds.update', saveCreds);
            client.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection === 'open') {
                    await client.sendMessage(client.user.id, { 
                        text: `🔐 Generating your session...\n\nPlease wait while OLALA-TECH-XMD prepares everything for you.` 
                    });

                    await delay(50000);

                    const data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    await delay(8000);
                    const b64data = Buffer.from(data).toString('base64');
                    const session = await client.sendMessage(client.user.id, { text: '' + b64data });

                    // Session message
                    const sessionText = 
`⚡ OLALA-TECH-XMD has been successfully linked to your WhatsApp account!  

📌 Do *NOT* share this session_id with anyone.  
📌 Copy and paste it into the *SESSION* field during deploy for authentication.  

💬 Need help? Contact me here:  
https://wa.me/254101457182

✨ Stay safe, stay productive.  
— OLALA-TECH-XMD`;

                    await client.sendMessage(client.user.id, { text: sessionText }, { quoted: session });

                    await delay(100);
                    await client.ws.close();
                    removeFile('./temp/' + id);
                } else if (connection === 'close' && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode !== 401) {
                    await delay(10000);
                    OLALA-TECH-XMD();
                }
            });
        } catch (err) {
            console.log('service restarted', err);
            removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: '⚠️ Service Currently Unavailable. Please try again later.' });
            }
        }
    }

    await OLALA-TECH-XMD();
});

module.exports = router;