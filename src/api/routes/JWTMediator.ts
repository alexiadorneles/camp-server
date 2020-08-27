import jwt from 'jsonwebtoken'

const SECRET = 'bG9vayBpIGRpZG4ndCB3YW50IHRvIGJlIGEgaGFsZiBibG9vZA=='

export class JWTMediator {
	private constructor() {}

	public static sign(payload: any): string {
		return jwt.sign(payload, SECRET, { expiresIn: '24h' })
	}

	public static verify(token: string): string | object {
		return jwt.verify(token, SECRET)
	}
}
