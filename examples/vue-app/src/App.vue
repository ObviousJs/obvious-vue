<template>
  <div class="app-container">
    <obvious-app v-if="showReactApp" name="react-app" />
    <div id="app">
      <img alt="Vue logo" src="./assets/logo.png">
      <div :style="{display: 'flex', justifyContent: 'center'}">
        <button class="button" v-if="!showReactApp" @click="showReactApp = true">Show React App</button>
      </div>
      <HelloWorld :msg="text"/>
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';

export default {
  name: 'App',

  components: {
    HelloWorld
  },

  data() {
    return {
      showReactApp: true
    }
  },

  obviousData: {
    text: 'text'
  },

  watch: {
    user(value) {
      this.$emit('userChanged')
    }
  },

  broadcast: {
    setReactAreaVisible(visible) {
      this.showReactApp = visible
    }
  },

  methods: {
    changeText: function(text){
      this.text = text;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  flex: 1;
}

.app-container {
  display: flex
}

.app-container>div {
  flex: 1
}

.button {
  border: none;
  outline: none;
  width: 13rem;
  height: 3rem;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
  background: #42b983
}

.button:hover {
  opacity: 0.8
}
</style>
