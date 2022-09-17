<!-- 移动端 商品详情 -->
<template>
    <div>
        <van-overlay :show="false"></van-overlay>
        <Header :goodsData="goodsData"></Header>

        <!-- 轮播图 -->
        <div class="goodsImgBanner">
            <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" height="10px" @change="goodsImgChange">
                <van-swipe-item height="10px" v-for="(image, index) in goodsImages" :key="index">
                    <img :src="image" alt="">
                </van-swipe-item>
            </van-swipe>
            <p class="goodsImgArr">{{ goodsImgIndex + 1 }}/{{ goodsImages.length }}</p>
        </div>
        <!-- 轮播图 -->

        <div class="goodsDetails">
            <h1 class="goodsName">{{ goodsData.name }}</h1>
            <p class="price">
                <span>{{ goodsData.price == 0 ? '免费商品' : goodsData.price }}</span>
                <span class="unit">×1{{ goodsData.unit }}</span>
            </p>
            <p class="goodsLabel">
                <el-tag v-for="item in goodsData.label" szie="mini" @click="unitChange(item)">{{ item }}</el-tag>
            </p>
            <div class="rightBox">
                <div class="right share">
                    <van-icon name="share-o" />分享
                </div>
                <div class="right" @click="likesAmountClick">
                    <van-icon name="good-job-o" />点赞({{ goodsData.likesAmount }})
                </div>
            </div>
        </div>

        <div class="goodsMoreBox">
            <van-tabs v-model="active" animated>
                <van-tab v-for="(item, index) in goodsMoreTitle" :title="item">
                    <div class="ql-container ql-snow goodsMore" v-if="index == 0">
                        <div class="ql-editor" v-html="goodsData.introduction">
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>

        <GoodsBuy :goodsBuyCard="goodsBuyCard"></GoodsBuy>
        <Footer>
        </Footer>
    </div>
</template>

