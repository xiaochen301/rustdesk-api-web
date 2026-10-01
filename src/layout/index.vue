<template>
  <el-config-provider :locale="appStore.setting.locale.value">
    <el-container :style="{'--sideBarWidth': sideBarWidth}">
      <el-aside :width="leftWidth" class="app-left">
        <g-aside></g-aside>
      </el-aside>
      <el-container class="app-container ">
        <el-header class="app-header">
          <g-header></g-header>
        </el-header>
        <el-main class="app-main">
          <router-view v-slot="{ Component }">
            <transition mode="out-in" name="el-fade-in-linear">
              <component :is="Component"/>
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-config-provider>
</template>

<script setup>
  import { useAppStore } from '@/store/app'
  import { computed } from 'vue'
  import GAside from '@/layout/components/aside.vue'
  import GHeader from '@/layout/components/header.vue'

  const appStore = useAppStore()
  const sideBarWidth = computed(() => appStore.setting.locale.sideBarWidth)
  const leftWidth = computed(() => appStore.setting.sideIsCollapse ? '64px' : 'var(--sideBarWidth)')
</script>

<style lang="scss" scoped>
.app-header {
  background-color: var(--xc-bg-surface);
  border-bottom: 1px solid var(--xc-border-light);
  display: flex;
  align-items: center;
  height: var(--xc-header-height);
  padding: 0 16px;
}

.app-left {
  transition: width 0.25s ease;
}

.app-container {
  min-height: 100vh;
  background: var(--xc-bg-app);
}

.app-main {
  padding: 16px;
}
</style>
