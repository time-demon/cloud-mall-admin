<!-- 后台 管理员 登录&注册页面 公共布局 -->
<template>
    <div class="verifyBox">
        <div class="verifyBox-center" :style="{ 'display': BoxDIsplay, 'width': BoxWidth }">

            <div class="leftBox" :style="{ 'display': leftBoxDIsplay }">
                <div class="leftTitle">
                    <h1>
                        <img src="@/assets/img/logo.png" alt="">
                        <!-- <span>{{ this.$route.meta.webConfig.webName }}</span> -->
                    </h1>
                    <!-- <p class="subTitle">{{ this.$route.meta.webConfig.sub_webName }}</p> -->
                </div>
                <img src="@/assets/img/login/background2.gif" alt="">
            </div>

            <router-view class="rightBox" />

        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            BoxDIsplay: "grid",// 验证盒子的布局
            BoxWidth: "900px",// 验证盒子的宽度
            leftBoxDIsplay: "",// 左边盒子的显隐
        }
    },
    mounted() {
        const _this = this;
        function onresize() {// 动态改变函数
            _this.leftBoxDIsplay = document.body.clientWidth < 768 ? "none" : "";// 小屏幕左边盒子隐藏
            _this.BoxDIsplay = document.body.clientWidth < 768 ? "" : "grid";//小屏幕大盒子布局 
            _this.BoxWidth = document.body.clientWidth < 950 ? "90%" : "900px";// 小屏幕大盒子宽度
        } onresize();// 挂载后自调用动态改变函数
        window.onresize = () => {// js原生动态监听
            onresize();// 调用动态改变函数
        };

        // loding 遮罩
        const loading = this.$loading({
            lock: true,
            text: '验证中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        setTimeout(() => {
            loading.close();
            // 检测token是否存在
            // if (localStorage.getItem('Authorization') !== null || localStorage.getItem('Authorization') != "") {
            //     this.$router.push('/admin');
            // };
        }, 500);
    },
}
</script>

<style lang="scss" scoped>
.verifyBox {
    width: 100%;
    height: 100%;
    background: url(@/assets/img/login/background.jpg) no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    >.verifyBox-center {
        min-height: 470px;
        background: #fff;
        border-radius: 4px;
        grid-template-columns: 50% 50%;
        grid-template-rows: 100%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

        >.leftBox {
            position: relative;
            padding-top: 60px;

            >.leftTitle {
                padding-left: 60px;

                >h1 {
                    font-weight: 300;
                    letter-spacing: 2.5px;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    >img {
                        width: auto;
                        max-width: 40px;
                        height: 40px;
                        margin-right: 10px;
                    }
                }

                >.subTitle {
                    font-weight: 300;
                    font-size: 13px;
                    text-align: center;
                    margin-top: 10px;
                    letter-spacing: 1px;
                }
            }

            >img {
                width: auto;
                max-width: 400px;
                height: 300px;
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
            }

        }

        >.rightBox {
            padding: 40px;
        }
    }
}
</style>