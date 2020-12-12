<template>
  <obvious-app
    name="test-app"
    :activate-config="{ activateCount }"
    :destroy-config="{ message: destroyMessage }"
  />
</template>

<script>
export default {
  name: 'AppTester',

  data () {
    return {
      activateCount: 1,
      destroyMessage: 'destroyed'
    }
  }
}
</script>
