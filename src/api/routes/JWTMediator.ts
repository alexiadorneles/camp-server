import jwt from 'jsonwebtoken'

const SECRET = 'bG9vayBpIGRpZG4ndCB3YW50IHRvIGJlIGEgaGFsZiBibG9vZA=='
export interface JWTPayload {
	idCamper: number
	password: string
}

export class JWTMediator {
	private constructor() {}

	public static sign(payload: JWTPayload): string {
		return jwt.sign(payload, SECRET, { expiresIn: '24h' })
	}

	public static verify(token: string): JWTPayload {
		return jwt.verify(token, SECRET) as JWTPayload
	}
}
