<template>
  <div></div>
</template>

<script>
import { localBus } from '../utils/bus'
const localSocket = localBus.createSocket()

export default {
  name: 'EventTester',

  mixins: [{
    obvious () {
      return {
        socket: localSocket,
        data: {
          localState1: 'localState1',
          localState2: 'localState2'
        },
        broadcast: {
          localBroadcast: () => {
            console.log('localBroadcast in parent')
          }
        },
        unicast: {
          localUnicast: () => {
            console.log('localUnicast in parent')
          }
        }
      }
    }
  }],

  obvious () {
    return {
      data: {
        globalState1: 'globalState1',
        globalState2: 'globalState2'
      },
      broadcast: {
        globalBroadcast: () => {
          console.log('globalBroadcast in child')
        },
        localBroadcast: {
          handler: () => {
            console.log('localBroadcast in child')
          },
          socket: localSocket
        }
      },
      unicast: {
        globalUnicast: () => {
          console.log('globalUnicast in child')
          return true
        }
      }
    }
  }
}
</script>
