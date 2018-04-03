/**
 * 怕取zhaoping.com
 *
 * 使用asp只能获取整个网页
 */

const cheerio = require('cheerio');
const request = require('then-request');
const fs = require("fs");

let qs = {
    jl: "上海",
    sm: 0,
    p: 1
}

let url = 'https://sou.zhaopin.com/jobs/searchresult.ashx'

async function getAll() {
    for (let i = 0; i < 100; i++) {
        qs.p = i
        console.log(url + " @ " + qs.p)
        let body = await getAsync(url, qs)
        parseHtml(body)
    }

    writeToFile(unique(OUT_LIST))
}

async function getAsync(url, qs) {
    try {
        let response = await request("GET", url, {url, qs});
        return await response.getBody()
    } catch (err) {
        console.log(err)
    }

}

let OUT_LIST = []

//解析html 获取内容
function parseHtml(result) {
    let $ = cheerio.load(result);
    let list = $(".zwmc a")
    try {
        list.map((i, t) => OUT_LIST.push(t.children[0].data))
    } catch (err) {
        console.log(err)
    }
}

function unique(arr) {
    const seen = new Map()
    return arr.filter((a) => !seen.has(a) && seen.set(a, 1))
}

function writeToFile(obj) {

    fs.writeFileSync(module.filename + "on", JSON.stringify(obj, 0, 4))
}

getAll()
