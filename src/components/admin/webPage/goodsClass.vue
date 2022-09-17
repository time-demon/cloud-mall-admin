<!-- 后台 商品列表 -->
<template>
    <div>

        <webPageTitle></webPageTitle>

        <div class="mainBox">

            <!-- 统一操作按钮 -->
            <div class="operationBox">

                <el-button class="goodsClassAddButton" type="primary" icon="el-icon-plus" @click="addGoods"
                    :disabled="goodsClassAddButoon">添加分类
                </el-button>
                <el-button type="danger" icon="el-icon-delete" @click="del"
                    :disabled="goodsClassDataLength == 0 || goodsDelButoon == true ? true : false">
                    删除
                </el-button>
                <el-button icon="el-icon-refresh-right" circle @click="refreshTable" :loading="refreshTableButton"
                    :disabled="refreshTableButton" style="float: right;">
                </el-button>

            </div>
            <!-- 统一操作按钮 -->

            <!-- 商品分类表格 -->
            <el-table :default-sort="{ prop: 'sort', order: 'descending' }"
                :data="goodsClassData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" border
                style="width:max-content" v-loading="loading" ref="queryForm" @sort-change="sortChange">

                <el-table-column fixed type="selection" align="center" width="55">
                </el-table-column>

                <el-table-column prop="[seen,name]" align="center" label="分类状态" width="160" sortable>
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.seen == 'true' ? 'success' : 'danger'">
                            {{ scope.row.seen == 'true' ? '显示中' : '已隐藏' }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="name" align="center" label="分类名称" width="120" :show-overflow-tooltip="true"
                    sortable>
                </el-table-column>

                <el-table-column prop="img" align="center" label="分类图片" width="100">
                    <template slot-scope="scope">
                        <el-image :src="'http://localhost:3000/upload/' + scope.row.img"
                            style="width: max-content;max-width:-webkit-fill-available;height: -webkit-fill-available; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                            <div slot="error" class="image-slot"
                                style="height: 100%; display: flex; align-items: center;">
                                <i class="el-icon-picture-outline">&nbsp;<span style="font-size: 12px;">暂无图片</span></i>
                            </div>
                        </el-image>
                    </template>
                </el-table-column>

                <el-table-column prop="" align="center" label="商品数量" width="120" sortable>
                    <template slot-scope="scope">
                        {{ pp.filter(item => { return item.class == scope.row.name }).length + '个' }}
                    </template>
                </el-table-column>

                <el-table-column prop="addTime" align="center" label="添加日期" width="180" :show-overflow-tooltip="true"
                    sortable>
                </el-table-column>


                <el-table-column fixed="right" prop="sort" align="center" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click.native.prevent="thisClassGoods(scope)">商品</el-button>
                        <el-button type="text" size="small"
                            @click.native.prevent="thisGoodsEdit(scope, 'goodsClassForm')">编辑
                        </el-button>
                        <el-button type="text" size="small" @click.native.prevent="thisGoodsDel(scope)">删除
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
            <!-- 商品分类表格 -->

            <div style="margin-top: 15px;">
                <el-pagination style="text-align: left;" align='center' background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 20, 100]"
                    :page-size="1" layout="total, sizes, prev, pager, next, jumper" :total="goodsClassData.length">
                </el-pagination>
            </div>

        </div>

        <!-- 弹窗表单 -->
        <el-dialog :title="popupFormName" :visible.sync="dialogFormVisible" :width="popup.width" :showClose="false"
            :closeOnClickModal="false" customClass="my-dialog">

            <el-form :rules="rules" :model="goodsClassForm" label-width="80px" ref="goodsClassForm">

                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="goodsClassForm.name" placeholder="点我输入内容..."
                        onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
                </el-form-item>

                <el-form-item label="是否显示" style="width:auto;;display: inline-block;" prop="seen">
                    <el-switch v-model="goodsClassForm.seen"></el-switch>
                </el-form-item>

                <el-form-item label="分类图片" prop="img">
                    <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="goodsClassForm.img" :src="'http://localhost:3000/upload/' + goodsClassForm.img"
                            class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('goodsClassForm')">取 消</el-button>
                <el-button type="primary" @click="submit('goodsClassForm')">确 定</el-button>
            </div>

        </el-dialog>
        <!-- 弹窗表单 -->

    </div>
</template>

