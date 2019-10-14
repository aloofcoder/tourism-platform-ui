import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/authority/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/auth/admin/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/authority/logout',
    method: 'post'
  })
}

export function getUserList(data) {
  return request({
    url: '/auth/admin',
    method: 'get',
    params: data
  })
}

export function removeUser(data) {
  return request({
    url: '/auth/admin',
    method: 'delete',
    params: data
  })
}
export function addUser(data) {
  return request({
    url: '/auth/admin',
    method: 'post',
    params: data
  })
}
