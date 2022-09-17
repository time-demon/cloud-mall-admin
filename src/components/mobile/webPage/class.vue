<!-- 移动端 商品分类 -->
<template>
    <div>
        <van-nav-bar :title="$route.name" left-text="返回" left-arrow>
            <template #left>
                <van-image round width="0.75rem" height="0.75rem" src="https://xc.timebk.cn/assets/img/user.png"
                    @click="user" />
            </template>
            <template #right>
                <van-icon name="search" size="18" />
            </template>
        </van-nav-bar>
    </div>
</template>

<script>
export default {
    methods: {

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
</style>