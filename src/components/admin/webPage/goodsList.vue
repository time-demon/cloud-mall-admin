<!-- 后台 商品列表 -->
<template>
    <div>

        <webPageTitle></webPageTitle>

        <div class="mainBox">

            <!-- 统一操作按钮 -->
            <div class="operationBox" style="display: flex; vertical-align: top;justify-content: space-between;">


                <div style="display: flex; vertical-align: top;">
                    <el-form :inline="true" :model="goodsListSearchForm" class="demo-form-block"
                        style="display: inline-block;margin: 0;" :style="{ width: goodsListSearchFormWidth }">
                        <el-form-item label="" style="margin: 0 10px 0 0;width: 145px;">
                            <el-select v-model="goodsListSearchForm.type" placeholder="选择搜索条件" clearable
                                @change="searchClass">
                                <el-option v-for="item in searchOptions" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="" style="margin: 0 10px 0 0;width: 145px;">
                            <el-input v-model="goodsListSearchForm.content" placeholder="输入查询内容"
                                @keyup.native.enter="onSubmit(goodsListSearchForm)" clearable v-if="searchContentInput">
                            </el-input>
                            <el-select v-model="goodsListSearchForm.content" placeholder="选择状态" v-if="searchSeenInput">
                                <el-option label="显示中" value="true"></el-option>
                                <el-option label="已隐藏" value="false"></el-option>
                            </el-select>
                            <el-select v-model="goodsListSearchForm.content" placeholder="选择状态" v-if="searchStateInput">
                                <el-option label="上架中" value="true"></el-option>
                                <el-option label="已下架" value="false"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item style="margin: 0 10px 0 0;">
                            <el-button type="primary" @click="onSubmit(goodsListSearchForm)">查询</el-button>
                        </el-form-item>
                        <el-form-item style="margin: 0 10px 0 0;">
                            <el-button icon="el-icon-arrow-left" circle size="mini" class="demo-form-none"
                                @click="goodsListSearchClick('false')"></el-button>
                        </el-form-item>
                    </el-form>
                    <el-button icon="el-icon-search" circle @click="goodsListSearchClick('true')"
                        v-show="goodsListSearchFormWidth == 0">
                    </el-button>

                    <el-button class="goodsAddButton" type="primary" icon="el-icon-plus" @click="addGoods"
                        :disabled="goodsAddButton">添加商品
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="del"
                        :disabled="goodsDataLength == 0 || goodsDelButoon == true ? true : false">
                        删除
                    </el-button>
                </div>
                <div>
                    <el-button icon="el-icon-refresh-right" circle @click="refreshTable" :loading="refreshTableButton"
                        :disabled="refreshTableButton" style="">
                    </el-button>
                </div>

            </div>
            <!-- 统一操作按钮 -->

            <!-- 商品列表表格 -->
            <el-table :default-sort="{ prop: 'gid', order: 'descending' }"
                :data="goodsListData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" style="width: 100%"
                v-loading="loading" ref="queryForm" @sort-change="sortChange">

                <el-table-column fixed type="selection" align="center" width="55" sortable='custom'>
                </el-table-column>

                <el-table-column prop="gid" align="center" label="gid" width="80" sortable>
                </el-table-column>

                <el-table-column prop="[seen,name]" align="center" label="商品状态" width="160">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.seen == 'true' ? 'success' : 'danger'"
                            @click="seenChange(scope, 'seen')" style="cursor: pointer;">
                            {{ scope.row.seen == 'true' ? '显示中' : '已隐藏' }}
                        </el-tag>&nbsp;
                        <el-tag :type="scope.row.state == 'true' ? 'success' : 'danger'"
                            @click="seenChange(scope, 'state')" style="cursor: pointer;">
                            {{ scope.row.state == 'true' ? '上架中' : '已下架' }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="class" align="center" label="所属分类" width="120" sortable>
                    <template slot-scope="scope">
                        <el-button icon="el-icon-close" circle size="mini"
                            style="position: absolute; z-index: 1; right: -11px; top: 0;"
                            v-if="goodsClassData.length != 0 && scope.$index == tabelTdGoodsIndex"
                            @click="abelTdGoodsClassClose"></el-button>
                        <el-select v-model="scope.row.class" placeholder="请选择"
                            v-if="goodsClassData.length != 0 && scope.$index == tabelTdGoodsIndex"
                            @change="($value) => goodsClassChange(scope, $value)" v-loading="tabelTdGoodsClassLoadng"
                            style="position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); width: 100%;">
                            <el-option v-for="(item, index) in goodsClassData" :key="item._id" :label="item.name"
                                :value="item.name">
                            </el-option>
                        </el-select>
                        <p @click="goodsClassClick(scope)" style="cursor: pointer;">
                            {{ scope.row.class }}
                        </p>
                    </template>
                </el-table-column>

                <el-table-column prop="name" header-align="center" label="商品名称" width="120"
                    :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-close" circle size="mini"
                            style="position: absolute; z-index: 1; right: -11px; top: 0;"
                            v-if="tabelTdGoodsNameIndex == scope.$index" @click="tabelTdGoodsNameClose"></el-button>
                        <el-button icon="el-icon-check" circle size="mini"
                            style="position: absolute; z-index: 1; left: -22px; top: 50%;transform: translateY(-50%);"
                            v-if="tabelTdGoodsNameIndex == scope.$index" @click="tabelTdGoodsNameYes(scope)">
                        </el-button>
                        <el-input placeholder="scope.row.name" v-model="scope.row.name"
                            v-if="tabelTdGoodsNameIndex == scope.$index"
                            @change="($value) => goodsNameChange(scope, $value)"
                            style="position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); width: 100%;">
                            ></el-input>

                        <p style="cursor: pointer;" @click="goodsNameClick(scope)"
                            v-if="tabelTdGoodsName != scope.row.name">{{ scope.row.name }}</p>
                    </template>
                </el-table-column>

                <el-table-column prop="img" align="center" label="商品图片" width="100">
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

                <el-table-column prop="price" align="center" label="售价(元)" width="100" sortable='custom'>
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.price == 0">{{ scope.row.price == 0 ? '免费商品' : '' }}</el-tag>
                        {{ scope.row.price == 0 ? '' : scope.row.price }}
                    </template>
                </el-table-column>
                <el-table-column prop="likesAmount" align="center" label="点赞量" width="100" sortable='custom'>
                    <template slot-scope="scope">
                        {{ scope.row.likesAmount }}
                    </template>
                </el-table-column>

                <el-table-column prop="amount" align="center" label="剩余库存" width="120" sortable='custom'>
                </el-table-column>

                <el-table-column prop="delivery" header-align="center" label="发货方式" width="160"
                    :show-overflow-tooltip="true" sortable>
                    <template slot-scope="scope">
                        <div style="display:flex;">
                            <span v-for="(itemDelivery, indexDelivery) in scope.row.delivery "
                                class="el-tag el-tag--plain "
                                :class="{ 'el-tag--info': indexDelivery == 1, 'el-tag--success': indexDelivery == 0 && itemDelivery != '自营' }"
                                style="margin-right: 0px;">
                                {{ itemDelivery }}
                            </span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="gid" align="center" label="添加日期" width="180" :show-overflow-tooltip="true"
                    sortable="custom">
                    <template slot-scope="scope">
                        <div>
                            {{ scope.row.addTime }}
                        </div>
                    </template>
                </el-table-column>


                <el-table-column fixed="right" align="center" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click.native.prevent="thisGoodsLook(scope)">查看</el-button>
                        <el-button type="text" size="small" @click.native.prevent="thisGoodsEdit(scope, 'goodsForm')">编辑
                        </el-button>
                        <el-button type="text" size="small" @click.native.prevent="thisGoodsDel(scope)">删除
                        </el-button>
                    </template>
                </el-table-column>


            </el-table>

            <div style="margin-top: 15px;">
                <el-pagination style="text-align: right;" align='center' background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 20, 100]"
                    :page-size="1" layout="total, sizes, prev, pager, next, jumper" :total="goodsListData.length">
                </el-pagination>
            </div>

            <!-- 商品列表表格 -->
        </div>

        <!-- 弹窗表单 -->
        <el-dialog :title="popupFormName" :visible.sync="dialogFormVisible" :width="popup.width" :showClose="false"
            :closeOnClickModal="false" customClass="my-dialog">

            <el-form :rules="rules" :model="goodsForm" label-width="80px" ref="goodsForm">
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="goodsForm.name" placeholder="点我输入内容..."></el-input>
                </el-form-item>

                <el-form-item label="所属分类" prop="class" style="width:auto;;display: inline-block;margin-right: 20px;">
                    <el-select v-model="goodsForm.class" placeholder="点击选择分类">
                        <el-option v-for="item in goodsClassData" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发货方式" prop="delivery" style="width:auto;;display: inline-block;">
                    <el-cascader v-model="goodsForm.delivery" :options="options" :props="{ expandTrigger: 'hover' }">
                    </el-cascader>
                </el-form-item>

                <el-form-item label="售价(元)" prop="price">
                    <el-input-number v-model="goodsForm.price" :precision="2" :min="0.00" :step="0.01" label="描述文字"
                        style="margin-right: 15px;">
                    </el-input-number>
                    <el-checkbox label="免费商品" name="type" v-model="free"></el-checkbox>
                </el-form-item>

                <el-form-item label="规格单位" style="width:auto;display: inline-block;" prop="unit">
                    <el-input v-model="goodsForm.unit" placeholder="不填则默认为：个">
                    </el-input>
                </el-form-item>
                <el-form-item label="是否显示" style="width:auto;display: inline-block;" prop="seen">
                    <el-switch v-model="goodsForm.seen"></el-switch>
                </el-form-item>
                <el-form-item label="是否上架" style="width: auto;display: inline-block;" prop="state">
                    <el-switch v-model="goodsForm.state"></el-switch>
                </el-form-item>

                <el-form-item label="商品标签" prop="label">

                    <el-tag :key="tag" v-for="tag in goodsLabelArr" closable :disable-transitions="false"
                        @close="handleClose(tag)">
                        {{ tag }}
                    </el-tag>
                    <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput"
                        size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加新标签</el-button>
                </el-form-item>

                <el-form-item label=" 商品图片" prop="img">
                    <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="goodsForm.img" :src="'http://localhost:3000/upload/' + goodsForm.img" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item label="设定库存" prop="amount">
                    <el-slider v-model="goodsForm.amount" show-input :max="999">
                    </el-slider>
                </el-form-item>
                <el-form-item label="商品介绍" prop="introduction">
                    <editor ref="editor"></editor>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('goodsForm')">取 消</el-button>
                <el-button type="primary" @click="submit('goodsForm')">确 定</el-button>
            </div>

        </el-dialog>
        <!-- 弹窗表单 -->

    </div>
