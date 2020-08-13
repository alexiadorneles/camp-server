import fs from 'fs'
import { pathToFileURL } from 'url'
import csv from 'csv-parser'
import { Level } from '../types/Level'

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
}
