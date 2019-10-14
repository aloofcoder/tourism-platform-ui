import request from '@/utils/request'

export function getMenuList(data) {
  return request({
    url: '/source',
    method: 'get',
    params: data
  })
}

export function addMenu(data) {
  return request({
    url: '/source',
    method: 'post',
    data
  })
}

export function removeMenu(data) {
  return request({
    url: '/source',
    method: 'delete',
    params: data
  })
}
