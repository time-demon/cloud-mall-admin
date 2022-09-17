<!-- 后台  自编面包屑-->
<template>
    <div>
        <div class="webPageTitleBox">
            <p class="title">{{ $route.name }}</p>
            <p class="position">
                <el-tooltip class="item" effect="dark" content="后台首页" placement="bottom-end">
                    <span class="home" @click="homeGo">首页</span>
                </el-tooltip>&nbsp;
                <span class="el-icon-arrow-right"></span>&nbsp;
                <span class="thisTitle">{{ $route.name }}</span>
            </p>

        </div>
    </div>
</template>

<script>
export default {
    methods: {
        // 回到后台首页
        homeGo() {
            this.$router.push("/admin");
        },
    },
}
</script>

<style lang="scss">
.webPageTitleBox {
    display: flex;
    vertical-align: top;
    justify-content: space-between;
    align-items: center;
    height: 85px;

    >.title {
        font-size: 18px;
        font-weight: 300;
        color: var(--themeBackColor);
    }

    >.position {
        font-size: 15px;
        font-weight: 300;

        >.home {
            color: var(--themeBackColor);
            cursor: pointer;
        }

        >.thisTitle {
            color: #adb5bd;
        }
    }
}
</style>

