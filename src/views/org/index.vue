<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-button type="danger" icon="el-icon-plus" @click="dialogOrgVisible = true">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      row-key="orgId"
      border
      default-expand-all
      fit
      highlight-current-row
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :header-cell-style="{color: 'white', backgroundColor: '#419fff'}">
      <el-table-column
        prop="orgName"
        label="组织名">
      </el-table-column>
      <el-table-column
        prop="orgAdmin"
        label="负责人"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="orgSort"
        label="排序号"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="orgClass"
        label="类型"
        align="center"
        width="120">
        <template slot-scope="scope">
          {{scope.row.orgClass | classFilter}}
        </template>
      </el-table-column>
<!--      <el-table-column class-name="status-col" label="状态" width="180" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <el-switch-->
<!--            v-model="!scope.row.status"-->
<!--            active-color="#13ce66"-->
<!--            inactive-color="#ff4949"-->
<!--            active-text="启用"-->
<!--            inactive-text="禁用">-->
<!--          </el-switch>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加组织 -->
    <el-dialog title="添加组织" :visible.sync="dialogOrgVisible" :fullscreen="fullscreen" :width="dialogWidth">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="上级组织" prop="parentName">
          <el-tree
                  ref="org-tree"
                  :data="list"
                  highlight-current
                  :default-expand-all="false"
                  :props="defaultProps"
                  :expand-on-click-node="false"
                  @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <el-radio v-model="form.parentName" :label="data.orgId">{{ node.label }}</el-radio>
            </span>
          </el-tree>
        </el-form-item>
        <el-form-item label="组织名称" prop="orgName">
          <el-input v-model="form.orgName" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="组织类型" prop="orgClass">
          <el-select v-model="form.orgClass" placeholder="请选择组织类型" style="width: 100%">
            <el-option
                    v-for="item in orgClassOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示排序" prop="orgSort">
          <el-input-number v-model="form.orgSort" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="管理员名称" prop="orgAdmin">
          <el-input v-model="form.orgAdmin" style="width: 100%"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOrgVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirmDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getOrgList, addOrg, removeOrg } from '@/api/org'
export default {
  filters: {
    classFilter(orgClass) {
      const orgClassMap = [
        '公司', '部门'
      ]
      return orgClassMap[orgClass - 1]
    },
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
      list: [],
      dialogOrgVisible: false,
      dialogWidth: '700px',
      fullscreen: false,
      form: {
        parentId: '',
        parentName: '',
        orgClass: '',
        orgName: '',
        orgSort: '',
        orgAdmin: ''
      },
      rules: {
        orgName: [
          { required: true, message: '请输入组织名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 之间', trigger: 'blur' }
        ],
        orgClass: [
          { required: true, message: '请选择组织类型', trigger: 'change' }
        ],
        orgSort: [
          { required: true, message: '请输入组织显示排序号', trigger: 'change' }
        ],
        orgAdmin: [
          { required: true, message: '请输入管理员名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 之间', trigger: 'blur' }
        ]
      },
      orgClassOptions: [
        {
          value: '1',
          label: '公司'
        }, {
          value: '2',
          label: '部门'
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'orgName'
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getOrgList().then((res) => {
        if (res.head.ret === 0) {
          this.list = [...res.body]
          console.log(this.list)
          this.listLoading = false
        }
      })
    },
    handleNodeClick(data) {
      this.form.parentName = data.orgName
      this.form.parentId = data.orgId
    },
    handleEdit(index, item) {
      this.form = Object.assign({}, this.form, item)
      this.form.parentName = item.orgName
      console.log(this.form)
      this.dialogOrgVisible = true
    },
    handleDelete(index, item) {
      this.$confirm(`将要删除组织${item.orgName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(item)
        removeOrg({ orgId: item.orgId }).then((res) => {
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
    },
    handleConfirmDialog() {
      console.log('##### orgInfo -> ' + this.form)
      addOrg(this.form).then(() => {
        this.$message.success('添加组织成功！')
        this.$refs.ruleForm.resetFields()
        this.fetchData()
      })
    }
  }
}
</script>
