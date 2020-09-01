import { Request, Response } from 'express'
import { EditionService } from '../services/EditionService'

export class EditionController {
	constructor(private editionService: EditionService) {
		this.findCurrent = this.findCurrent.bind(this)
	}

	public async findCurrent(req: Request, res: Response): Promise<any> {
		const edition = await this.editionService.findCurrent()
		if (!edition) {
			return res.status(400).json({ error: 'Nenhuma edição do acampamento está acontecendo agora' })
		}
		res.json(edition)
	}
}
