require("dotenv").config();

const { Client, DiscordAPIError } = require("discord.js");
const path = require ("path");
const ytdl = require (`yt-search`);
const Discord = require('discord.js');
const fetch = require("node-fetch");
const Commando = require ("discord.js-commando");
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

const history1 = new Discord.MessageEmbed()
.setTitle ("This is a little about me")
.setImage ("https://i.imgur.com/K5xGoHs.png")
.setURL ("https://cyberpunk.fandom.com/wiki/Judy_Alvarez")
.setFooter ("You can click the title and go to my wiki")
.setAuthor ("Nerea loves Judy")

const error1 = new Discord.MessageEmbed()
.setTitle (" :x: | You have to indicate de Channel id form the voice Channel you want to start the session. Follow these steeps to obtain de Channel ID from a voice Channel")
.setImage ("https://i.postimg.cc/zGHmSgv1/Mi-video1-min.gif")

const help1 = new Discord.MessageEmbed()
.setTitle ("Comands")
.addFields (
    {name: `${PREFIX}youtube Channel_ID`, value: `starts a Youtube session in the Channel indicated`},
    {name: `${PREFIX}games Channel_ID + pocker, betrayal, fishington or chess` , value: `starts a game session of the game selected in the Channel indicated`},
    {name: `${PREFIX}boutme` , value: `know a little more about me`},    
    {name: "To obtain the Channel_ID of your voice Channel follow these steps", value: "Tutorial"}
    )
.setImage ("https://i.postimg.cc/zGHmSgv1/Mi-video1-min.gif")

//const youtube1 = new Discord.MessageEmbed()
//.setTitle ("Dale click para empezar la sesion de __YouTube Together__")
//.setDescription (`en ${channel.name}: "<https://discord.gg/"${invite.code}>`)

const lagunabend1 = new Discord.MessageEmbed()
.setTitle (":x: | You have to be in a voice Channel for running this command")

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
                const youtube1 = new Discord.MessageEmbed() .setTitle (" :tv: | Click the link to start or join __YouTube Together__ session") .setDescription (`in **${channel.name}**: <https://discord.gg/${invite.code}>`) .setURL (`https://discord.gg/${invite.code}`)
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
                const games1 = new Discord.MessageEmbed() .setTitle (` :video_game: | Click the link to start or join __${activity.name}__ session`) .setDescription (`in **${channel.name}**: <https://discord.gg/${invite.code}>`) .setURL(`https://discord.gg/${invite.code}`)
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

    if (cmd === "boutme") {
        return message.channel.send (history1);
    } 
    
    if (cmd === "lagunabend") {

      const voiceChannel = message.member.voice.channel;
      
      if (!voiceChannel) return message.channel.send (lagunabend1); 
      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has(`CONNECT`)) return message.channel.send(admin1);
      if (!permissions.has(`SPEAK`)) return message.channel.send(admin1);    
      
      const connection = await voiceChannel.join();

    } 


});

client.on('ready', () => {
    console.log("Activity OK")
    //CHANGE {type: 2} in 
    //1 FOR PLAYING
    //2 FOR LISTENING
    //3 FOR WATCHING
    client.user.setActivity("El fin del verano", {type: 2});
});

client.login();
