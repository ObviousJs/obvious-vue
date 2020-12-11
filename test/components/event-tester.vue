<template>
  <div id="test-component">
    <div id="broadcastCount">{{ broadcastCount }}</div>
    <div id="unicastCount">{{ unicastCount }}</div>
  </div>
</template>

<script>
import { localBus } from '../utils/bus'
const localSocket = localBus.createSocket()

export default {
  name: 'EventTester',

  data () {
    return {
      broadcastCount: 0,
      unicastCount: 0
    }
  },

  obvious () {
    return {
      broadcast: {
        testBroadcast: () => {
          this.broadcastCount++
        },
        testBroadcastWithLocalSocket: {
          handler: () => {
            this.broadcastCount++
          },
          socket: localSocket
        }
      },
      unicast: {
        testUnicast: () => {
          this.unicastCount++
          return this.unicastCount
        }
      }
    }
  }
}
</script>
