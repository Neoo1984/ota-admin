<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item label="设备类型">
          <el-select @change="getList" v-model="listQuery.deviceType" placeholder="请选择设备类型">
            <el-option
              v-for="item in deviceType"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="厂商">
          <el-select filterable @focus="getFactoryName" @change="getList" v-model="listQuery.factoryName"
                     placeholder="请选择厂商名称"
                     style="width: 200px" class="filter-item"
          >
            <el-option
              v-for="item in listFactoryName"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号">
          <el-select @focus="getProduct" @change="getList" v-model="listQuery.productModel" placeholder="请选择产品型号"
                     style="width: 200px" class="filter-item"
          >
            <el-option
              v-for="item in listProductModel"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="硬件版本">
          <el-select v-model="listQuery.hardVersion" @focus="getHard" @change="getList" placeholder="请选择产品型号"
                     style="width: 200px"
                     class="filter-item"
          >
            <el-option
              v-for="item in listHardVersion"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务编号">
          <el-input prefix-icon="el-icon-search" clearable @input="getList" v-model="listQuery.taskId"
                    placeholder="设备编码" style="width: 200px"
                    class="filter-item"
          ></el-input>
        </el-form-item>

        <el-button type="primary" @click="reSearch" icon="el-icon-refresh-left" size="small">重置查询</el-button>
        <el-button type="primary" @click="handleOtaCreate" icon="el-icon-plus" size="small">新建OTA任务</el-button>

      </el-form>
    </div>
    <el-table
      ref="multipleTable"
      :loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      border
      :default-sort="{prop: 'date', order: 'descending'}"
      highlight-current-row
    >
      <el-table-column
        type="selection"
        width="40"
      >
      </el-table-column>
      <el-table-column type="index" align="center" label="序号" width="50" fixed="left"></el-table-column>

      <el-table-column label="任务编号" align="center" width="150" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.row.taskId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="厂商名称" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.factoryName }}
        </template>
      </el-table-column>
      <el-table-column label="设备类型" align="center" width="120" :formatter="renderType">
      </el-table-column>

      <el-table-column label="产品型号" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.productModel }}
        </template>
      </el-table-column>

      <el-table-column label="硬件版本" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.hardVersion }}
        </template>
      </el-table-column>
      <el-table-column label="升级软件版本" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.upSoftVersion }}
        </template>
      </el-table-column>
      <el-table-column label="任务状态" align="center" width="150" :formatter="renderTaskStatus">
      </el-table-column>
      <el-table-column sortable label="创建时间" align="center" width="150" :formatter="renderCreateTime">
      </el-table-column>
      <el-table-column label="任务开始时间" align="center" width="150" :formatter="renderBeginTime">
      </el-table-column>
      <el-table-column label="任务结束时间" align="center" width="150" :formatter="renderEndTime">
      </el-table-column>

      <el-table-column label="创建者" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.createUserName || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="150" :formatter="renderUpdateTime">
      </el-table-column>
      <el-table-column label="更新者" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.updateUserName || '--' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" width="80">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleDetail(scope.$index, scope.row)"
          >详情
          </el-button>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size"
                @pagination="getList"
    />
    <!--    新建OTA任务-->
    <el-drawer
      :with-header=true
      title="请选择要升级的设备信息和升级包"
      :before-close="handleClose"
      :visible.sync="otaDialogVisible"
      v-if="otaDialogVisible"
      direction="rtl"
      ref="drawer"
      :destroy-on-close="true"
      custom-class="demo-drawer"
      :size="drawerSize"
    >
      <div class="drawer-content">
        <el-form v-if="otaDialogVisible" ref="taskForm" :model="taskForm" style="flex: 1" size="small"
                 :rules="createTaskRules"
        >
          <el-form-item label="厂商" :label-width="formLabelWidth" prop="factoryName">
            <el-select @focus="getFactoryName" v-model="taskForm.factoryName" @change="getFormProduct(false)"
                       placeholder="请选择厂商名称" style="width: 80%"
                       class="filter-item"
            >
              <el-option
                v-for="item in tempFactoryName"
                :key="item.index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型" :label-width="formLabelWidth" prop="deviceType">
            <el-select v-model="taskForm.deviceType" @change="getFormProduct(false)" placeholder="请选择设备类型"
                       style="width: 80%" class="filter-item"
            >
              <el-option
                v-for="item in taskDeviceType"
                :key="item.index"
                :label="item.label"
                :value="item.value"
                :disabled="item.value !== '1'"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品型号" :label-width="formLabelWidth" v-if="taskForm.factoryName && taskForm.deviceType"
                        prop="productModel"
          >
            <el-select v-model="taskForm.productModel"
                       @change="getFormHard(false)"
                       placeholder="请选择产品型号" style="width: 80%"
                       class="filter-item"
            >
              <el-option
                v-for="item in taskProductModel"
                :key="item.index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="硬件版本" :label-width="formLabelWidth" v-if="taskForm.productModel" prop="hardVersion">
            <el-select v-model="taskForm.hardVersion" @change="getFormSoft" placeholder="请选择硬件版本" style="width: 80%"
                       class="filter-item"
            >
              <el-option
                v-for="item in taskHardVersion"
                :key="item.index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="软件版本" :label-width="formLabelWidth" v-if="taskForm.hardVersion" prop="softVersion">
            <el-select v-model="taskForm.softVersion" placeholder="请选择软件版本" style="width: 80%"
                       class="filter-item"
            >
              <el-option
                v-for="item in taskSoftVersion"
                :key="item.index"
                :label="item.softVersion"
                :value="item.packageId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务起止时间" :label-width="formLabelWidth" prop="time">
            <el-date-picker
              v-model="taskForm.time"
              type="datetimerange"
              :default-time="['23:59:59', '23:59:59']"
              :picker-options="pickerOptions1"
              value-format="yyyy/MM/dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item style="text-align: center">
            <span class="ota-task-title">主设备信息选择</span>
          </el-form-item>
          <el-form-item label="主设备厂商" :label-width="formLabelWidth" prop="mainFactoryName">
            <el-select v-model="taskForm.mainFactoryName" @focus="getFactoryName" @change="getFormProduct(true)"
                       placeholder="请选择主设备厂商名称"
                       style="width: 80%"
                       class="filter-item"
            >
              <el-option
                v-for="item in tempFactoryName"
                :key="item.index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主设备类型" :label-width="formLabelWidth" prop="mainDeviceType">
            <el-select v-model="taskForm.mainDeviceType" placeholder="请选择主设备类型" @change="getFormProduct(true)"
                       style="width: 80%" class="filter-item"
            >
              <el-option
                v-for="item in taskDeviceType"
                :key="item.index"
                :label="item.label"
                :value="item.value"
                :disabled="item.value === '1'"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主设备产品型号" :label-width="formLabelWidth"
                        v-if="taskForm.mainDeviceType && taskForm.mainFactoryName" prop="mainProductModel"
          >
            <el-select v-model="taskForm.mainProductModel"
                       @change="getFormHard(true)"
                       placeholder="请选择主设备产品型号"
                       style="width: 80%"
                       class="filter-item"
            >
              <el-option
                v-for="item in taskMainProductModel"
                :key="item.index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主设备硬件版本" :label-width="formLabelWidth" v-if="taskForm.mainProductModel"
                        prop="mainHardVersion"
          >
            <el-select v-model="taskForm.mainHardVersion" placeholder="请选择主设备硬件版本" style="width: 80%"
                       class="filter-item"
            >
              <el-option
                v-for="item in taskMainHard"
                :key="item.index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主设备编码" :label-width="formLabelWidth">
            <el-link type="primary" :disabled="taskForm.mainHardVersion === undefined" @click="mainDeviceList">已选择
              {{ taskForm.mainDeviceCount }} 个主设备，选择当前筛选条件下的主设备...
            </el-link>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-popconfirm
              title="清空已选择的主设备？"
              @confirm="removeMainDevice"
              v-if="taskForm.mainDeviceCount > 0"
            >
              <el-button plain slot="reference" type="primary">清空已选主设备</el-button>
            </el-popconfirm>
          </el-form-item>

        </el-form>
        <div class="drawer-footer">
          <div style="text-align: right;padding-right: 8px">
            <el-button style="width: 40%" @click="cancelOta" size="small">取 消</el-button>
          </div>
          <div v-if="taskForm.mainDeviceCount === 0" style="text-align: left;padding-left: 8px">
            <el-popover
              placement="top"
              width="160"
              v-model="isPop"
            >
              <p>未选择主设备,将升级所有当前条件下的设备！</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="isPop = false">取消</el-button>
                <el-button type="warning" size="mini" @click="createTask">确定</el-button>
              </div>
              <el-button type="primary" style="width: 40%" size="small" slot="reference" :loading="creatingTask">
                {{ creatingTask ? '提交中 ...' : '开始升级' }}
              </el-button>
            </el-popover>
          </div>
          <div v-else style="text-align: center;padding-right: 8px">
            <el-button @click="createTask" slot="reference" style="width: 40%" type="primary" size="small"
                       :loading="creatingTask"
            >{{ creatingTask ? '提交中 ...' : '开始升级' }}
            </el-button>
          </div>


        </div>
      </div>
      <!--    新建OTA任务 查看主设备-->
      <el-drawer
        :with-header="true"
        :append-to-body="true"
        title="选择OTA任务主设备"
        :visible.sync="taskMainDeviceVisible"
        direction="rtl"
        :before-close="closeSelectedDrawer"
        ref="drawer"
        :destroyOnClose="true"
        :size="tableDrawerSize"
      >

        <el-form :inline="true" :label-position="labelPosition" size="small" class="detail-form">
          <el-form-item label="厂商">
            <el-input v-model="taskForm.mainFactoryName" disabled style="width: 200px"
                      class="filter-item"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备类型">
            <el-select v-model="taskForm.mainDeviceType" disabled
                       style="width: 80%" class="filter-item"
            >
              <el-option
                v-for="item in taskDeviceType"
                :key="item.index"
                :label="item.label"
                :value="item.value"
                :disabled="item.value !== '1'"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品型号">
            <el-input v-model="taskForm.mainProductModel" disabled style="width: 200px"
                      class="filter-item"
            ></el-input>
          </el-form-item>
          <el-form-item label="硬件版本">
            <el-input v-model="taskForm.mainHardVersion" disabled style="width: 200px"
                      class="filter-item"
            ></el-input>
          </el-form-item>
          <el-form-item label="主设备编码">
            <el-input v-model="taskForm.searchDevice" clearable placeholder="主设备编码" style="width: 200px"
                      class="filter-item"
            ></el-input>

          </el-form-item>

          <el-button type="primary" @click="mainDeviceList" icon="el-icon-search" size="small">查询</el-button>
          <el-button type="primary" @click="addMainDevice" icon="el-icon-plus" size="small">添加选中设备</el-button>
          <el-button type="primary" @click="editChosenMain" icon="el-icon-edit" size="small">查看已选择设备</el-button>

        </el-form>
        <el-table
          :loading="mainDeviceLoading"
          :data="mainDeviceData"
          @select="selectMain"
          @select-all="selectMain"
          element-loading-text="加载中..."
          highlight-current-row
          border
          fit
          class="detail-table"
        >
          <el-table-column
            type="selection"
            width="50"
          ></el-table-column>
          <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>

          <el-table-column label="设备编号" align="center">
            <template slot-scope="scope">
              {{ scope.row.deviceName }}
            </template>
          </el-table-column>
          <el-table-column label="设备类型" align="center" :formatter="renderType">
          </el-table-column>
          <el-table-column label="厂商" align="center">
            <template slot-scope="scope">
              {{ scope.row.factoryName }}
            </template>
          </el-table-column>
          <el-table-column label="产品型号" align="center">
            <template slot-scope="scope">
              {{ scope.row.productModel }}
            </template>
          </el-table-column>

          <el-table-column label="硬件版本" align="center">
            <template slot-scope="scope">
              {{ scope.row.hardVersion }}
            </template>
          </el-table-column>

        </el-table>
        <pagination v-show="mainDeviceTotal>0" :total="mainDeviceTotal" :page.sync="taskForm.current"
                    :limit.sync="taskForm.size"
                    @pagination="mainDeviceList"
        />

        <!-- 已选的主设备，第三层drawer-->
        <el-drawer
          title="已添加主设备"
          :visible.sync="mainChosenVisible"
          direction="rtl"
          :append-to-body="true"
          ref="taskMainChosen"
          :size="tableDrawerSize"
        >
          <el-form>
            <el-form-item style="margin:1%">
              <el-button type="primary" @click="removeSelected" icon="el-icon-delete" size="small">删 除</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :loading="mainDeviceLoading"
            :data="chosenDeviceData"
            @select="selectChosen"
            @select-all="selectChosen"
            element-loading-text="加载中..."
            highlight-current-row
            border
            fit
            class="detail-table"
          >
            <el-table-column
              type="selection"
              width="46"
            ></el-table-column>
            <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>

            <el-table-column label="设备编号" align="center" width="150">
              <template slot-scope="scope">
                {{ scope.row.deviceName }}
              </template>
            </el-table-column>
            <el-table-column label="设备类型" align="center" :formatter="renderType">
            </el-table-column>
            <el-table-column label="厂商" align="center">
              <template slot-scope="scope">
                {{ scope.row.factoryName }}
              </template>
            </el-table-column>
            <el-table-column label="产品型号" align="center">
              <template slot-scope="scope">
                {{ scope.row.productModel }}
              </template>
            </el-table-column>

            <el-table-column label="硬件版本" align="center">
              <template slot-scope="scope">
                {{ scope.row.hardVersion }}
              </template>
            </el-table-column>

          </el-table>
          <pagination v-show="chosenDeviceTotal>0" :total="chosenDeviceTotal" :page.sync="chosenMain.current"
                      :limit.sync="chosenMain.size"
                      @pagination="chosenMainList"
          />

        </el-drawer>


      </el-drawer>
    </el-drawer>

    <!--    查看任务详情-->
    <el-drawer
      :with-header="true"
      title="设备信息和升级包"
      :visible.sync="taskDetailVisible"
      direction="rtl"
      ref="drawer"
      :destroyOnClose="true"
      custom-class="demo-drawer"
      :size="drawerSize"
    >
      <div class="drawer-content">
        <el-form :model="detailForm" style="flex: 1" size="small">
          <el-form-item label="厂商" :label-width="formLabelWidth">
            <el-input v-model="detailForm.factoryName" :disabled="detailDisabled"
                      style="width: 80%"
                      class="filter-item"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备类型" :label-width="formLabelWidth">
            <el-select v-model="detailForm.deviceType" :disabled="detailDisabled"
                       style="width: 80%"
                       class="filter-item"
            >
              <el-option
                v-for="item in deviceType"
                :key="item.index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品型号" :label-width="formLabelWidth">
            <el-input v-model="detailForm.productModel" :disabled="detailDisabled"
                      style="width: 80%"
                      class="filter-item"
            ></el-input>
          </el-form-item>
          <el-form-item label="硬件版本" :label-width="formLabelWidth">
            <el-input v-model="detailForm.hardVersion" :disabled="detailDisabled"
                      style="width: 80%"
                      class="filter-item"
            ></el-input>
          </el-form-item>
          <el-form-item label="软件版本" :label-width="formLabelWidth">
            <el-input v-model="detailForm.upSoftVersion" :disabled="detailDisabled"
                      style="width: 80%"
                      class="filter-item"
            ></el-input>
          </el-form-item>
          <el-form-item style="text-align: center">
            <span class="ota-task-title">主设备信息</span>
          </el-form-item>
          <el-form-item label="主设备厂商" :label-width="formLabelWidth">
            <el-input v-model="detailForm.mainFactoryName" :disabled="detailDisabled"
                      style="width: 80%"
                      class="filter-item"
            ></el-input>
          </el-form-item>
          <el-form-item label="主设备类型" :label-width="formLabelWidth">
            <el-select v-model="detailForm.mainDeviceType" :disabled="detailDisabled" style="width: 80%"
                       class="filter-item"
            >
              <el-option
                v-for="item in deviceType"
                :key="item.index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主设备产品型号" :label-width="formLabelWidth">
            <el-input v-model="detailForm.mainProductModel" :disabled="detailDisabled"
                      style="width: 80%"
                      class="filter-item"
            ></el-input>
          </el-form-item>
          <el-form-item label="主设备硬件版本" :label-width="formLabelWidth">
            <el-input v-model="detailForm.mainHardVersion" :disabled="detailDisabled"
                      style="width: 80%"
                      class="filter-item"
            ></el-input>

          </el-form-item>
          <el-form-item label="主设备编码" :label-width="formLabelWidth">
            <el-link type="success" @click="handleExTable">已选择 {{ detailForm.mainDeviceCount }} 个 主设备，查看升级详情...
            </el-link>
          </el-form-item>

        </el-form>
        <div class="drawer-footer">
          <div style="text-align: right;padding-right: 8px">
            <el-button style="width: 50%" @click="cancelDetail()" size="small">关 闭</el-button>
          </div>
          <div style="text-align: left;padding-left: 8px">
            <el-button style="width: 50%" @click="operate" type="primary" size="small" v-if="canOperate">
              {{ canOperateText }}
            </el-button>
          </div>
        </div>
      </div>
      <!--      嵌套drawer-->
      <!--扩展表格-->
      <el-drawer
        title="升级详情"
        :visible.sync="exDetailVisible"
        direction="rtl"
        :destroy-on-close="true"
        :append-to-body="true"
        ref="exDrawer"
        :size="subDrawerSize"
      >
        <el-form :inline="true" size="small" class="detail-form">
          <el-form-item label="主设备编码">
            <el-select @change="exSearch" filterable v-model="exQuery.mainDeviceName" placeholder="请选择主设备编码">
              <el-option
                v-for="item in exDeviceName"
                :key="item.index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务状态">
            <el-select v-model="exQuery.taskStatus" @change="exSearch" placeholder="请选择升级状态" style="width: 200px" class="filter-item">
              <el-option
                v-for="item in taskStatus"
                :key="item.index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-button type="primary" @click="reExSearch" icon="el-icon-refresh-left" size="small">重置查询</el-button>
          <el-button type="primary" @click="handleExcel(true)" icon="el-icon-plus" size="small">导出表格</el-button>
          <el-button type="primary" @click="handleDetailTable" icon="el-icon-tickets" size="small">子设备升级详情</el-button>

        </el-form>
        <el-table
          :loading="exLoading"
          :data="exData"
          element-loading-text="加载中..."
          border
          highlight-current-row
          class="detail-table"
        >
          <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>

          <el-table-column label="设备编号" align="center">
            <template slot-scope="scope">
              {{ scope.row.mainDeviceName }}
            </template>
          </el-table-column>
          <el-table-column label="发送状态" align="center" :formatter="renderExSend">
          </el-table-column>
          <el-table-column label="升级任务状态" align="center" :formatter="renderExStatus">
          </el-table-column>

          <el-table-column label="更新结束时间" align="center" :formatter="renderExEndTime">
          </el-table-column>
          <el-table-column align="center" label="操作" width="80">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleExDetail(scope.$index, scope.row)"
              >详情
              </el-button>

            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="exTotal>0" :total="exTotal" :page.sync="exQuery.current"
                    :limit.sync="exQuery.size"
                    @pagination="exSearch"
        />
        <!--        第三层-->
        <el-drawer
          :title="subDrawerTitle"
          :visible.sync="subDetailVisible"
          direction="rtl"
          :destroy-on-close="true"
          :append-to-body="true"
          ref="subDrawer"
          :before-close="handleSubClose"
          :size="subDrawerSize"
        >

          <el-form :inline="true" size="small" class="detail-form">
            <el-form-item label="主设备编码">
              <el-select filterable v-model="detailQuery.mainDeviceName" @change="detailSearch" placeholder="请选择主设备编码">
                <el-option
                  v-for="item in mainDeviceName"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="从设备编码">
              <el-input   clearable prefix-icon="el-icon-search" v-model="detailQuery.subDeviceName" @input="detailSearch" placeholder="从设备编码" style="width: 200px"
                        class="filter-item"
              ></el-input>

            </el-form-item>
            <el-form-item label="升级状态">
              <el-select v-model="detailQuery.otaStatus" @change="detailSearch" placeholder="请选择升级状态" style="width: 200px" class="filter-item">
                <el-option
                  v-for="item in otaStatus"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-button type="primary" @click="reDetailSearch" icon="el-icon-refresh-left" size="small">重置查询</el-button>
            <el-button type="primary" @click="handleExcel(false)" :loading="getExcel" icon="el-icon-plus" size="small">
              导出表格
            </el-button>

          </el-form>
          <el-table
            :loading="detailLoading"
            :data="detailData"
            element-loading-text="加载中..."
            border
            fit
            highlight-current-row
            class="detail-table"
          >
            <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>

            <el-table-column label="从设备编号" align="center">
              <template slot-scope="scope">
                {{ scope.row.subDeviceName }}
              </template>
            </el-table-column>
            <el-table-column label="主设备编号" align="center">
              <template slot-scope="scope">
                {{ scope.row.mainDeviceName }}
              </template>
            </el-table-column>
            <el-table-column label="升级状态" align="center" :formatter="renderOtaStatus">
            </el-table-column>
            <el-table-column label="更新结束时间" align="center" :formatter="renderOtaEndTime">
            </el-table-column>
            <el-table-column align="center" label="操作" width="80">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleItemDetail(scope.$index, scope.row)"
                >详情
                </el-button>

              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="detailTotal>0" :total="detailTotal" :page.sync="detailQuery.current"
                      :limit.sync="detailQuery.size"
                      @pagination="detailSearch"
          />

          <!--        详情，第三层drawer-->
          <el-drawer
            :title="itemDrawerTitle"
            :visible.sync="itemDetailVisible"
            direction="rtl"
            :append-to-body="true"
            ref="itemDrawer"
            :destroy-on-close="true"
            :before-close="handleSubClose"
            :size="drawerSize"
          >
            <div class="drawer-content">
              <el-form :model="itemForm" style="flex: 1" size="small">

                <el-form-item label="厂商" :label-width="formLabelWidth">
                  <el-input v-model="itemForm.factoryName" :disabled="itemDetailDisabled"
                            style="width: 80%"
                            class="filter-item"
                  ></el-input>
                </el-form-item>
                <el-form-item label="设备类型" :label-width="formLabelWidth">
                  <el-select v-model="itemForm.deviceType" :disabled="detailDisabled" style="width: 80%"
                             class="filter-item"
                  >
                    <el-option
                      v-for="item in deviceType"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="产品型号" :label-width="formLabelWidth">
                  <el-input v-model="itemForm.productModel" :disabled="detailDisabled"
                            style="width: 80%"
                            class="filter-item"
                  ></el-input>
                </el-form-item>
                <el-form-item label="硬件版本" :label-width="formLabelWidth">
                  <el-input v-model="itemForm.hardVersion" :disabled="detailDisabled"
                            style="width: 80%"
                            class="filter-item"
                  ></el-input>
                </el-form-item>
                <el-form-item label="软件版本" :label-width="formLabelWidth">
                  <el-input v-model="itemForm.softVersion" :disabled="detailDisabled"
                            style="width: 80%"
                            class="filter-item"
                  ></el-input>
                </el-form-item>
                <el-form-item label="主设备编码" :label-width="formLabelWidth">
                  <el-input v-model="itemForm.mainDeviceName" :disabled="detailDisabled"
                            style="width: 80%"
                            class="filter-item"
                  ></el-input>
                </el-form-item>

              </el-form>
              <div class="drawer-footer">
                <div style="text-align: center">
                  <el-button style="width: 40%" @click="cancelItem()" size="small" type="primary">退 出</el-button>
                </div>

              </div>
            </div>
          </el-drawer>
        </el-drawer>
      </el-drawer>


    </el-drawer>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getDevice, getExDetail, getOtaDetail, getOtaList, getSubDevice } from '@/api/table'
