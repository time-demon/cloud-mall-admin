<!-- 富文本编辑器 -->
<template>
    <div>
        <quill-editor ref="myGQuillEditor" v-model="content" :options="editorOption" class="editor" @blur="onEditorBlur"
            @focus="onEditorFocus" @change="onEditorChange">
        </quill-editor>

        <el-upload drag multiple class="quill-upload" :on-success="quillSuccess" action="/api/upload"
            style="display: none;">
            <!-- <el-button size="small" type="primary">点击上传</el-button> -->
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
    </div>
</template>

<script>

const toolbarOptions = [
    // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
    ['bold', 'italic', 'underline', 'strike'],
    // 引用  代码块-----['blockquote', 'code-block']
    ['blockquote', 'code-block'],
    // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
    [{ header: 1 }, { header: 2 }],
    // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
    [{ list: 'ordered' }, { list: 'bullet' }],
    // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
    [{ script: 'sub' }, { script: 'super' }],
    // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
    [{ indent: '-1' }, { indent: '+1' }],
    // 文本方向-----[{'direction': 'rtl'}]
    [{ direction: 'rtl' }],
    // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
    [{ size: ['small', false, 'large', 'huge'] }],
    // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
    [{ color: [] }, { background: [] }],
    // 字体种类-----[{ font: [] }]
    [{ font: [] }],
    // 对齐方式-----[{ align: [] }]
    [{ align: [] }],
    // 清除文本格式-----['clean']
    ['clean'],
    // 链接、图片、视频-----['link', 'image', 'video']
    ['link', 'image', 'video'],
    ['clean'] // remove formatting button
]

export default {
    data() {
        return {
            content: '',
            editorOption: {
                modules: {
                    toolbar: {
                        container: toolbarOptions,
                        handlers: {
                            // 重写点击组件上的图片按钮要执行的代码
                            'image': function (value) {
                                document.querySelector('.quill-upload .el-icon-upload').click()
                            }
                        }
                    }
                },
                theme: 'snow',
                placeholder: '选填',
                // Some Quill optiosn...
            },
        }
    },

    methods: {

        quillSuccess(response) {
            if (response) {
                // 获取文本编辑器
                // console.log(this.$refs);
                const quill = this.$refs.myGQuillEditor.quill
                // 获取光标位置
                const pos = quill.getSelection().index
                // 插入图片到光标位置
                console.log(response);
                quill.insertEmbed(pos, 'image', 'http://localhost:3000/upload/' + response.url)
            } else {
                this.$essage.error('图片插入失败')
            }
        },

        // 失去焦点事件
        onEditorBlur(e) {
            console.log(1, 'onEditorBlur: ', e)
        },
        // 获得焦点事件
        onEditorFocus(e) {
            console.log(2, 'onEditorFocus: ', e)
        },
        // 内容改变事件
        onEditorChange(e) {
            console.log(3, 'onEditorChange: ', e)
            this.content = e.html;
        },
    }
}
</script>

<style lang="scss">
.ql-snow .ql-tooltip[data-mode=link]::before {
    content: "请输入链接地址:" !important;
}

.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px !important;
    content: '保存' !important;
    padding-right: 0px !important;
}

.ql-snow .ql-tooltip[data-mode=video]::before {
    content: "请输入视频地址:" !important;
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: '14px' !important;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
    content: '10px' !important;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
    content: '18px' !important;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
    content: '32px' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: '文本' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: '标题1' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: '标题2' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: '标题3' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: '标题4' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: '标题5' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: '标题6' !important;
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: '标准字体' !important;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
    content: '衬线字体' !important;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
    content: '等宽字体' !important;
}

.ql-toolbar {
    line-height: 0;

    >.ql-formats {
        margin-right: 0 !important;

        .ql-picker-item {
            line-height: 20px;
        }
    }
}

.ql-editor {
    min-height: 100px;

    img {
        height: 150px !important;
    }
}
</style>