<template>
    <div>
        <van-sku v-model="goodsBuyCard.goodsBuyShow" :sku="goodsBuyCard.sku" :goods="goodsBuyCard.goods"
            :goods-id="goodsBuyCard.goodsId" :quota="goodsBuyCard.quota" :quota-used="goodsBuyCard.quotaUsed"
            :hide-stock="goodsBuyCard.sku.hide_stock" :custom-stepper-config="goodsBuyCard.customStepperConfig" />
    </div>
</template> 

<script>
export default {
    props: ["goodsBuyCard"],
}
</script>

<style lang="scss">
</style>