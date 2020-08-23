export type IndexedObject = {
	[key in string]: any
}

export interface TimestampDependant extends IndexedObject {
	createdAt: Date
	updatedAt: Date
}
