// 模拟 apiGateway 和 serverless 执行环境
const vm = require('vm');
const http = require('http');


process.on('message', function (encodedPayload) {
    const { sharedLayer, routes } = JSON.parse(encodedPayload);
    const SERVERLESS = {
        configureMemCloud: async() => {
            return {};
        },
        functions: {}
    };
    vm.runInNewContext(
        sharedLayer,
        {
            SERVERLESS,
            console,
        },
        { displayErrors: true },
    );
    startServer({
        ...SERVERLESS,
        routes
    });
});

async function startServer(options) {
    const { serviceProtocol, database } = await options.configureMemCloud();
    http.createServer((req, resp) => {
        let reqBody = '';
        req.on('data', (chunk) => {
            reqBody += chunk;
        });
        req.on('end', async () => {
            resp.setHeader('Access-Control-Allow-Origin', '*')
            // CORS 有一个预检
            if (req.method === 'OPTIONS') {
                resp.setHeader('Access-Control-Allow-Headers', '*')
                resp.end('');
                return;
            }
            console.log('!!!', reqBody);
            resp.end('');
        });
    }).listen(3000);
}
