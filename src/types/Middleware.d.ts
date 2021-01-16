import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import QueryString = require('qs')

export type Middleware = (
	req: Request<ParamsDictionary, any, any, QueryString.ParsedQs>,
	res: Response<any>,
	next: Function,
) => Promise<void>
