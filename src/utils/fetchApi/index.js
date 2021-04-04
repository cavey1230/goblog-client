import {showToast} from "@/utils/lightToast";

export function Http(url, errorCodeTable = {}, token = "") {
    this.baseUrl = url ? url : "http://localhost:5000"
    this.errorCodeTable = errorCodeTable
    this.token = token
}

Http.prototype.setBaseUrl = function (urlParam) {
    this.baseUrl = urlParam
}

Http.prototype.getBaseUrl = function () {
    return this.baseUrl
}

Http.prototype.setToken = function (tokenString) {
    this.token = tokenString
}

Http.prototype.getToken = function () {
    return this.token
}

Http.prototype.getConcatUrl = function (address) {
    return `${this.baseUrl}${address}`
}

Http.prototype.mapObjectToUrl = function (object) {
    const urlString = Object.keys(object).map(item => {
        if (object[item]) {
            return `${item}=${object[item]}`
        }
    }).filter(i => i).join("&")
    return "?" + urlString
}

Http.prototype.initConfig = function (moreConfig = {}) {
    let innerHeaders
    if (moreConfig.hasOwnProperty("headers")) {
        innerHeaders = moreConfig.headers
        delete moreConfig.headers
    }
    return {
        method: "GET",
        headers: {
            "Accept": "*/*",
            "Content-Type": "application/json;charset=utf-8",
            "Authorization": this.token ? `Bearer ${this.token}` : "",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
            ...innerHeaders
        },
        // credentials: 'include',//允许客户端携带cook
        mode: 'cors',
        ...moreConfig
    }
}

Http.prototype.baseApi = function (url, moreConfig = {}) {
    const haveToken = localStorage.getItem("token")
    haveToken && (haveToken !== this.token) && this.setToken(haveToken)
    return new Promise((resolve, reject) => {
        fetch(url, this.initConfig(moreConfig)).then(async response => {
            const result = await response.json()
            result["status"] !== 200 &&
            Object.keys(this.errorCodeTable).map(item => {
                result["status"] === Number(item) &&
                showToast(this.errorCodeTable[item], "error")
            });
            resolve(result)
        }).catch(err => {
            console.warn(err)
            reject(err)
        })
    })
}

Http.prototype.GET = function (address, data) {
    const baseUrl = this.getConcatUrl(address)
    let url = data ? baseUrl + this.mapObjectToUrl(data) : baseUrl
    return this.baseApi(url)
}

Http.prototype.POST = function (address, data) {
    return this.baseApi(this.getConcatUrl(address), {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

Http.prototype.PUT = function (address, data) {
    return this.baseApi(this.getConcatUrl(address), {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

Http.prototype.DELETE = function (address) {
    return this.baseApi(this.getConcatUrl(address), {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

Http.prototype.UPLOAD = function (address, data) {
    const haveToken = localStorage.getItem("token")
    const config = {
        method: "POST",
        headers: {
            "Accept": "*/*",
            "Authorization": this.token ? `Bearer ${this.token}` : "",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        },
        mode: 'cors',
        body: data
    }
    haveToken && (haveToken !== this.token) && this.setToken(haveToken)
    return new Promise((resolve, reject) => {
        fetch(this.getConcatUrl(address), config).then(async response => {
            const result = await response.json()
            result["status"] !== 200 &&
            Object.keys(this.errorCodeTable).map(item => {
                result["status"] === Number(item) &&
                showToast(this.errorCodeTable[item], "error")
            });
            resolve(result)
        }).catch(err => {
            console.warn(err)
            reject(err)
        })
    })
}

const devAddress = "http://localhost:5000/api/v1"
const productionAddress = "http://121.4.169.10:5000/api/v1"

export const GoblogApiV1 = new Http(productionAddress, {
    //CODE = 1000...用户模块的错误
    "200": "OK",
    "500": "FAIL",
    "1001": "用户名已存在",
    "1002": "密码错误",
    "1003": "用户不存在",
    "1004": "TOKEN不存在",
    "1005": "TOKEN过期",
    "1006": "TOKEN不正确",
    "1007": "TOKEN格式错误",
    "1008": "暂无用户数据",
    "1009": "角色状态异常",
    //CODE = 2000...文章模块的错误
    "2001": "文章分类已占用",
    "2002": "暂无分类数据",
    //CODE = 3000...分类模块的错误
    "3001": "文章标题已占用",
    "3002": "文章不存在",
    "3003": "文章列表为空",
    "3004": "精品文章列表为空",
    //CODE = 4000...个人信息模块的错误
    "4001": "获取个人信息失败",
    "4002": "没有个人信息",
    //CODE = 5000...工具链接地址模块的错误
    "5001": "工具链接地址获取错误",
    "5002": "工具链接地址编辑错误",
    //CODE = 6000...友情链接地址模块的错误
    "6001": "友情链接获取错误",
    "6002": "友情链接编辑错误",
    //CODE = 7000...版权信息模块的错误
    "7001": "版权信息获取错误",
    "7002": "版权信息编辑错误",
})