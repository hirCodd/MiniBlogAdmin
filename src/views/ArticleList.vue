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
                <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" v-for="(o, index) in 8" :key="o" :offset="index > 0 ? 0 : 0">
                    <el-card :body-style="{ padding: '0px' }">
                        <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image" style="width: 100%">
                        <div style="padding: 14px;">
                            <span>好吃的汉堡</span>
                            <div class="bottom">
                                <time class="time">{{ currentDate }}</time>
                                <el-button type="text" class="button">操作按钮</el-button>
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

export default {
    name: "article",
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
        }
    },
    methods: {

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
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

</style>