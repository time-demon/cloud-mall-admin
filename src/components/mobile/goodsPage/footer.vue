<template>
    <div>

        <van-goods-action>
            <van-goods-action-icon icon="service-o" text="客服" :dot="false" @click="kefuCard.kfShow = true" />
            <van-goods-action-icon icon="cart-o" text="购物车" badge="5" />
            <van-goods-action-button type="warning" text="加入购物车" />
            <van-goods-action-button type="danger" text="立即购买" />
        </van-goods-action>

        <Kefu :kefuCard="kefuCard"></Kefu>

    </div>
</template>

<script>
import Kefu from '@/components/mobile/kefu.vue'
export default {
    components: {
        Kefu
    },
    data() {
        return {
            kefuCard: {
                kfShow: false
            },
        }
    },
}
</script>

<style lang="scss" scoped>
</style>