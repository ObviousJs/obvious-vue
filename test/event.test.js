import { shallowMount, createLocalVue } from '@vue/test-utils'
import EventTester from './components/event-tester.vue'
import { localBus, globalBus } from './utils/bus'
import ObviousVue from '../src/index'

const localVue = createLocalVue()
localVue.use(ObviousVue)
const Root = {
  $bus: globalBus,
  $socket: globalBus.createSocket()
}

describe('Test broadcast and unicast option', () => {
  const globalWatcherSocket = globalBus.createSocket()
  const localWatcherSocket = localBus.createSocket()
  const wrapper = shallowMount(EventTester, { localVue, parentComponent: Root })

  test('# case 1: test broadcast event', async () => {
    console.warn = jest.fn()
    globalWatcherSocket.broadcast('testBroadcast')
    globalWatcherSocket.broadcast('testBroadcastWithLocalSocket')
    expect(wrapper.vm.broadcastCount).toEqual(1)
    localWatcherSocket.broadcast('testBroadcastWithLocalSocket')
    expect(wrapper.vm.broadcastCount).toEqual(2)
    expect(console.warn).toHaveBeenCalledTimes(1)
  })

  test('# case 2: test unicast event', async () => {
    const unicastCount = globalWatcherSocket.unicast('testUnicast')
    expect(unicastCount).toEqual(wrapper.vm.unicastCount)
    expect(wrapper.vm.unicastCount).toEqual(1)
  })

  test('# case 3: test destroy', () => {
    wrapper.destroy()
    console.warn = jest.fn()
    globalWatcherSocket.broadcast('testBroadcast')
    localWatcherSocket.broadcast('testBroadcastWithLocalSocket')
    expect(console.warn).toHaveBeenCalledTimes(2)
    expect(() => {
      globalWatcherSocket.unicast('testUnicast')
    }).toThrowError()
  })
})
