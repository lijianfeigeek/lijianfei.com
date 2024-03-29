const uml = {
    openMarker: '@startuml',
    closeMarker: '@enduml',
    diagramName: 'uml',
    imageFormat: 'png'
}

const mindmap = {
    openMarker: '@startmindmap',
    closeMarker: '@endmindmap',
    diagramName: 'mindmap',
    imageFormat: 'png'
}

// 加载markdownit及其插件
var md = window.markdownit({
    html: true,
    linkify: true,
    typographer: true,
  })
.use(window.markdownitEmoji)
.use(window.markdownitPlantuml,uml)
.use(window.markdownitPlantuml,mindmap)
.use(window.markdownitImagelazyloading)
.use(window.markdownitContainer)

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

// var gitalk = new Gitalk({
//     clientID: 'f4c9de56e72723b940b7', // 必须. GitHub Application Client ID.
//     clientSecret: '20d2721ab67bc17d6a3cefc489d4ee669598d9a2', // 必须. GitHub Application Client Secret.
//     repo: 'lijianfeigeek.github.io', // 必须. GitHub repository.
//     owner: 'lijianfeigeek', // 必须. GitHub repository 所有者，可以是个人或者组织。
//     admin: ['lijianfeigeek'], // 必须. GitHub repository 的所有者和合作者 (对这个 repository 有写权限的用户)。
//     id: id,      // 页面的唯一标识。长度必须小于50。
//     distractionFreeMode: true , // 类似Facebook评论框的全屏遮罩效果.
// })
  
// gitalk.render('gitalk-container')

const query = new AV.Query('Atricle')
query.get(id).then(function(result) {
    const title = result.get('title')
    const content = md.render(result.get('content'))
    const time = result.createdAt.toLocaleString()
    atricleContentHTML(title, content, time)
    watermark.load()
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