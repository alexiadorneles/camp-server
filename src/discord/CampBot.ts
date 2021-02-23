import {
  Client,
  Collection,
  GuildMember,
  Message,
  RoleManager,
} from 'discord.js'
import { MessageHandler } from './MessageHandler'
import {
  CABIN_NUMBER_TO_OLYMPIAN,
  Divinity,
  OLYMPIAN_TO_CABIN_NUMBER,
} from '../types/Mythology'
import _ from 'lodash'

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

    if (
      message.author.id === DISCORD_ADMIN_ID &&
      message.content.includes('!clear')
    ) {
      return this.handleClearAllCabinRolesMessage(message)
    }

    if (
      message.channel.id === DISCORD_CHANNEL_ID &&
      message.content.trim() === '!camp'
    ) {
      return this.handleCabinRequestMessage(message)
    }

    if (
      message.channel.id === DISCORD_CHANNEL_ID &&
      message.content.trim().startsWith('!cabin')
    ) {
      return this.handleCountCabinMessage(message)
    }
  };

  private handleCountCabinMessage = async (message: Message) => {
    try {
      const campServer = this.client.guilds.cache.find(
        (guild) => guild.name === 'Acampamento'
      )
      const roles = await campServer.roles.fetch()
      const members = await campServer.members.fetch()
      const [command, cabin] = message.content.trim().split(' ')

      if (cabin && !Number(cabin)) {
        return message.channel.send(
          'Formato incorreto! O correto é !cabin <número do chalé>, ex: !cabin 7'
        )
      }

      if (cabin) {
        const membersWithRole = this.countSingleCabinMembers(
          cabin,
          roles,
          members
        )
        return message.channel.send(
          `O Chalé ${cabin} possui ${membersWithRole.size} membros aqui no Discord`
        )
      }

      const roleUserSortedByCabinID = this.countAllCabinMembers(roles, members)
      const responseMessage = roleUserSortedByCabinID.map(
        ([divinity, members]: [number, any[]]) => {
          return `Chalé ${divinity} - ${members.length} membros`
        }
      )
      await message.channel.send(responseMessage)
    } catch (err) {
      message.author.send('Opa, deu algum problema.')
      message.author.send(err.message)
    }
  }

  private handleClearAllCabinRolesMessage = async (message: Message) => {
    const campServer = this.client.guilds.cache.find(
      (guild) => guild.name === 'Acampamento'
    )
    const rolesNames = Object.values(Divinity)
    console.log('Começou a limpar as roles!')
    const roles = await campServer.roles.fetch()
    const divinityRoles = roles.cache.filter((role) =>
      rolesNames.includes(role.name as Divinity)
    )
    console.log('Roles: ', divinityRoles.size)
    try {
      const members = await campServer.members.fetch()
      const membersWithRole = members.filter((member) => {
        const userRoles = member.roles.cache.array()
        return divinityRoles.some((divinityRole) =>
          userRoles.includes(divinityRole)
        )
      })

      const membersArray = membersWithRole.array()
      for (const member of membersArray) {
        console.log(
          'Removendo roles do user ',
          member.displayName,
          ' roles: ',
          divinityRoles.size
        )
        await member.roles.remove(divinityRoles)
      }
      console.log('Os membros são ', members.size)
      message.author.send(
        'Todos os usuários do Acampamento fora de seus chalés.'
      )
    } catch (err) {
      message.author.send('Opa, deu algum problema.')
      message.author.send(err.message)
    }
  };

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
  };

  private onReady = () => {
    console.log('Bot está pronto para começar!')
  };

  private countAllCabinMembers(
    roles: RoleManager,
    members: Collection<string, GuildMember>
  ) {
    const rolesNames = Object.values(Divinity)
    const divinityRoles = roles.cache.filter((role) =>
      rolesNames.includes(role.name as Divinity)
    )

    const roleUserGroup = _.groupBy(members, (member: GuildMember) =>
      divinityRoles.find((divinityRole) =>
        member.roles.cache.array().includes(divinityRole)
      )
    )

    const roleUserSortedByCabinID = Object.entries(roleUserGroup)
      .map(([d, m]) => [OLYMPIAN_TO_CABIN_NUMBER[d as Divinity], m])
      .sort(([a]: [number], [b]: [number]) => a - b)
    return roleUserSortedByCabinID
  }

  private countSingleCabinMembers(
    cabin: string,
    roles: RoleManager,
    members: Collection<string, GuildMember>
  ) {
    const divinityRelated = CABIN_NUMBER_TO_OLYMPIAN[Number(cabin)]
    const roleRelated = roles.cache.find(
      (role) => role.name === divinityRelated
    )
    const membersWithRole = members.filter((member) => {
      const userRoles = member.roles.cache.array()
      return userRoles.includes(roleRelated)
    })
    return membersWithRole
  }
}
