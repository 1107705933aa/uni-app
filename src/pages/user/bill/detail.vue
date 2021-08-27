<template>
	<view class="">
		<web-view :src="viewUrl" style="width: 100vw;height: scle(100vh-50px);"></web-view>
	<!-- 	<view class="pdf_view" id="pdt_content">

		</view> --> 
	</view>
</template>

<script>
import pdfobject from 'pdfobject';
	export default {
		data() {
			return {
				viewUrl: ""
			}
		},
		onLoad(option) {
			this.viewUrl = option.billUrl
		},onReady() {
			pdfobject.embed(this.viewUrl,'#pdt_content')
		}
	}
</script>

<style>
	.pdf_view {
		width: 100%;
		height: 200px;
	}

	.pdfobject-container {
		width: 100%;
		height: 200px;
		margin: 2em 0;
	}
</style>
