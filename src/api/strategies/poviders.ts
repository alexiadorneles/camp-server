import { DiscordAuthStrategyProvider } from './discord-auth.provider'
import { StrategyProvider } from './strategy.provider'

export const STRATEGY_PROVIDERS: StrategyProvider[] = [new DiscordAuthStrategyProvider()]
