<!-- 后台界面入口 -->
<template>
    <div class="allBox " v-show="true">
        <Header />

        <Nav />

        <router-view class="webPageBox" />

        <Footer />

        <Backtop />
    </div>
</template>

<script>
import Header from "@/components/admin/header"; // 头部
import Nav from "@/components/admin/nav"; // 导航
import Footer from "@/components/admin/footer";// 底部
import Backtop from "@/components/more/backtop";// 右下角回到顶部按钮
export default {
    components: {
        Header,
        Nav,
        Footer,
        Backtop,
    },
    data() {
        return {
            pageShow: false,
        }
    },
    watch: {
        $route(to, from) {
            this.pageLoading(200);// 路由有变化时调用整页加载遮罩
        }
    },
    mounted() {
        this.pageLoading(200);// 挂载后调用整页加载遮罩
    },
    methods: {

        //整页加载遮罩
        pageLoading(time) {
            const loading = this.$loading({
                lock: true,
                text: '加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            setTimeout(() => {
                loading.close();
                this.pageShow = true;
            }, time)
        }
    },

}
</script>

<style lang="scss">
.allBox {
    height: 100% !important;
    position: relative;

    >.webPageBox {
        max-width: 1220px;
        margin: auto;
        min-height: calc(100vh - 186px);
        padding: 10px;
    }
}


// 以下是 后台页面 的公共样式
:root {
    --themeBackColor: #4A8FA1;
    --spacing: 20px;
}

::-webkit-scrollbar {
    width: 6px;
    /*对垂直流动条有效*/
    height: 6px;
    /*对水平流动条有效*/
}

/*定义滚动条的轨道颜色、内阴影及圆角*/
::-webkit-scrollbar-track {
    border-radius: 4px;
    /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3); */
    /* background-color: rosybrown; */
}

/*定义滑块颜色、内阴影及圆角*/
::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: var(--themeBackColor);
    /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3); */
}

/*定义滑块悬停变化颜色、内阴影及圆角*/
::-webkit-scrollbar-thumb:hover {
    background-color: #c7c9cc;
}

.el-cascader-node.in-active-path {
    color: var(--themeBackColor) !important;
}

input:focus {
    border: 1px solid var(--themeBackColor) !important;
}

.el-button--text {
    color: var(--themeBackColor) !important;
}

.el-button--text:hover {
    opacity: .7;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
    background: var(--themeBackColor) !important;
    ;
}

.el-select-dropdown__item.selected {
    color: var(--themeBackColor) !important;
}

.el-switch.is-checked .el-switch__core {
    background: var(--themeBackColor) !important;
    border: 1px solid var(--themeBackColor) !important;
}

.el-slider__bar {
    background: var(--themeBackColor) !important;
}

.el-slider__button {
    border: 1px solid var(--themeBackColor) !important;
}

.el-button--primary {
    background: var(--themeBackColor) !important;
    border: 1px solid var(--themeBackColor) !important;

}

.el-dialog__title {
    color: var(--themeBackColor) !important;
}

::selection {
    background: var(--themeBackColor);
    color: #ffffff;
}
</style>