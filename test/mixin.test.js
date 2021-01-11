import { shallowMount, createLocalVue } from '@vue/test-utils'
import mixinTester from './components/mixin-tester.vue'
import { localBus, globalBus } from './utils/bus'
import ObviousVue from '../src/index'

const localVue = createLocalVue()
localVue.use(ObviousVue)
const Root = {
  $bus: globalBus,
  $socket: globalBus.createSocket()
}

describe('Test mixin', () => {
  test('# case 1: test mixin', async () => {
    const globalWatcherSocket = globalBus.createSocket()
    const localWatcherSocket = localBus.createSocket()
    const stateValue = {
      global1: 'globalState1',
      global2: 'globalState2',
      local1: 'localState1',
      local2: 'localState2'
    }
    globalWatcherSocket.initState('globalState1', 'globalState1')
    globalWatcherSocket.initState('globalState2', 'globalState2')
    localWatcherSocket.initState('localState1', 'localState1')
    localWatcherSocket.initState('localState2', 'localState2')

    globalWatcherSocket.watchState('globalState1', (value) => {
      stateValue.global1 = value
    })
    globalWatcherSocket.watchState('globalState2', (value) => {
      stateValue.global2 = value
    })
    localWatcherSocket.watchState('localState1', (value) => {
      stateValue.local1 = value
    })
    localWatcherSocket.watchState('localState2', (value) => {
      stateValue.local2 = value
    })

    const wrapper = shallowMount(mixinTester, { localVue, parentComponent: Root })
    await localVue.nextTick()
    expect(wrapper.vm.localState1).toEqual('localState1')
    expect(wrapper.vm.localState2).toEqual('localState2')
    expect(wrapper.vm.globalState1).toEqual('globalState1')
    expect(wrapper.vm.globalState2).toEqual('globalState2')
    await wrapper.setData({
      globalState1: 1,
      globalState2: 2,
      localState1: 3,
      localState2: 4
    })
    expect(Object.values(stateValue).reduce((total, next) => total + next)).toEqual(10)

    console.log = jest.fn()
    globalWatcherSocket.broadcast('globalBroadcast')
    globalWatcherSocket.unicast('globalUnicast')
    localWatcherSocket.broadcast('localBroadcast')
    localWatcherSocket.unicast('localUnicast')

    expect(console.log).toHaveBeenCalledTimes(5)
    expect(console.log).toHaveBeenCalledWith('globalBroadcast in child')
    expect(console.log).toHaveBeenCalledWith('localBroadcast in child')
    expect(console.log).toHaveBeenCalledWith('localBroadcast in parent')
    expect(console.log).toHaveBeenCalledWith('globalUnicast in child')
    expect(console.log).toHaveBeenCalledWith('localUnicast in child')
  })
})
