<template>
  <div class="login-page">
    <!-- 左侧品牌区 -->
    <div class="brand-panel">
      <div class="brand-inner">
        <div class="brand-logo-row">
          <img src="@/assets/logo.png" alt="logo" class="brand-logo"/>
          <span class="brand-name">{{ appTitle }}</span>
        </div>
        <h1 class="brand-headline">企业级远程控制<br/>管理平台</h1>
        <p class="brand-sub">集中管理设备、账号与访问权限</p>
        <div class="brand-foot">
          <span>RustDesk 自建服务 · 数据自主可控</span>
        </div>
      </div>
    </div>

    <!-- 右侧表单区 -->
    <div class="form-panel">
      <div class="form-inner">
        <h2 class="form-title">登录管理后台</h2>
        <p class="form-sub">请使用您的账号登录</p>

        <el-form v-if="!disablePwd" label-position="top" class="login-form">
          <el-form-item :label="T('Username')">
            <el-input v-model="form.username" type="username" size="large" placeholder="请输入用户名"></el-input>
          </el-form-item>

          <el-form-item :label="T('Password')">
            <el-input v-model="form.password" type="password" size="large" @keyup.enter.native="login" show-password
                      placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item :label="T('Captcha')" v-if="captchaCode">
            <el-input v-model="form.captcha" size="large" @keyup.enter.native="login" class="captcha-input" placeholder="请输入验证码">
              <template #append>
                <img :src="captchaCode.b64" @click="loadCaptcha" class="captcha" alt="captcha"/>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="submit-item">
            <el-button @click="login" type="primary" size="large" class="login-button">{{ T('Login') }}</el-button>
            <el-button v-if="allowRegister" @click="register" size="large" class="login-button">{{ T('Register') }}</el-button>
          </el-form-item>
        </el-form>

        <div class="divider" v-if="options.length > 0 && !disablePwd">
          <span>{{ T('or login in with') }}</span>
        </div>

        <div class="oidc-options">
          <div v-for="(option, index) in options" :key="index" class="oidc-option">
            <el-button @click="handleOIDCLogin(option.name)" class="oidc-btn">
              <img :src="getProviderImage(option.name)" alt="provider" class="oidc-icon"/>
              <span>{{ T(option.name) }}</span>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { reactive, onMounted, ref, computed } from 'vue'
  import { useUserStore } from '@/store/user'
  import { useAppStore } from '@/store/app'
  import { ElMessage } from 'element-plus'
  import { T } from '@/utils/i18n'
  import { useRoute, useRouter } from 'vue-router'
  import { loginOptions, captcha } from '@/api/login'
  import { getCode, removeCode } from '@/utils/auth'

  const oauthInfo = ref({})
  const userStore = useUserStore()
  const appStore = useAppStore()
  const appTitle = computed(() => appStore.setting.title)
  const route = useRoute()
  const router = useRouter()
  const options = reactive([]) // 存储 OIDC 登录选项

  let platform = window.navigator.platform
  if (navigator.platform.indexOf('Mac') === 0) {
    platform = 'mac'
  } else if (navigator.platform.indexOf('Win') === 0) {
    platform = 'windows'
  } else if (navigator.platform.indexOf('Linux armv') === 0) {
    platform = 'android'
  } else if (navigator.platform.indexOf('Linux') === 0) {
    platform = 'linux'
  }
  const userAgent = navigator.userAgent
  let browser = 'Unknown Browser'
  if (/chrome|crios/i.test(userAgent)) browser = 'Chrome'
  else if (/firefox|fxios/i.test(userAgent)) browser = 'Firefox'
  else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = 'Safari'
  else if (/edg/i.test(userAgent)) browser = 'Edge'

  const form = reactive({
    username: '',
    password: '',
    platform: platform,
    captcha: '',
    captcha_id: ''
  })

  const captchaCode = ref('')
  const redirect = route.query?.redirect
  const login = async () => {
    const res = await userStore.login(form).catch(e => e)
    if (!res.code) {
      ElMessage.success(T('LoginSuccess'))
      router.push({ path: redirect || '/', replace: true })
      return
    }
    if (res.code === 110) {
      // need captcha
      loadCaptcha()
    }
  }

  const loadCaptcha = async () => {
    const captchaRes = await captcha().catch(_ => false)
    console.log(captchaRes)
    captchaCode.value = captchaRes.data.captcha
    form.captcha_id = captchaRes.data.captcha.id
  }

  const handleOIDCLogin = (provider) => {
    userStore.oidc(provider, platform, browser)
  }

  import googleImage from '@/assets/google.png'
  import githubImage from '@/assets/github.png'
  import oidcImage from '@/assets/oidc.png'
  import webauthImage from '@/assets/webauth.png'
  import defaultImage from '@/assets/oidc.png'

  const providerImageMap = {
    google: googleImage,
    github: githubImage,
    oidc: oidcImage,
    // WebAuth: webauthImage,
    default: defaultImage,
  }

  const getProviderImage = (provider) => {
    return providerImageMap[provider.toLowerCase()] || providerImageMap.default
  }

  const allowRegister = ref(false)
  const disablePwd = ref(false)
  const loadLoginOptions = async () => {
    try {
      const res = await loginOptions().catch(_ => false)
      if (!res || !res.data) return console.error('No valid response received')
      res.data.ops.map(option => (options.push({ name: option }))) // 创建新的对象数组
      if (res.data.auto_oidc) {
        // 如果有自动OIDC登录选项，直接调用第一个
        handleOIDCLogin(res.data.ops[0])
      }
      disablePwd.value = res.data.disable_pwd
      allowRegister.value = res.data.register
      if (res.data.need_captcha) {
        loadCaptcha()
      }
    } catch (error) {
      console.error('Error loading login options:', error.message)
    }
  }

  onMounted(async () => {
    const code = getCode()
    if (code) {
      // 如果code存在，进行query获取user info
      const res = await userStore.query(code)
      if (res) {
        // 删除code，确保跳转之前对code进行清楚
        removeCode()
        ElMessage.success(T('LoginSuccess'))
        router.push({ path: redirect || '/', replace: true })
      }
    } else {
      // 如果code不存在, 现实登陆页面
      loadLoginOptions() // 组件挂载后调用登录选项加载函数
    }
  })

  const register = () => {
    router.push('/register')
  }
