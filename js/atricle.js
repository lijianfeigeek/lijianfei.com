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
var id = null
// 如果不包含&
if(!url.includes('&')){
    id = url.split('?')[1].split('=')[0]
}
else{
    id = url.split('&')[0].split('?')[1].split('=')[0]
}

var gitalk = new Gitalk({
    clientID: 'f4c9de56e72723b940b7', // 必须. GitHub Application Client ID.
    clientSecret: '20d2721ab67bc17d6a3cefc489d4ee669598d9a2', // 必须. GitHub Application Client Secret.
    repo: 'lijianfeigeek.github.io', // 必须. GitHub repository.
    owner: 'lijianfeigeek', // 必须. GitHub repository 所有者，可以是个人或者组织。
    admin: ['lijianfeigeek'], // 必须. GitHub repository 的所有者和合作者 (对这个 repository 有写权限的用户)。
    id: id,      // 页面的唯一标识。长度必须小于50。
    number:id, // 页面的 issue ID 标识，若未定义number属性则会使用id进行定位。
    labels:['Gitalk'], // GitHub issue 的标签。
    title :document.title, // GitHub issue 的标题。
    // body:location.href + header.meta[description], // GitHub issue 的内容。
    language :navigator.language || navigator.userLanguage, // 设置语言，支持 [en, zh-CN, zh-TW]。
    perPage :100,// 每次加载的数据大小，最多 100。
    distractionFreeMode: true , // 类似Facebook评论框的全屏遮罩效果.
    pagerDirection :'last',// 评论排序方式， last为按评论创建时间倒叙，first为按创建时间正序。
    createIssueManually : false, // 如果当前页面没有相应的 isssue 且登录的用户属于 admin，则会自动创建 issue。如果设置为 true，则显示一个初始化页面，创建 issue 需要点击 init 按钮。
    proxy :'https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token',// GitHub oauth 请求到反向代理，为了支持 CORS。
    flipMoveOptions :{
        staggerDelayBy: 150,
        appearAnimation: 'accordionVertical',
        enterAnimation: 'accordionVertical',
        leaveAnimation: 'accordionVertical'
    },// 评论列表的动画。
    enableHotKey :true // 启用快捷键(cmd|ctrl + enter) 提交评论.
  })
  
gitalk.render('gitalk-container')

const query = new AV.Query('Atricle')
query.get(id).then(function(result) {
    const title = result.get('title')
    const content = marked(result.get('content'))
    const time = result.createdAt.toLocaleString()
    atricleContentHTML(title, content, time)
}, function(error) {
    console.error(error)
})

function atricleContentHTML(title, content, time) {
    document.title = '李剑飞的博客 | ' + title
    document.getElementById('title').innerText = title
    document.getElementById('content').innerHTML = content
    document.getElementById('time').innerText = ' 李剑飞 创建于 ' + time + '   '
}

// 根据id获取
const query_pv = new AV.Query('Atricle_pv')
query_pv.equalTo('atricle_objid',id)
query_pv.find().then(function (result) {
    if(result.length >0){// 如果有直接读数
        let pv = result[0].get('pv')
        let objectid = result[0].get('objectId')
        atriclePV(pv)
        // 获得该对象
        let atricleObject = AV.Object.createWithoutData('Atricle_pv', objectid);
        atricleObject.increment('pv', 1);
        atricleObject.save()
    }
    else{// 如果没有创建一个，再读数
        var Atricle_pv = AV.Object.extend('Atricle_pv')
        var atricleObject = new Atricle_pv()
        atricleObject.set('atricle_objid',id);
        atricleObject.increment('pv', 1);
        atricleObject.save()
        atriclePV(0)
    }
}, function (error) {
    console.error(error)
});

function atriclePV(pv){
    document.getElementById('pv').innerText = pv    
}


//跳转网页
document.getElementById('title').addEventListener("click", function() {
    if (AV.User.current()) {
        window.location.href = 'updata.html?' + id
    }
}, false)

//引一下sohu这个 
//返回数据var returnCitySN = {"cip": "117.132.58.6", "cid": "370200", "cname": "山东省青岛市"};
{/* <script src="http://pv.sohu.com/cityjson?ie=utf-8"></script>    */}
//就能在用到的地方直接取到变量 returnCitySN啦

if (returnCitySN != null){
    // 根据id获取
    const query_pv = new AV.Query('Atricle_pv')
    query_pv.equalTo('atricle_objid',id)
    query_pv.find().then(function (result) {
        if(result.length >0){// 如果有直接写入
            let objectid = result[0].get('objectId')
            let atricleObject = AV.Object.createWithoutData('Atricle_pv', objectid);
            atricleObject.add('readerInfo', returnCitySN);
            atricleObject.save()
        }
        else{// 如果没有创建一个
            var Atricle_pv = AV.Object.extend('Atricle_pv')
            var atricleObject = new Atricle_pv()
            atricleObject.set('atricle_objid',id);
            tricleObject.add('readerInfo', returnCitySN);
            atricleObject.save()
        }
    }, function (error) {
        console.error(error)
    });
}