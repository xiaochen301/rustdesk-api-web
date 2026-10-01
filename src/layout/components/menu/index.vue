<template>
  <el-menu
          class="menus"
          :collapse="isCollapse"
          :default-active="activeIndex"
          router
  >
    <menu-item v-for="(route,index) in routes" :key="route.name" :route="route"></menu-item>
  </el-menu>
</template>

<script>
  import { defineComponent, ref, onMounted, watch, computed } from 'vue'
  import { useRouteStore } from '@/store/router'
  import MenuItem from '@/layout/components/menu/item.vue'
  import { useRoute } from 'vue-router'
  import { useAppStore } from '@/store/app'

  export default defineComponent({
    name: 'Menu',
    created () {
    },
    components: { MenuItem },
    setup () {
      const routes = ref([])
      const route = useRoute()
      const app = useAppStore()
      const isCollapse = computed(() => app.setting.sideIsCollapse)
      const activeIndex = computed(() => route.name)

      routes.value = useRouteStore().routes
      return {
        routes,
        activeIndex,
        isCollapse,
      }
    },

  })
</script>

<style lang="scss" scoped>
  .menus {
    min-height: calc(100vh - var(--xc-header-height));
    border-right: none;
    padding: 8px 0;
    background: transparent;
    &:not(.el-menu--collapse) {
      width: var(--sideBarWidth);
    }

    // 菜单项与子菜单标题
    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      height: 40px;
      line-height: 40px;
      margin: 2px 10px;
      border-radius: 8px;
      color: var(--xc-text-2);
      font-size: 14px;
      transition: background 0.18s ease, color 0.18s ease;

      &:hover {
        background: var(--xc-bg-hover);
        color: var(--xc-text-1);
      }
    }

    // 选中态
    :deep(.el-menu-item.is-active) {
      background: var(--xc-primary-bg);
      color: var(--xc-primary);
      font-weight: 500;
    }

    // 子菜单展开容器
    :deep(.el-sub-menu .el-menu) {
      background: transparent;
    }

    // 折叠时
    &.el-menu--collapse {
      :deep(.el-menu-item),
      :deep(.el-sub-menu__title) {
        margin: 2px 6px;
      }
    }
  }
</style>
<style>
</style>
