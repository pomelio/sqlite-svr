const dotenv = require("dotenv");
dotenv.config();
const Router = require("koa-router");
const { koaBody } = require('koa-body');
var serve = require('koa-static');



const Koa = require("koa");
const cors = require("@koa/cors");

const logger = require("./logger");

const {jwtDecode} = require('./utils');

const koaInstance = new Koa();

let publicFolder = process.cwd() + '/public';
koaInstance.use(serve(publicFolder));


let api = {};


koaInstance.use(async (ctx, next) => {
	ctx.set('Access-Control-Allow-Origin', '*');
	ctx.set('Access-Control-Allow-Credentials', 'true');
	await next();
});

koaInstance.use(async (ctx, next) => {
	try {
		console.log(`${ctx.method}:${ctx.originalUrl}`);
		await next();
	} catch (err) {
		// will only respond with JSON
		logger.error(err);
		let errStr = err.toString();
		ctx.status = err.statusCode || err.status || 500;
		ctx.body = {
			message: errStr,
		};
	}
});

async function authJWT(ctx, next) {
	if (!ctx.header || !ctx.header.authorization) {
		ctx.throw(403, "ER_ACCOUNT");
	}

	const parts = ctx.header.authorization.trim().split(' ');

	if (parts.length === 2) {
		const scheme = parts[0];
		const credentials = parts[1];

		if (/^Bearer$/i.test(scheme)) {
			try {
				let decoded = jwtDecode(credentials);
				logger.info("jwt auth success." + decoded.db);
				

				ctx.state.db = decoded.db;
				return next();
			}catch(err) {
				ctx.throw(403, "ER_ACCOUNT");
			}
			
		}
	}
	
	ctx.throw(403,"ER_ACCOUNT");
}

koaInstance.use(cors());

//koaInstance.use(bodyParser({ enableTypes: ["json", "form", "text", "xml"] }));

koaInstance.use(koaBody({ multipart: true }));

const router = new Router();

const {list, get, update} = require('./DBHandler')(api);


router.post('/db/list', authJWT, list);
router.post('/db/get', authJWT, get);
router.post('/db/update', authJWT, update);

koaInstance.use(router.allowedMethods());
koaInstance.use(router.routes());

koaInstance.api = api;


module.exports = koaInstance;