import {
  exportExcel,
  getFactoryNameList,
  operateTask,
  otaTask,
  queryProductModelList,
  querySoftVersion
} from '@/api/operation'
import {
  renderExTaskStatus,
  renderOtaStatus,
  renderProgress,
  renderSendStatus,
  renderTaskStatus,
  renderTime,
  renderType
} from '@/utils'
import { global } from '@/common'

export default {
  name: 'Ota',
  components: { Pagination },
  data() {
    return {
      //全局
      labelPosition: 'left',
      formLabelWidth: '130px',
      drawerSize: '50%',
      tempFactoryName: [],
      getExcel: false,
      //list
      list: null,
      listLoading: false,
      total: 0,
      deviceType: global.tempDeviceType,
      listQuery: {
        current: 1,
        size: 20,
        deviceType: undefined,
        factoryName: undefined,
        hardVersion: undefined,
        productModel: undefined,
        deviceCode: undefined
      },
      listFactoryName: [
        {
          label: '全部',
          value: undefined
        }
      ],
      listProductModel: [
        {
          label: '全部',
          value: undefined
        }
      ],
      listHardVersion: [
        {
          label: '全部',
          value: undefined
        }
      ],
      hard: [],
      renderType: renderType,
      renderOtaStatus: renderOtaStatus,
      renderProgress: renderProgress,
      //OTA任务
      creatingTask: false, //新建OTA任务
      otaDialogVisible: false,
      chosenDeviceData: [], //选中的主设备
      taskProductModel: [],
      taskDeviceType: global.deviceType,
      taskStatus: global.taskStatus,
      taskHardVersion: [],
      taskSoftVersion: [],
      taskMainProductModel: [],
      taskMainHard: [],
      taskForm: {
        current: 1,
        size: 20,
        deviceType: undefined,
        factoryName: undefined,
        productModel: undefined,
        hardVersion: undefined,
        softVersion: undefined,
        mainDeviceNames: undefined,
        mainDeviceCount: 0,
        searchDevice: undefined,
        mainHardVersion: undefined,
        mainProductModel: undefined,
        mainDeviceType: undefined,
        mainFactoryName: undefined,
        time: undefined
      },
      isPop: false,
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      //OTA任务查看主设备（第2层drawer）
      taskMainDeviceVisible: false,
      tableDrawerSize: '90%',
      mainDeviceLoading: false,
      mainDeviceData: null,
      mainDeviceTotal: 0,
      selected: [],
      selectedNames: [],
      deleteSelected: [],
      deleteSelectedNames: [],
      //OTa任务第三层，编辑已选择的主设备
      mainChosenVisible: false,
      chosenDeviceTotal: 0,
      chosenMain: {
        current: 1,
        size: 20
      },
      //第一层drawer表单
      detailDisabled: true,
      canOperate: false,
      taskDetailVisible: false,
      canOperateText: '中止',
      detailForm: {
        deviceType: '',
        factoryName: '',
        productModel: '',
        hardVersion: '',
        upSoftVersion: undefined,
        mainDeviceNames: '',
        mainHardVersion: '',
        mainProductModel: '',
        mainDeviceType: '',
        mainFactoryName: '',
        mainDeviceCount: 0,
        taskStatus: '',
        time: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)]
      },
      //ex新增table
      exDetailVisible: false,
      exDetailLoading: false,
      exLoading: false,
      exData: null,
      exTotal: 0,
      exQuery: {
        current: 1,
        size: 20,
        mainDeviceName: undefined,
        taskStatus: undefined,
        taskId: undefined
      },
      exDeviceName: [],
      //第3层
      detailData: null,
      mainDeviceName: [],
      subDetailVisible: false,
      detailTotal: 0,
      detailLoading: false,
      subDrawerSize: '86%',
      subDrawerTitle: '已升级设备详情',
      otaStatus: global.otaStatus,
      detailQuery: {
        current: 1,
        size: 20,
        mainDeviceName: undefined,
        subDeviceName: undefined,
        otaStatus: undefined,
        taskId: undefined
      },
      //第4层
      itemDetailDisabled: true,
      itemDrawerTitle: '从设备详情',
      itemDetailVisible: false,
      itemForm: {
        deviceType: undefined,
        factoryName: undefined,
        productModel: undefined,
        hardVersion: undefined,
        softVersion: undefined,
        mainDeviceName: undefined
      },
      updateType: global.updateType,
      createTaskRules: {
        deviceType: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
        factoryName: [{ required: true, message: '请选择厂商名称', trigger: 'blur' }],
        productModel: [{ required: true, message: '请选择产品型号', trigger: 'blur' }],
        hardVersion: [{ required: true, message: '请选择硬件版本', trigger: 'blur' }],
        softVersion: [{ required: true, message: '请选择软件版本', trigger: 'blur' }],
        mainFactoryName: [{ required: true, message: '请选择主设备厂商', trigger: 'blur' }],
        mainDeviceType: [{ required: true, message: '请选择主设备类型', trigger: 'blur' }],
        mainProductModel: [{ required: true, message: '请选择主设备型号', trigger: 'blur' }],
        mainHardVersion: [{ required: true, message: '请选择主设备硬件版本', trigger: 'blur' }],
        time: [{ required: true, message: '请选择任务时间', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.getList()
  },

  methods: {
    getList() {
      this.listLoading = true
      if (this.listQuery.productModel === undefined) {
        this.listQuery.hardVersion = undefined
      }
      getOtaList(this.listQuery).then(response => {
        if (response.data.data !== null) {
          const data = response.data.data
          this.list = data.records
          this.total = data.total
        }
      })
      this.listLoading = false
    },
    //获取厂商
    getFactoryName() {
      getFactoryNameList().then(res => {
        if (res.data.success) {
          if (res.data.data.length !== 0) {
            var data = res.data.data
            if (this.otaDialogVisible) {
              this.tempFactoryName = []
              data.forEach((item, index) => {
                this.tempFactoryName.push({ value: item, label: item })
              })
            } else {
              this.listFactoryName = [
                {
                  label: '全部',
                  value: undefined
                }
              ]
              data.forEach((item, index) => {
                this.listFactoryName.push({ value: item, label: item })
              })
            }

          } else {
            console.error(res.data.message)
          }
        } else {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'error'
          })
        }
      })

    },

    //下拉获取产品型号productModel 和硬件版本
    async getProduct() {
      this.listProductModel = [
        {
          label: '全部',
          value: undefined
        }
      ]
      if (this.listQuery.factoryName !== undefined && this.listQuery.deviceType !== undefined) {
        const product = {
          factoryName: this.listQuery.factoryName,
          productType: this.listQuery.deviceType
        }
        try {
          let res = await queryProductModelList(product)
          let data = res.data.data
          if (data.infoList.length !== 0) {
            data.infoList.forEach((item, index) => {
              if (item.hardVersions.length !== 0) {
                this.hard.push(item.hardVersions)
              }
              this.listProductModel.push({ value: item.productModel, label: item.productModel })
            })
          }
        } catch (err) {
          console.log(err)
        }
      } else {
        this.$notify({
          title: '警告',
          message: '请先选择设备类型和厂商！',
          type: 'warning',
          duration: 2000
        })
      }
    },
    //下拉硬件
    getHard() {
      this.listHardVersion = []
      if (this.listQuery.productModel !== undefined) {
        this.listHardVersion = [
          {
            label: '全部',
            value: undefined
          }
        ]
        let modelIndex = ''
        this.listProductModel.forEach((item, index) => {
          if (this.listQuery.productModel === item.value) {
            modelIndex = index - 1
          }
        })
        if (this.hard.length !== 0 && this.hard[modelIndex].length !== 0) {
          this.hard[modelIndex].forEach((item, index) => {
            this.listHardVersion.push({ value: item, label: item })
          })
        }
      } else {
        this.listHardVersion = [
          {
            label: '全部',
            value: undefined
          }
        ]
        this.hard = []
      }
    },

    //表单产品类型,硬件型号
    getFormProduct(isMain) {
      this.hard = []
      if (isMain) {
        this.taskMainProductModel = []
        this.taskMainHard = []
        this.taskForm.mainProductModel = undefined
        this.taskForm.mainHardVersion = undefined
        let query = {
          factoryName: this.taskForm.mainFactoryName,
          productType: this.taskForm.mainDeviceType
        }
        this.product(query).then(res => this.taskMainProductModel = res)
      } else {
        this.taskProductModel = []
        this.taskHardVersion = []
        this.taskForm.productModel = undefined
        this.taskForm.hardVersion = undefined
        let query = {
          factoryName: this.taskForm.factoryName,
          productType: this.taskForm.deviceType
        }
        this.product(query).then(res => this.taskProductModel = res)
      }

    },

    async product(query) {
      let list = []
      try {
        if (query.factoryName !== undefined && query.productType !== undefined) {
          let res = await queryProductModelList(query)
          let data = res.data.data
          if (data.infoList.length !== 0) {
            data.infoList.forEach((item, index) => {
              if (item.hardVersions.length !== 0) {
                this.hard.push(item.hardVersions)
              }
              list.push({ value: item.productModel, label: item.productModel })
            })
          }

        }
      } catch (err) {
        console.log(err)
      }
      return list
    },

    getFormHard(isMain) {
      if (isMain) {
        this.taskForm.mainHardVersion = ''
        this.taskMainHard = this.hardVersion(this.taskMainProductModel, this.taskForm.mainProductModel)
      } else {
        this.taskForm.hardVersion = ''
        this.taskHardVersion = this.hardVersion(this.taskProductModel, this.taskForm.productModel)
      }
    },
    hardVersion(productModel, chosenProduct) {
      let list = []
      let modelIndex = 0
      productModel.forEach((item, index) => {
        if (chosenProduct === item.value) {
          modelIndex = index
        }
      })
      if (this.hard.length !== 0 && this.hard[modelIndex].length !== 0) {
        this.hard[modelIndex].forEach((item, index) => {
          list.push({ value: item, label: item })
        })
      }
      return list
    },
    //表单获取软件版本
    getFormSoft() {
      this.taskForm.softVersion = ''
      let query = {
        factoryName: this.taskForm.factoryName,
        hardVersion: this.taskForm.hardVersion,
        productModel: this.taskForm.productModel
      }
      this.softVersion(query)
    },
    async softVersion(query) {
      this.taskSoftVersion = []
      let res = await querySoftVersion(query)
      if (res.data.success) {
        if (res.data.data.length !== 0) {
          let data = res.data.data
          data.forEach((item, value) => {
            this.taskSoftVersion.push({ softVersion: item.softVersion, packageId: item.objectId })
          })
        }
      } else {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'error'
        })
      }
    },
    //新建OTA任务
    handleOtaCreate() {
      this.otaDialogVisible = true
      this.$nextTick(() => {
        this.$refs['taskForm'].clearValidate()
      })
    },
    //ota任务开始升级
    createTask() {
      this.$refs['taskForm'].validate((valid) => {
        if (valid) {
          this.taskForm.mainDeviceCount === 0 ? this.isPop = true : this.isPop = false
          let query = {
            factoryName: this.taskForm.factoryName,
            deviceType: this.taskForm.deviceType,
            productModel: this.taskForm.productModel,
            hardVersion: this.taskForm.hardVersion,
            packageId: this.taskForm.softVersion,
            beginTime: this.taskForm.time[0],
            endTime: this.taskForm.time[1],
            mainFactoryName: this.taskForm.mainFactoryName,
            mainDeviceType: this.taskForm.mainDeviceType,
            mainProductModel: this.taskForm.mainProductModel,
            mainHardVersion: this.taskForm.mainHardVersion,
            mainDeviceNames: this.taskForm.mainDeviceNames
          }

          this.taskSoftVersion.forEach((item, index) => {
            if (item.packageId === this.taskForm.softVersion) {
              query.upSoftVersion = item.softVersion
            }
          })
          this.creatingTask = true
          otaTask(query).then(res => {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: res.data.success ? 'success' : 'error'
            })
            this.otaDialogVisible = !res.data.success
            this.getList()
          })
          this.isPop = false
          this.creatingTask = false
        }
      })

    },
    //ota升级主设备选择,获取主设备列表
    mainDeviceList() {
      const query = {
        current: this.taskForm.current,
        size: this.taskForm.size,
        deviceType: this.taskForm.mainDeviceType,
        factoryName: this.taskForm.mainFactoryName,
        hardVersion: this.taskForm.mainHardVersion,
        productModel: this.taskForm.mainProductModel,
        isShowMain: true
      }
      this.taskMainDeviceVisible = true
      getDevice(query).then(res => {
        if (res.data.success) {
          if (res.data.data.length !== 0) {
            var device = res.data.data
            this.mainDeviceData = device.records
            this.mainDeviceTotal = device.total
          }
        } else {
          this.$message({
            showClose: true,
            message: '获取设备失败',
            type: 'error'
          })
        }
      })
    },

    //task添加主设备
    selectMain(selection, row) {
      this.selected = []
      this.selectedNames = []
      selection.forEach((item, index) => {
        this.selectedNames.push(item.deviceName)
      })
      this.selected = selection
    },

    addMainDevice() {
      if (this.selected.length === 0) {
        this.$message({
          showClose: true,
          message: '请先选择设备！',
          type: 'warning'
        })
      } else if (this.selected.length > 50) {
        this.$notify({
          title: '警告',
          message: '最多选择50台设备！',
          type: 'warning',
          duration: 2000
        })
      } else {
        this.chosenDeviceData = []
        this.taskForm.mainDeviceNames = ''
        this.taskForm.mainDeviceCount = 0
        this.chosenDeviceData = this.selected

        this.selectedNames.forEach((item, index) => {
          this.taskForm.mainDeviceNames += item + ','
          this.taskForm.mainDeviceCount++
        })
        this.taskForm.mainDeviceNames = this.taskForm.mainDeviceNames.substring(0, this.taskForm.mainDeviceNames.lastIndexOf(','))
        this.$message({
          showClose: true,
          message: '添加设备成功！',
          type: 'success'
        })
      }
    },
    //已选择的主设备
    selectChosen(selection) {
      this.deleteSelected = []
      this.deleteSelectedNames = []
      selection.forEach((item, index, arr) => {
        //删除的设备名
        this.deleteSelectedNames.push(item.deviceName)
      })
      console.log(this.deleteSelectedNames)
      this.deleteSelected = this.chosenDeviceData.filter((item, index, arr) => !this.deleteSelectedNames.includes(item.deviceName))

      console.log(this.chosenDeviceData)
      console.log(this.deleteSelected)
    },

    //删除已选
    removeSelected() {
      if (this.deleteSelected.length === this.chosenDeviceData.length) {
        this.$message({
          showClose: true,
          message: '请先选择要删除的设备！',
          type: 'warning'
        })
      } else {
        this.chosenDeviceData = []
        this.taskForm.mainDeviceNames = ''
        this.taskForm.mainDeviceCount = 0
        this.chosenDeviceData = this.deleteSelected
        this.deleteSelected.forEach((item, index) => {
          this.taskForm.mainDeviceNames += item.deviceName + ','
        })
        this.taskForm.mainDeviceCount = this.chosenDeviceData.length
        this.taskForm.mainDeviceNames = this.taskForm.mainDeviceNames.substring(0, this.taskForm.mainDeviceNames.lastIndexOf(','))
        this.$message({
          showClose: true,
          message: '删除设备成功！',
          type: 'success'
        })

      }
    },
    //删除已选择设备列表分页：
    chosenMainList() {

    },

    //关闭task drawer
    handleClose(done) {
      if (this.creatingTask) {
        return
      }
      this.$confirm('当前内容未保存，确定离开？').then(_ => {
        done()
      })
    },
    //关闭查看主设备drawer
    closeSelectedDrawer(done) {
      if (this.taskForm.mainDeviceCount > 0) {
        done()
      } else {
        this.$confirm('当前未添加主设备，确定离开？').then(_ => {
          done()
        })
      }
    },

    //查看已选择的主设备
    editChosenMain() {
      if (this.taskForm.mainDeviceCount > 0) {
        this.mainChosenVisible = true
      } else {
        this.$message({
          showClose: true,
          message: '还未添加任何主设备，清先添加主设备！',
          type: 'warning'
        })
      }
    },

    //清空已选择的主设备
    removeMainDevice() {
      this.taskForm.mainDeviceNames = undefined
      this.taskForm.mainDeviceCount = 0
    },

    //第一个drawer表单详情
    handleDetail(index, row) {

      this.taskDetailVisible = true
      this.detailQuery.taskId = row.taskId
      this.exQuery.taskId = row.taskId
      this.exDeviceName = []
      this.mainDeviceName = []
      let names = row.mainDeviceNames.split(',')
      names.forEach((item, index) => {
        this.exDeviceName.push({
          label: item,
          value: item
        })
        this.mainDeviceName.push({
          label: item,
          value: item
        })

      })
      this.detailForm = Object.assign({}, row)
      this.detailForm.mainDeviceCount = names.length
      switch (this.detailForm.taskStatus) {
        case 2:
          this.canOperate = true
          this.canOperateText = '恢复'
          break
        case 1:
          this.canOperate = true
          this.canOperateText = '中止'
          break
        default:
          this.canOperate = false
      }
    },
    //操作任务
    operate() {
      let operateType = ''
      if (this.detailForm.taskStatus === 2) {
        operateType = '2'
      } else if (this.detailForm.taskStatus === 1) {
        operateType = '1'
      }
      let query = {
        taskId: this.detailForm.taskId,
        operateType: operateType,
        currentUser: JSON.parse(sessionStorage.getItem('userInfo')).userId
      }
      operateTask(query).then(res => {
        if (res.data.success) {
          this.taskDetailVisible = false
        }
        this.$message({
          showClose: true,
          message: res.data.message,
          type: res.data.success ? 'success' : 'error'
        })

      })
    },

    //ex drawer
    handleExTable() {
      this.exDetailVisible = true
      this.exSearch()
    },
    //查看ota详情
    handleExDetail(index, row) {
      this.subDetailVisible = true
      this.detailLoading = true
      this.detailQuery.mainDeviceName = row.mainDeviceName
      this.detailSearch()
    },
    exSearch() {
      this.exDetailLoading = true
      getExDetail(this.exQuery).then(response => {
        if (response.data.data !== null) {
          this.exData = response.data.data.records
          this.exTotal = response.data.data.total
        } else {
          this.$message({
            showClose: true,
            message: '获取失败!',
            type: 'error'
          })
        }
      })
      this.exDetailLoading = false
    },
    reExSearch() {
      this.exQuery.mainDeviceName = undefined
      this.exQuery.taskStatus = undefined
      this.exSearch()
    },
    renderExStatus(row) {
      return renderExTaskStatus(row.taskStatus)
    },
    renderExSend(row) {
      return renderSendStatus(row.sendStatus)
    },
    renderExEndTime(row) {
      return renderTime(row.updateTime)
    },
    //ex drawer
    handleDetailTable() {
      this.subDetailVisible = true
      this.detailLoading = true
      this.detailSearch()
    },

    // OTA索索第3层
    detailSearch() {
      this.detailData = null
      getOtaDetail(this.detailQuery).then(response => {
        if (response.data.data !== null) {
          if (response.data.data.records !== null) {
            this.detailData = response.data.data.records
            this.detailTotal = response.data.data.total
          }
        } else {
          this.$message({
            showClose: true,
            message: '获取失败!',
            type: 'error'
          })
        }
      })
      this.detailLoading = false
    },
    reDetailSearch() {
      this.detailQuery.mainDeviceName = undefined
      this.detailQuery.subDeviceName = undefined
      this.detailQuery.otaStatus = undefined
      this.detailSearch()
    },
    handleSubClose(done) {
      done()
    },
    cancelDetail() {
      this.taskDetailVisible = false
    },

    cancelOta() {
      this.otaDialogVisible = false
    },
    //第三个drawer
    handleItemDetail(index, row) {
      this.itemForm = {}
      this.itemDetailVisible = true
      this.searchSubDevice(row.subDeviceName)
    },
    searchSubDevice(query) {
      getSubDevice(query).then(res => {
        if (res.data !== null) {
          if (res.data.data != null) {
            this.itemForm = res.data.data
          }
        } else {
          this.$message({
            showClose: true,
            message: '获取失败!',
            type: 'error'
          })
        }
      })
    },
    //关闭第三个drawer
    cancelItem() {
      this.itemDetailVisible = false
    },
