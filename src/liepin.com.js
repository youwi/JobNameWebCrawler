/**
 * 怕取zhaoping.com
 *
 * 使用asp只能获取整个网页
 */
const path = require('path');

const cheerio = require('cheerio');
const request = require('then-request');
const fs = require("fs");

let qs = {
    fromSearchBtn: 2,
    ckid: '5e54ddef153a7b1d',
    degradeFlag: 0,
    init: -1,
    salary: '15$20',
    headckid: '0736e1e520f28984',
    d_pageSize: 40,
    siTag: '1B2M2Y8AsgTpgAmY7PhCfg~VUY7fE5tNQwSXrVfrBCPqw',
    d_headId: '7bc22f7e0083e5dce59ca8c1aa3793b7',
    d_ckId: '5ca3ea41c7ef1ba287836a316726b8fe',
    d_sfrom: 'search_unknown',
    d_curPage: 2,
    curPage: 3
}


let url = 'https://www.liepin.com/zhaopin/'

async function getAll() {
    for (let i = 0; i < 10; i++) {
        qs.curPage = i
        console.log(url + " @ " + qs.curPage)
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
    let list = $(".job-info h3")
    try {
        list.map((i, t) => OUT_LIST.push(t.attribs.title))
    } catch (err) {
        console.log(err)
    }
}

function unique(arr) {
    const seen = new Map()
    return arr.filter((a) => !seen.has(a) && seen.set(a, 1))
}

function writeToFile(obj) {
    let pobj = path.parse(module.filename);
    let filename = path.join(pobj.dir,"..", "data", pobj.name + ".json")
    fs.writeFileSync(filename, JSON.stringify(obj, 0, 4))
}

getAll()
