import { mount, createLocalVue } from '@vue/test-utils'
import StateTester1 from './components/state-tester-1.vue'
import StateTester2 from './components/state-tester-2.vue'
import { localBus, globalBus } from './utils/bus'
import ObviousVue from '../src/index'

const localVue = createLocalVue()
localVue.use(ObviousVue, {
  bus: globalBus
})

describe('Test obvious.data option', () => {
  const globalWatcherSocket = globalBus.createSocket()
  const localWatcherSocket = localBus.createSocket()
  globalWatcherSocket.initState('user', {
    name: 'mike'
  })
  test('# case 1: test state socket and global socket', async () => {
    const wrapper = mount(StateTester1, { localVue })
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
    expect(console.log).toHaveBeenCalledTimes(2)
    expect(console.log).toHaveBeenCalledWith('dark')
    expect(console.log).toHaveBeenCalledWith('jack')

    globalWatcherSocket.setState('user.name', 'Bob')
    expect(wrapper.vm.user).toEqual(globalWatcherSocket.getState('user.name'))
    await localVue.nextTick()
    expect(wrapper.find('#user').text()).toEqual(globalWatcherSocket.getState('user.name'))
  })

  test('# case 2: test state socket and global socket', async () => {
    const wrapper = mount(StateTester2, { localVue })
    globalWatcherSocket.setState('user.gender', 'female')
    localWatcherSocket.initState('count', 1)
    await localVue.nextTick()
    console.log = jest.fn()
    expect(wrapper.vm.count).toEqual(localWatcherSocket.getState('count'))
    expect(wrapper.vm.gender).toEqual(globalWatcherSocket.getState('user.gender'))
    localWatcherSocket.watchState('count', (value) => {
      console.log(value)
    })
    globalWatcherSocket.watchState('user.gender', (value) => {
      console.log(value)
    })
    await wrapper.setData({
      count: 2,
      gender: 'male'
    })
    expect(console.log).toHaveBeenCalledTimes(2)
    expect(console.log).toHaveBeenCalledWith(2)
    expect(console.log).toHaveBeenCalledWith('male')

    globalWatcherSocket.setState('user', { gender: 'male' })
    expect(wrapper.vm.gender).toEqual('male')
    await localVue.nextTick()
    expect(wrapper.find('#gender').text()).toEqual(globalWatcherSocket.getState('user').gender)
  })
})
