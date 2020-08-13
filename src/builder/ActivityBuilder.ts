import { ActivityCreationAttribute } from '../models/ActivityModel'
import { ActivityOptionCreationAttribute } from '../models/ActivityOptionModel'
import { ActivityCSV } from '../util/FileUtils'

export interface ActivityPlusOptions {
	activity: ActivityCreationAttribute
	options: ActivityOptionCreationAttribute[]
}

export namespace ActivityBuilder {
	export function buildActivitiesFromCSV(csvItems: ActivityCSV[]): ActivityPlusOptions[] {
		return csvItems.map(buildActivityFromCSV)
	}

	export function buildActivityFromCSV(csv: ActivityCSV): ActivityPlusOptions {
		const options = getOptions(csv)
		delete csv.option1
		delete csv.option2
		delete csv.option3
		delete csv.option4
		delete csv.optionCorrect
		return { activity: csv as ActivityCreationAttribute, options }
	}

	function getOptions(csv: ActivityCSV): ActivityOptionCreationAttribute[] {
		const optionsDescriptions = [csv.option1, csv.option2, csv.option3, csv.option4]
		return optionsDescriptions.map((dsOption: string, index: number) => {
			return {
				dsOption,
				blCorrect: Number(csv.optionCorrect) === index + 1,
			}
		})
	}
}
