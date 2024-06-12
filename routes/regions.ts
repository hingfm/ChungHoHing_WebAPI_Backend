import Router, { RouterContext } from "koa-router";
import * as model from "../models/regions";

const prefix = '/api/v1/regions';
const router:Router = new Router({ prefix: prefix });

router.get("/", async (ctx: RouterContext, next) => {
    ctx.body = await model.getAll()
    await next()
})

export {
    router
}
