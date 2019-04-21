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
    atricleContentHTML(title, content, time,tag)
}, function(error) {
    console.error(error)
})

function atricleContentHTML(title, content, time,tag) {
    document.title = '李剑飞的博客 | ' + title
    document.getElementById('title').innerText = title
    document.getElementById('content').innerHTML = content
    document.getElementById('time').innerText = '李剑飞 创建于 ' + time
}

//跳转网页
document.getElementById('title').addEventListener("click", function() {
    if (AV.User.current()) {
        window.location.href = 'updata.html?' + id
    }
}, false)