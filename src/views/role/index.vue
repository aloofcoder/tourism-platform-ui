<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="condition" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="handleAddRole">添加</el-button>
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
      <el-table-column label="角色名称">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column label="角色描述">
        <template slot-scope="scope">
          {{ scope.row.roleDesc }}
        </template>
      </el-table-column>
      <el-table-column label="显示排序">
        <template slot-scope="scope">
          {{ scope.row.roleSort }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="180" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="!scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启用"
            inactive-text="禁用">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="dialogRoleVisible" :fullscreen="fullscreen" :width="dialogWidth">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="显示排序" prop="roleSort">
          <el-input-number v-model="form.roleSort" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入角色描述"
            v-model="form.roleDesc">
          </el-input>
        </el-form-item>
        <el-form-item label="授权菜单" prop="parentName">
          <el-tree
            ref="menuTree"
            :data="menuList"
            highlight-current
            :default-expand-all="false"
            :props="defaultProps"
            show-checkbox
            node-key="sourceId">
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirmDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, addRole, removeRole } from '@/api/role'
import { getMenuList } from '@/api/menu'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      condition: '',
      listLoading: true,
      currentPage: 1,
      pageSize: 10,
      totalPage: 1,
      list: [],
      dialogRoleVisible: false,
      dialogWidth: '600px',
      fullscreen: false,
      form: {
        roleName: '',
        roleSort: '',
        roleDesc: '',
        sourceIds: []
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'sourceName'
      },
      menuList: []
    }
  },
  created() {
    this.fetchData()
    this.fetchMenu()
  },
  methods: {
    handleConfirmDialog() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.form.sourceIds = [...this.$refs.menuTree.getCheckedKeys()]
          addRole(this.form).then((res) => {
            this.$message.success('添加菜单成功！')
            this.dialogRoleVisible = false
            this.fetchData()
          })
        } else {
          this.$message.warning('请填写所有必填信息！')
          return false
        }
      })
    },
    handleAddRole() {
      this.dialogRoleVisible = true
    },
    fetchMenu() {
      getMenuList().then((res) => {
        if (res.head.ret === 0) {
          this.menuList = [...res.body]
        }
      })
    },
    fetchData() {
      getRoleList({
        condition: this.condition,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then((res) => {
        if (res.head.ret === 0) {
          console.log(res.body.list, 'res.body.list')
          this.list = [...res.body.list]
          this.listLoading = false
          this.currentPage = res.body.currentPage
          this.pageSize = res.body.pageSize
          this.totalPage = res.body.totalPage
          this.totalSize = res.body.totalSize
        }
      })
    },
    handleEdit(index, item) {
    },
    handleDelete(index, item) {
      this.$confirm(`将要角色菜单${item.roleName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeRole({ roleId: item.roleId }).then((res) => {
          if (res.head.ret === 0) {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
