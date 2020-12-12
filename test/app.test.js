import { mount, createLocalVue } from '@vue/test-utils'
import AppTester from './components/app-tester.vue'
import { globalBus } from './utils/bus'
import ObviousVue from '../src/index'

const localVue = createLocalVue()
localVue.use(ObviousVue, {
  bus: globalBus
})

describe('Test obvious.broadcast and obvious.unicast option', () => {
  let destroyed = false
  globalBus.createApp('test-app')
    .bootstrap(async (config) => {
      config.mountPoint.innerHTML = `<h1 id="title">${config.activateCount}</h1>`
      console.log('activated')
    })
    .activate(async (config) => {
      console.log('activated')
      config.mountPoint.innerHTML = `<h2 id="title">${config.activateCount}</h2>`
    })
    .destroy(async (config) => {
      destroyed = true
      console.log(config.message)
    })

  test('# case 1: mount an app and activate it', async () => {
    console.log = jest.fn()
    const wrapper = mount(AppTester, { localVue })
    await localVue.nextTick()
    expect(wrapper.find('#title').text()).toEqual('1')
    expect(wrapper.find('h1').exists()).toBeTruthy()
    await wrapper.setData({
      activateCount: 2
    })
    expect(wrapper.find('#title').text()).toEqual('2')
    expect(wrapper.find('h2').exists()).toBeTruthy()
    wrapper.destroy()
    expect(destroyed).toBeTruthy()

    expect(console.log).toHaveBeenCalledTimes(3)
    expect(console.log).toHaveBeenCalledWith('activated')
    expect(console.log).toHaveBeenCalledWith('destroyed')
  })
})
