import { Message } from 'discord.js'
import { Camper } from '../models'
import { CABIN_NUMBER_TO_OLYMPIAN, Divinity } from '../types/Mythology'

const CAMPER_ADDED_IN_CABIN = (id: string, cabin: string) =>
	`Hey <@${id}>! Acabei de adicionar você no Chalé ${cabin} aqui no Discord :smile:`

const CAMPER_WITH_NO_CABIN = `Vejo que você é uma pessoa Campista em nosso Acampamento, mas ainda não está em nenhum chalé. Verifique se realizou a inscrição paga/gratuita em https://acampamento.portalpercyjackson.com`

export class MessageHandler {
	constructor(private message: Message) {}

	public async rejectAndReply(replyText: string): Promise<Message> {
		await this.message.react('❌')
		return this.message.reply(replyText)
	}

	public async addCabinRoleToUser(camper: Camper): Promise<void | Message> {
		const roleName = CABIN_NUMBER_TO_OLYMPIAN[camper.idCabin]
		const role = this.message.guild.roles.cache.find(role => role.name === roleName)
		if (!role) {
			return this.rejectAndReply(CAMPER_WITH_NO_CABIN)
		}
		this.message.member.roles.add(role)
		await this.message.react('✅')
		this.message.channel.send(CAMPER_ADDED_IN_CABIN(camper.dsDiscordID, `de ${role}`))
	}

	public async loadCamperFromDiscordId(): Promise<Camper> {
		const dsDiscordID = this.message.author.id
		return Camper.findOne({ where: { dsDiscordID }, attributes: ['idCabin', 'dsDiscordID'] })
	}

	public userAlreadyInCabin(): boolean {
		const userRoles = this.message.member.roles.cache.array()
		const roles = Object.values(Divinity)
		return userRoles.some(role => roles.includes(role.name as Divinity))
	}
}
