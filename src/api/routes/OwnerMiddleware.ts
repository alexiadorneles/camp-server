import { Request, Response } from 'express'

export async function ownerMiddleware(req: Request, res: Response, next: Function): Promise<void> {
	const idCamper = Number(req.params.signedInUser)
	const paramId = Number(req.params.idCamper)
	if (paramId !== idCamper) {
		res.status(403).json({ error: "You don't have permission to perform this action" })
		return
	}

	next()
}
