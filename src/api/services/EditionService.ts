import { Edition } from '../../models'

export class EditionService {
	public async findCurrent(): Promise<Edition> {
		return Edition.findOne({
			where: {
				dtEnd: null,
			},
		})
	}
}
