import { Client, CommandInteraction, CacheType, SlashCommandChannelOption, GuildTextBasedChannel, GuildChannel, ReactionCollector } from "discord.js";
import { TeamBot } from "../../Bot";
import { DiscordCommand } from "../DiscordCommand";
import fs from "fs";
import { PCLTeam, HourReaction } from "../../interfaces/PCLTeam";

export class SchedulingChannelCommand extends DiscordCommand {
    public inDev: boolean = false;

    constructor() {
        super();
        this.properties
            .setName("scheduling_channel")
            .setDescription("this is required to make scheduling requests")
            .addChannelOption(new SlashCommandChannelOption().setName("channel").setDescription("make sure you are in your team's server").setRequired(true));
    }

    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        interaction.deferReply();
        const REACTIONS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🕚", "🕛"];
        const channel = interaction.options.get("channel")!.value as string;
        let teamsDb: PCLTeam[] = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"));
        let issuerTeam = teamsDb.find((pclTeam) => {
            return pclTeam.captain === interaction.user.id || pclTeam.coCap === interaction.user.id; //evaluate wether the user is a cap or cocap of a team
        });

        if (!issuerTeam) return interaction.reply("you are not part of a team");
        teamsDb.find((pclTeam) => {
            return pclTeam.name === issuerTeam!.name;
        })!.schedulingChannel = channel;

        //sending out the shizz
        const guildChan = (await client.channels.fetch(channel)) as GuildTextBasedChannel;
        const messages = [];
        messages.push(
            await guildChan.send("Tuesday"),
            await guildChan.send("Wednesday"),
            await guildChan.send("Thursday"),
            await guildChan.send("Friday"),
            await guildChan.send("Saturday"),
            await guildChan.send("Sunday"),
            await guildChan.send("Monday")
        );

        const teamAvailability: PCLTeam["availability"] = {
            messageIds: [],
            tuesday: {"1PM": [], "2PM": [], "3PM": [], "4PM": [], "5PM":[], "6PM":[],"7PM":[],"8PM":[], "9PM":[], "10PM":[],"11PM":[], "12PM":[]},
            wednesday: {"1PM": [], "2PM": [], "3PM": [], "4PM": [], "5PM":[], "6PM":[],"7PM":[],"8PM":[], "9PM":[], "10PM":[],"11PM":[], "12PM":[]},
            thursday: {"1PM": [], "2PM": [], "3PM": [], "4PM": [], "5PM":[], "6PM":[],"7PM":[],"8PM":[], "9PM":[], "10PM":[],"11PM":[], "12PM":[]},
            friday: {"1PM": [], "2PM": [], "3PM": [], "4PM": [], "5PM":[], "6PM":[],"7PM":[],"8PM":[], "9PM":[], "10PM":[],"11PM":[], "12PM":[]},
            saturday: {"1PM": [], "2PM": [], "3PM": [], "4PM": [], "5PM":[], "6PM":[],"7PM":[],"8PM":[], "9PM":[], "10PM":[],"11PM":[], "12PM":[]},
            sunday: {"1PM": [], "2PM": [], "3PM": [], "4PM": [], "5PM":[], "6PM":[],"7PM":[],"8PM":[], "9PM":[], "10PM":[],"11PM":[], "12PM":[]},
            monday: {"1PM": [], "2PM": [], "3PM": [], "4PM": [], "5PM":[], "6PM":[],"7PM":[],"8PM":[], "9PM":[], "10PM":[],"11PM":[], "12PM":[]},
        }

		//populating the messageIds
        for (const message of messages) {
            teamAvailability.messageIds.push(message.id);
            for (const reaction of REACTIONS) {
                message.react(reaction);
            }
            message.react("❌");
        }


        teamsDb.find((pclTeam) => {
            return pclTeam.name === issuerTeam!.name;
	})!.availability = teamAvailability
        fs.writeFileSync("./db/teams.json", JSON.stringify(teamsDb));
        interaction.followUp("Success");
    }
}
