import { Level, ActivityType } from './Level'

export interface RoundConfig {
	activitiesConfig: ActivityConfig[]
}

export interface ActivityConfig {
	nrQuantity: number
	tpLevel: Level
	type: ActivityType
}
