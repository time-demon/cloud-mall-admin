<!-- 手机端 入口 -->
<template>
    <div class="mobileBox">

        <router-view class="webPage" />

        <FootNav class="footNav" />
    </div>
</template>

<script>
// 移动端适配
import 'amfe-flexible';

import FootNav from '@/components/mobile/footNav'
export default {
    components: {
        FootNav
    },
}
</script>

<style lang="scss">
.mobileBox {
    min-height: 100%;

    >.webPage {
        width: 100vw;
        background: #f8f8f8;
        height: auto;
        min-height: 100vh;
        padding-bottom: 50px;
    }
}
</style>