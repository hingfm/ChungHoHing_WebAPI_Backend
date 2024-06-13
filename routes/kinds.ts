import Router, { RouterContext } from "koa-router";
import * as model from "../models/kinds";
import * as articleModel from '../models/articles'

const prefix = '/api/v1/kinds';
const router:Router = new Router({ prefix: prefix });

router.get("/", async (ctx: RouterContext, next) => {
    ctx.body = await model.getAll()
    await next()
})



export {
    router
}
