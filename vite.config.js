import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import styleImport from 'vite-plugin-style-import'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(),styleImport(
    {
      libs:[
        {
          libraryName:'zarm',
          esModule:true,
          resolveStyle:(name)=>{
            return `zarm/es/${name}/style/css`
          }
        }
      ]
    }
  )],
  css:{
    modules:{
      localsConvention:'dashesOnly'
    },
    preprocessorOptions:{
      less:{
        javascriptEnabled: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // src 路径
      'config': path.resolve(__dirname, 'src/config') // src 路径
    }
  },
  server: {
    proxy: {
      '/API': {
        target:'http://107.173.140.5:7001',
        changeOrigin:true,
        rewrite:path => path.replace(/^\/API/,'')
      }
    }
  }
})
