import request from '@/utils/request'

export function getOrgList(data) {
  return request({
    url: '/auth/org',
    method: 'get',
    params: data
  })
}

export function addOrg(data) {
  return request({
    url: '/auth/org',
    method: 'post',
    params: data
  })
}

export function removeOrg(data) {
  return request({
    url: '/auth/org',
    method: 'delete',
    params: data
  })
}
