<template>
  <div id="test-component">
    <div id="gender">{{ gender }}</div>
    <div id="age">{{ age }}</div>
  </div>
</template>

<script>
import { localBus } from '../utils/bus'
const localSocket = localBus.createSocket()

export default {
  name: 'StateTester',

  obvious () {
    return {
      socket: localSocket,
      data: {
        count: 'count',
        gender: {
          state: 'user.gender',
          socket: this.$socket
        }
      }
    }
  }
}
</script>
