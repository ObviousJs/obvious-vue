export default {
  name: 'obvious-app',

  props: {
    bus: {
      type: Object,
      required: false
    },
    name: {
      type: String,
      required: true
    },
    activateConfig: {
      type: Object,
      default: () => {}
    },
    destroyConfig: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      _bus_: null
    }
  },

  watch: {
    bus (value) {
      this._bus_ = value
    },
    activateConfig: {
      handler (value) {
        this._bus_.activateApp(this.name, {
          ...value,
          mountPoint: this.$refs.mountPoint
        })
      },
      deep: true
    }
  },

  created () {
    this._bus_ = this.bus ?? this.$bus
  },

  mounted () {
    this._bus_.activateApp(this.name, {
      ...this.activateConfig,
      mountPoint: this.$refs.mountPoint
    }).then(() => {
      this.$emit('activated')
    }).catch((err) => {
      this.$emit('error', err)
    })
  },

  beforeDestroy () {
    this._bus_.destroyApp(this.name, {
      ...this.destroyConfig,
      mountPoint: this.$refs.mountPoint
    }).then(() => {
      this.$emit('destroyed')
    }).catch((err) => {
      this.$emit('error', err)
    })
  },

  render (h) {
    return h('div', {
      ref: 'mountPoint'
    })
  }
}
