<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 文章发布</el-breadcrumb-item>
                <el-breadcrumb-item>markdown编辑器</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row :gutter="20" :type="flex">
                <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" v-for="(item, key, index) in articles" :key="key" :offset="index > 0 ? 0 : 0">
                    <el-card :body-style="{ padding: '0px' }">
                        <img :src="item.thumb" class="image" style="width: 100%">
                        <div style="padding: 14px;">
                            <span>{{item.id}}.{{item.title}}</span>
                            <div class="bottom">
                                <time class="time">{{ item.publishTime }}</time>
<!--                                <el-button type="primary" icon="el-icon-edit" round>编辑</el-button>-->
<!--                                <el-button type="danger" icon="el-icon-delete" round>删除</el-button>-->
                                <div class="operator-button">
                                    <el-button type="primary" icon="el-icon-edit" round></el-button>
                                    <el-button type="danger" icon="el-icon-delete" round></el-button>
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
        </div>
    </div>
</template>
<script>
// import mavonEditor  from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'
// import service from "../utils/request";

import {getArticles} from "../api";

export default {
    name: "article-list",
    components: {
        // mavonEditor
    },
    data: function(){
        return {
            currentDate: new Date(),
            pageTotal: 0,
            query: {
                address: "",
                name: "",
                pageIndex: 1,
                pageSize: 10
            },
            articles: []
        }
    },
    created() {
        console.log("create")
    },
    activated() {
        var that = this;
        getArticles().then(res => {
            that.articles = res.data
            console.log(res)
        })
    },
    methods: {
        handlePageChange() {

        }
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

</style>