//清除OTA 表单
    resetMainTemp() {
      this.taskForm.deviceType = ''
      this.taskForm.factoryName = ''
      this.taskForm.hardVersion = ''
      this.taskForm.softVersion = ''
      this.taskForm.productModel = ''
    },

    //渲染
    renderTaskStatus(row) {
      return renderTaskStatus(row.taskStatus)
    },
    renderBeginTime(row) {
      return renderTime(row.beginTime)
    },
    renderEndTime(row) {
      return renderTime(row.endTime)
    },
    renderCreateTime(row) {
      return renderTime(row.createTime)
    },
    renderUpdateTime(row) {
      return renderTime(row.updateTime)
    },
    renderOtaEndTime(row) {
      return renderTime(row.updateTime)
    },

//重置搜索
    //list表格
    reSearch() {
      this.listQuery.factoryName = undefined
      this.listQuery.deviceType = undefined
      this.listQuery.productModel = undefined
      this.listQuery.hardVersion = undefined
      this.listQuery.taskId = undefined
      this.getList()
    },

    //Excel
    handleExcel(ex) {
      this.getExcel = true
      let query = ''
      ex ? query = { taskId: this.exQuery.taskId } : query = { taskId: this.detailQuery.taskId }
      exportExcel(query, ex).then(res => {
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })
        const fileName = ex ? '子设备任务表.xlsx' : '子设备OTA表.xlsx'
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      })
      this.getExcel = false

    }
  }
}
</script>
<style scoped>

.drawer-content {
  display: flex;
  flex-direction: column;
  padding: 16px 40px 8px 40px;
  height: 100%;
}

.drawer-footer {
  display: flex;
}

.drawer-footer div {
  flex: 1;
}

.ota-task-title {
  padding: 16px;
  color: #409EFF;
}

.detail-form {
  padding: 20px;
}

.detail-table {
  margin: 1%;
  width: 98%;
}
</style>
