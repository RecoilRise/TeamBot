import { EmbedBuilder } from "discord.js";

export class RequestSentEmbed extends EmbedBuilder {
    constructor(teamName: string){
        super()
        this.setColor("Green")
        this.setTitle("Alrighty!")
        this.addFields({
            name: "Success",
            value: `Sent a scheduling request to ${teamName}`
        })
        
    }
}

export class SchedReqPrimaryEmbed extends EmbedBuilder {
    constructor(){
        super()
        this.setColor("DarkButNotBlack")
        this.setTitle("Pick a team and match type")
        this.setDescription("If a team isn't listed, they have not set their scheduling channel yet.")
    }
}

