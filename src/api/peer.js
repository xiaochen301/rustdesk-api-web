import request from '@/utils/request'

export function list (params) {
  return request({
    url: '/peer/list',
    params,
  })
}

export function detail (id) {
  return request({
    url: `/peer/detail/${id}`,
  })
}

export function create (data) {
  return request({
    url: '/peer/create',
    method: 'post',
    data,
  })
}

export function update (data) {
  return request({
    url: '/peer/update',
    method: 'post',
    data,
  })
}

export function remove (data) {
  return request({
    url: '/peer/delete',
    method: 'post',
    data,
  })
}

export function batchRemove (data) {
  return request({
    url: '/peer/batchDelete',
    method: 'post',
    data,
  })
}

export function simpleData (data) {
  return request({
    url: '/peer/simpleData',
    method: 'post',
    data,
  })
}

// XC: 游离设备（注册过但从未绑定用户）
export function strayList (params) {
  return request({
    url: '/peer/stray',
    params,
  })
}

// XC: 收编游离设备到托管用户
export function adopt (data) {
  return request({
    url: '/peer/adopt',
    method: 'post',
    data,
  })
}
