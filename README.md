<div align="center">
  
# ☁️🔗 URL shortener using CF Workers

[![Node CI](https://github.com/BetaHuhn/cf-worker-redirect/workflows/Node%20CI/badge.svg)](https://github.com/BetaHuhn/cf-worker-redirect/actions?query=workflow%3A%22Node+CI%22) [![Release CI](https://github.com/BetaHuhn/cf-worker-redirect/workflows/Release%20CI/badge.svg)](https://github.com/BetaHuhn/cf-worker-redirect/actions?query=workflow%3A%22Release+CI%22) [![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/BetaHuhn/cf-worker-redirect/blob/master/LICENSE) ![David](https://img.shields.io/david/betahuhn/cf-worker-redirect)

Simple URL redirection running at the edge with Cloudflare Workers and Worker KV.

</div>

## ⭐ Features

- **Extremely fast** - *Runs on Cloudflare's Edge*
- **Simple to integrate** - *Integrate it with existing sites using Cloudflare*
- **Easy to manage** - *Redirects are stored in Workers KV*
- **Supports URL parameters** - *URL parameters are appended to the target URL if not already present*

## 🚀 Get started

1. Fork your this repository
2. Clone your new repository
3. Install dependencies using `npm install`
4. Update package details in `package.json` and `README.md`
   1. Find and replace `betahuhn/cf-worker-redirect` with `user/repository`
   2. Find and replace `@betahuhn/cf-worker-redirect` with `user/repository`
5. Specify your worker details in the `wrangler.toml` file (more info in [Cloudflare's Docs](https://developers.cloudflare.com/workers/cli-wrangler/configuration))
6. Setup [wrangler CLI](https://developers.cloudflare.com/workers/cli-wrangler/install-update) locally
6. Run `wrangler publish`

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/BetaHuhn/cf-worker-redirect)

## 📚 Usage

After you have deployed your Worker, head over to the KV section of the Workers Dashboard and select your Namespace.

To add a redirect, simply enter the URL path you want to redirect as the key (including the leading `/`) and the target URL as the value.

Example:

| Key | Value |
| ------------- | ------------- |
| `/github` | `https://github.com/BetaHuhn` |

If your your Worker runs on example.com, all requests to example.com/github will be redirected to https://github.com/BetaHuhn.

### Root page

Since a key in your KV Namespace specifies a URL path starting with `/`, you can also specify a redirect if a user requests the root of your page (i.e. example.com/):

| Key | Value |
| ------------- | ------------- |
| `/` | `https://example.com/home` |

### 404 Page

By default if a path is not found in the KV Namespace a 404 error will be returned. You can optionally redirect all 404 errors to a custom URL by adding it with the key `404`:

| Key | Value |
| ------------- | ------------- |
| `404` | `https://example.com/404` |

### URL parameters

All URL search parameters will be passed on to the final URL if they are not already present in the specified target URL.

Example with a Worker running at example.com:

| Key | Value |
| ------------- | ------------- |
| `/blog-post-test` | `https://example.com/blog/posts/test` |

A user requesting example.com/blog-post-test?ref=Twitter will be redirected to https://example.com/blog/posts/test?ref=Twitter.

> If the specified target URL would have been `https://example.com/blog/posts/test?ref=Campaign` then the parameter `ref=Twitter` would have been ignored

## 💻 Available commands

- run `yarn lint` or `npm run lint` to run eslint.
- run `yarn test` or `npm run test` to run all Mocha tests.
- run `yarn dev` or `npm run dev` to run the Worker locally with [Wrangler](https://developers.cloudflare.com/workers/cli-wrangler/commands#dev).
- run `yarn build` or `npm run build` to produce a production version with webpack.

## ❔ About

This project was developed by me ([@betahuhn](https://github.com/BetaHuhn)) in my free time. If you want to support me:

[![Donate via PayPal](https://img.shields.io/badge/paypal-donate-009cde.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=394RTSBEEEFEE)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/F1F81S2RK)

## 📄 License

Copyright 2021 Maximilian Schiller

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.