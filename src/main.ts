import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { AES_Encrypt, AES_Decrypt } from './utils/aes.js'
import { md5 } from './utils/md5.js'
import uQRCode from './utils/uqrcode.js'
import App from './App.vue'
import 'animate.css'
export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  app.use(pinia)
  // 全局加密
  app.config.globalProperties.$AES_Encrypt = AES_Encrypt 
  // 全局解密
  app.config.globalProperties.$AES_Decrypt = AES_Decrypt
  // md5 加密
  app.config.globalProperties.$md5 = md5
  // 全局二维码生成
  app.config.globalProperties.$uqrcode = uQRCode
  return {
    app
  }
}
