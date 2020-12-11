import { Bus } from 'obvious-core'

export const globalBus = new Bus('global')
export const localBus = new Bus('local')
