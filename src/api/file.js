import request from '@/utils/request'

export function getFileList(data) {
  return request({
    url: '/sys/file',
    method: 'get',
    params: data
  })
}

export function uploadFile(data) {
  return request({
    url: '/sys/file/upload/image',
    method: 'post',
    data,
    headers: {
      contentType: 'multipart/form-data'
    }
  })
}
