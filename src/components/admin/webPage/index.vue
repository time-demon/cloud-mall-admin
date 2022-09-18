<!-- 后台 数据中心（首页） -->
<template>
    <div>
        <div class="dataBox1">
            <h3 class="pageTitle">
                <p>{{ this.$route.meta.webConfig.webName }} v1.2.3
                    <span>{{ this.$route.meta.webConfig.sub_webName }}</span>
                </p>
                <p>数据中心 - 每隔10秒自动更新一次数据</p>
            </h3>
            <div class="dataBox2">
                <div class="panelBox">
                    <div class="panel-longBox">
                        <h1 class="panel-title">
                            快捷导航
                            <el-button type="text" class="el-icon-edit-outline"
                                @click="$router.push('webConfig/quickNav')">
                            </el-button>
                        </h1>
                        <div class="panel-longBox-nav">
                            <p v-for="item in panelNav" @click="$router.push(item.url)">
                                <span>{{ item.name }}</span>
                            </p>
                        </div>
                    </div>
                    <div class="panel-shortBox">
                        <div class="panel">
                            <div class="panel-left">
                                <h4>交易金额</h4>
                                <p>{{ panelData.allMoney }} 元</p>
                            </div>
                            <div class="panel-right">
                                <i class="el-icon-money"></i>
                            </div>
                        </div>

                        <div class="panel">
                            <div class="panel-left">
                                <h4>订单总数</h4>
                                <p>{{ panelData.allOrder }} 条</p>
                            </div>
                            <div class="panel-right">
                                <i class="el-icon-shopping-cart-2"></i>
                            </div>
                        </div>

                        <div class="panel">
                            <div class="panel-left">
                                <h4>商品总数</h4>
                                <p>{{ panelData.allGoods }} 个</p>
                            </div>
                            <div class="panel-right">
                                <i class="el-icon-shopping-bag-2"></i>
                            </div>
                        </div>
                        <div class="panel">
                            <div class="panel-left">
                                <h4>分类总数</h4>
                                <p>{{ panelData.allGoodsClass }} 个</p>
                            </div>
                            <div class="panel-right">
                                <i class="el-icon-s-grid"></i>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="updateNotice">
                    <div class="environment">
                        <h1 class="panel-title environment-title">
                            <i class="el-icon-warning"></i> 环境信息
                        </h1>
                        <div class="environment-content">
                        </div>
                    </div>
                    <div class="updateNoticeBox">
                        <h1 class="panel-title updateNoticeBox-title">
                            <i class="el-icon-message-solid"></i> 更新&公告
                        </h1>
                        <div class="updateNoticeBox-content">
                            <el-timeline>
                                <el-timeline-item v-for="(activity, index) in activities" :key="index"
                                    :icon="activity.icon" :type="activity.type" :color="activity.color"
                                    :size="activity.size" :timestamp="activity.timestamp">
                                    {{ activity.content }}
                                </el-timeline-item>
                            </el-timeline>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>


import network from '@/network';

export default {
    data() {
        return {
            panelNav: [
                {
                    name: '首页下单',
                    url: '/'
                },
                {
                    name: '商品列表',
                    url: 'goods/goodsList'
                },
                {
                    name: '商品分类',
                    url: 'goods/goodsCLass'
                },
                {
                    name: '订单列表',
                    url: 'order/orderList'
                },
                {
                    name: '网站配置',
                    url: 'webConfig'
                },
                {
                    name: '个人设置',
                    url: 'admin_my'
                },
            ],
            activities: [
                {
                    color: '#0bbd87',
                    size: 'large',
                    type: 'primary',
                    icon: 'el-icon-more',
                    content: '不定期更新小细节',
                    timestamp: '',
                },
                {
                    content: '解决 postcss-pxtorem 的定向转换 ',
                    timestamp: '2022-08-02 16:476:31',
                },
                {
                    content: '解决 相同路由不同参数 不跳转的Bug',
                    timestamp: '2022-08-02 14:56:26',
                },
                {
                    content: '完成 个人设置 的修改功能',
                    timestamp: '2022-08-01 15:02:51',
                },
                {
                    content: '完成后台主题功能',
                    timestamp: '2022-08-01 10:56:05',
                },
                {
                    content: '完成头部复杂筛选功能',
                    timestamp: '2022-07-31 16:20:25',
                },
                {
                    content: '完成修改 商品分类名称 动态改变 商品的所属分类',
                    timestamp: '2022-07-30 15:20:25',
                },
                {
                    content: '完成 商品分类 的增删改查',
                    timestamp: '2022-07-30 15:20:25',
                },
                {
                    content: '完成 商品列表 的增删改查',
                    timestamp: '2022-07-30 11:20:25',
                },
                {
                    content: '创建项目',
                    timestamp: '2022-07-29',
                },
            ],
            panelData: {
                allMoney: 0,
                allOrder: 0,
                allGoods: 0,
                allGoodsClass: 0,
            },
            count: 0,
        }
    },
    methods: {

        getAllDate() {

            // 获取商品数据
            network({
                method: 'get',
                url: '/goodsList/getData'
            }).then(res => {
                this.panelData.allGoods = res.data.length;
            });
            //获取商品分类数据
            network({
                method: 'get',
                url: '/goodsClass/getData'
            }).then(res => {
                this.panelData.allGoodsClass = res.data.length;
            });

        },
    },
    mounted() {

        // 挂载后访问数据
        this.getAllDate();

        // 定时获取数据
        const timer = setInterval(() => {
            this.count++;
            if (this.count == 9) {
                this.count = 0;
                this.getAllDate();
            }
        }, 1000)

    },
}
</script>

