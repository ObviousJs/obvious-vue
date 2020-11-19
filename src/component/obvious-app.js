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
      default: {}
    },
    destroyConfig: {
      type: Object,
      default: {}
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
    this._bus_.activateApp(this.name, {
      ...this.activateConfig,
      mountPoint: this.$refs.mountPoint
    })
  },

  beforeDestroy () {
    this._bus_.destroyApp(this.name, {
      ...this.destroyConfig,
      mountPoint: this.$refs.mountPoint
    })
  },

  template: '<div ref="mountPoint"></div>'
}