</template>

<script>
import network from "@/network";// 引入axios网络模块
import editor from '@/components/more/editor';// 引入富文本编辑器模块
import webPageTitle from '@/components/admin/webPageTitle.vue';// 引入自编面包屑模块
export default {
    components: {
        editor,
        webPageTitle
    },
    data() {
        return {
            goodsLabelArr: [],// 添加商品时商品标签
            inputVisible: false,// 添加商品时标签输入框是否显示
            inputValue: '',// 添加商品时标签输入框里的内容
            tabelTdGoodsNameIndex: -1,// 表格商品名称被选中的索引号
            tabelTdGoodsName: '',// 单元格商品名称是否显示
            tabelTdGoodsNameNew: '',// 单元格商品名称新的
            tabelTdGoodsClassLoadng: false,// 表格单元格商品分类loading状态
            tabelTdGoodsIndex: -1,// 表格商品分类被选中的索引号
            searchContentInput: true, // 条件搜索 内容输入框 是否显示
            searchSeenInput: false,// 内容搜索 隐藏状态选择框 是否显示
            searchStateInput: false,// 内容搜索 上架状态选择框 是否显示
            goodsListSearchFormWidth: 0,// 商品查询盒子的宽度
            goodsListSearchForm: { // 商品条件搜索对象
                type: '',
                content: ''
            },
            parameter: {},// 地址栏后带的参数
            currentPage: 1, // 当前页码
            pageSize: 5, // 每页的数据条数
            popupFormName: "",// 弹窗表单名称
            goodsClassData: [],// 商品分类数组
            goodsListData: [],// 商品列表数组
            goodsDataLength: '',// 商品列表数组长度
            goodsAddButton: false,// 商品添加按钮是否不可用
            goodsDelButoon: false,// 商品删除按钮是否不可用
            popup: [// 弹窗的样式数组
                {
                    width: "400px",
                }
            ],
            searchOptions: [ // 商品查询类别数组
                {
                    label: 'gid',
                    value: 'gid',
                },
                {
                    label: '商品名称',
                    value: 'name',
                },
                {
                    label: '分类',
                    value: 'class',
                },
                {
                    label: '隐藏状态',
                    value: 'seen',
                },
                {
                    label: '上架状态',
                    value: 'state',
                },
                {
                    label: '标签',
                    value: 'label',
                },
            ]
            ,
            dialogFormVisible: false,// 弹窗的开启或关闭
            loading: "true",// 遮罩的开启与关闭
            goodsForm: {// 弹窗表单的数据
                seen: true,
                state: true,
                addTime: '',
                class: '',
                name: '',
                price: '0.5',
                delivery: [],
                gid: '',
                amount: 999,
                img: "",
                introduction: '',
                label: [],
                unit: '',
            },
            options: [// 发货方式
                {
                    value: '自营',
                    label: '自营',
                    children: [
                        {
                            value: '自动发货',
                            label: '自动发货',
                        },
                        {
                            value: '卡密发货',
                            label: '卡密发货',
                        },
                    ]
                },
                {
                    value: '快递',
                    label: '快递',
                    children: [
                        {
                            value: '顺丰',
                            label: '顺丰',
                        },
                        {
                            value: '申通',
                            label: '申通',
                        },
                        {
                            value: '中通',
                            label: '中通',
                        },
                        {
                            value: '圆通',
                            label: '圆通',
                        },
                        {
                            value: '邮政',
                            label: '邮政',
                        },
                        {
                            value: 'EMS',
                            label: 'EMS',
                        },
                    ]
                },
            ],
            rules: {// 表单验证规则
                name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                ],
                delivery: [
                    { required: true, message: '请选择发货方式', trigger: 'blur' },
                ],
                class: [
                    { required: true, message: '请选择所属分类', trigger: 'blur' },
                ],
            },
            free: false,// 商品是否免费按钮
            beforePrice: '',// 之前的价格
            _id: "",// 商品 _id 临时存放
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
                this.dataRender(100);
            }
        },

        // 动态监听添加商品时价格是否免费
        free(newval) {
            if (newval == true) {
                this.beforePrice = this.goodsForm.price;
                this.goodsForm.price = 0;
            } else {
                this.goodsForm.price = this.beforePrice
            }
        },

    },
    methods: {

        handleClose(tag) {// 删除标签
            this.goodsLabelArr.splice(this.goodsLabelArr.indexOf(tag), 1);
        },

        showInput() {// 点击添加新标签
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
                this.inputValue = '';
            });
        },

        handleInputConfirm() {// 确认添加新标签
            let inputValue = this.inputValue;
            console.log(2, this.inputValue);
            if (inputValue) {
                this.goodsLabelArr.push(inputValue);
            }
            this.inputVisible = false;
        },

        // 表格单元格改变隐藏或上架状态
        seenChange(scope, data) {
            let pp;
            if (data == 'seen') {
                pp = JSON.parse(scope.row.seen);
            } else {
                pp = JSON.parse(scope.row.state)
            }
            network({
                method: 'put',
                url: '/goodsList/update',
                params: {
                    _id: scope.row._id,
                    [data]: !pp
                }
            }).then(res => {
                this.dataRender(200);
            })
        },

        // 表格商品分类点击
        goodsClassClick(scope) {
            this.tabelTdGoodsIndex = scope.$index;
            network({// 获取商品分类
                method: "get",
                url: "/goodsClass/getData"
            }).then(res => {
                if (res.code == 200) {
                    console.log(23, res.data);
                    this.goodsClassData = res.data;
                } else {
                }
            })
        },
        // 手动关闭商品分类点击
        abelTdGoodsClassClose() {
            this.goodsClassData = [];
        },
        // 表格商品分类修改
        goodsClassChange(scope, value) {
            this.tabelTdGoodsClassLoadng = true;
            network({
                method: 'put',
                url: '/goodsList/update',
                params: {
                    _id: scope.row._id,
                    class: value
                }
            }).then(res => {
                setTimeout(() => {
                    this.tabelTdGoodsClassLoadng = false;
                    this.goodsClassData = [];
                }, 200)
                this.dataRender(200);
            })
        },


        // 表格商品名称点击
        goodsNameClick(scope) {
            this.tabelTdGoodsName = scope.row.name
            this.tabelTdGoodsNameNew = scope.row.name
            this.tabelTdGoodsNameIndex = scope.$index;
        },
        // 表格编辑商品名称手动关闭
        tabelTdGoodsNameClose() {
            this.tabelTdGoodsNameIndex = -1;
            this.tabelTdGoodsName = ''
            this.dataRender(200);
        },
        // 表格编辑商品名称
        goodsNameChange(scope, value) {
            this.tabelTdGoodsNameNew = value;
        },
        // 表格编辑商品名称确认
        tabelTdGoodsNameYes(scope) {
            network({
                method: 'put',
                url: '/goodsList/update',
                params: {
                    _id: scope.row._id,
                    name: this.tabelTdGoodsNameNew
                }
            }).then(res => {
                setTimeout(() => {
                    this.tabelTdGoodsNameIndex = -1;
                    this.tabelTdGoodsName = ''
                    this.tabelTdGoodsClassLoadng = false;
                    this.goodsClassData = [];
                }, 200)
                this.dataRender(200);
            })
        },

        // 搜索框清除器
        searchClassFormClear() {
            this.goodsListSearchForm.content = "";
            this.searchContentInput = true;
            this.searchSeenInput = false;
        },

        // 搜索类别条件
        searchClass(value) {
            this.searchClassFormClear();
            this.searchContentInput = false;
            console.log(value);
            if (value == 'seen') {
                this.searchSeenInput = true;
            } else if (value == 'state') {
                this.searchStateInput = true;
            } else {
                this.searchContentInput = true;

            }
        },

        // 点击后展开商品查询
        goodsListSearchClick(type) {
            this.goodsListSearchFormWidth = type == 'true' ? "430px" : "0";
        },

        // 商品查询确认按钮
        onSubmit(formName) {
            this.loading = true;
            this.$router.push(`goodsList?${formName.type}=${formName.content}`);
            network({
                method: "get",
                url: "/goodsList/getData",
                params: {
                    [formName.type]: formName.content
                }
            }).then(res => {
                if (res.code == 200) {
                    console.log(111, res);
                    setTimeout(() => {
                        this.loading = false;
                        this.goodsListData = res.data;
                        this.goodsDataLength = res.data.length;// 商品列表数据数组长度
                    }, 500)
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
        },

        // 表格排手动序筛选
        sortChange(column) {
            this.pageIndex = 1; // 排序后返回第一页
            console.log(99, this.goodsListData.gid);
            if (column.order === "descending") {
                // this.goodsListData.gid((a, b) => b[column.prop] - a[column.prop]);
            } else if (column.order === "ascending") {
                // this.goodsListData.gid((a, b) => a[column.prop] - b[column.prop]);
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
            this.$refs.editor.content = '';
            this.$refs[formName].resetFields();// 清空表单
            this.free = false;
            this.goodsForm.delivery = [];
            this._id = "";
            this.goodsLabelArr = [];

            this.goodsForm = {// 弹窗表单的数据
                seen: true,
                state: true,
                addTime: '',
                class: '',
                name: '',
                price: '0.5',
                delivery: [],
                gid: '',
                amount: 999,
                img: "",
            }
        },

        // 刷新表格按钮
        refreshTable() {
            this.loading = true;
            this.refreshTableButton = true;
            setTimeout(() => {
                this.refreshTableButton = false;
                this.parameter = JSON.stringify({});
                this.dataRender(100);
                this.$router.push("goodsList");
            }, 100)
        },

        // 图片上传 上传成功后
        handleAvatarSuccess(res, file) {
            this.goodsForm.img = res.url;
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

        // 弹窗表单清理
        popupForm() {
            this.goodsForm = {// 弹窗表单的数据
                seen: true,
                state: true,
                addTime: '',
                class: '',
                name: '',
                price: '0.5',
                delivery: [],
                gid: '',
                amount: 999,
                img: "",
            }
        },

        // 添加商品按钮
        addGoods() {
            this.popupForm();
            this.popupFormName = "添加商品";
            this.goodsAddButton = true;
            this.dialogFormVisible = true;
            network({// 获取商品分类
                method: "get",
                url: "/goodsClass/getData"
            }).then(res => {
                if (res.code == 200) {
                    this.goodsClassData = res.data;
                } else {
                }
            })
        },

        // 统一删除商品按钮
        del() {
            if (this.$refs.queryForm.selection.length == 0) {
                this.$message({
                    message: '请先选择需要删除的数据！',
                    showClose: true,
                    type: 'error',
                    duration: 2000,
                });
            } else {
                this.goodsDelButoon = true;
                this.loading = true;
                let ppd = this.$refs.queryForm.selection
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    for (let i = 0; i < ppd.length; i++) {
                        this.delGoods(ppd[i]._id);
                    };
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

        // 查看选中的商品的商品详情页
        thisGoodsLook(scope) {
            this.$router.push('/mobile/goods?name=' + scope.row.name)
        },

        // 编辑选中的商品
        thisGoodsEdit(scope, formName) {
            if (scope.row.label != undefined) {// 如果商品有标签
                this.goodsLabelArr = JSON.parse(JSON.stringify(scope.row.label))
            }
            setTimeout(() => {
                this.$refs.editor.content = scope.row.introduction
            }, 100)
            this.popupFormName = "编辑商品";
            this.goodsAddButton = true;
            this.dialogFormVisible = true;
            this._id = scope.row._id;
            this.goodsForm = {// 弹窗表单的数据
                seen: JSON.parse(scope.row.seen),
                state: JSON.parse(scope.row.state),
                addTime: scope.row.addTime,
                class: scope.row.class,
                name: scope.row.name,
                price: scope.row.price,
                delivery: scope.row.delivery,
                amount: scope.row.amount,
                gid: scope.row.gid,
                amount: parseInt(scope.row.amount),
                img: scope.row.img,
                introduction: scope.row.introduction,
                label: scope.row.label,
                unit: scope.row.unit,
            };
            network({// 获取商品分类
                method: "get",
                url: "/goodsClass/getData"
            }).then(res => {
                if (res.code == 200) {
                    this.goodsClassData = res.data;
                } else {
                }
            })
        },

        // 删除选中的商品
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

        // 删除商品方法
        delGoods(_id) {
            network({
                method: "delete",
                url: "/goodsList/del",
                params: {
                    _id: _id,
                }
            }).then(res => {
                if (res.code == 200) {
                    setTimeout(() => {
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                        this.dataRender(200);
                        this.goodsDelButoon = false;
                    }, 500)
                    this.dataRender(200);
                } else {
                    this.$notify({
                        title: '失败',
                        message: '删除失败',
                        type: 'error'
                    });
                    this.goodsDelButoon = false;
                }
            })
        },

        // 商品列表数据渲染方法
        dataRender(time) {
            delete this.goodsForm._id;
            if (this.parameter == '{}') { // 如果地址栏没带参数
                network({
                    method: "get",
                    url: "/goodsList/getData"
                }).then(res => {
                    if (res.code == 200) {
                        this.loading = true;
                        setTimeout(() => {
                            this.loading = false;
                            this.goodsListData = res.data;
                            this.goodsDataLength = res.data.length;// 商品列表数据数组长度
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
                    params: JSON.parse(this.parameter)
                }).then(res => {
                    if (res.code == 200) {
                        this.loading = true;
                        setTimeout(() => {
                            this.loading = false;
                            this.goodsListData = res.data;
                            this.goodsDataLength = res.data.length;// 商品列表数据数组长度
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
            this.goodsAddButton = false;
            this.fromClear(formName);
            this.free = false;
        },

        // 弹窗表单确认按钮
        submit(formName) {
            this.goodsForm.introduction = this.$refs.editor.content;
            this.goodsForm.label = this.goodsLabelArr;
            if (this.popupFormName == "添加商品") {
                if (this.goodsForm.unit == undefined) {// 如果规格没填
                    this.goodsForm.unit = '个';
                };
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.goodsAddButton = false;
                        this.goodsForm.addTime = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
                        network({
                            method: "get",
                            url: "/goodsList/getData",
                        }).then(res => {
                            this.goodsForm.gid = parseInt(res.data[res.data.length - 1].gid) + 1;
                            network({
                                method: "post",
                                url: "/goodsList/add",
                                params: this.goodsForm,
                            }).then(res => {
                                this.dataRender(500);
                                this.fromClear(formName);
                                if (res.code == 200) {
                                    this.$notify({
                                        title: '成功',
                                        message: '添加成功！',
                                        type: 'success'
                                    });
                                } else {
                                    this.$notify({
                                        title: '失败',
                                        message: '添加失败！',
                                        type: 'error'
                                    });
                                }
                            })
                        })

                        this.goodsForm.price = 0.5;
                    } else {
                        return false;
                    }
                    this.dialogFormVisible = false;
                });
            } else if (this.popupFormName == "编辑商品") {
                this.$refs[formName].validate((valid) => {
                    this.goodsForm._id = this._id;
                    if (valid) {
                        this.goodsAddButton = false;
                        network({
                            method: "put",
                            url: "/goodsList/update",
                            params: this.goodsForm,
                        }).then(res => {
                            this.dataRender(500);
                            this.fromClear(formName);
                            if (res.code == 200) {
                                this.$notify({
                                    title: '成功',
                                    message: '修改成功！',
                                    type: 'success'
                                });
                            } else {
                                this.$notify({
                                    title: '失败',
                                    message: '修改失败！',
                                    type: 'error'
                                });
                            }
                        })
                        this.goodsForm.price = 0.5;
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

        .goodsAddButton {
            border: 1px solid var(--themeBackColor) !important;
            background: var(--themeBackColor) !important;
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
    border-color: var(--themeBackColor);
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

.demo-form-block {
    // width: 0px;
    height: 41px;
    overflow: hidden;
    transition: all 1s;
    position: relative;
}

.el-tag+.el-tag {
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
    vertical-align: bottom;
}
</style>
