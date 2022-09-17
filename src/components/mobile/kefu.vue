<template>
    <div>
        <van-action-sheet v-model="kefuCard.kfShow" :actions="kfActions" @select="kfOnSelect" />
    </div>
</template>

<script>
export default {
    props: ['kefuCard'],
    data() {
        return {
            kfShow: true,
            kfActions: [
                { name: 'QQ客服', },
                { name: '微信客服', },
                { name: '人工客服', }
            ],
        }
    },
    methods: {

        // 客服方式选中按钮
        kfOnSelect(item) {
            this.kfShow = false;
            console.log(item.name);
        },

    },
}
</script>

<style lang="scss">
</style>