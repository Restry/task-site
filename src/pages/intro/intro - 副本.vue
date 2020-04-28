<template>
	<view>

		<cu-custom bgColor="bg-gradual-blue" class="nav-bar" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">编辑资料</block>
		</cu-custom>


			<view class="cu-bar bg-white margin-top">
				<view class="action">
					头像
				</view>
				<view class="action">
					1/4
				</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" :data-url="imgList[index]" @tap="ViewImage">
					 <image :src="imgList[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>





		<view class="cu-form-group margin-top">
			<view class="title">头像</view>
			<view class="cu-avatar radius bg-gray"></view>
		</view>

	
		<!-- list1 -->
		<view  class="cu-list menu solid-top margin-top-xs">

			<view  class="cu-item">
				<view  class="content">
					<text  class="text-black">昵称</text>
				</view>
				<view  class="action">
					<text class="text-grey"> bool </text>
					<text class="text-grey text-sm cuIcon-right margin-left"></text>
				</view>
			</view>

			<!-- 性别 -->
			<view  class="cu-item">
				<view  class="content">
					<text  class="text-black">性别</text>
				</view>
				<view  class="action">
					<text class="text-grey"> 男 </text>
					<text class="text-grey text-sm cuIcon-right margin-left"></text>
				</view>
			</view>
			
			<!-- 生日 -->
			<view  class="cu-item">
				<view  class="content">
					<text  class="text-black">生日</text>
				</view>
				<view  class="action">
					<text class="text-grey"> 1993-08-09 </text>
					<text class="text-grey text-sm cuIcon-right margin-left"></text>
				</view>
			</view>
			
			<!-- 邮箱 -->
			<view  class="cu-item">
				<view  class="content">
					<text  class="text-black">邮箱</text>
				</view>
				<view  class="action">
					<text class="text-grey"> 30024167@qq.com </text>
					<text class="text-grey text-sm cuIcon-right margin-left"></text>
				</view>
			</view>	
			
			<!-- 手机号 -->
			<view  class="cu-item">
				<view  class="content">
					<text  class="text-black">手机号</text>
				</view>
				<view  class="action">
					<text class="text-grey"> 185****2124 </text>
					<text class="text-grey text-sm cuIcon-right margin-left"></text>
				</view>
			</view>
			
			<!-- 居住地 -->
			<view  class="cu-item">
				<view  class="content">
					<text  class="text-black">居住地</text>
				</view>
				<view  class="action">
					<text class="text-grey"> 徐州市 </text>
					<text class="text-grey text-sm cuIcon-right margin-left"></text>
				</view>
			</view>	
			
			
		</view>			
		
	
	
	





	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgList: [
					'https://ossweb-img.qq.com/images/lol/img/champion/Taric.png'
				],
			};
		},
		methods: {
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '召唤师',
					content: '确定要删除这段回忆吗？',
					cancelText: '再看看',
					confirmText: '再见',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			ChooseImage() {
				uni.chooseImage({
					count: 4, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths)
						} else {
							this.imgList = res.tempFilePaths
						}
					}
				});
			},
			
		}
	}
</script>

<style>
page{
  padding-bottom: 100upx;
}
</style>