<script>
import Header from '@/components/mobile/goodsPage/header.vue'
import Footer from '@/components/mobile/goodsPage/footer.vue'
import GoodsBuy from '@/components/mobile/goodsPage/goodsBuy.vue'
import network from '@/network'
import { Toast } from 'vant';//下拉刷新
export default {
    components: {
        Header,
        Footer,
        GoodsBuy
    },
    data() {
        return {
            goodsData: [],
            goodsImgIndex: '',
            goodsImages: [
                'https://xc.timebk.cn/assets/img/pay.jpg',
                'https://xc.timebk.cn/assets/img/pay.jpg',
            ],
            active: 0,
            goodsMoreTitle: ['商品介绍', '商品参数',],
            goodsBuyCard: {
                goodsBuyShow: false,
                sku: {
                    // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
                    // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
                    tree: [
                        {
                            k: '颜色', // skuKeyName：规格类目名称
                            k_s: 's1', // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
                            v: [
                            ],
                            largeImageMode: true, //  是否展示大图模式
                        }
                    ],
                    // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
                    list: [
                        {
                            id: 2259, // skuId
                            s1: '1', // 规格类目 k_s 为 s1 的对应规格值 id
                            s2: '1', // 规格类目 k_s 为 s2 的对应规格值 id
                            price: 100, // 价格（单位分）
                            stock_num: 110 // 当前 sku 组合对应的库存
                        }
                    ],
                    price: '1.00', // 默认价格（单位元）
                    stock_num: 227, // 商品总库存
                    collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
                    none_sku: false, // 是否无规格商品
                    messages: [
                        {
                            // 商品留言
                            datetime: '0', // 留言类型为 time 时，是否含日期。'1' 表示包含
                            multiple: '0', // 留言类型为 text 时，是否多行文本。'1' 表示多行
                            name: '留言', // 留言名称
                            type: 'text', // 留言类型，可选: id_no（身份证）, text, tel, date, time, email
                            required: '1', // 是否必填 '1' 表示必填
                            placeholder: '', // 可选值，占位文本
                            extraDesc: ''  // 可选值，附加描述文案
                        }
                    ],
                    hide_stock: false, // 是否隐藏剩余库存
                },
                goods: {
                    // 默认商品 sku 缩略图
                    picture: 'https://img01.yzcdn.cn/1.jpg'
                },
            }
        }
    },
    mounted() {
        const loading = this.$loading({
            lock: true,
            text: '加载中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        if (JSON.stringify(this.$route.query) != "{}") {
            network({
                method: "get",
                url: 'goodsList/getData',
                params: this.$route.query,
            }).then(res => {
                console.log(res.data[0]);
                if (res.code == 200 && res.data.length != 0) {
                    setTimeout(() => {
                        this.goodsData = res.data[0];
                        if (res.data[0].img != '') {
                            this.goodsImages.unshift('http://localhost:3000/upload/' + res.data[0].img)
                        }
                        loading.close();
                    }, 300)
                } else {
                    setTimeout(() => {
                        this.goodsData = res.data[0];
                        Toast('当前商品不存在！');
                        loading.close();
                        setTimeout(() => {
                            this.$router.push('/mobile')
                        }, 500)
                    }, 300)
                }
            })
        } else {
            setTimeout(() => {
                Toast('当前商品不存在！');
                loading.close();
                setTimeout(() => {
                    this.$router.push('/mobile')
                }, 500)
            }, 300)
        }
    },
    methods: {

        // 查询含有选定标签的商品
        unitChange(item) {
            this.$router.push(`/mobile/?label=${item}`);
        },

        // 商品图片右下角索引
        goodsImgChange(index) {
            this.goodsImgIndex = index;
        },

        //点赞该商品
        likesAmountClick() {
            network({
                method: 'get',
                url: '/goodsList/getData',
                params: {
                    gid: this.goodsData.gid,
                }
            }).then(res => {
                if (res.code == 200) {
                    let likesAmountNew;
                    if (res.data[0].likesAmount == '') {
                        likesAmountNew = 1
                    } else {
                        likesAmountNew = parseInt(res.data[0].likesAmount) + 1
                    }
                    network({
                        method: 'put',
                        url: '/goodsList/update',
                        params: {
                            _id: this.goodsData._id,
                            likesAmount: likesAmountNew
                        }
                    }).then(res => {
                        if (res.code == 200) {
                            // console.log(res);
                            this.goodsData.likesAmount = likesAmountNew
                        }
                    })
                }
            })
        }

    },
}
</script>

<style lang="scss">
.goodsImgBanner {
    position: relative;
    height: auto;

    >.goodsImgArr {
        position: absolute;
        bottom: 40px;
        right: 40px;
        background: rgba(0, 0, 0, .34);
        color: #ddd;
        border-radius: 10px;
        padding: 5px 10px;
        font-size: 12px;
    }

    >.my-swipe {
        border-bottom: 1px solid #ccc;
        padding-bottom: 40px;

        >.van-swipe__track {

            >.van-swipe-item {
                color: #fff;
                font-size: 20px;
                text-align: center;
                height: auto;

                >img {
                    width: auto;
                    max-height: 400px;
                }
            }
        }

        >.van-swipe__indicators {
            bottom: 15px;
            display: none;

            >i {
                width: 20px;
                height: 20px;
                background: #333;
            }
        }
    }

}

.goodsDetails {
    border-bottom: 1px solid #ddd;
    padding: 15px;
    position: relative;

    >.goodsName {
        font-size: 35px;
        font-weight: 400;
        padding: 10px 0;
    }

    >.price {
        padding: 10px 0;
        color: orange;
        font-size: 40px;

        >.unit {
            font-size: 18px;
            padding-left: 20px;
        }
    }

    >.goodsLabel {
        >.el-tag {
            font-size: 16px;
            padding: 5px 10px;
            height: auto;
            line-height: inherit;
            margin-right: 10px;
        }
    }

    >.rightBox {
        font-size: 16px;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);

        >.right {
            background: #eee;
            padding: 10px 15px 10px 25px;
            letter-spacing: 1px;
            border-radius: 25px 0 0 25px;
            margin: 5px 0;
        }
    }
}

.goodsMoreBox {
    padding: 0 15px;

    .goodsMore {
        border: 0;
        padding: 20px 10px;

        >.ql-editor {
            padding: 0;
        }
    }
}
</style>