import request from '@/utils/request'

export function getRoleList(data) {
  return request({
    url: '/role',
    method: 'get',
    params: data
  })
}

export function getRoles() {
  return request({
    url: '/role/complete',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function removeRole(data) {
  return request({
    url: '/role',
    method: 'delete',
    params: data
  })
}
