import { Level, ActivityType } from './Activity'

export interface RoundConfig {
	activitiesConfig: ActivityConfig[]
}

export interface ActivityConfig {
	nrQuantity: number
	tpLevel: Level
	type: ActivityType
}
