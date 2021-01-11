<template>
  <div></div>
</template>

<script>
import { localBus } from '../utils/bus'

const localSocket = localBus.createSocket()

export default {
  name: 'EventTester',

  mixins: [{
    obviousData: {
      localState1: {
        state: 'localState1',
        socket: localSocket
      },
      localState2: {
        state: 'localState2',
        socket: localSocket
      }
    },
    broadcast: {
      localBroadcast: {
        handler() {
          console.log('localBroadcast in parent')
        },
        socket: localSocket
      }
    },
    unicast: {
      localUnicast: {
        handler() {
          console.log('localUnicast in parent')
        },
        socket: localSocket
      }
    }
  }],

  obviousData: {
    globalState1: 'globalState1',
    globalState2: 'globalState2'
  },
  broadcast: {
    globalBroadcast() {
      console.log('globalBroadcast in child')
    },
    localBroadcast: {
      handler() {
        console.log('localBroadcast in child')
      },
      socket: localSocket
    }
  },
  unicast: {
    globalUnicast: () => {
      console.log('globalUnicast in child')
      return true
    },
    localUnicast: {
      handler() {
        console.log('localUnicast in child')
      },
      socket: localSocket
    }
  }
}
</script>