</script>

<style scoped lang="scss">
.login-page {
  display: flex;
  min-height: 100vh;
  background: var(--xc-bg-surface);
}

/* ---------- 左侧品牌区 ---------- */
.brand-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px;
  background: linear-gradient(155deg, #0f172a 0%, #172554 45%, #1e40af 100%);
  color: #fff;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(620px 320px at 82% 8%, rgba(96, 165, 250, 0.22), transparent 62%),
      radial-gradient(520px 420px at 8% 92%, rgba(37, 99, 235, 0.30), transparent 60%);
    pointer-events: none;
  }

  @media (max-width: 900px) {
    display: none;
  }
}

.brand-inner {
  position: relative;
  max-width: 440px;
}

.brand-logo-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 56px;

  .brand-logo {
    width: 36px;
    height: 36px;
    border-radius: 8px;
  }

  .brand-name {
    font-size: 17px;
    font-weight: 600;
    letter-spacing: 0.01em;
  }
}

.brand-headline {
  font-size: 34px;
  line-height: 1.35;
  font-weight: 600;
  margin: 0 0 18px;
  letter-spacing: 0.01em;
}

.brand-sub {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.72);
  margin: 0 0 44px;
  line-height: 1.7;
}

.brand-foot {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.58);
}

/* ---------- 右侧表单区 ---------- */
.form-panel {
  width: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: var(--xc-bg-surface);

  @media (max-width: 900px) {
    width: 100%;
  }
}

.form-inner {
  width: 100%;
  max-width: 360px;
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--xc-text-1);
  margin: 0 0 10px;
}

.form-sub {
  font-size: 14px;
  color: var(--xc-text-3);
  margin: 0 0 28px;
}

.login-form {
  :deep(.el-form-item__label) {
    color: var(--xc-text-2);
    font-weight: 500;
    padding-bottom: 6px;
  }
}

.submit-item {
  margin-top: 8px;
  margin-bottom: 0;
}

.login-button {
  width: 100%;
  height: 42px;
  margin-left: 0;
  font-size: 15px;
  border-radius: var(--xc-radius-sm);
}

.captcha-input {
  :deep(.el-input-group__append) {
    border-radius: 0 var(--xc-radius-sm) var(--xc-radius-sm) 0;
    padding: 0;
    overflow: hidden;
    background: var(--xc-bg-subtle);
  }

  .captcha {
    cursor: pointer;
    width: 130px;
    height: 38px;
    object-fit: cover;
    display: block;
  }
}

.divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
  font-size: 13px;
  color: var(--xc-text-3);

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: var(--xc-border-light);
  }

  &::before {
    margin-right: 12px;
  }

  &::after {
    margin-left: 12px;
  }
}

.oidc-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.oidc-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 44px;
  border: 1px solid var(--xc-border);
  border-radius: var(--xc-radius-sm);
  font-size: 14px;
  transition: all 0.18s ease;

  &:hover {
    border-color: var(--xc-primary-border);
    background: var(--xc-primary-bg);
  }
}

.oidc-icon {
  width: 20px;
  height: 20px;
  margin-right: 4px;
}
</style>
