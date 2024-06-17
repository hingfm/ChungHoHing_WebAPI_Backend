import Koa from "koa";
import Router, { RouterContext }  from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import passport from 'koa-passport';
import bodyParser from "koa-bodyparser";
import cors from '@koa/cors' ;
import { router as articles } from "./routes/articles";
import { router as special } from './routes/special';
import { router as uploads } from './routes/uploads';
import { router as users } from "./routes/users";
import { router as regions } from './routes/regions'
import { router as kinds } from './routes/kinds'
import serve from 'koa-static';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import * as model from './models/users';

const app: Koa = new Koa();
const router: Router = new Router();

// Configure Passport to use Google OAuth 2.0
const GOOGLE_CLIENT_ID = "866324759131-u9v5vrrjukgkegaj8r8iqhajc8lc3m2v.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/v1/auth/google/callback"
},
(accessToken, refreshToken, profile, done) => {
  // Here, you would typically find or create a user in your database.
  // This is an asynchronous operation, so you would need to handle it with a Promise or async/await.
  // Example: User.findOrCreate({ googleId: profile.id }, (err, user) => done(err, user));
  console.log('Authenticated user:', profile);
  done(null, profile); // Assuming profile is the user object for simplicity
}
));

// Google Auth route that initiates an OAuth transaction
router.post('/api/v1/auth/google', async (ctx: RouterContext) => {
  const { token }: { token: string } = ctx.request.body as { token: string };
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload: TokenPayload | undefined = ticket.getPayload();

    if (payload) {
      const user = await model.findOrCreateGoogleUser(payload.sub, payload.email!, payload.name!);

      ctx.body = { user: user, token: 'your_generated_token' };
    } else {
      ctx.status = 401;
      ctx.body = { error: 'Google authentication failed' };
    }
  } catch (error) {
    ctx.status = 401;
    ctx.body = { error: 'Google authentication failed' };
  }
});

// Google Auth route that initiates an OAuth transaction
router.get('/api/v1/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Auth callback route
router.get('/api/v1/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (ctx) => {
    // Successful authentication, redirect home.
    ctx.redirect('/');
  }
);

/*const welcomeAPI = async (ctx: RouterContext, next:any) => {
  ctx.body = {message: "Welcome to the blog API!"};
  await next();
}

router.get('/api/v1', welcomeAPI);
*/
// For Document:
app.use(serve('./docs'));
app.use(cors());
app.use(logger());
app.use(json());
app.use(bodyParser());
app.use(router.routes());
app.use(passport.initialize());
app.use(router.routes()).use(router.allowedMethods());

app.use(articles.middleware());
app.use(special.middleware());
app.use(uploads.middleware());
app.use(users.middleware());
app.use(regions.middleware())
app.use(kinds.middleware())

app.use(async (ctx: RouterContext, next: any) => {
  try {
    await next();
    console.log(ctx.status)
    if(ctx.status === 404){
      ctx.body = {err: "No such endpoint existed"};
    }
  } catch(err: any) {
    ctx.body = {err: err};
  }

});
let port = process.env.PORT || 10888;
app.listen(10888, () => {
console.log( `Koa Started at ${port}` );
})