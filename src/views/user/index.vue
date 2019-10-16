<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="">
        <el-input v-model="condition" @input="fetchData" placeholder="姓名/手机号/邮箱"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" icon="el-icon-plus" @click="handleAddAdmin">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
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
          {{ scope.$index * currentPage + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          {{ scope.row.adminName }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.adminMobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.adminEmail }}
        </template>
      </el-table-column>
      <el-table-column label="登录名" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.loginName }}
        </template>
      </el-table-column>
<!--      <el-table-column label="系统编号" width="140" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.adminNum }}-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column class-name="status-col" label="状态" width="170" align="center">
        <template slot-scope="scope">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启用"
            inactive-text="禁用"
            v-model="!scope.row.status">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.adminRoles }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            circle
            @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="handleDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-20">
      <el-pagination
        hide-on-single-page
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 30, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalSize">
      </el-pagination>
    </div>
    <!-- 添加管理员 -->
    <el-dialog title="添加管理员" :visible.sync="dialogUserVisible" :fullscreen="fullscreen" :width="dialogWidth">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="姓名" prop="adminName">
          <el-input v-model="form.adminName" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="form.loginName" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="密码" prop="adminPwd">
          <el-input v-model="form.adminPwd" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="手机号" prop="adminMobile">
          <el-input v-model="form.adminMobile" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="adminEmail">
          <el-input v-model="form.adminEmail" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="部门" prop="orgName">
<!--          <el-input-->
<!--            v-model="form.orgName"-->
<!--            style="width: 100%"-->
<!--            readonly-->
<!--            @click.native="handleShowSelectOrg"-->
<!--            @blur="handleHideSelectOrg">-->
<!--            <i-->
<!--              slot="suffix"-->
<!--              class="el-input__icon"-->
<!--               :class="[showSelectOrg ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i>-->
<!--          </el-input>-->
          <el-tree
            ref="org-tree"
            :data="orgList"
            highlight-current
            :default-expand-all="false"
            :props="defaultProps"
            :expand-on-click-node="false"
            @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <el-radio v-model="form.orgId" :label="data.orgId">{{ node.label }}</el-radio>
            </span>
          </el-tree>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="form.roleIds" multiple clearable placeholder="请选择授权角色" style="width: 100%;">
            <el-option
              v-for="item in roleList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirmDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getRoles } from '@/api/role'
import { getOrgList } from '@/api/org'
import { getUserList, removeUser, addUser } from '@/api/user'
import { setCookie, getCookie } from '@/utils'

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
      orgList: [],
      defaultProps: {
        children: 'children',
        label: 'orgName',
        value: 'orgId'
      },
      condition: '',
      listLoading: true,
      currentPage: 1,
      pageSize: 10,
      totalPage: 1,
      totalSize: 1,
      list: [],
      dialogUserVisible: false,
      dialogWidth: '700px',
      fullscreen: false,
      showSelectOrg: false,
      form: {
        adminName: '',
        adminPwd: '',
        adminEmail: '',
        adminMobile: '',
        loginName: '',
        orgId: '',
        orgName: '',
        roleIds: []
      },
      rules: {
        adminName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 之间', trigger: 'blur' }
        ],
        loginName: [
          { required: true, message: '请输入登陆名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 7 之间', trigger: 'blur' }
        ],
        adminPwd: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 3 到 5 之间', trigger: 'blur' }
        ],
        adminMobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        adminEmail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        orgName: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ]
      },
      roleList: []
    }
  },
  created() {
    this.condition = getCookie('user_condition') ? getCookie('user_condition') : ''
    this.currentPage = getCookie('user_currentPage') ? parseInt(getCookie('user_currentPage')) : 1
    this.pageSize = getCookie('user_pageSize') ? parseInt(getCookie('user_pageSize')) : 10
    this.fetchData()
    this.fetchOrgInfo()
    this.fetchRoleInfo()
  },
  methods: {
    // 添加管理员信息
    handleConfirmDialog() {
      addUser(this.form).then((res) => {
        this.$message.success('添加用户成功！')
        this.$refs.ruleForm.resetFields()
        this.fetchData()
      })
    },
    handleHideSelectOrg() {
      if (this.showSelectOrg) {
        this.showSelectOrg = false
      }
    },
    handleNodeClick(data) {
      this.form.orgId = data.orgId
      this.form.orgName = data.orgName
      this.showSelectOrg = false
    },
    handleShowSelectOrg() {
      if (!this.showSelectOrg) {
        this.showSelectOrg = true
      }
    },
    handleAddAdmin() {
      this.dialogUserVisible = true
    },
    fetchRoleInfo() {
      getRoles().then((res) => {
        if (res.head.ret === 0) {
          this.roleList = [...res.body]
        }
      })
    },
    fetchOrgInfo() {
      getOrgList().then((res) => {
        if (res.head.ret === 0) {
          this.orgList = [...res.body]
        }
      })
    },
    fetchData() {
      setCookie('user_condition', this.condition)
      setCookie('user_currentPage', this.currentPage)
      setCookie('user_pageSize', this.pageSize)
      getUserList({
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
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    handleEdit(index, item) {
      this.form = Object.assign({}, this.form, item)
      this.dialogUserVisible = true
    },
    handleDelete(index, item) {
      this.$confirm(`将要删除用户${item.adminName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(item)
        removeUser({ adminNum: item.adminNum }).then((res) => {
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
<style>
  .full-popover {
    width: 100%;
  }
</style>
