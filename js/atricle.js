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
    document.title = title
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