<template>
  <div class="aside-inner">
    <div class="brand" :class="{ 'is-collapse': isCollapse }">
      <img :src="setting.logo" alt="logo" class="brand-logo" />
      <span v-show="!isCollapse" class="brand-title">{{ setting.title }}</span>
    </div>
    <el-scrollbar class="scroll-sidebar">
      <menus></menus>
    </el-scrollbar>
  </div>
</template>
<script>
  import Menus from '@/layout/components/menu/index.vue'
  import { defineComponent, computed } from 'vue'
  import { useAppStore } from '@/store/app'

  export default defineComponent({
    name: 'GAside',
    components: { Menus },
    setup () {
      const appStore = useAppStore()
      const setting = computed(() => appStore.setting)
      const isCollapse = computed(() => appStore.setting.sideIsCollapse)
      return {
        setting,
        isCollapse,
      }
    },
  })
</script>

<style scoped lang="scss">
.aside-inner {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--xc-bg-surface);
  border-right: 1px solid var(--xc-border-light);
  overflow: hidden;
}

.brand {
  display: flex;
  align-items: center;
  height: var(--xc-header-height);
  padding: 0 16px;
  gap: 10px;
  flex-shrink: 0;
  border-bottom: 1px solid var(--xc-border-light);
  overflow: hidden;

  &.is-collapse {
    justify-content: center;
    padding: 0;
  }

  .brand-logo {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    flex-shrink: 0;
  }

  .brand-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--xc-text-1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.scroll-sidebar {
  flex: 1;
  min-height: 0;
}
</style>
