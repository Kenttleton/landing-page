import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
 
export default {
  input: 'source/javascript/initialize.js',
  output: {
    file: 'public/javascript/bundle.js',
    format: 'iife',
    name: 'scene'
  },
  plugins: [
    resolve(),
    commonjs(),
    json({
        compact: true
    })
  ]
};