import { defineConfig } from 'tsup'
import pkg from './package.json'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: false,
  minify: true,
  external: Object.keys(pkg.dependencies)
    .concat(Object.keys(pkg.peerDependencies))
    .reduce(
      (collect, name) => {
        collect.push(name, new RegExp('^' + name + '/'))
        return collect
      },
      [] as (string | RegExp)[],
    ),
})
