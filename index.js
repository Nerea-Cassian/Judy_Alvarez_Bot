require("dotenv").config();

const { Client } = require("discord.js");
const fetch = require("node-fetch");
const client = new Client();
const PREFIX = ".";

const ACTIVITIES = {
    "poker": {
        id: "755827207812677713",
        name: "Poker Night"
    },
    "betrayal": {
        id: "773336526917861400",
        name: "Betrayal.io"
    },
    "youtube": {
        id: "755600276941176913",
        name: "YouTube Together"
    },
    "fishington": {
        id: "814288819477020702",
        name: "Fishington.io"
    },
    "chess": {
        id: "832012586023256104",
        name: "CG 2 Dev",
    }
 
};

client.on("ready", () => console.log("Bot Online"));
client.on("warn", console.warn);
client.on("error", console.error);

client.on("message", async message => {
    if (message.author.bot || !message.guild) return;
    if (message.content.indexOf(PREFIX) !== 0) return;

    const args = message.content.slice(PREFIX.length).trim().split(" ");
    const cmd = args.shift().toLowerCase();

    if (cmd === "ping") return message.channel.send(`Pong! \`${client.ws.ping}ms\``);

    if (cmd === "youtube") {
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== "voice") return message.channel.send("❌ | Tienes que especificar la id del canal de audio donde iniciar la sesión. **Sigue estas instruciones para obtener la id de un canal de voz** **Sigue estos pasos para obtener la id de un canal** https://streamable.com/u9w8xu ");
        if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.channel.send("❌ | Necesito permiso para `CREATE_INSTANT_INVITE` ");

        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: "755600276941176913", // youtube together
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${client.token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(invite => {
                if (invite.error || !invite.code) return message.channel.send("❌ | Could not start **YouTube Together**!");
                message.channel.send(`✅ | Dale click para empezar una sesión de **YouTube Together** en ${channel.name}: <https://discord.gg/${invite.code}>`);
            })
            .catch(e => {
                message.channel.send("❌ | Algo ha fallado, no he podido iniciar una sesión de **YouTube Together**!");
            })
    }
    

    // or use this
    if (cmd === "juegos") {
        const channel = message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== "voice") return message.channel.send("❌ | Tienes que especificar la id del canal de audio donde iniciar la sesión. **Sigue estas instruciones para obtener la id de un canal de voz** **Sigue estos pasos para obtener la id de un canal** https://streamable.com/u9w8xu ");
        if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.channel.send("❌ | Necesito permiso para `CREATE_INSTANT_INVITE` ");
        const activity = ACTIVITIES[args[1] ? args[1].toLowerCase() : null];
        if (!activity) return message.channel.send(`❌ | Formatos correctos:\n${Object.keys(ACTIVITIES).map(m => `- **${PREFIX}juegos <Channel_ID> ${m}**`).join("\n")}`);

        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: activity.id,
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${client.token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(invite => {
                if (invite.error || !invite.code) return message.channel.send(`❌ | Could not start **${activity.name}**!`);
                message.channel.send(`✅ | Click aqui para empezar **${activity.name}** en **${channel.name}**: <https://discord.gg/${invite.code}>`);
            })
            .catch(e => {
                message.channel.send(`❌ | Algo ha fallado, no he podido iniciar una sesión de **${activity.name}**!`);
            })
    }


    if (cmd === "invitar") {
        return message.channel.send (' 🎁| Usa este enlace para invitar a este bot a tu server https://discord.com/oauth2/authorize?client_id=854134774825091092&scope=bot&permissions=8 ')
    }

    if (cmd === "sex") {
        return message.channel.send (' ||https://twitter.com/who_caresboutme|| ')
    }

    if (cmd === "help") {
        return message.channel.send (' 📄 | Los comandos disponibles son \n**.youtube <Chanel_id>** para empezar una sesión de Youtube\n \n**.juegos <Channel_ID> pocker, betrayal, fishington, chess** para empezar una sesion de cualquiera de esos juegos\n \n Para obtener la **ID de cualquier canal de voz** sigue estos pasos https://streamable.com/u9w8xu \n ')
    }


});

client.login();
