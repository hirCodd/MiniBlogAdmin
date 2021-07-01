<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 文章发布</el-breadcrumb-item>
                <el-breadcrumb-item>markdown编辑器</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row :gutter="20">
                <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" v-for="(item, key, index) in articles" :key="key" :offset="index > 0 ? 0 : 0">
                    <el-card :body-style="{ padding: '0px' }">
                        <img :src="item.thumb" class="image" style="width: 100%">
                        <div style="padding: 14px;">
                            <span>{{item.id}}.{{item.title}}</span>
                            <div class="bottom">
                                <time class="time">{{ item.publishTime }}</time>
                                <div class="operator-button">
                                    <el-button type="primary" icon="el-icon-edit" @click="handlerEdit(item.id)" round></el-button>
                                    <el-button type="danger" icon="el-icon-delete" @click="deleteArticle(item.id)" round></el-button>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
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
            <div class="edit-article">
                <el-dialog title="新增分类" v-model="editArticleVisible" width="60%">
                    <el-form ref="form" label-width="120px">
                        <el-form-item label="文章标题">
                            <el-input v-model="form.title"></el-input>
                        </el-form-item>
                        <el-form-item label="文章标签">
                            <el-tag
                                    :key="tag"
                                    v-for="tag in form.tags"
                                    closable
                                    :disable-transitions="false"
                                    @close="handleClose(tag)">
                                {{tag}}
                            </el-tag>
                            <el-input
                                    class="input-new-tag"
                                    v-if="inputVisible"
                                    v-model="inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter="handleInputConfirm"
                                    @blur="handleInputConfirm"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                        </el-form-item>
                        <el-form-item label="文章是否置顶">
                            <el-switch v-model="form.isTop"></el-switch>
                        </el-form-item>
                        <el-form-item label="文章内容">
                            <v-md-editor v-model="form.content" height="600px"></v-md-editor>
                        </el-form-item>
                    </el-form>
                    <el-button class="editor-btn" type="primary">提交</el-button>
                </el-dialog>
            </div>
        </div>

    </div>
</template>
<script>
// import mavonEditor  from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'
// import service from "../utils/request";

import {deleteArticleById, getArticeById, getArticles} from "../api";

export default {
    name: "article-list",
    components: {
        // mavonEditor
    },
    data: function(){
        return {
            pageTotal: 0,
            query: {
                address: "",
                name: "",
                pageIndex: 1,
                pageSize: 8
            },
            articles: [],
            editArticleVisible: false,
            inputVisible: false,
            inputValue: '',
            form: {
                title: "",
                author: "",
                tags: [],
                isTop: false,
                content: ""
            }
        }
    },
    created() {
        console.log("create")
    },
    activated() {
        var that = this;
        getArticles(this.query.pageIndex, this.query.pageSize).then(res => {
            that.articles = res.data.list;
            that.pageTotal = res.data.total;
            that.query.pageIndex = res.data.pageNum;
        })
    },
    methods: {
        handlePageChange(val) {
            var that = this;
            getArticles(val, this.query.pageSize).then(res => {
                that.articles = res.data.list;
                that.pageTotal = res.data.total;
                that.query.pageIndex = res.data.pageNum;
            })
        },
        handlerEdit(id) {
            // todo 修改category,修改完成后更新至数据库
            var that = this;
            this.editArticleVisible = true;
            getArticeById(id).then(res => {
                that.form.title = res.data.title;
                that.form.author = res.data.author;
                that.form.isTop = res.data.isTop;
                that.form.tags = res.data.tags.split(",")
                that.form.content = res.data.content;
                console.log(that.form)
            })
        },
        deleteArticle(id) {
            var that = this;
            deleteArticleById(id).then(res => {
                if (res.code === 20000) {
                    that.articles.forEach((item, index) => {
                        if (item.id === id) {
                            that.articles.splice(index, 1);
                        }
                    });
                    this.$message.success("删除成功");
                } else {
                    this.$message.error("删除成功");
                }
            })
        },
        showInput() {
            var that = this;
            this.inputVisible = true;
            this.$nextTick(function () {
                that.$refs.saveTagInput.$refs.input.focus();
            })
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.form.tags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
    }

};
</script>
<style lang="scss">
.container {
    .el-row {
        .el-col {
            margin-top: 20px;
        }
    }
}
.time {
    font-size: 13px;
    color: #999;
    float: left;
}
.tag {
    font-size: 13px;
    color: #999;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-button.is-round {
        padding: 5px 12px;
    }
}
.operator-button {
    display: flex;
    justify-content:flex-end;
}
.el-tag + .el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    /*vertical-align: bottom;*/
}

</style>