// 模拟 apiGateway 和 serverless 执行环境
const vm = require('vm');
const http = require('http');

process.on('message', function (encodedPayload) {
    const { sharedLayer, routes } = JSON.parse(encodedPayload);
    const SERVERLESS = { functions: {} };
    vm.runInNewContext(sharedLayer, { SERVERLESS, console }, { displayErrors: true });
    startServer({ ...SERVERLESS, routes });
});

async function startServer(options) {
    await options.insertTestData();
    http.createServer(handleRoute.bind(undefined, options)).listen(3000);
    console.log('api gateway started @3000');
}

async function handleRoute(options, req, resp) {
    resp.setHeader('Access-Control-Allow-Origin', '*');
    // CORS 有一个预检
    if (req.method === 'OPTIONS') {
        resp.setHeader('Access-Control-Allow-Headers', '*');
        resp.end('');
        return;
    }
    const route = options.routes[req.url];
    if (!route) {
        resp.end(JSON.stringify({ error: `no route defined for ${req.url}` }));
        return;
    }
    const func = options.functions[route.functionName];
    if (!func) {
        resp.end(JSON.stringify({ error: `no function defined for ${route.functionName}` }));
        return;
    }
    try {
        await func(req, resp);
    } catch (e) {
        resp.end(JSON.stringify({ error: new String(e) }));
        return;
    }
}
