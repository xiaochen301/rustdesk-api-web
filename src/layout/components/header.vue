<template>
  <div class="fold-btn" @click="expandOrFoldSlider">
    <el-icon :size="18">
      <el-icon-expand v-if="setting.sideIsCollapse"></el-icon-expand>
      <el-icon-fold v-else></el-icon-fold>
    </el-icon>
  </div>
  <div class="header-title">{{ pageTitle }}</div>
  <Setting></Setting>
</template>

<script>
  import { defineComponent, computed } from 'vue'
  import Setting from '@/layout/components/setting/index.vue'
  import { useAppStore } from '@/store/app'
  import { useRoute } from 'vue-router'
  import { T } from '@/utils/i18n'

  export default defineComponent({
    name: 'LayerHeader',
    components: { Setting },
    setup () {
      const appStore = useAppStore()
      const setting = computed(() => appStore.setting)
      const route = useRoute()
      const pageTitle = computed(() => {
        const t = route.meta?.title
        return t ? (T(t) || t) : (route.name ? T(route.name) : '')
      })
      const expandOrFoldSlider = () => {
        appStore.sideCollapse()
      }
      return {
        setting,
        pageTitle,
        expandOrFoldSlider,
      }
    },
  })
</script>

<style scoped lang="scss">
  .fold-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    color: var(--xc-text-2);
    cursor: pointer;
    transition: background 0.18s ease, color 0.18s ease;
    flex-shrink: 0;

    &:hover {
      background: var(--xc-bg-hover);
      color: var(--xc-text-1);
    }
  }

  .header-title {
    margin-left: 12px;
    font-size: 15px;
    font-weight: 600;
    color: var(--xc-text-1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
