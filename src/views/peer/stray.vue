<template>
  <div>
    <el-card class="list-query" shadow="hover">
      <el-form inline label-width="60px">
        <el-form-item>
          <el-button type="primary" @click="handlerQuery">{{ T('Filter') }}</el-button>
          <el-button @click="getList">{{ T('Refresh') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="list-body" shadow="hover">
      <el-table :data="listRes.list" v-loading="listRes.loading">
        <el-table-column prop="row_id" label="ID" align="center" width="80"/>
        <el-table-column prop="id" :label="T('PeerId')" align="center" width="150"/>
        <el-table-column prop="hostname" :label="T('Hostname')" align="center"/>
        <el-table-column prop="os" :label="T('Os')" align="center"/>
        <el-table-column prop="version" :label="T('Version')" align="center" width="90"/>
        <el-table-column :label="T('LastOnlineTime')" align="center" width="160">
          <template #default="{row}">{{ formatTime(row.last_online_time) }}</template>
        </el-table-column>
        <el-table-column :label="T('Actions')" align="center" width="120" fixed="right">
          <template #default="{row}">
            <el-button link type="primary" @click="toAdopt(row)">{{ T('Adopt') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="list-page" shadow="hover">
      <el-pagination background
                     layout="prev, pager, next, sizes, jumper"
                     :page-sizes="[10,20,50,100]"
                     v-model:page-size="listQuery.page_size"
                     v-model:current-page="listQuery.page"
                     :total="listRes.total">
      </el-pagination>
    </el-card>
    <el-dialog v-model="adoptVisible" :title="T('Adopt')" width="520">
      <el-form label-width="100px">
        <el-form-item :label="T('PeerId')">
          <span>{{ adoptRow.id }}</span>
        </el-form-item>
        <el-form-item :label="T('Hostname')">
          <span>{{ adoptRow.hostname }}</span>
        </el-form-item>
        <el-form-item :label="T('AdoptTo')" required>
          <el-select v-model="adoptUserId" filterable style="width: 100%" :placeholder="T('SelectManagedUser')">
            <el-option v-for="u in managedUsers" :key="u.id"
                       :label="u.username + (u.nickname ? '（' + u.nickname + '）' : '')"
                       :value="u.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="adoptVisible = false">{{ T('Cancel') }}</el-button>
        <el-button type="primary" @click="submitAdopt">{{ T('Submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { onMounted, reactive, ref, watch } from 'vue'
  import { strayList, adopt } from '@/api/peer'
  import { list as userList } from '@/api/user'
  import { ElMessage } from 'element-plus'
  import { T } from '@/utils/i18n'

  const listRes = reactive({
    list: [], total: 0, loading: false,
  })
  const listQuery = reactive({
    page: 1,
    page_size: 10,
  })

  const getList = async () => {
    listRes.loading = true
    const res = await strayList(listQuery).catch(_ => false)
    listRes.loading = false
    if (res) {
      listRes.list = res.data.list || []
      listRes.total = res.data.total
    }
  }
  const handlerQuery = () => {
    if (listQuery.page === 1) {
      getList()
    } else {
      listQuery.page = 1
    }
  }
  watch(() => listQuery.page, getList)
  watch(() => listQuery.page_size, handlerQuery)

  const formatTime = (t) => {
    if (!t) return '-'
    const d = new Date(t * 1000)
    const p = (n) => (n < 10 ? '0' + n : n)
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
  }

  // 托管用户列表（收编目标，仅 type=2 可选）
  const managedUsers = ref([])
  const loadManagedUsers = async () => {
    const res = await userList({ page: 1, page_size: 500 }).catch(_ => false)
    if (res) {
      managedUsers.value = (res.data.list || []).filter(u => u.type === 2)
    }
  }

  const adoptVisible = ref(false)
  const adoptRow = ref({})
  const adoptUserId = ref(null)
  const toAdopt = async (row) => {
    adoptRow.value = row
    adoptUserId.value = null
    adoptVisible.value = true
    if (!managedUsers.value.length) {
      await loadManagedUsers()
    }
  }
  const submitAdopt = async () => {
    if (!adoptUserId.value) {
      ElMessage.warning(T('SelectManagedUser'))
      return false
    }
    const res = await adopt({ row_id: adoptRow.value.row_id, user_id: adoptUserId.value }).catch(_ => false)
    if (res) {
      ElMessage.success(T('OperationSuccess'))
      adoptVisible.value = false
      getList()
    }
  }

  onMounted(() => {
    getList()
    loadManagedUsers()
  })
</script>

<style scoped lang="scss">

</style>
