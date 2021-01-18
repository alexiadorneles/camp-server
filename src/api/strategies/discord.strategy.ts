import passport from 'passport'
import { Strategy } from 'passport-discord'
import OAuth2Strategy from 'passport-oauth2'

const { DISCORD_CLIENT_ID, DISCORD_SECRET_KEY, DISCORD_PUBLIC_KEY } = process.env

function callback(
	accessToken: string,
	refreshToken: string,
	profile: Strategy.Profile,
	done: OAuth2Strategy.VerifyCallback,
): void {}

const discordStrategy = new Strategy(
	{
		clientID: DISCORD_CLIENT_ID,
		clientSecret: DISCORD_SECRET_KEY,
		callbackURL: '/discord/redirect',
		scope: ['identify', 'email', 'guilds'],
	},
	callback,
)

passport.use(discordStrategy)
