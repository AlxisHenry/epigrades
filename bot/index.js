import { Client, GatewayIntentBits } from "discord.js";
import config from "./config.json" assert { type: "json" };
import { AttachmentBuilder } from "discord.js";
import moment from "moment";
import fs from "fs";

const { token } = config;
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!report")) {
    const response = await fetch(
      "https://epigrades.alexishenry.eu/api/online/me/pdf"
    );
    const { filename, base64 } = await response.json();
    fs.writeFileSync("attachments/report-me.pdf", base64, "base64");
    const attachment = new AttachmentBuilder("attachments/report-me.pdf");
    attachment.setName(filename);
    await message.channel.send({ files: [attachment] });
    await message.author.send("Here is your report!");
    await message.author.send({
      files: [attachment],
    });
    fs.unlinkSync("attachments/report-me.pdf");
  }
});

client.login(token);
