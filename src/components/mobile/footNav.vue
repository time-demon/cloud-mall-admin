<template>
    <div>
        <van-tabbar v-model="active">
            <van-tabbar-item v-for="item in navData" :name="item.name" :icon="item.icon" @click="navGo(item)">
                {{ item.nameC }}
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
export default {
    watch: {
        $route(to, form) {
            console.log(to);
            console.log(form);
        }
    },
    data() {
        return {
            active: './',
            onChange(event) {
                // event.detail 的值为当前选中项的索引
                this.setData({ active: event.detail });
            },
            navData: [
                {
                    name: './',
                    nameC: '首页',
                    icon: 'home-o',
                },
                {
                    name: 'class',
                    nameC: '分类',
                    icon: 'cluster-o',
                },
                {
                    name: 'order',
                    nameC: '订单',
                    icon: 'search',
                },
                {
                    name: 'shopCart',
                    nameC: '购物车',
                    icon: 'shopping-cart-o',
                },
                {
                    name: 'user',
                    nameC: '个人中心',
                    icon: 'user-circle-o',
                },
            ],
        }
    },
    mounted() {
        this.active = this.$route.path.match(/\b\w+\b/g)[1];
    },
    methods: {
        navGo(item) {
            console.log(this.$route.path);
            if (this.$route.path == '/mobile') {
                this.$router.push('mobile/' + item.name);
            } else {
                this.$router.push(item.name);
            }
        }
    },
}
</script>