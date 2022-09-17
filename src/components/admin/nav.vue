<!-- 后台 导航 -->
<template>
    <div class="nav">
        <div class="navBox">
            <div class="bigNav" v-for="(item, index) in allNav" :class="{
                bigNavActive: '/admin/' + item.path == $route.path || '/admin/' + item.path + '/' + $route.path.match(/\b\w+\b/g)[2] == $route.path
            }" @click="bigNavGo(item)">
                <div>
                    <span><i :class="item.icon"></i></span>
                    {{ item.name }}
                </div>
                <i class="el-icon-arrow-down navRightIco" v-show="item.children != null"></i>
                <div class="smallNav" v-show="item.children != null">
                    <p v-for="(itemb, indexb) in item.children" @click="smallNavGo(item, itemb)">{{
                            itemb.name
                    }}</p>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            allNav: "",
        }
    },
    methods: {
        bigNavGo(item) {
            if (!item.children) {
                this.$router.push('/admin/' + item.path);// 访问大导航
            }
        },
        smallNavGo(item, itemb) {
            this.$router.push('/admin/' + item.path + '/' + itemb.path);// 访问小导航
        }
    },
    mounted() {
        this.allNav = this.$router.options.routes[1].children[0].children;// 将大小导航数组赋给 nav
        // console.log('正则解析地址', this.$route.path.match(/\b\w+\b/g));
    },
}
</script>

<style lang="scss" scoped>
.bigNavActive {
    color: #fff !important;
}

.nav {
    width: 100%;
    height: 56px;
    background: linear-gradient(to bottom, var(--themeBackColor), var(--themeBackColor));

    .navBox {
        max-width: 1220px;
        padding: 0 10px;
        height: 100%;
        // background: orange;
        margin: auto;
        display: flex;
        vertical-align: top;

        >.bigNav:nth-of-type(1) {
            padding: 0 16px 0 0;
        }

        >.bigNav {
            width: 120px;
            height: 100%;
            // background: red;
            padding: 0 16px 0 0;
            display: flex;
            align-items: center;
            cursor: pointer;
            position: relative;
            color: #ffffff80;
            font-size: 14px;

            >.navRightIco {
                font-size: 12px;
                margin-left: 6px;
                transition: all .3s;
            }

            >.smallNav {
                width: 100%;
                height: 0;
                overflow: hidden;
                position: absolute;
                top: 56px;
                left: 0;
                background: #fff;
                border-radius: 0 0 4px 4px;

                >p:nth-of-type(1) {
                    margin-top: 5px;
                }

                >p:nth-last-of-type(1) {
                    border-radius: 0 0 4px 4px;
                }

                >p {
                    padding: 10px 20px;
                    color: #6c757d;
                    font-size: 14px;
                }

                >p:hover {
                    background: #e0effe;
                    color: var(--themeBackColor);
                }
            }
        }

        >.bigNav:hover {
            color: #fff;

            >.navRightIco {
                transform: rotate(180deg);
            }

            >.smallNav {
                height: max-content;
                box-shadow: 0 0 35px 0 rgba(154, 161, 171, .15);
                border: 1px solid #ddd;
            }
        }
    }
}
</style>