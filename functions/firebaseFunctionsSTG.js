/* eslint-disable @typescript-eslint/no-require-imports */
const functions = require('firebase-functions/v1');
const express = require('express');
const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const next = require('next');

// 後から環境変数を利用して初期化したい & 初期化後保持したいので一旦null
let app = null;

const nextjsServer = next({
  dev: false,
  // Next.js 13以降で動かなくなってそうなので、コメントアウトしている。distDirにはデフォルトの './next' が使われる。
  // https://github.com/syninc/eevee-client-web/issues/385
  // conf: {
  //   // next.config.js の dist と合わせる
  //   distDir: 'build',
  // },
});
const nextjsHandle = nextjsServer.getRequestHandler();

const initializeApp = (userCredentials) => {
  app = express();
  passport.use(
    // 認証
    new BasicStrategy(function (userid, password, done) {
      const storedPassword = userCredentials[userid];
      if (storedPassword && password === storedPassword) {
        return done(null, { userid });
      }
      return done(null, false);
    }),
  );
  app.use(passport.initialize());
  app.use('/', passport.authenticate('basic', { session: false }));
  app.use((req, res) => nextjsServer.prepare().then(() => nextjsHandle(req, res)));
};

const eeveeClientWebStaging = functions
  .runWith({
    secrets: [
      'EEVEE_CLIENT_WEB_BASICAUTH_USERNAME',
      'EEVEE_CLIENT_WEB_BASICAUTH_PASSWORD',
      'EEVEE_CLIENT_WEB_BASICAUTH_USERNAME_FOR_IKINARISTEAK',
      'EEVEE_CLIENT_WEB_BASICAUTH_PASSWORD_FOR_IKINARISTEAK',
      'EEVEE_CLIENT_WEB_BASICAUTH_USERNAME_FOR_SUAGE',
      'EEVEE_CLIENT_WEB_BASICAUTH_PASSWORD_FOR_SUAGE',
    ],
  })
  .https.onRequest((req, res) => {
    if (app === null) {
      initializeApp({
        [process.env.EEVEE_CLIENT_WEB_BASICAUTH_USERNAME]: process.env.EEVEE_CLIENT_WEB_BASICAUTH_PASSWORD,
        [process.env.EEVEE_CLIENT_WEB_BASICAUTH_USERNAME_FOR_IKINARISTEAK]:
          process.env.EEVEE_CLIENT_WEB_BASICAUTH_PASSWORD_FOR_IKINARISTEAK,
        [process.env.EEVEE_CLIENT_WEB_BASICAUTH_USERNAME_FOR_SUAGE]:
          process.env.EEVEE_CLIENT_WEB_BASICAUTH_PASSWORD_FOR_SUAGE,
      });
    }
    return app(req, res);
  });

exports.eeveeClientWebStaging = eeveeClientWebStaging;
exports.eeveeClientWebStaging2 = eeveeClientWebStaging;
exports.eeveeClientWebStaging3 = eeveeClientWebStaging;