<script>
import network from "@/network";// 引入axios网络模块
import webPageTitle from '@/components/admin/webPageTitle.vue';
export default {
    components: {
        webPageTitle
    },
    data() {
        return {
            parameter: {},// 地址栏后带的参数
            currentPage: 1, // 当前页码
            pageSize: 5, // 每页的数据条数
            oldClass: '',// 修改分类名称时的老名称
            popupFormName: "",// 弹窗表单名称
            goodsClassData: [],// 商品分类数组
            goodsClassDataLength: '',// 商品分类数组长度
            goodsClassAddButoon: false,// 商品分类添加按钮是否不可用
            goodsDelButoon: false,// 商品分类删除按钮是否不可用
            popup: [// 弹窗的样式数组
                {
                    width: "400px",
                }
            ],
            dialogFormVisible: false,// 弹窗的开启或关闭
            loading: "true",// 遮罩的开启与关闭
            goodsClassForm: {// 弹窗表单的数据
                addTime: "",
                img: "",
                name: "",
                notice: "",
                seen: true,
                sort: '',
            },
            rules: {// 表单验证规则
                name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                ],
            },
            _id: "",// 商品分类 _id 临时存放
            pp: [],
            refreshTableButton: false,// 刷新表格按钮状态
        }
    },
    mounted() {

        // 挂载后执行商品列表数据渲染函数
        setTimeout(() => {
            this.dataRender(200);
        }, 200);

        // 获取地址后的参数=
        let parameter = {};
        decodeURI(window.location.search.substr(0)).slice(1).split('&').map((query) => {
            let temp = query.split('=');
            if (temp.length > 1) {
                parameter[temp[0]] = temp[1];
            }
        })
        this.parameter = JSON.stringify(parameter);
        console.log(77, this.parameter);

    },
    watch: {
        $route(now, old) {
            // now: 变化之后的数据
            // old: 变化之前的数据
            if (now != old) {
                let parameter = {};
                decodeURI(window.location.search.substr(0)).slice(1).split('&').map((query) => {
                    let temp = query.split('=');
                    if (temp.length > 1) {
                        parameter[temp[0]] = temp[1];
                    }
                })
                this.parameter = JSON.stringify(parameter);
                this.dataRender(100)
            }
        },
    },
    methods: {

        // 表格排手动序筛选
        sortChange(column) {
            this.pageIndex = 1; // 排序后返回第一页
            if (column.order === "descending") {
                this.goodsClassData.sort((a, b) => b[column.prop] - a[column.prop]);
            } else if (column.order === "ascending") {
                this.goodsClassData.sort((a, b) => a[column.prop] - b[column.prop]);
            }
        },

        // 分页操作
        handleSizeChange(val) {
            this.currentPage = 1;
            this.loading = true;
            setTimeout(() => {
                this.loading = false;
                this.pageSize = val;
            }, 500);
        },

        //当前页改变时触发 跳转其他页
        handleCurrentChange(val) {
            this.loading = true;
            setTimeout(() => {
                this.loading = false;
                this.currentPage = val;
            }, 500);
        },

        // 清空表单方法
        fromClear(formName) {
            this.$refs[formName].resetFields();// 清空表单
            this.free = false;
            this.goodsClassForm.delivery = [];
            this._id = "";

            this.goodsClassForm = {// 弹窗表单的数据
                addTime: "",
                img: "",
                name: "",
                notice: "",
                seen: true,
                sort: '',
            };
        },

        // 回到后台首页
        homeGo() {
            this.$router.push("/admin");
        },

        // 刷新表格按钮
        refreshTable() {
            this.loading = true;
            this.refreshTableButton = true;
            this.parameter = JSON.stringify({});
            this.dataRender(100);
            setTimeout(() => {
                this.refreshTableButton = false;
                this.$router.push("goodsList");
            }, 100)
        },

        // 图片上传 上传成功后
        handleAvatarSuccess(res, file) {
            this.goodsClassForm.img = res.url;
        },
        // 图片上传 上传前
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },

        // 添加商品分类按钮
        addGoods() {
            this.popupFormName = "添加分类";
            this.goodsClassAddButoon = true;
            this.dialogFormVisible = true;
        },

        // 查看当前分类的商品
        thisClassGoods(scope) {
            this.$router.push(`goodsList?class=${scope.row.name}`)
        },

        // 编辑选中的商品分类
        thisGoodsEdit(scope, formName) {
            this.popupFormName = "编辑分类";
            this.goodsClassAddButoon = true;
            this.dialogFormVisible = true;
            this._id = scope.row._id;
            this.oldClass = scope.row.name;
            this.goodsClassForm = { // 弹窗表单的数据
                seen: JSON.parse(scope.row.seen),
                addTime: scope.row.addTime,
                name: scope.row.name,
                img: scope.row.img,
            };
        },

        // 统一删除商品分类按钮
        del() {
            if (this.$refs.queryForm.selection.length == 0) {
                this.$message({
                    message: '请先选择需要删除的数据！',
                    showClose: true,
                    type: 'error',
                    duration: 2000,
                });
            } else {
                this.loading = true;
                let ppd = this.$refs.queryForm.selection
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    for (let i = 0; i < ppd.length; i++) {
                        this.delGoods(ppd[i]._id);
                    }
                    this.goodsDelButoon = true;
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                    this.loading = false;
                    this.goodsDelButoon = false;
                });
            }
        },

        // 删除选中的商品分类
        thisGoodsDel(scope) {
            this.goodsDelButoon = true;
            this.loading = true;
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delGoods(scope.row._id);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
                this.loading = false;
                this.goodsDelButoon = false;
            });
        },

        // 删除商品分类方法
        delGoods(_id) {
            network({
                method: "delete",
                url: "/goodsClass/del",
                params: {
                    _id: _id,
                }
            }).then(res => {
                if (res.code == 200) {
                    setTimeout(() => {
                        this.$message({
                            message: '成功删除！',
                            showClose: true,
                            type: 'success',
                            duration: 1000,
                        });
                        this.dataRender(200);
                        this.goodsDelButoon = false;
                    }, 200)
                    this.dataRender(500);
                } else {
                    this.$message({
                        message: '未知错误！',
                        showClose: true,
                        type: 'error',
                        duration: 2000,
                    });
                    this.goodsDelButoon = false;
                }
            })
        },

        // 商品分类数据渲染方法
        dataRender(time) {
            console.log(23, this.parameter);
            if (this.parameter == '{}' && window.location.search == "") {
                network({
                    method: "get",
                    url: "/goodsList/getData"
                }).then(res => {
                    this.pp = res.data;
                })
                delete this.goodsClassForm._id;
                network({
                    method: "get",
                    url: "/goodsClass/getData"
                }).then(res => {
                    if (res.code == 200) {
                        this.loading = true;
                        setTimeout(() => {
                            this.loading = false;
                            this.goodsClassData = res.data;
                            this.goodsClassDataLength = res.data.length;// 商品列表数据数组长度
                        }, time)
                    } else {
                        setTimeout(() => {
                            this.$message({
                                message: '未知错误！数据无法访问',
                                showClose: true,
                                type: 'error',
                                duration: 2000,
                            });
                        }, 500)
                    }
                });
            } else {

                network({
                    method: "get",
                    url: "/goodsList/getData",
                    params: {
                        class: JSON.parse(this.parameter).class
                    }
                }).then(res => {
                    this.pp = res.data;
                })
                delete this.goodsClassForm._id;
                network({
                    method: "get",
                    url: "/goodsClass/getData",
                    params: JSON.parse(this.parameter)
                }).then(res => {
                    if (res.code == 200) {
                        this.loading = true;
                        setTimeout(() => {
                            this.loading = false;
                            this.goodsClassData = res.data;
                            this.goodsClassDataLength = res.data.length;// 商品列表数据数组长度
                        }, time)
                    } else {
                        setTimeout(() => {
                            this.$message({
                                message: '未知错误！数据无法访问',
                                showClose: true,
                                type: 'error',
                                duration: 2000,
                            });
                        }, 500)
                    }
                });
            }
        },

        // 弹窗表单取消按钮
        resetForm(formName) {
            this.dialogFormVisible = false;
            this.goodsClassAddButoon = false;
            this.fromClear(formName);
        },

        // 弹窗表单确认按钮
        submit(formName) {
            if (this.popupFormName == "添加分类") {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.goodsClassAddButoon = false;
                        this.goodsClassForm.sort = new Date().getTime();
                        this.goodsClassForm.addTime = new Date().getFullYear() + '/' + new Date().getMonth() + '/' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
                        network({
                            method: "post",
                            url: "/goodsClass/add",
                            params: this.goodsClassForm,
                        }).then(res => {
                            this.dataRender(500);
                            this.fromClear(formName);
                        })
                    } else {
                        return false;
                    }
                    this.dialogFormVisible = false;
                });
            } else if (this.popupFormName == "编辑分类") {
                this.$refs[formName].validate((valid) => {
                    this.goodsClassForm._id = this._id;
                    if (valid) {
                        this.goodsClassAddButoon = false;
                        const oldClass = this.oldClass;
                        const newClass = this.goodsClassForm.name;
                        network({
                            method: "put",
                            url: "/goodsClass/update",
                            params: this.goodsClassForm,
                        }).then(res => {
                            this.dataRender(500);
                            this.fromClear(formName);
                            network({// 实现改变分类名称时动态改变相应商品的分类名称
                                method: "get",
                                url: "/goodsList/getData",
                                params: {
                                    class: oldClass
                                }
                            }).then(res => {
                                if (res.code == 200) {
                                    for (let i = 0; i < res.data.length; i++) {
                                        console.log(res.data[i]._id);
                                        console.log(newClass);
                                        network({
                                            method: "put",
                                            url: "/goodsList/update",
                                            params: {
                                                _id: res.data[i]._id,
                                                class: newClass
                                            }
                                        })
                                    }
                                };
                            })
                        })
                    } else {
                        return false;
                    }
                    this.dialogFormVisible = false;
                });
            };
        },

    },
}
</script>

<style lang="scss" scoped>
.mainBox {

    // background: orange;
    >.operationBox {
        margin-bottom: 20px;

        >.goodsClassAddButton {
            background: var(--themeBackColor);
            border: 1px solid var(--themeBackColor);
        }
    }
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border: 1px dashed #d9d9d9;
}

.avatar {
    width: 150px;
    height: 150px;
    display: block;
    box-shadow: 0 1px 3px rgb(0 0 0 / 15%);
}
</style>