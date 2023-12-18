import { defineConfig } from 'vite';
import aurelia from '@aurelia/vite-plugin';
import path from 'path';
import typescript from '@rollup/plugin-typescript';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import swc from 'unplugin-swc'
import * as packageJson from './package.json';
import { createFilter } from '@rollup/pluginutils';

const external: Array<string | RegExp> = Object.keys(packageJson.peerDependencies).concat(Object.keys(packageJson.dependencies)).concat([/(@material|devextreme)/] as any);


export const rawHtml = () => {
  const filter = createFilter('*/.ts', undefined);
  return {
    name: 'raw',
    transform: function transform(code: string, id: string) {
      if (!filter(id)) { return; }
      if (code.includes('__au2ViewDef')) { return; }
      code = code.replaceAll(/(import .* from .*).html/g, '$1.html?raw');
      return { code };
    },
  };
};

export default defineConfig({
  plugins: [
    aurelia(),
    swc.vite()
  ],
  build: {
    manifest: true,
    minify: true,
    reportCompressedSize: true,
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, './index.ts'),
      name: 'aurelia-slickgrid',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external,
      plugins: [
        typescriptPaths({
          preserveExtensions: true,
        }),
        typescript({
          sourceMap: true,
          declaration: true,
          outDir: 'dist',
          exclude: ['**/__tests__'],
          tsconfig: './tsconfig.json',
        }),
        rawHtml()
      ],
    },
  },
});
