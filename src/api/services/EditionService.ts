import { Edition } from '../../models'

export class EditionService {
	public async findCurrent(): Promise<Edition> {
		const edition = await Edition.findOne({ where: { dtEnd: null } })
		if (!edition) {
			return Edition.findOne({ order: [['idEdition', 'DESC']] })
		}

		return edition
	}
}