<style lang="scss" scoped>
.dataBox1 {

    >.pageTitle {
        font-weight: 300;
        height: 75px;
        line-height: 75px;
        color: var(--themeBackColor);
        display: flex;
        justify-content: space-between;
        align-items: center;

        span {
            font-size: 12px;
        }
    }

    .panel-title {
        font-size: 14px;
        color: var(--themeBackColor);
        padding: 0 25px;
        margin-bottom: 15px;

        >.el-button {
            color: inherit;
        }

    }

    >.dataBox2 {
        display: flex;
        vertical-align: top;
        flex-wrap: wrap;

        >.updateNotice {
            order: 1;
            width: 320px;
            height: auto;
            padding-right: 20px;
            margin: 0 0 25px;

            >.environment {
                height: 100px;
                border-radius: 4px;
                padding: 15px;
                margin-bottom: 25px;
                background: #fff;
                box-shadow: 0 0 35px 0 rgba(154, 161, 171, .15);

                >.environment-title {
                    padding: 0;
                }

                >.environment-content {
                    font-size: 12px;
                }
            }

            >.updateNoticeBox {
                max-height: 300px;
                background: #fff;
                border-radius: 4px;
                padding: 15px;
                box-shadow: 0 0 35px 0 rgba(154, 161, 171, 0.15);

                >.updateNoticeBox-title {
                    padding: 0;
                    margin-bottom: 25px;
                }

                >.updateNoticeBox-content {
                    overflow: hidden;
                    overflow-y: auto;
                    height: 240px;

                }
            }
        }

        >.panelBox {
            flex: 1;
            order: 2;

            >.panel-longBox {
                margin-bottom: 25px;
                background: #fff;
                padding: 10px 5px 20px;
                box-shadow: 0 0 35px 0 rgba(154, 161, 171, .15);
                width: 100%;
                display: grid;
                color: #333;
                min-height: 100px;
                align-items: center;


                .el-button {
                    color: inherit;
                }



                .panel-longBox-nav {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, 102px);
                    justify-content: space-between;
                    ;

                    >p {
                        margin: 5px 25px;
                        cursor: pointer;
                        font-size: 13px;
                        overflow: hidden;

                        >span {
                            color: #333;
                        }
                    }

                    >p:hover {
                        >span {
                            color: var(--themeBackColor);
                            text-decoration: underline;
                        }
                    }

                }
            }

            >.panel-shortBox {
                margin-bottom: 25px;
                display: grid;
                grid-template-columns: repeat(auto-fill, 200px);
                grid-template-rows: repeat(auto-fill, 120px);
                justify-content: space-between;

                >.panel {
                    max-height: 100px;
                    overflow: hidden;
                    overflow-y: auto;
                    background: #fff;
                    border-radius: 4px;
                    box-shadow: 0 0 35px 0 rgba(154, 161, 171, .15);
                    padding: 20px;
                    display: flex;
                    vertical-align: top;
                    justify-content: space-between;
                    align-items: center;

                    >.panel-left {
                        position: relative;

                        >h4 {
                            color: var(--themeBackColor);
                            font-weight: 400;
                            font-size: 15px;
                        }

                        >p {
                            font-weight: 300;
                            position: relative;
                            top: 5px;
                            font-size: 14px;
                            color: #333;

                            >span {
                                font-weight: bold;
                            }
                        }
                    }

                    >.panel-right {
                        >i {
                            font-size: 25px;
                            color: #fff;
                            padding: 10px;
                            border-radius: 4px;
                            background: var(--themeBackColor);
                        }
                    }
                }

                >.panel::-webkit-scrollbar {
                    display: none
                }
            }


        }

    }

}
</style>