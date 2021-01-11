import { shallowMount, createLocalVue } from '@vue/test-utils'
import StateTester1 from './components/state-tester-1.vue'
import StateTester2 from './components/state-tester-2.vue'
import { localBus, globalBus } from './utils/bus'
import ObviousVue from '../src/index'

const localVue = createLocalVue()
localVue.use(ObviousVue)
const Root = {
  $bus: globalBus,
  $socket: globalBus.createSocket()
}

describe('Test obviousData option', () => {
  const globalWatcherSocket = globalBus.createSocket()
  const localWatcherSocket = localBus.createSocket()
  globalWatcherSocket.initState('user', {
    name: 'mike'
  })
  test('# case 1: indicate state socket and global socket', async () => {
    const wrapper = shallowMount(StateTester1, { localVue, parentComponent: Root })
    await localVue.nextTick()
    expect(wrapper.vm.theme).toEqual(localWatcherSocket.getState('theme'))
    expect(wrapper.vm.user).toEqual(globalWatcherSocket.getState('user.name'))

    await wrapper.setData({
      age: 20
    })
    expect(wrapper.vm.age).toEqual(20)

    console.log = jest.fn()
    localWatcherSocket.watchState('theme', (value) => {
      console.log(value)
    })
    globalWatcherSocket.watchState('user.name', (value) => {
      console.log(value)
    })
    await wrapper.setData({
      theme: 'dark',
      user: 'jack'
    })

    globalWatcherSocket.setState('user.name', 'Bob')
    expect(wrapper.vm.user).toEqual(globalWatcherSocket.getState('user.name'))
    await localVue.nextTick()
    expect(wrapper.find('#user').text()).toEqual(globalWatcherSocket.getState('user.name'))
    expect(console.log).toHaveBeenCalledTimes(3)
    expect(console.log).toHaveBeenCalledWith('dark')
    expect(console.log).toHaveBeenCalledWith('jack')
    expect(console.log).toHaveBeenCalledWith('Bob')
    // expect(wrapper.emitted('userChanged').length).toEqual(2)
    wrapper.destroy()
  })

  test('# case 2: indicate state socket and component socket', async () => {
    const wrapper = shallowMount(StateTester2, { localVue, parentComponent: Root })
    globalWatcherSocket.setState('user.gender', 'female')
    localWatcherSocket.initState('count', 1)
    await localVue.nextTick()
    expect(wrapper.vm.count).toEqual(localWatcherSocket.getState('count'))
    expect(wrapper.vm.gender).toEqual(globalWatcherSocket.getState('user.gender'))

    console.warn = jest.fn()
    localWatcherSocket.watchState('count', (value) => {
      console.warn(value)
    })
    globalWatcherSocket.watchState('user.gender', (value) => {
      console.warn(value)
    })
    await wrapper.setData({
      count: 2,
      gender: 'male'
    })
    globalWatcherSocket.setState('user', { gender: 'none' })
    expect(wrapper.vm.gender).toEqual('none')
    await localVue.nextTick()
    expect(wrapper.find('#gender').text()).toEqual(globalWatcherSocket.getState('user').gender)
    expect(console.warn).toHaveBeenCalledTimes(3)
    expect(console.warn).toHaveBeenCalledWith(2)
    expect(console.warn).toHaveBeenCalledWith('male')
    expect(console.warn).toHaveBeenCalledWith('none')
    wrapper.destroy()
  })
})
