<template>
    <div>
        <van-nav-bar :title="goodsData.name + ' - 商品详情'" left-text="返回" left-arrow>
            <template #left>
                <van-icon name="arrow-left" size="18" @click="home" />
            </template>
            <template #right>
                <van-icon name="share-o" size="18" />
            </template>
        </van-nav-bar>
    </div>
</template>

<script>
export default {
    props: ["goodsData"],
    methods: {

        // 访问个人中心
        home() {
            this.$router.push('/mobile')
        },
    },
}
</script>

<style lang="scss" scoped>
</style>