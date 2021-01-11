<template>
  <div id="test-component">
    <div id="gender">{{ gender }}</div>
    <div id="age">{{ age }}</div>
  </div>
</template>

<script>
import { localBus, globalBus } from '../utils/bus'
const localSocket = localBus.createSocket()

export default {
  name: 'StateTester',

  socket: localSocket,

  obviousData: {
    count: 'count',
    gender: {
      state: 'user.gender',
      socket: globalBus.createSocket()
    }
  }
}
</script>
