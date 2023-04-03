import { createSSRApp } from 'vue'

import { AES_Encrypt, AES_Decrypt } from './utils/aes.js'
import { md5 } from './utils/md5.js'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.$AES_Encrypt = AES_Encrypt //全局加密
  app.config.globalProperties.$AES_Decrypt = AES_Decrypt //全局解密
  app.config.globalProperties.$md5 = md5
  return {
    app
  }
}
