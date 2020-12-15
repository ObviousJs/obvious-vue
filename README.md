# obvious-vue
在Vue应用中使用[obvious](https://github.com/ObviousJs/obvious-core)的第三方库

## 安装
```
npm install vue obvious-vue
```

```js
import Vue from 'vue'
import ObviousVue from 'obvious-vue'


Vue.use(ObviousVue, {
  bus: window.__Bus__.host
})
```

## 使用
### bus和socket
安装了ObviousVue后，vue.prototype中添加了$bus和$socket两个属性，$bus是在安装插件时传入的bus实例，$socket则是由$bus创建的。可以在组件内通过this.$bus和this.$socket调用obvious的API

### obvious option
安装了ObviousVue后，组件声明支持配置obvious属性
```vue
<template>
  <div :style="{background: theme}">
    <span>用户名：</span>{{ userName }}
  </div>
</template>

<script>
const bus = window._Bus_.local
const localSocket = bus.createSocket()

export default {
  obvious() {
    return {
      data: {
        userName: 'user.name' // this.userName与this.$socket.getState('user.name')双向绑定
        theme: {
          state: 'theme', // this.theme与localSocket.getState('theme')双向绑定 
          socket: localSocket
        }
      },
      // 在组件生命周期内监听广播和单播事件
      broadcast: {
        event1() {
          // doSomething
        }
      },
      unicast: {
        event2: {
          handler() {
            // doSomething
          },
          socket: localSocket
        }
      }
    }
  }
}
</script>
```
obvious属性必须是一个函数，为了能在函数内通过this访问Vue实例，请不要使用箭头函数，obvious的返回值是一个对象，可以包含以下属性：

- data: 声明组件data和状态的绑定关系，data中的每个键是Vue实例的数据名，值是obvious的状态名，值也可以是一个对象，通过state属性声明状态名，socket属性单独指定操作该状态的socket
- broadcast: 监听广播事件，broadcast中的每个键是事件名，值是事件回调函数。如果要单独指定监听事件的socket，则值可以是一个对象，在handler属性中声明回调函数，socket属性中声明监听该事件的socket
- unicast: 监听单播事件，用法同broadcast
- socket: 操作obvious中声明的状态和事件的socket，如果不传，则使用默认的this.$socket。socket的声明优先级是状态或事件中特定声明的socket > obvious选项中声明的socket > 默认的this.$socket

