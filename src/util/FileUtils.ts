import fs from 'fs'
import { pathToFileURL } from 'url'
import csv from 'csv-parser'
import { Level } from '../types/Activity'

export interface ActivityCSV {
	dsQuestion: string
	tpLevel: Level
	tpActivity: string
	option1: string
	option2: string
	option3: string
	option4: string
	optionCorrect: string
}

export interface DiscordCabinMap {
	discordID: string
	cabinNumber: string
}

export namespace FileUtils {
	export function readActivitiesCSV(): Promise<ActivityCSV[]> {
		const url = pathToFileURL('src/input/activities.csv')
		const results: ActivityCSV[] = []
		return new Promise((resolve, reject) => {
			fs.createReadStream(url)
				.pipe(csv())
				.on('data', data => results.push(data))
				.on('end', () => resolve(results))
		})
	}

	export function readDiscordIDsCSV(): Promise<DiscordCabinMap[]> {
		const url = pathToFileURL('src/input/discord.csv')
		const results: DiscordCabinMap[] = []
		return new Promise((resolve, reject) => {
			fs.createReadStream(url)
				.pipe(csv())
				.on('data', data => results.push(data))
				.on('end', () => resolve(results))
		})
	}
}
