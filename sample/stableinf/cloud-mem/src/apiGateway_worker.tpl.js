const SERVERLESS = { functions: {} }; $sharedLayer

SERVERLESS.routes = $routes;

const http = require('http');
startServer();

async function startServer() {
    http.createServer(handleRoute).listen(3000);
    console.log('api gateway worker started @3000');
}

async function handleRoute(req, resp) {
    resp.setHeader('Access-Control-Allow-Origin', '*');
    // CORS 有一个预检
    if (req.method === 'OPTIONS') {
        resp.setHeader('Access-Control-Allow-Headers', '*');
        resp.end('');
        return;
    }
    const route = SERVERLESS.routes[req.url];
    if (!route) {
        const error = `no route defined for ${req.url}`;
        console.warn(error);
        resp.end(JSON.stringify({ error }));
        return;
    }
    const func = SERVERLESS.functions[route.functionName];
    if (!func) {
        const error = `no function defined for ${route.functionName}`;
        console.error(error);
        resp.end(JSON.stringify({ error }));
        return;
    }
    try {
        await func(req, resp);
    } catch (e) {
        resp.end(JSON.stringify({ error: new String(e) }));
        return;
    }
}
