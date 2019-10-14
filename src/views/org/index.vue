<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-button type="danger" icon="el-icon-plus" @click="fetchData">添加</el-button>
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
  </div>
</template>
<script>
import { getOrgList } from '@/api/org'
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
      list: []
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
    handleEdit(index, item) {
    },
    handleDelete(index, item) {
    }
  }
}
</script>
