<template>
  <div id="test-component">
    <div id="theme">{{ theme }}</div>
    <div id="user">{{ user }}</div>
    <div id="age">{{ age }}</div>
  </div>
</template>

<script>
import { localBus } from '../utils/bus'
const localSocket = localBus.createSocket()

export default {
  name: 'StateTester',

  data () {
    return {
      age: 11
    }
  },

  obvious () {
    return {
      data: {
        user: 'user.name',
        theme: {
          state: 'theme',
          socket: localSocket
        }
      }
    }
  },

  created () {
    localSocket.initState('theme', 'light', true)
  }
}
</script>
