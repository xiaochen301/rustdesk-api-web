import { createRouter, createWebHashHistory } from 'vue-router'

const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    meta: { title: 'Login' },
    component: () => import('@/views/login/login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    meta: { title: 'Register' },
    component: () => import('@/views/register/index.vue'),
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true,
  },
  {
    path: '/oauth/:code',
    meta: { title: 'OauthLogin' },
    component: () => import('@/views/oauth/login.vue'),
    hidden: true,
  },
  {
    path: '/oauth/bind/:code',
    meta: { title: 'OauthBind' },
    component: () => import('@/views/oauth/bind.vue'),
    hidden: true,
  },
]
export const asyncRoutes = [
  // {
  //   path: '/',
  //   name: 'Index',
  //   redirect: '/Home',
  //   meta: { title: '首页', icon: 'house' },
  //   component: () => import('@/layout/index.vue'),
  //   children: [
  //     {
  //       path: '/Home',
  //       name: 'Home',
  //       meta: { title: '首页', icon: 'house' },
  //       component: () => import('@/views/index/index.vue'),
  //     },
  //
  //   ],
  // },
  {
    path: '/my',
    name: 'My',
    redirect: '/',
    meta: { title: 'My', icon: 'UserFilled' },
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/',
        name: 'MyInfo',
        meta: { title: 'Userinfo', icon: 'User' /*keepAlive: true*/ },
        component: () => import('@/views/my/info.vue'),
      },
      {
        path: 'peer',
        name: 'MyPeer',
        meta: { title: 'MyPeer', icon: 'Monitor' /*keepAlive: true*/ },
        component: () => import('@/views/my/peer/index.vue'),
      },
      {
        path: 'address_book_collection',
        name: 'MyAddressBookCollection',
        meta: { title: 'MyAddressBookCollection', icon: 'Collection' /*keepAlive: true*/ },
        component: () => import('@/views/my/address_book/collection.vue'),
      },
      {
        path: 'address_book',
        name: 'MyAddressBookList',
        meta: { title: 'AddressBooks', icon: 'Notebook' /*keepAlive: true*/ },
        component: () => import('@/views/my/address_book/index.vue'),
      },
      {
        path: 'tag',
        name: 'MyTagList',
        meta: { title: 'MyTags', icon: 'CollectionTag' /*keepAlive: true*/ },
        component: () => import('@/views/my/tag/index.vue'),
      },
      {
        path: 'shareRecord',
        name: 'MyShareRecordList',
        meta: { title: 'MyShareRecord', icon: 'Share' /*keepAlive: true*/ },
        component: () => import('@/views/my/share_record/index.vue'),
      },
      {
        path: 'loginLog',
        name: 'MyLoginLog',
        meta: { title: 'MyLoginLog', icon: 'List' /*keepAlive: true*/ },
        component: () => import('@/views/my/login_log/index.vue'),
      },
    ],
  },
  {
    path: '/user',
    name: 'User',
    redirect: '/user/index',
    meta: { title: 'System', icon: 'Setting' },
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: 'peer',
        name: 'Peer',
        meta: { title: 'PeerManage', icon: 'Monitor' /*keepAlive: true*/ },
        component: () => import('@/views/peer/index.vue'),
      },
      {
        path: 'group',
        name: 'UserGroup',
        meta: { title: 'GroupManage', icon: 'ChatRound' /*keepAlive: true*/ },
        component: () => import('@/views/group/index.vue'),
      },
      {
        path: 'stray',
        name: 'StrayPeer',
        meta: { title: 'StrayPeer', icon: 'Warning' /*keepAlive: true*/ },
        component: () => import('@/views/peer/stray.vue'),
      },
      {
        path: 'deviceGroup',
        name: 'DeviceGroup',
        meta: { title: 'DeviceGroupManage', icon: 'ChatRound', hide: true /*keepAlive: true*/ },
        component: () => import('@/views/group/deviceGroupList.vue'),
      },
      {
        path: 'index',
        name: 'UserList',
        meta: { title: 'UserManage', icon: 'User' /*keepAlive: true*/ },
        component: () => import('@/views/user/index.vue'),
      },
      {
        path: 'add',
        name: 'UserAdd',
        meta: { title: 'UserAdd', hide: true },
        component: () => import('@/views/user/edit.vue'),
      },
      {
        path: 'edit/:id',
        name: 'UserEdit',
        meta: { title: 'UserEdit', hide: true },
        component: () => import('@/views/user/edit.vue'),
      },
      {
        path: 'addressBookName',
        name: 'UserAddressBookName',
        meta: { title: 'AddressBookNameManage', icon: 'Collection' /*keepAlive: true*/ },
        component: () => import('@/views/address_book/collection.vue'),
      },
      {
        path: 'addressBook',
        name: 'UserAddressBook',
        meta: { title: 'AddressBookManage', icon: 'Notebook' /*keepAlive: true*/ },
        component: () => import('@/views/address_book/index.vue'),
      },
      {
        path: 'tag',
        name: 'UserTag',
        meta: { title: 'TagsManage', icon: 'CollectionTag', hide: true /*keepAlive: true*/ },
        component: () => import('@/views/tag/index.vue'),
      },
      {
        path: '/oauth',
        name: 'Oauth',
        meta: { title: 'OauthManage', icon: 'Link' /*keepAlive: true*/ },
        component: () => import('@/views/oauth/index.vue'),
      },
      {
        path: '/userToken',
        name: 'UserToken',
        meta: { title: 'UserToken', icon: 'Ticket', hide: true /*keepAlive: true*/ },
        component: () => import('@/views/user/token.vue'),
      },
      {
        path: '/loginLog',
        name: 'LoginLog',
        meta: { title: 'LoginLog', icon: 'List' /*keepAlive: true*/ },
        component: () => import('@/views/login/log.vue'),
      },
      {
        path: '/auditConn',
        name: 'AuditConn',
        meta: { title: 'AuditConnLog', icon: 'Tickets' /*keepAlive: true*/ },
        component: () => import('@/views/audit/connList.vue'),
      },
      {
        path: '/auditFile',
        name: 'AuditFile',
        meta: { title: 'AuditFileLog', icon: 'Files' /*keepAlive: true*/ },
        component: () => import('@/views/audit/fileList.vue'),
      },
      {
        path: '/shareRecord',
        name: 'ShareRecord',
        meta: { title: 'ShareRecord', icon: 'Share' /*keepAlive: true*/ },
        component: () => import('@/views/share_record/index.vue'),
      },
      {
        path: '/serverCmd',
        name: 'ServerCmd',
        meta: { title: 'ServerCmd', icon: 'Tools' /*keepAlive: true*/ },
        component: () => import('@/views/rustdesk/control.vue'),
      },
    ],
  },
]
export const lastRoutes = [
  { path: '/:catchAll(.*)', redirect: '/404', meta: { hide: true } },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
})

// XC: 部署新版本后旧页面请求已失效 chunk 时自动刷新恢复（30 秒窗口防循环刷新）
router.onError((error) => {
  if (/Failed to fetch dynamically imported module/i.test(error?.message || '')) {
    const last = Number(sessionStorage.getItem('xc-preload-reloaded') || 0)
    if (Date.now() - last > 30000) {
      sessionStorage.setItem('xc-preload-reloaded', String(Date.now()))
      window.location.reload()
    }
  }
})

