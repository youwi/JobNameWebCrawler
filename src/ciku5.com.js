



/**
 * 爬取 ciku5.com
 *
 * 使用jsp只能获取整个网页
 */
const path = require('path');

const cheerio = require('cheerio');
const request = require('then-request');
const fs = require("fs");

let qs = {
    citype:1,
    p:2
}


let url = 'http://www.ciku5.com/words'

async function getAll() {
    for (let i = 0; i < 1000; i++) {
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
    let list = $(".first a")
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
    let pobj = path.parse(module.filename);
    let filename = path.join(pobj.dir,"..", "data", pobj.name + ".json")
    fs.writeFileSync(filename, JSON.stringify(obj, 0, 4))
}

getAll()
