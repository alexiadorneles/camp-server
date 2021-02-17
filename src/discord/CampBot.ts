import { Client, Message } from 'discord.js'
import { MessageHandler } from './MessageHandler'
import { Divinity } from '../types/Mythology'

const { DISCORD_BOT_TOKEN, DISCORD_CHANNEL_ID, DISCORD_ADMIN_ID } = process.env

const CAMPER_NOT_FOUND_MESSAGE =
	'Olá! Percebi que você tentou entrar para seu chalé no Discord do Acampamento. No entanto, parece que você não está registrado devidamente no site. Acesse https://acampamento.portalpercyjackson.com e verifique seu perfil, depois tente novamente'
const CAMPER_ALREADY_IN_CABIN =
	'Olá! Percebi que você tentou entrar para seu chalé no Discord do Acampamento, mas parece que você já está em um chalé. É importante que não tente executar o comando muitas vezes, para não me sobrecarregar. Se isso for um problema, favor entrar em contato com os diretores. Obrigado!'

export class CampBot {
	private client: Client

	constructor() {
		this.client = new Client()
		this.client.on('ready', this.onReady)
		this.client.on('message', this.onMessage)
		this.client.login(DISCORD_BOT_TOKEN)
	}

	private onMessage = async (message: Message) => {
		if (message.author.bot) return

		if (message.author.id === DISCORD_ADMIN_ID && message.content.includes('!clear')) {
			return this.handleClearAllCabinRolesMessage(message)
		}

		if (message.channel.id === DISCORD_CHANNEL_ID && message.content.trim() === '!camp') {
			return this.handleCabinRequestMessage(message)
		}
	}

	private handleClearAllCabinRolesMessage = async (message: Message) => {
		const campServer = this.client.guilds.cache.find(guild => guild.name === 'Acampamento')
		const rolesNames = Object.values(Divinity)
		console.log('Começou a limpar as roles!')
		const roles = campServer.roles.cache.filter(role => rolesNames.includes(role.name as Divinity))
		console.log('Roles: ', roles.size)
		try {
			const members = await campServer.members.fetch()
			await Promise.all(campServer.members.cache.map(member => roles.map(r => member.roles.remove(r))))
			console.log('Os membros são ', members.size)
			message.author.send('Todos os usuários do Acampamento fora de seus chalés.')
		} catch (err) {
			message.author.send('Opa, deu algum problema.')
			message.author.send(err.message)
		}
	}

	private handleCabinRequestMessage = async (message: Message) => {
		const messageHandler = new MessageHandler(message)

		if (messageHandler.userAlreadyInCabin()) {
			return messageHandler.rejectAndReply(CAMPER_ALREADY_IN_CABIN)
		}

		const camper = await messageHandler.loadCamperFromDiscordId()

		if (!camper) {
			return messageHandler.rejectAndReply(CAMPER_NOT_FOUND_MESSAGE)
		}

		await messageHandler.addCabinRoleToUser(camper)
	}

	private onReady = () => {
		console.log('Bot está pronto para começar!')
	}
}
