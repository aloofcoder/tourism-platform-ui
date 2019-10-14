import request from '@/utils/request'

export function getOrgList(data) {
  return request({
    url: '/auth/org',
    methods: 'get',
    params: data
  })
}
