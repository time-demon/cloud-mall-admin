<!-- 移动端 首页 -->
<template>
    <div>
        <!-- 头部 -->
        <div class="header">
            <van-nav-bar class="header" :title="$route.name" left-text="返回" left-arrow>
                <template #left>
                    <van-image round width="0.75rem" height="0.75rem" @click="user" :src="adminLogo" />
                </template>
                <template #title>
                    <van-search v-model="value" shape="round" height="500px" placeholder="请输入商品关键词"
                        @search="onSearch" />
                </template>
                <template #right>
                    <van-icon name="service-o" size="18" @click="kefuCard.kfShow = true" />
                </template>
            </van-nav-bar>
        </div>
        <!-- 头部 -->

        <div class="rollNotice">
            <van-notice-bar left-icon="volume-o" :text="webConfigData.rollNotice" />
        </div>

        <!-- 轮播图 -->
        <div class="banner" style="height: 120px;">
            <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" height="10px">
                <van-swipe-item height="10px" v-for="(image, index) in bannerImages" :key="index">
                    <img :src="image" alt="">
                </van-swipe-item>
            </van-swipe>
        </div>
        <!-- 轮播图 -->

        <!-- 商品分类宫格 -->
        <div class="classNav">
            <van-grid>
                <van-grid-item icon="bullhorn-o" text="平台公告" />
                <van-grid-item icon="service-o" text="售后客服" />
                <van-grid-item v-for="item in goodsClassData" icon="service-o" :text="item.name"
                    @click="goodsClassClick(item)">
                    <template #icon>
                        <img :src="'http://localhost:3000/upload/' + item.img" alt="" class="goodsClassImg">
                    </template>
                </van-grid-item>
            </van-grid>
        </div>
        <!-- 商品分类宫格 -->

        <!-- 商品 -->
        <div class="goodsBigBox">
            <van-dropdown-menu style="height: 30px;margin-bottom: 25px;">
                <van-dropdown-item v-model="value1" :options="option1" />
                <van-dropdown-item v-model="value2" :options="option2" />
            </van-dropdown-menu>
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <div style="min-height: 200px;">
                    <div class="goodsBox">
                        <div class="goods" v-for="item in goodsData" @click="goodsLook(item)">
                            <div class="goodsImg">
                                <img :src="'http://localhost:3000/upload/' + item.img" alt="">
                            </div>
                            <div class="goodsContent">
                                <h6>{{ item.name }}</h6>
                                <p class="price" v-if="item.price != 0">￥{{ item.price }} / {{ item.unit }}</p>
                                <p class="price" v-if="item.price == 0">
                                    <el-tag size="mini">免费商品</el-tag>
                                </p>
                                <p class="more">
                                    <el-tag type="info" effect="dark" size="mini">
                                        <font v-if="item.amount != 0">{{ item.amount > 100 ? '库存丰富' : '库存不足' }}</font>
                                        {{ item.amount == 0 ? '无货' : '' }}
                                    </el-tag>
                                    <el-tag type="info" effect="plain" size="mini">
                                        {{ 'x1/' + item.unit }}
                                    </el-tag>
                                </p>
                                <p class="label">
                                    <el-tag type="success" size="mini" v-for="itemb in     item.label">{{ itemb }}
                                    </el-tag>
                                </p>
                            </div>
                        </div>
                    </div>
                    <van-empty description="未搜索到内容" v-if="searchNull" />
                    <van-divider>没有更多了</van-divider>
                </div>
            </van-pull-refresh>
        </div>
        <!-- 商品 -->

        <Kefu :kefuCard="kefuCard"></Kefu>

    </div>
</template>

