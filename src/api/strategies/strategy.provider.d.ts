import { Strategy } from 'passport-discord'

export interface StrategyProvider {
	provide(): Strategy
}
