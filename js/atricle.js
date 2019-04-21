marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true, //开启github的markdown
    tables: true, //支持Github表格，必须打开gfm选项
    breaks: true, //支持Github换行符，必须打开gfm选项
    pedantic: false, //只解析符合markdown.pl定义的，不修正markdown的错误
    sanitize: false, //忽略HTML标签
    smartLists: true,//使用新语法
    smartypants: false,//使用新语法，比如在引用语法中加入破折号。
    highlight: function (code) { //插件代码高亮
        return hljs.highlightAuto(code).value
    }
})


//获取url，剪切出id
const url = location.search
const id = url.split('?')[1].split('=')[0]

const query = new AV.Query('Atricle')
query.descending('createdAt')
query.limit(1000)
query.get(id).then(function(result) {
    const title = result.get('title')
    const content = marked(result.get('content'))
    const time = result.createdAt.toLocaleString()
    const tag = result.get('tag')
    // const newTime = result.updatedAt.toLocaleString()

    atricleContentHTML(title, content, time,tag)
    readTime('readTime', content)
}, function(error) {
    console.error(error)
})

function atricleContentHTML(title, content, time,tag) {
    document.title = '李剑飞的博客 | ' + title
    document.getElementById('title').innerText = title
    document.getElementById('content').innerHTML = content
    document.getElementById('time').innerText = '李剑飞 创建于 ' + time
    // if(time == newTime)
    // {
    //     document.getElementById('time').innerText = '创建于 ' + time
    // }
    // else
    // {
    //     document.getElementById('time').innerText = '更新于 ' + newTime + '\n' +'创建于 ' + time
    // }

    // let tagHTML = '标签：'
    // var tagArr = tag.split(',')
    // for (let i = 0; i < tagArr.length; i++) {
    //     tagHTML += ' <a href="index.html?' + tagArr[i] + '">' + tagArr[i] + '</a>'
    // }
    // document.getElementById('tag').innerHTML = tagHTML
}

//跳转网页
document.getElementById('title').addEventListener("click", function() {
    if (AV.User.current()) {
        window.location.href = 'updata.html?' + id
    }
}, false)

function readTime(b, wordcount) {
  var read_time= wordcount.length / 400; //计算阅读时间
  var read_time= Math.round(read_time); //四舍五入
  if(read_time > 1){
      document.getElementById(b).innerHTML = '预计阅读时间：'+read_time + '分钟'
  } else{
      document.getElementById(b).innerHTML = '预计阅读时间：1分钟'
  }
}


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

var gitalk = new Gitalk({
    clientID: 'f4c9de56e72723b940b7',
    clientSecret: '20d2721ab67bc17d6a3cefc489d4ee669598d9a2',
    repo: 'lijianfeigeek.github.io',
    owner: 'lijianfeigeek',
    admin: ['lijianfeigeek'],
    id: location.pathname,      // Ensure uniqueness and length less than 50
    distractionFreeMode: false  // Facebook-like distraction free mode
  })
  
gitalk.render('gitalk-container')