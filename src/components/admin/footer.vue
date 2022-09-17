<!-- 后台 页面底部 -->
<template>
    <div class="footer">
        <div class="footerBox">
            <div>
                {{ nowYear }} © All rights reserved. <img src="@/assets/img/logo.png" alt="" style="height: 15px;">
                {{ this.$route.meta.webConfig.webName }}.
            </div>
            <div>
                Author 时光. <a target="_blank"
                    href="http://wpa.qq.com/msgrd?v=3&uin=1937966358&site=qq&menu=yes">联系作者</a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            nowYear: '',
        }
    },
    mounted() {
        // 获取现在的年份
        this.nowYear = new Date().getFullYear();
    },
}
</script>

<style lang="scss" scoped>
.footer {
    width: 100%;
    height: 60px;
    background: #fff;
    border-top: 1px solid #dddd;

    >.footerBox {
        max-width: 1220px;
        padding: 10px;
        height: 100%;
        // background: orange;
        margin: auto;
        font-size: 15px;
        color: #98a6ad;
        display: flex;
        vertical-align: top;
        justify-content: space-between;
        align-items: center;
    }
}
</style>