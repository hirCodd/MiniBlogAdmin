<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 文章系统</el-breadcrumb-item>
                <el-breadcrumb-item>文章分类管理器</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-delete"
                        class="handle-del mr10"
                        @click="addCategory"
                >新增分类</el-button>
                <el-select  placeholder="地址" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>
                <el-input  placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
<!--                <el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="一级分类"></el-table-column>
                <el-table-column label="二级分类">
                    <template #default="scope">￥{{ scope.row.money }}</template>
                </el-table-column>
                <el-table-column label="文章缩略图(查看大图)" align="center">
                    <template #default="scope">
                        <el-image
                                class="table-td-thumb"
                                :src="scope.row.thumb"
                                :preview-src-list="[scope.row.thumb]"
                        ></el-image>
                    </template>
                </el-table-column>
<!--                <el-table-column prop="address" label="地址"></el-table-column>-->
                <el-table-column label="状态" align="center">
                    <template #default="scope">
                        <el-tag
                                :type="
                                scope.row.state === '成功'
                                    ? 'success'
                                    : scope.row.state === '失败'
                                    ? 'danger'
                                    : ''
                            "
                        >{{ scope.row.state }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="date" label="发布时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageIndex"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" v-model="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!--新增分类-->
        <el-dialog title="新增分类" v-model="addCategoryVisible" width="40%">
            <el-form ref="form" :model="categoryForm" label-width="120px">
                <el-form-item label="分类名称">
                    <el-input v-model="categoryForm.name"></el-input>
                </el-form-item>
                <el-form-item label="分类缩略图">
                    <el-upload
                            class="upload-demo"
                            action="http://localhost:8090/api/admin/file/gitee/upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="handlerUpload"
                            :file-list="form.fileList"
                            :limit="1"
                            list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <template #tip>
                            <div class="el-upload__tip">
                                只能上传 jpg/png 文件，且不超过 500kb
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item label="是否为根目录">
                    <el-switch v-model="isRoot" @change="changeCategory"></el-switch>
                </el-form-item>
                <div v-if="!isRoot">
                    <el-form-item label="文章分类">
                        <el-select v-model="form.categories"
                                   placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
            <el-button class="editor-btn" type="primary">提交</el-button>
        </el-dialog>
    </div>
</template>
<script>
    import { fetchData } from "../api/index";
    import service from "../utils/request";
    export default {
        name: "basetable",
        data() {
            return {
                addCategoryVisible: false,
                categoryForm: {},
                query: {
                    address: "",
                    name: "",
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,

                pageTotal: 0,
                form: {},

                idx: -1,
                id: -1,
                isRoot: true,
                options: [{
                    key: '1',
                    value: 'Java基础',
                }, {
                    key: '2',
                    value: 'Jvm专题'
                }, {
                    key: 'java-interview',
                    value: 'Java面试'
                }, {
                    key: 'spring',
                    value: 'Spring专题'
                }, {
                    key: 'springboot',
                    value: 'springboot专题'
                }, {
                    key: 'springcloud',
                    value: 'springcloud专题'
                }, {
                    key: 'network',
                    value: '网络编程'
                }, {
                    key: 'web',
                    value: 'web前端'
                }, {
                    key: 'other',
                    value: '技术杂谈'
                }]
            };
        },
        created() {
            this.getData();
        },
        methods: {
            changeCategory() {
                console.log(this.isRoot)
            },
            handleRemove(file, fileList) {

                console.log(file.response.data);
                service.post('http://localhost:8090/api/admin/file/gitee/delete', {
                    path: file.response.data
                }).then(() => {
                    console.log("delete")
                })
                console.log(fileList)
            },
            handlePreview(file) {
                console.log(file);
            },
            handlerUpload(response, file, fileList) {
                console.log(response)
                // this.form.fileList.push(response.data)
                console.log(fileList, file)
            },

            // 获取 easy-mock 的模拟数据
            getData() {
                fetchData(this.query).then(res => {
                    console.log(res);
                    this.tableData = res.list;
                    this.pageTotal = res.pageTotal || 50;
                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, "pageIndex", 1);
                this.getData();
            },
            // 删除操作
            addCategory() {
                this.addCategoryVisible = true;
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                const length = this.multipleSelection.length;
                let str = "";
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + " ";
                }
                this.$message.error(`删除了${str}`);
                this.multipleSelection = [];
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                this.$set(this.tableData, this.idx, this.form);
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, "pageIndex", val);
                this.getData();
            }
        }
    };
</script>
<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>
