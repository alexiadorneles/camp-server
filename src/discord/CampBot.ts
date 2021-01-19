import { Client, Message } from 'discord.js'
import { MessageHandler } from './MessageHandler'

const { DISCORD_BOT_TOKEN, DISCORD_CHANNEL_ID } = process.env
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
		console.log('expected id ', DISCORD_CHANNEL_ID)
		console.log('current id ', message.channel.id)
		if (message.channel.id !== DISCORD_CHANNEL_ID || !message.content.includes('!camp')) return

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
		console.log(this.client.guilds.cache.array()[0].memberCount)
	}
}
