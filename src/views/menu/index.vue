<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-button type="danger" icon="el-icon-plus" @click="dialogMenuVisible = true">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      row-key="sourceId"
      border
      default-expand-all
      fit
      highlight-current-row
      :header-cell-style="{color: 'white', backgroundColor: '#419fff'}"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="sourceName"
        label="菜单名">
      </el-table-column>
      <el-table-column
        prop="sourceMark"
        label="菜单标记"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="sourceLink"
        label="菜单链接"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="sourceType"
        label="类型"
        align="center"
        width="120">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.sourceType | sourceTypeTagColor">
            {{scope.row.sourceType | classFilter}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="sourceSort"
        label="排序号"
        align="center"
        width="120">
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
    <!-- 添加菜单 -->
    <el-dialog title="添加菜单" :visible.sync="dialogMenuVisible" :fullscreen="fullscreen" :width="dialogWidth">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="菜单名称" prop="sourceName">
          <el-input v-model="form.sourceName" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="菜单类型" prop="sourceType">
          <el-select v-model="form.sourceType" placeholder="请选择菜单类型" style="width: 100%">
            <el-option
              v-for="item in sourceTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单标记" prop="sourceMark">
          <el-input v-model="form.sourceMark" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="菜单链接" prop="sourceLink">
          <el-input v-model="form.sourceLink" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="显示排序号" prop="sourceSort">
          <el-input-number v-model="form.sourceSort" :min="1"/>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentName">
          <el-tree
            ref="menu-tree"
            :data="list"
            highlight-current
            :default-expand-all="false"
            :props="defaultProps"
            :expand-on-click-node="false"
            @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <el-radio v-model="form.parentMenu" :label="data.sourceId">{{ node.label }}</el-radio>
            </span>
          </el-tree>
        </el-form-item>
        <el-form-item label="授权角色" prop="sourceSort">
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
        <el-button @click="dialogMenuVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getMenuList, addMenu, removeMenu } from '@/api/menu'
import { getRoles } from '@/api/role'
export default {
  filters: {
    classFilter(sourceType) {
      const sourceTypeMap = [
        '系统', '菜单', '按钮', '数据列'
      ]
      return sourceTypeMap[sourceType - 1]
    },
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    sourceTypeTagColor(sourceType) {
      const sourceTypeMap = [
        '', 'success', 'warning', 'danger'
      ]
      return sourceTypeMap[sourceType - 1]
    }
  },
  data() {
    return {
      condition: '',
      listLoading: true,
      list: [],
      dialogMenuVisible: false,
      popoverVisible: false,
      formLabelWidth: '120px',
      sourceTypeOptions: [
        {
          value: '1',
          label: '系统'
        }, {
          value: '2',
          label: '菜单'
        }, {
          value: '3',
          label: '按钮'
        }, {
          value: '4',
          label: '数据列'
        }
      ],
      form: {
        parentId: '',
        parentMenu: '',
        parentName: '',
        sourceName: '',
        sourceMark: '',
        sourceLink: '',
        sourceSort: '',
        sourceType: '',
        roleIds: []
      },
      rules: {
        sourceName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 之间', trigger: 'blur' }
        ],
        sourceMark: [
          { required: true, message: '请输入菜单标记', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 之间', trigger: 'blur' }
        ],
        sourceLink: [
          { required: true, message: '请输入菜单链接', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 之间', trigger: 'blur' }
        ],
        sourceSort: [
          { required: true, message: '请输入菜单显示排序号', trigger: 'change' }
        ],
        sourceType: [
          { required: true, message: '请选择菜单类型', trigger: 'change' }
        ]
      },
      // 全屏模态框
      fullscreen: false,
      dialogWidth: '700px',
      defaultProps: {
        children: 'children',
        label: 'sourceName'
      },
      roleList: []
    }
  },
  created() {
    this.getRoles()
    this.fetchData()
  },
  methods: {
    getRoles() {
      getRoles().then((res) => {
        if (res.head.ret === 0) {
          this.roleList = [...res.body]
        }
      })
    },
    handleNodeClick(data) {
      this.form.parentMenu = data.sourceId
      this.form.parentName = data.sourceName
      this.form.parentId = data.sourceId
      this.popoverVisible = false
    },
    fetchData() {
      getMenuList().then((res) => {
        if (res.head.ret === 0) {
          this.list = [...res.body]
          this.listLoading = false
        }
      })
    },
    handleEdit(index, item) {
      this.form = Object.assign({}, this.form, item)
      this.dialogMenuVisible = true
    },
    /*
    添加菜单
    * */
    handleConfirm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          addMenu(this.form).then((res) => {
            this.$message.success('添加菜单成功！')
            this.dialogMenuVisible = false
            this.fetchData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除菜单
    handleDelete(index, item) {
      this.$confirm(`将要删除菜单${item.sourceName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeMenu({ sourceId: item.sourceId }).then((res) => {
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
