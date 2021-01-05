import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonJs from '@rollup/plugin-commonjs'
import pkg from './package.json'

export default {
  input: './src/index.js',
  output: [{
    file: pkg.main,
    format: 'umd',
    name: 'ObviousVue'
  }, {
    file: pkg.module,
    format: 'es'
  }],
  plugins: [
    babel({ runtimeHelpers: true }),
    resolve(),
    commonJs()
  ]
}
