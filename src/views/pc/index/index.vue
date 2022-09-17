<!-- 首页 -->
<template>
    <div>
        <router-view></router-view>
        <p>首页</p>
        <router-link to="admin">点我</router-link>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
p {
    font-size: 20px;
}
</style>