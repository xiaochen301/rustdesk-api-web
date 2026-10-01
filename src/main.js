import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { router } from '@/router'
import 'normalize.css/normalize.css'
import { pinia } from '@/store'
import '@/permission'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/style.scss'
import '@/styles/design-system.scss'
import * as ElementIcons from '@element-plus/icons'

// XC: chunk 加载失败自恢复——部署新版本后旧页面引用的 chunk 已失效时触发；
// 自动刷新一次拿新版本（30 秒窗口防循环刷新，与 router onError 共用标记）
window.addEventListener('vite:preloadError', () => {
  const last = Number(sessionStorage.getItem('xc-preload-reloaded') || 0)
  if (Date.now() - last > 30000) {
    sessionStorage.setItem('xc-preload-reloaded', String(Date.now()))
    window.location.reload()
  }
})

const app = createApp(App)
app.use(ElementPlus, { locale: zhCn })
app.use(pinia)
app.use(router)
for (let icon in ElementIcons){
  app.component("ElIcon" +icon ,ElementIcons[icon])
}
app.mount('#app')
