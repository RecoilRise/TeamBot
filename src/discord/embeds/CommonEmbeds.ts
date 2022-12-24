import { EmbedBuilder } from "discord.js";

export class UserNotCaptainEmbed extends EmbedBuilder{
    constructor(){
        super()
        this.setColor("Red")
        this.setTitle("A bit awkward eh?")
        this.setFields({
            name: "Failed:",
            value: "Only captains or co-captains can use this"
        })
    }
}

export class PlayerNotRegisteredEmbed extends EmbedBuilder {
    constructor(oculusId?: string){
        super()
        this.setColor("Red")
        this.setTitle("What a loser...")
        if(!oculusId){
            this.setFields({
                name: "Failed:",
                value: "The provided player is not registered"
            })
        } else {
            this.setFields({
                name: "Failed",
                value: `**${oculusId}** could not be found. Check spelling or wait for them to register`
            })
        }
    }
}

export class UserNotOnTeamEmbed extends EmbedBuilder {
    constructor(){
        super()
        this.setColor("Red")
        this.setTitle("Wait a second...")
        this.setFields({
            name: "Failed:",
            value: "You must be on a team to use this command"
        })
    }
}

export class PlayerAlreadyOnEmbed extends EmbedBuilder {
    constructor(oculusId?: string){
        super()
        this.setColor("Red")
        this.setTitle("No can do...")
        if(oculusId){
            this.setFields({
                name: "Failed:",
                value: `${oculusId} is already on a team`
            })
        } else {
            this.setFields({
                name: "Failed:",
                value: "The player is already on a team"
            })
        }
    }
}

export class PlayerNotOnUserTeamEmbed extends EmbedBuilder {
    constructor(){
        super()
        this.setColor("Red")
        this.setTitle("Can't do that")
        this.setFields({
            name: "Failed:",
            value: "You cannot remove someone from somebody else's team"
        })
        this.setFooter({text: "Nice try"})
    }
}