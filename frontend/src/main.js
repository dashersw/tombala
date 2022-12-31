import { createApp } from 'vue'
import App from './app.vue'
import './register-service-worker'
import router from './router'
import store from './store'
import 'normalize.css'

async function main() {
  const storeInstance = await store()

createApp(App)
  .use(storeInstance)
  .use(router)
  .mount('#app')

}
main()
