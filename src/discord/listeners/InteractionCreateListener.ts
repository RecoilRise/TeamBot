import { DiscordListener } from "../DiscordListener";
import { TeamBot } from "../../Bot";

export class InteractionCreateListener extends DiscordListener {
    startListener(teamBot: TeamBot): void {
        const nonReplyButtonIds = ["teamcfgGold", "teamcfgSilver", "teamcfgBronze"]
        teamBot.client.on("interactionCreate", async (interaction) => {
            try {
                if (interaction.isCommand()) {
                    teamBot.commands.get(interaction.commandName)?.executeInteraction(teamBot.client, interaction, teamBot);
                }
            } catch (e) {
                console.error(e);
            }

            if (interaction.isButton()) {
                /** if it isn't a persistent button, either wait for a 
                 * reply or defer an update if it's a non-reply button */
                if(!teamBot.persistentButtons.has(interaction.customId)){
                    if(nonReplyButtonIds.includes(interaction.customId)) { //non-reply button
                        interaction.deferUpdate();
                        return;
                    }
                    //not a persitent button, but should hava a reply
                    interaction.deferReply()
                    setTimeout(() => {
                        if(!interaction.replied){
                            interaction.followUp({content: "I do not understand. Try refreshing the buttons eh?", ephemeral: true})
                            return;
                        }
                    }, 10_000)
                }
                teamBot.persistentButtons.get(interaction.customId)?.execute(teamBot, teamBot.client, interaction)
                
            }
        });
    }
}
