import { EditionService } from '../services'
import { ActivityService } from '../services/ActivityService'
import {
	ActivityRouterBuilder,
	AdminRouterBuilder,
	CabinRequestsRouterBuilder,
	CabinRouterBuilder,
	CampersRouterBuilder,
	EditionRouterBuilder,
	RankingRouterBuilder,
	RoundsRouterBuilder,
} from './builders'
import { adminMiddleware, authMiddleware, ownerMiddleware } from './middlewares'
import { CamperService } from '../services/CamperService'

export namespace CampRoutes {
	export function register(app: { use: Function }): void {
		const editionService = new EditionService()
		const activityService = new ActivityService()
		const camperService = new CamperService()

		app.use('/cabins', CabinRouterBuilder.build())
		app.use('/cabin-requests', CabinRequestsRouterBuilder.build(editionService, authMiddleware, ownerMiddleware))
		app.use('/campers', CampersRouterBuilder.build(editionService, camperService, authMiddleware, ownerMiddleware))
		app.use('/admins', AdminRouterBuilder.build(editionService, adminMiddleware))
		app.use('/activities', ActivityRouterBuilder.build(editionService, authMiddleware, adminMiddleware))
		app.use(
			'/rounds',
			RoundsRouterBuilder.build(editionService, activityService, authMiddleware, adminMiddleware, ownerMiddleware),
		)
		app.use('/rankings', RankingRouterBuilder.build(editionService, adminMiddleware))
		app.use('/editions', EditionRouterBuilder.build(editionService))
	}
}
