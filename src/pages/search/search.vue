<template>
	<view class="search-box">
		<cu-custom bg-color="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">搜索</block>
		</cu-custom>
		
		<zy-search :is-focus="true" :is-block="true" :show-want="true"></zy-search>
	</view>
</template>

<script>
	import zySearch from '@/components/zy-search/zy-search.vue'
	export default {
		components: {
			zySearch
		}
	}
</script>

<style>
	.search-box{
		background: #FFFFFF;
		height: 100vh;
		width: 100vw;
	}
</style>
