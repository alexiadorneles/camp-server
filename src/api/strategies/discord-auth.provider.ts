import { Strategy } from 'passport-discord'
import OAuth2Strategy from 'passport-oauth2'
import { StrategyProvider } from './strategy.provider'

const { DISCORD_CLIENT_ID, DISCORD_SECRET_KEY } = process.env

export class DiscordAuthStrategyProvider implements StrategyProvider {
	public provide = (): Strategy => {
		return new Strategy(
			{
				clientID: DISCORD_CLIENT_ID,
				clientSecret: DISCORD_SECRET_KEY,
				callbackURL: '/discord/redirect',
				scope: ['identify', 'email', 'guilds'],
			},
			this.strategyCallback,
		)
	}

	private strategyCallback = (
		accessToken: string,
		refreshToken: string,
		params: any,
		profile: Strategy.Profile,
		done: OAuth2Strategy.VerifyCallback,
	) => {
		done(null, profile, {})
	}
}