<script>
import { Toast } from 'vant';//下拉刷新
import network from '@/network';
import Kefu from '@/components/mobile/kefu.vue'
export default {
    components: {
        Kefu
    },
    data() {
        return {
            adminLogo: '',
            searchNull: false,
            kefuCard: {
                kfShow: false
            },
            value: '',
            bannerImages: [
                'https://xc.timebk.cn/assets/img/pay.jpg',
            ],
            webConfigData: [],
            goodsData: [],
            goodsClassData: [],
            value1: 0,
            value2: 'a',
            option1: [
                { text: '全部商品', value: 0 },
                { text: '新款商品', value: 1 },
                { text: '活动商品', value: 2 },
            ],
            option2: [
                { text: '默认排序', value: 'a' },
                { text: '好评排序', value: 'b' },
                { text: '销量排序', value: 'c' },
            ],
            isLoading: false,
        }
    },
    watch: {
        $route(to, form) {
            if (to.fullPath != form.fullPath) {
                this.goodsref(to.query);
            }
        }
    },
    mounted() {
        if (localStorage.getItem('adminLogo') == null) {
            this.adminLogo = 'https://xc.timebk.cn/assets/img/user.png'
        } else {
            this.adminLogo = 'http://localhost:3000/upload/' + localStorage.getItem('adminLogo');
        }
        this.isLoading = true;
        if (JSON.stringify(this.$route.query) == '{}') {
            this.goodsDataGet();
        } else {
            this.goodsDataGet(false, this.$route.query);
        }


        this.webConfigData = this.$route.meta.webConfig;
        // 获取商品分类
        network({
            method: 'get',
            url: 'goodsClass/getData',
        }).then(res => {
            if (res.code == 200) {
                this.goodsClassData = res.data;
            }
        })

    },
    methods: {

        // 商品工具地址栏参数渲染
        goodsref(query) {
            this.isLoading = true;
            this.goodsDataGet(false, query)
        },

        // 点击导航栏分类盒子
        goodsClassClick(item) {
            console.log(22, item.name);
            console.log(136, this.$route);
            this.$router.push(`?class=${item.name}`)
        },

        // 商品搜索按钮
        onSearch(val) {
            // this.$router.push(`/mobile/goods?name=${val}`);
            this.isLoading = true;
            network({
                method: 'get',
                url: 'goodsList/getData',
                params: {
                    name: val
                }
            }).then(res => {
                if (res.code == 200) {
                    setTimeout(() => {
                        if (res.data.length == 0) {
                            this.searchNull = true;
                        }
                        this.isLoading = false;
                        this.goodsData = res.data.reverse();
                        if (type == 'goodsRef') {
                            Toast('刷新成功');
                        }
                        return true
                    }, 500)
                }
            })
        },

        // 查看商品详情
        goodsLook(item) {
            this.$router.push(`/mobile/goods?name=${item.name}`);
        },

        // 获取商品
        goodsDataGet(type, data) {
            network({
                method: 'get',
                url: 'goodsList/getData',
                params: data

            }).then(res => {
                if (res.code == 200) {
                    setTimeout(() => {
                        this.isLoading = false;
                        this.goodsData = res.data.reverse();
                        if (type == 'goodsRef') {
                            Toast('刷新成功');
                        }
                        return true
                    }, 500)
                }
            })
        },

        // 刷新商品按钮
        onRefresh() {
            setTimeout(() => {
                this.goodsDataGet('goodsRef');
                this.$router.push('')
            }, 1000);
        },

        // 访问个人中心
        user() {
            console.log(this.$route.path);
            if (this.$route.path == '/admin') {
                this.$router.push('mobile/user')
            } else {
                this.$router.push('user')
            }
        }
    },
}
</script>

<style lang="scss">
.banner {
    background: transparent
}

.classNav {
    >.van-grid {

        >.van-grid-item {

            >.van-grid-item__content {
                padding: 10px 0;

                >i {
                    font-size: 40px;
                    display: flex;
                    align-items: center;
                }

                >.van-grid-item__text {
                    margin: 0;
                }
            }
        }
    }
}

.goodsBigBox {
    margin: 25px 0;

    .goodsBox {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        padding: 10px;
        justify-content: space-between;
        justify-items: center;

        >.goods {
            width: 95%;
            height: auto;
            // background: orange;
            background: #fff;
            border-radius: 15px;
            padding: 15px;
            margin-bottom: 15px;
            position: relative;

            >.goodsImg {
                width: 100%;
                min-height: 250px;
                text-align: center;
                // border: 1px solid;

                img {
                    width: auto;
                    height: 250px;
                    border-radius: 15px;
                }
            }

            >.goodsContent {

                >h6 {
                    font-weight: 400;
                    font-size: 30px;
                }

                >.price {
                    padding-top: 15px;
                    color: red;
                    font-size: 30px;
                }

                >p {
                    >span {
                        margin-right: 10px;
                    }

                    >span:nth-last-of-type(1) {
                        margin-right: 0;
                    }
                }
            }


        }
    }
}

.van-nav-bar__title {
    max-width: 80%;
    width: 80%;
}

.van-search {
    height: auto;
}

.van-nav-bar__left {
    padding: 0 0 0 16px;
}

.van-nav-bar__right {
    padding: 0 16px 0 0;
}

.my-swipe {
    >.van-swipe__track {
        >.van-swipe-item {
            color: #fff;
            font-size: 20px;
            line-height: 150px;
            text-align: center;
            height: 250px;

            >img {
                padding: 15px;
                width: 100%;
                height: inherit;
                border-radius: 25px;
            }
        }
    }

    >.van-swipe__indicators {
        bottom: 5px;

        >i {
            background: #1989fa;
        }
    }
}

.van-grid-item__icon-wrapper {
    height: 59px;
}

.van-grid-item__icon {
    height: 58px;
}

.goodsClassImg {
    max-width: 65px;
    height: 65px;
}

.content {
    padding: 16px 16px 160px;
    font-size: 35px;
    text-align: center;
}
</style>