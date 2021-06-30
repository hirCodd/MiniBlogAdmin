<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 文章发布</el-breadcrumb-item>
                <el-breadcrumb-item>markdown编辑器</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="plugins-tips">
                <p class="title">Markdown格式文章发布系统</p>
            </div>
            <el-form ref="form"  label-width="120px">
                <el-form-item label="文章标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="文章作者">
                    <el-input v-model="form.author"></el-input>
                </el-form-item>
                <el-form-item label="文章缩略图">
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
                <el-form-item label="默认显示所有Tag">
                    <div class="block">
<!--                        <span class="demonstration">默认显示所有Tag</span>-->
                        <el-cascader
                                v-model="form.categories"
                                :options="options2"
                                :props="props"
                                clearable></el-cascader>
                    </div>
                </el-form-item>
<!--                <el-form-item label="文章分类">-->
<!--                    <el-select v-model="form.categories"-->
<!--                               multiple-->
<!--                               placeholder="请选择">-->
<!--                        <el-option-->
<!--                                v-for="item in options"-->
<!--                                :key="item.key"-->
<!--                                :label="item.value"-->
<!--                                :value="item.value">-->
<!--                        </el-option>-->
<!--                    </el-select>-->
<!--                </el-form-item>-->
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
                <el-form-item label="文章发布时间">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.publishDate" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="文章是否置顶">
                    <el-switch v-model="form.isTop"></el-switch>
                </el-form-item>
                <el-form-item label="文章内容">
                    <v-md-editor v-model="form.content" height="600px"></v-md-editor>
                </el-form-item>
            </el-form>
            <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
        </div>
    </div>
</template>
<script>
// import mavonEditor  from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'
import service from "../utils/request";

export default {
    name: "article",
    components: {
        // mavonEditor
    },
    data: function(){
        return {
            form: {
                title: '',
                author: '',
                fileList: [],
                categories: [],
                tags: [],
                publishDate: '',
                isTop: false,
                content: '',
                thumb: ''
            },
            inputVisible: false,
            inputValue: '',
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
            }],
            options2: [{
                value: 1,
                label: '东南',
                children: [{
                    value: 2,
                    label: '上海',
                    children: [
                        { value: 3, label: '普陀' },
                        { value: 4, label: '黄埔' },
                        { value: 5, label: '徐汇' }
                    ]
                }, {
                    value: 7,
                    label: '江苏',
                    children: [
                        { value: 8, label: '南京' },
                        { value: 9, label: '苏州' },
                        { value: 10, label: '无锡' }
                    ]
                }, {
                    value: 12,
                    label: '浙江',
                    children: [
                        { value: 13, label: '杭州' },
                        { value: 14, label: '宁波' },
                        { value: 15, label: '嘉兴' }
                    ]
                }]
            }, {
                value: 17,
                label: '西北',
            }],
            value: [],
            props: { multiple: true },
        }
    },
    methods: {
        handlerUpload(response, file, fileList) {
            console.log(response)
            this.form.thumb = response.data;
            // this.form.fileList.push(response.data)
            console.log(fileList, file)
        },
        submit(){
            console.log(this.form)
            service.post('/admin/article/publish', {
                'title': this.form.title,
                'author': this.form.author,
                'thumb': this.form.thumb,
                'categories': this.form.categories,
                'tags': this.form.tags,
                'publishDate': this.form.publishDate,
                'isTop': this.form.isTop,
                'content': this.form.content
            })
            // service.post('/article/publish', {
            //     'title': this.title,
            //     'author': this.author,
            //     'tags': this.dynamicTags.toString(),
            //     'category': this.category.toString(),
            //     'content': this.content
            // });
            this.$message.success('提交成功！');
        },
        // 处理标签功能
        handleClose(tag) {
            this.form.tags.splice(this.form.tags.indexOf(tag), 1);
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
        // 文章缩略图
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
        }
    }

};
</script>
<style lang="scss">
.container {
    .plugins-tips {
        padding: 10px 10px;
    }
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
.title {
    text-align: center;
    font-size: 24px;
    font-weight: 700;
}
</style>