//tag
let tag = location.search.split('?')[1] || ''
if (decodeURI(tag) == '首页') {
    tag = ''
}

// 开始查询
(function () {
    const query = new AV.Query('Atricle')
    query.limit(1000)
    query.descending('createdAt')
    // query.notEqualTo('hidden', 1) //hidden 不为 1 ，也就是不隐藏的。
    // query.contains('tag', decodeURI(tag)) //注意转码
    query.find().then(function(results) {
        let html = ''
        for (let i = 0; i <results.length; i++) {
            const id = results[i].id
            let title = results[i].get('title')
            title = title.length < 70 ? title : title.substring(0, 70) + '......' 
            let content = results[i].get('content')
            content = content.length < 100 ? content : content.substring(0, 100) + '......' 
            const time = results[i].createdAt.toLocaleString()
            html += atricleHTML(id, title, content, time)
        }
        document.getElementById('count').innerHTML = '嗯..！目前共计'+results.length+'篇日志。继续努力。'
        document.getElementById('content').innerHTML = html
    }, function(error) {
        console.error(error)
    })
})()

function atricleHTML(id, title, content, time) {
    return '<a class="item" href="atricle.html?' + id + '">' +
        '<h1 class="title">' + title + '</h1>' +
        // '<div class="atricle-content">' + content + '</div>' +
        '<div class="time">' + time + '</div></a>'
}

//发布文章
document.getElementById('admin').addEventListener('click', function() {
    if (AV.User.current()) {
        window.location.href = "updata.html"
    }else{
        window.location.href = "admin.html"
    }

}, false)


// let tagHTML = '标签：'
// const tagArr = tagStr.split(',')
// for (let i = 0; i < tagArr.length; i++) {
//     tagHTML += ' <a href="index.html?' + tagArr[i] + '">' + tagArr[i] + '</a>'
// }
// document.getElementById('tag').innerHTML = tagHTML

//标签按钮
// document.getElementById('btn').onclick = function() {
//     const tag = document.getElementById('tag')
//     if (this.innerText == "标签") {
//         this.innerText = "取消"
//         tag.style.visibility = 'visible'
//     } else {
//         this.innerText = "标签"
//         tag.style.visibility = 'hidden'
//     }
// }

var intStartTime;
var objIMG = new Image();
var bolIsRunning = false;
var intTimerID;
var intTimeout;

objIMG.onload = objIMG.onerror = function() {
    /* 
* 有回应,取消超时计时 
*/
    clearTimeout(intTimerID);
    if (!bolIsRunning || bolIsTimeout) return;
    var delay = new Date() - intStartTime;
    document.getElementById('ping').innerHTML = "ping" +((delay < 1) ? ("<1") : (":" + delay)) + "ms"
    // console.log(delay)
    // println("Reply from " + strURL + " time" + ((delay < 1) ? ("<1") : ("=" + delay)) + "ms");
    // arrDelays.push(delay);
    /* 
* 每次请求间隔限制在1秒以上 
*/
    setTimeout(ping, delay < 1000 ? (1000 - delay) : 1000);
}
function ping() {
    /* 
* 发送请求 
*/
    intStartTime = +new Date();
    intSent++;
    objIMG.src = strURL //+ "/" + intStartTime;
    bolIsTimeout = false;
    /* 
* 超时计时 
*/
    intTimerID = setTimeout(timeout, intTimeout);
}
function timeout() {
    if (!bolIsRunning) return;
    bolIsTimeout = true;
    objIMG.src = "X:\\";
    // println("Request timed out.");
    ping();
}

var strURL = "lijianfei.com";
if (strURL.substring(0, 7).toLowerCase() != "http://") strURL = "http://" + strURL;
intTimeout = parseInt(2000, 10);
if (isNaN(intTimeout)) intTimeout = 2000;
if (intTimeout < 1000) intTimeout = 1000;
bolIsRunning = true;
intSent = 0;
ping();