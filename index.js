require("dotenv").config();

const { Client, DiscordAPIError } = require("discord.js");
const Discord = require('discord.js');
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
        name: "Chess",
    }
 
};
//embeds

const error1 = new Discord.MessageEmbed()
.setTitle (" :x: | You have to indicate de chanel id form the chanel you wan to start the session. Follow theese steeps to obtain de chanel ID from a voice chanel")
.setImage ("https://i.postimg.cc/zGHmSgv1/Mi-video1-min.gif")

const help1 = new Discord.MessageEmbed()
.setTitle ("Comands")
.addFields (
    {name: `${PREFIX}youtube ChanelID`, value: `starts a Youtube session in the chanel indicated`},
    {name: `${PREFIX}games Chanel_ID + pocker, betrayal, fishington or chess` , value: `starts a game session of the game selected and chanel indicated`},
    {name: "To obtain the Chanel ID of your voice chanel follow theese steps", value: "Tutorial"}
    )
.setImage ("https://i.postimg.cc/zGHmSgv1/Mi-video1-min.gif")

//const youtube1 = new Discord.MessageEmbed()
//.setTitle ("Dale click para empezar la sesion de __YouTube Together__")
//.setDescription (`en ${channel.name}: "<https://discord.gg/"${invite.code}>`)

const error2 = new Discord.MessageEmbed()
.setTitle (`:x: | You have not specified the game you want to start a session, the avaible games are __pocker, betrayal, fishington or chess__`)
.setDescription (` if you ned hel use **${PREFIX}help** `)

const admin1 = new Discord.MessageEmbed()
.setTitle (":x: | To work properly i need admin permissions")

const error3 = new Discord.MessageEmbed() 
.setTitle (":X:| Could not start de session. Try again later")

const pong1 = new Discord.MessageEmbed()
.setTitle (`Pong! \`${client.ws.ping}ms\``)

const invite1 = new Discord.MessageEmbed()
.setTitle (` :gift: | Click here to invite Judy to your server ` )
.setDescription ("Made by Nerea Cassian [Who cares#3784 (@who_caresboutme)]")
.setURL (`https://discord.com/oauth2/authorize?client_id=854134774825091092&scope=bot&permissions=8`)
.setImage (`https://66.media.tumblr.com/facc9dcbaccc5052e22358557f81e979/a6a4bdc2d7d3effe-b0/s400x600/ec76b2c6f6be3288fbc1fc2e1338f930d28e5474.gifv`)


client.on("ready", () => console.log("Judy Online"));
client.on("warn", console.warn);
client.on("error", console.error);

client.on("message", async message => {
    if (message.author.bot || !message.guild) return;
    if (message.content.indexOf(PREFIX) !== 0) return;

    const args = message.content.slice(PREFIX.length).trim().split(" ");
    const cmd = args.shift().toLowerCase();

    if (cmd === "ping") return message.channel.send(pong1);

    if (cmd === "youtube") {
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== "voice") return message.channel.send(error1);
        if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.channel.send(admin1);

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
                if (invite.error || !invite.code) return message.channel.send(error3);
                const youtube1 = new Discord.MessageEmbed() .setTitle (" :tv: | Click the link to start or join __YouTube Together__ session") .setDescription (`in **${channel.name}**: <https://discord.gg/${invite.code}>`)
                message.channel.send(youtube1);
            })
            .catch(e => {
                
                message.channel.send(error3);
            })
    }
    

    // or use this
    if (cmd === "games") {
        const channel = message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== "voice") return message.channel.send(error1);
        if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.channel.send(admin1);
        const activity = ACTIVITIES[args[1] ? args[1].toLowerCase() : null];
        if (!activity) return message.channel.send(error2);

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
                if (invite.error || !invite.code) return message.channel.send(error3);
                const games1 = new Discord.MessageEmbed() .setTitle (` :video_game: | Click the link to start or join __${activity.name}__ session`) .setDescription (`in **${channel.name}**: <https://discord.gg/${invite.code}>`)
                message.channel.send(games1);
            })
            .catch(e => {
                message.channel.send(error3);
            })
    }


    if (cmd === "invite") {
        return message.channel.send (invite1);
    }

   // if (cmd === "sex") {
   //     return message.channel.send (' ||https://twitter.com/who_caresboutme|| ');
   // }

    if (cmd === "help") {
        return message.channel.send (help1);
    }


});

client.login();
