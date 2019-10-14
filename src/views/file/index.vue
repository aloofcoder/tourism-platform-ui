<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="condition" placeholder="图片名称" @keyup.enter.native="fetchData"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="handleAddFile">添加</el-button>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      stripe
      :header-cell-style="{color: 'white', backgroundColor: '#419fff'}"
    >
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index  * currentPage + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="缩略图" align="center" width="80">
        <template slot-scope="scope">
          <el-image :src="'http://image.minzhile.top/' + scope.row.filePath" style="width: 50px;" :preview-src-list="srcList"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="文件名">
        <template slot-scope="scope">
          {{ scope.row.fileName }}
        </template>
      </el-table-column>
      <el-table-column label="文件链接" max-width="460">
        <template slot-scope="scope">
          {{ scope.row.filePath }}
        </template>
      </el-table-column>
<!--      <el-table-column align="center" label="操作" width="160">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"></el-button>-->
<!--          <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)"></el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
    <!-- 添加角色 -->
    <el-dialog title="添加附件" :visible.sync="dialogFileVisible" :fullscreen="fullscreen" :width="dialogWidth">
      <el-form :model="form" label-width="100px">
        <el-form-item>
          <el-upload
            drag
            action=""
            :http-request="uploadFile"	>
            <img v-if="imageUrl" style="max-width: 360px; max-height: 180px;" :src="imageUrl" alt="">
            <div v-else>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFileVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirmDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getFileList, uploadFile } from '@/api/file'
export default {
  data() {
    return {
      condition: '',
      listLoading: true,
      currentPage: 1,
      pageSize: 10,
      totalPage: 1,
      list: [],
      dialogFileVisible: false,
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      ],
      form: {
        formData: ''
      },
      imageUrl: '',
      fullscreen: false,
      dialogWidth: '600px'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getFileList({
        condition: this.condition,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then((res) => {
        if (res.head.ret === 0) {
          this.list = [...res.body.list]
          this.listLoading = false
          this.currentPage = res.body.currentPage
          this.pageSize = res.body.pageSize
          this.totalPage = res.body.totalPage
          this.totalSize = res.body.totalSize
        }
      })
    },
    handleAddFile() {
      this.dialogFileVisible = true
    },
    uploadFile(param) {
      console.log(param.file)
      const fileObj = param.file
      // 接收上传文件的后台地址
      // FormData 对象
      const form = new FormData()
      // 文件对象
      form.append('file', fileObj)
      const reader = new FileReader()
      reader.readAsDataURL(param.file)
      reader.onload = () => {
        this.imageUrl = reader.result
      }
      this.form.formData = form
    },
    handleConfirmDialog() {
      uploadFile(this.form.formData).then((res) => {
        this.$message({
          type: 'success',
          message: '上传成功!'
        })
        this.dialogFileVisible = false
        this.imageUrl = ''
        this.fetchData()
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '上传失败, 请重试!'
        })
      })
    },
    handleEdit(index, item) {
    },
    handleDelete(index, item) {
    }
  }
}
</script>
