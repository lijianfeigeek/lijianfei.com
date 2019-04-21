const APP_ID = '4D8qaIDla4x2T47v9NLqKBQJ-gzGzoHsz';
const APP_KEY = 'syQtaEx2WQP3YjntYqRmhCr6';

window.AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});

var analytics = AV.analytics({
    appId: APP_ID,
    appKey: APP_KEY,
    // 你当前应用或者想要指定的版本号
    version: '1.0.0',
    // 你当前应用的渠道或者你想指定的渠道
    channel: 'web',
    // 选择服务地区（默认为国内节点）
    region: 'cn'
})
