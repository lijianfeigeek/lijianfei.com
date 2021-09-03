//tag
let tag = location.search.split('?')[1] || ''
if (decodeURI(tag) == '首页') {
    tag = ''
}

// 开始查询
(function () {
    const query = new AV.Query('Atricle')
    // 先查询数量
    query.count().then(function (count) {
        // 1000以内
        if(count<=1000){
            query.limit(count)
            query.descending('createdAt')
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
                watermark.load()
            }, function(error) {
                console.error(error)
            })
        }
        else if(count>1000){
            // 1000以外 
            // 几个1000
            let num_thousand = count % 1000
            let results = []
            for(let i = 0;i<=num_thousand;i++)
            {
                let i_thousand = i*1000
                query.limit(count)
                query.descending('createdAt')
                query.find().then(function(i_results) {
                    results = results.concat(i_results)
                }, function(error) {
                    console.error(error)
                })
            }
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
            watermark.load()
        }
    }, function (error) {
        console.error(error)
    });
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
