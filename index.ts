import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware'
import bodyParser from 'body-parser';

const app = express();


app.use(bodyParser.json())

app.use(createProxyMiddleware({
    target: 'https://openai80.p.rapidapi.com',
    pathRewrite: (path, req) => {
        return path.replace('v1/', '')
    },
    onProxyReq: function(proxyReq, req, res) {
        const auth = proxyReq.getHeader('Authorization');
        if(!auth) {
            return;
        } else {
            const key = [].concat(auth).join('').replace('Bearer ', '');
            proxyReq.setHeader("X-RapidAPI-Key", key);
            proxyReq.setHeader("X-RapidAPI-Host", 'openai80.p.rapidapi.com');
            proxyReq.setHeader('host', 'openai80.p.rapidapi.com');
            proxyReq.removeHeader('authorization');
            proxyReq.removeHeader('x-openai-client-user-agent');
            proxyReq.setHeader('user-agent', 'nodejs fetch')
        }
    }
}))

app.listen(9991);

