# obvious-vue
[![Coverage Status](https://coveralls.io/repos/github/ObviousJs/obvious-vue/badge.svg?branch=main)](https://coveralls.io/github/ObviousJs/obvious-vue?branch=main) [![release](https://img.shields.io/github/release/ObviousJs/obvious-vue.svg)](https://github.com/ObviousJs/obvious-vue/releases) [![lastCommit](https://img.shields.io/github/last-commit/ObviousJs/obvious-vue)](https://github.com/ObviousJs/obvious-vue/commits/master) [![](https://img.shields.io/badge/document-%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-brightgreen)](https://github.com/ObviousJs/obvious-vue/blob/main/README.zh.md)

The official library to help you use [obvious](https://github.com/ObviousJs/obvious-core) in Vue application

## Install
npm:
```
npm install vue obvious-vue
```
umd:
```
<script src="https://unpkg.com/obvious-vue@{version}/dist/index.umd.js"></script>
```

```js
import Vue from 'vue'
import ObviousVue from 'obvious-vue'

Vue.use(ObviousVue)
```

## Usage
You should provide the $bus and $socket on the root, and they will be injected into all the child components and will be available on them as `this.$bus` and `this.$socket`

```js
const $bus = window.__Bus__.host
const $socket = $bus.createSocekt()

const app = new Vue({
  $bus,
  $socket
})

app.$mount(document.getElementById('root'))
```
### state
You can declare the obviousData option to perform the two-way binding for Vue data and obvious state

```vue
<template>
  <div :style="{color: theme}">{{ userName }}</div>
</template>

<script>
const anotherBus = window.__Bus__.anotherBus
const anotherSocket = anotherBus.createSocket()

export default {
  name: 'SubComponent',

  obviousData: {
    userName: 'user.name', // Two-way binding for this.userName and this.$socket.getState('user.name')
    theme: { // Two-way binding for this.theme and anotherSocket.getState('themeColor')
      state: 'themeColor',
      socket: anotherSocket
    }
  }
}
</script>
```

### broadcast and unicast
You can declare the broadcast and unicast option to register some broadcast and unicast events for obvious

```vue
<template>
  <ul ref="container">
    <li v-for="item of list">{{ item }}</li>
  </div>
</template>

<script>
const anotherSocket = window.__Bus__.anotherBus.createSocket()

export default {
  data: {
    list: []
  },

  broadcast: {
    addItem(item) { // this.$socket.onBroadcast('addItem', handler)
      this.list.push(item)
    },
    addItemByAnotherSocket: { // anotherSocket.onBroadcast('addItemByAnotherSocket', handler)
      handler(item) {
        this.list.push(item)
      },
      socket: anotherSocket
    },
    deleteItem(index) {
      this.list.splice(index, 1)
    },
  },

  unicast: {
    getItem(index) {// this.$socket.onUnicast('getItem', handler)
      return this.list[index]
    },
    getItemByAnotherSocket:{// anotherSocket.onUnicast('getItem', handler)
      handler(index) {
        return this.list[index]
      },
      socket: anotherSocket
    }
  }
}
</script>
```

### set the default socket
The default socket to handle all states and events is this.$socket, you can change it by declare the socket option

```vue
<script>
const anotherSocket = window.__Bus__.anotherBus.createSocket()
export default {
  socket,

  obviousData: {
    name: 'name' // Two-way binding for this.name and anotherSocket.getState('name')
  },
  broadcast: {
    changeName(value) { // anotherSocket.onBroadcast('changeName', handler)
      this.name = value
    },
    getName() { // anotherSocket.onUnicast('getName', handler)
      return this.name
    }
  }
}
</script>
```

### activate obvious app
after using ObviousVue, there will be a global component named obvious-app to help you easily activate an obvious app, the app will be bootstrapped when the component is mounted and will be reactivated once the props activate-config is changed, and when the component is destroyed, the app will be destroyed too 

```js
const bus = window.__Bus__.host

bus.createApp('react-app')
  .bootstrap(async (config) => {
    ReactDOM.render(<App />, config.mountPoint)
  })
  .activate(async (config) => {
    console.log(config.message)
  })
  .destroy(async (config) => {
    console.log(config.message)
    ReactDOM.unmountComponentAtNode(config.mountPoint)
  })
```

```vue
<template>
  <obvious-app 
    name="react-app" 
    :activate-config="activateConfig"
    :destroy-config="destroyConfig"
  />
</template>

<script>
export default {
  data() {
    return {
      activateConfig: {
        message: 'I was activated by a vue app'
      },
      destroyConfig: {
        message: 'I was destroyed by a vue app'
      }
    }
  }
}
</script>
```
all the props and events of obvious-app are below

props:

|name|required|default|description|
|----|----|-------|-----------|
|bus|false|this.$bus|the bus to activate the target app|
|name|true| - |the name of the app to activate|
|activate-config|false|{}| the config argument of activating|
|destroy-config|false|{}| the config argument of destroying|

events:

|name|description|
|----|-----------|
|activated|emitted after the app is activated|
|destroyed|emitted after the app is destroyed|
|error|emmited when an error is throwed during activating or destroying|

## License
obvious-vue is MIT licensed







