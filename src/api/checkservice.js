/**
 * 检测服务相关接口
 */

// 预约检测
const bookcheckUrl = "/api/bookingRecord/add";

// 检测项目
const checkItemsUrl = "/api/checkItem/all";

// 我的预约
const minebookingUrl = "/api/bookingRecord/list/mine";

// 预约详情
const bookingdetailUrl = "/api/bookingRecord/detail";

// 检测动态查询
const checkstatusqueryUrl = "";

// 检测动态详情
const checkstatusdetailUrl = "";

// 证书查询
const credentialqueryUrl = "/api/wxcredential/wxdetail";

// 证书详情
const credentialdetailUrl = "";

// 我的电子证书
const minecredentialUrl = "/api/wxCredentialUser/list/mine";

// 证书添加到卡包
const credentialaddtopackageUrl = "/api/wxCredentialUser/add/package";

// 我的电子发票
const minebillUrl = "/api/wxBillUser/list/mine";

// 发票添加到卡包
const billaddtopackageUrl = "/api/wxBillUser/add/package";


export {
	bookcheckUrl,
	checkItemsUrl,
	minebookingUrl,
	bookingdetailUrl,
	checkstatusqueryUrl,
	checkstatusdetailUrl,
	credentialqueryUrl,
	credentialdetailUrl,
	minecredentialUrl,
	credentialaddtopackageUrl,
	minebillUrl,
	billaddtopackageUrl
}
