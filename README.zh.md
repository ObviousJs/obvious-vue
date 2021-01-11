# obvious-vue
[![Coverage Status](https://coveralls.io/repos/github/ObviousJs/obvious-vue/badge.svg?branch=main)](https://coveralls.io/github/ObviousJs/obvious-vue?branch=main) [![release](https://img.shields.io/github/release/ObviousJs/obvious-vue.svg)](https://github.com/ObviousJs/obvious-vue/releases) [![lastCommit](https://img.shields.io/github/last-commit/ObviousJs/obvious-vue)](https://github.com/ObviousJs/obvious-vue/commits/main) [![](https://img.shields.io/badge/document-english-brightgreen)](https://github.com/ObviousJs/obvious-vue/blob/main/README.md)

在Vue应用中轻松使用[obvious](https://github.com/ObviousJs/obvious-core)的库

## 安装
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

## 使用

在安装了ObviousVue插件后，你应该在Vue根组件中提供$bus和$socket, 它们将会被注入到该根组件下的所有子组件中，你可以在组件中通过`this.$bus`和`this.$socket`访问它们

```js
const $bus = window.__Bus__.host
const $socket = $bus.createSocekt()

const app = new Vue({
  $bus,
  $socket
})

app.$mount(document.getElementById('root'))
```
### 状态
你可以在组件中声明`obviousData`属性来实现Vue的data和obvious的状态的双向绑定

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

### broadcast 和 unicast
你可以在组件中声明`broadcast`和`unicast`属性来注册obvious的广播和单播事件

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

### 设置默认socket
默认情况下，如果没有给状态和事件特别指定socket，组件内部将通过`this.$socket`操作状态和事件，你也可以在组件定义中声明`socket`属性来更改这个默认socket

```vue
<script>
const anotherSocket = window.__Bus__.anotherBus.createSocket()
export default {
  socket: anotherSocket,

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

### 激活app
ObviousVue注册了一个全局组件`obvious-app`，当组件被挂载以及activateConfig属性有变更时，app将被激活，当组件卸载时，app也将被卸载

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
obvious-app的所有属性如下

属性:

|名称|是否必选|默认值|描述|
|----|----|-------|-----------|
|bus|否|this.$bus|用来激活app的bus|
|name|是| - |要激活的app的名字|
|activate-config|否|{}|app的激活参数，每次参数变更都会触发一次激活|
|destroy-config|否|{}|app的销毁参数|

事件:

|名称|描述|
|----|-----------|
|activated|app被激活后触发|
|destroyed|app被销毁后触发|
|error|app激活或销毁过程中出错时触发|

## License
obvious-vue is MIT licensed







