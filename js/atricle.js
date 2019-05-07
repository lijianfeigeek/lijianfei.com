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

// $.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function(data) {
//     // ip
//     const ip = data.geoplugin_request
//     // 国家
//     const country = data.geoplugin_countryName
//     // 省份
//     const region = data.geoplugin_region
//     // 城市
//     const city = data.geoplugin_city

//     let readerInfo = null

//     if(ip!=null & country!=null & region!=null & city != null){
//         readerInfo = {
//             ip,
//             country,
//             region,
//             city
//         }
//     }

//     if (readerInfo){
//         console.log(readerInfo)
//         // 根据id获取
//         const query_pv = new AV.Query('Atricle_pv')
//         query_pv.equalTo('atricle_objid',id)
//         query_pv.find().then(function (result) {
//             if(result.length >0){// 如果有直接写入
//                 let objectid = result[0].get('objectId')
//                 let atricleObject = AV.Object.createWithoutData('Atricle_pv', objectid);
//                 atricleObject.add('readerInfo', readerInfo);
//                 atricleObject.save()
//             }
//             else{// 如果没有创建一个
//                 var Atricle_pv = AV.Object.extend('Atricle_pv')
//                 var atricleObject = new Atricle_pv()
//                 atricleObject.set('atricle_objid',id);
//                 tricleObject.add('readerInfo', readerInfo);
//                 atricleObject.save()
//             }
//         }, function (error) {
//             console.error(error)
//         });
//     }
// })

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