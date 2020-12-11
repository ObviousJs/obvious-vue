<template>
  <obvious-app
    name="test-app"
    :activate-config="{activateConfig}"
    :destroy-config="{destroyConfig}"
  />
</template>

<script>
export default {
  name: 'AppTester',

  data () {
    return {
      activateConfig: {
        activateCount: 1
      },

      desctroyConfig: {
        message: 'app has been destroyed'
      }
    }
  }
}
</script>
