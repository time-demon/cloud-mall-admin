<!-- 后台 页面头部 -->
<template>
    <div class="header">
        <div class="headerBox">

            <div class="headerLeft">
                <div class="adminTitle">
                    <h1>
                        <img src="@/assets/img/logo.png" alt="">
                        系统后台
                    </h1>
                </div>
                <div class="allFormBox">
                    <el-form :inline="true" :model="allForm" class="demo-form-inline" ref="allForm">
                        <el-form-item label="" style="margin: 0 10px 0 0;width: 165px;" prop="options">
                            <el-cascader clearable v-model="allForm.options" :options="options"
                                :props="{ expandTrigger: 'hover' }" placeholder="请选择筛选类别" @change="allClassChange">
                            </el-cascader>
                        </el-form-item>
                        <el-form-item label="" style="margin: 0 10px 0 0;width: 165px;" prop="content">
                            <el-input v-model="allForm.content" placeholder="筛选内容"
                                @keyup.native.enter="allFormSubmit(allForm)" clearable v-if="allInput">
                            </el-input>

                            <el-select v-model="allForm.content" placeholder="选择状态" v-if="seenInput">
                                <el-option label="显示中" value="true"></el-option>
                                <el-option label="已隐藏" value="false"></el-option>
                            </el-select>
                            <el-select v-model="allForm.content" placeholder="选择状态" v-if="stateInput">
                                <el-option label="上架中" value="true"></el-option>
                                <el-option label="已下架" value="false"></el-option>
                            </el-select>
                            <el-select v-model="allForm.content" placeholder="选择发货方式" v-if="kdInput">
                                <el-option label="自营" value="自营"></el-option>
                                <el-option label="快递" value="快递"></el-option>
                            </el-select>


                        </el-form-item>
                        <el-form-item style="margin: 0 10px 0 0;">
                            <el-button type="primary" class="allFormButton" @click="allFormSubmit('allForm', allForm)">
                                筛选</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div class="headerRight">
                <div class="rightBox">
                    <el-button circle title="林黛绿" style="background: #4A8FA1;" @click="themeChange('#4A8FA1')">
                    </el-button>
                    <el-button circle title="亮蓝色" style="background: #409EFF;" @click="themeChange('#409EFF')">
                    </el-button>
                    <el-button circle title="深度灰" style="background: #636267;" @click="themeChange('#636267')">
                    </el-button>
                    <el-button circle title="梦幻紫" style="background: #AC94DB;" @click="themeChange('#AC94DB')">
                    </el-button>
                    <el-button circle title="甜心橙" style="background: #F5592C;" @click="themeChange('#F5592C')">
                    </el-button>
                </div>
                <div class="rightBox">
                    <el-color-picker size="medium" value="#409EFF" @active-change="themePreview" @change="themeChange">
                    </el-color-picker>
                </div>
                <div class="rightBox">
                    <el-tooltip class="item" effect="dark" content="联系客服" placement="bottom-end">
                        <el-button type="text" icon="el-icon-service" class="icon" @click="kefu"></el-button>
                    </el-tooltip>
                </div>
                <div class="rightBox adminBox">
                    <img v-if="RegExp(/http/).test(adminLogo)" :src="adminLogo" class="adminLogo">
                    <img v-if="RegExp(/http/).test(adminLogo) == false"
                        :src="'http://localhost:3000/upload/' + adminLogo" class="adminLogo">
                    <span class="adminName">{{ adminName }}</span>&nbsp;
                    <i class="el-icon-arrow-down headAdminLogoIcon"></i>
                    <div class="adminBox_son">
                        <p class="el-icon-user" @click="$router.push('/admin/admin_my')">
                            个人设置
                        </p>
                        <p class="el-icon-switch-button" @click="logOut">
                            退出登录
                        </p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            adminLogo: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            adminName: 0,
            allForm: {
                content: '',
                options: [],
            },
            allInput: true, // 输入框是否隐藏
            seenInput: false,// 隐藏状态选择框是否显示
            stateInput: false,//上架状态选择框是否显示
            kdInput: false,// 快递选择框是否显示
            options: [
                {
                    value: 'goods/goodsList',
                    label: '商品',
                    children: [
                        {
                            value: 'name',
                            label: '商品名称',
                        },
                        {
                            value: 'class',
                            label: '所属分类',
                        },
                        {
                            value: 'seen',
                            label: '隐藏状态',
                        },
                        {
                            value: 'state',
                            label: '上架状态',
                        },
                        {
                            value: 'delivery',
                            label: '发货方式',
                        },
                        {
                            value: 'label',
                            label: '标签',
                        },
                    ]
                },
                {
                    value: 'goods/goodsClass',
                    label: '商品分类',
                    children: [
                        {
                            value: 'name',
                            label: '分类名称',
                        },
                        {
                            value: 'seen',
                            label: '隐藏状态',
                            pp: true
                        },
                    ]
                },
                {
                    value: '订单',
                    label: '订单',
                    children: [
                        {
                            value: '订单名称',
                            label: '订单名称',
                        },
                        {
                            value: '订单编号',
                            label: '订单编号',
                        },
                    ]
                },
            ]

        }
    },
    watch: {
    },
    mounted() {
        this.adminName = localStorage.getItem('adminName');
        this.adminLogo = localStorage.getItem('adminLogo');

        //主题颜色读取
        var root = document.querySelector(':root');
        if (localStorage.getItem('themeBackColor') != undefined) {
            root.setAttribute('style', `--themeBackColor: ${localStorage.themeBackColor}`);
        }
    },
    methods: {

        // 主题颜色预览
        themePreview(value) {
            var root = document.querySelector(':root');
            root.setAttribute('style', `--themeBackColor: ${value}`);
        },
        //主题颜色确认
        themeChange(value) {
            var root = document.querySelector(':root');
            root.setAttribute('style', `--themeBackColor: ${value}`);
            localStorage.themeBackColor = value;
        },

        // 类别清除器
        allFormClear() {
            this.allInput = true;
            this.seenInput = false;
            this.stateInput = false;
            this.kdInput = false;
        },


        allClassChange(value) {
            this.allFormClear();
            this.allInput = false;
            if (value[1] == 'seen') {
                this.seenInput = true;
            } else if (value[1] == 'state') {
                this.stateInput = true;
            } else if (value[1] == 'delivery') {
                this.kdInput = true;
            }
            else {
                this.allInput = true;
            }
        },

        // 头部多功能查询按钮
        allFormSubmit(formName, allForm) {
            const that = this
            this.allFormClear();
            if (allForm.content == "" && allForm.options.length == 0) {
                this.$notify({
                    title: '警告',
                    message: '请选择查询类别和填写查询内容',
                    type: 'warning',
                    duration: 1000,
                });
            } else if (allForm.content == "") {
                this.$notify({
                    title: '警告',
                    message: '请填写查询内容',
                    type: 'warning',
                    duration: 1000,
                });
            } else if (allForm.options.length == 0) {
                this.$notify({
                    title: '警告',
                    message: '请选择查询类别',
                    type: 'warning',
                    duration: 1000,
                });
            } else {
                const loading = this.$loading({
                    lock: true,
                    text: '查询数据中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                setTimeout(() => {
                    loading.close();
                    this.$router.push(`/admin/${allForm.options[0]}?${allForm.options[1]}=${allForm.content}`);
                    this.$refs[formName].resetFields();
                    this.allInput = true;
                }, 300);
            }
        },

        logOut() { // 退出登录
            // 整页加载
            const loading = this.$loading({
                lock: true,
                text: '正在退出',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            // 整页加载计时关闭
            setTimeout(() => {
                loading.close();// 关闭整页加载
                window.localStorage.clear();
                this.$router.push("/admin/login");// 跳转登录页面
            }, 300);
        },
        kefu() { // 联系客服
            window.open("http://wpa.qq.com/msgrd?v=3&uin=1937966358&site=qq&menu=yes")
        }
    }
}
</script>

<style lang="scss" scoped>
.allFormButton {
    background: var(--themeBackColor);
    border: 1px solid var(--themeBackColor);
}

.icon {
    font-size: 22px;
}


.header {
    width: 100%;
    height: 70px;
    background: #fff;
    box-shadow: 0 0 35px 0 rgb(154 161 171 / 15%);

    >.headerBox {
        max-width: 1220px;
        padding: 10px;
        height: 100%;
        margin: auto;
        display: flex;
        vertical-align: top;
        justify-content: space-between;
        align-items: center;

        >.headerLeft {
            display: flex;
            vertical-align: top;
            align-items: center;

            >.adminTitle {
                color: var(--themeBackColor);
                display: inline-block;
                margin-right: 15px;

                >h1 {
                    font-weight: 300;
                    display: flex;
                    align-items: center;
                    font-size: 26px;

                    >img {
                        height: 35px;
                        padding-right: 10px;
                    }
                }
            }
        }

        >.headerRight {
            display: flex;
            vertical-align: top;
            justify-content: space-between;
            align-items: center;
            height: 100%;

            >.rightBox {
                height: 100%;
                display: flex;
                vertical-align: top;
                align-items: center;
                margin: 0 0 0 20px;
            }

            >.adminBox {
                cursor: pointer;
                padding: 0 15px;
                position: relative;

                >.adminName {
                    font-size: 16px;
                    color: var(--themeBackColor);
                }

                >.headAdminLogoIcon {
                    transition: all .5s;
                }

                >.adminLogo {
                    width: 32px;
                    height: 32px;
                    margin-right: 10px;
                    border-radius: 50%;
                    box-shadow: 1px 1px 1px 1px var(--themeBackColor);
                }

                >.adminBox_son {
                    position: absolute;
                    top: 45px;
                    right: 0;
                    min-width: 100%;
                    height: 0;
                    overflow: hidden;
                    border-radius: 4px;
                    background: #fff;
                    color: #6c757d;
                    font-size: 14px;

                    >p {
                        padding: 15px 20px;
                        width: 100% !important;
                    }

                    >p:hover {
                        background: #F8F9FA;
                    }

                }
            }

            >.adminBox:hover {
                background: #F8F9FA;

                >.adminName {
                    color: var(--themeBackColor);
                }

                >.headAdminLogoIcon {
                    color: var(--themeBackColor);
                    transform: rotate(180deg);
                }

                >.adminBox_son {
                    height: max-content;
                    box-shadow: 0 0 35px 0 rgba(154, 161, 171, .15);
                    border: 1px solid #eee;
                }
            }
        }

    }
}
</style>