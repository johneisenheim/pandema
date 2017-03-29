import babelPolyfill from "babel-polyfill";
import koa from "koa";
import koaProxy from "koa-proxy";
import koaStatic from "koa-static";
import React from "react";
import ReactDOM from "react-dom/server";
import * as ReactRouter from "react-router";
import Transmit from "react-transmit";
import routesContainer from "containers/routes";
import favicon from "favicon.ico";

import express from 'express';

import server2 from './server2';

try {
	const app      = koa();
	const hostname = process.env.HOSTNAME || "localhost";
	const port     = process.env.PORT || 8000;
	let   routes   = routesContainer;

	app.use(koaStatic("static"));

	app.use(function *(next) {
		yield ((callback) => {
			const webserver = __PRODUCTION__ ? "" : `//${this.hostname}:8000`;
			const location  = this.path;

			ReactRouter.match({routes, location}, (error, redirectLocation, renderProps) => {
				if (redirectLocation) {
					this.redirect(redirectLocation.pathname + redirectLocation.search, "/");
					return;
				}

				if (error || !renderProps) {
					callback(error);
					return;
				}

				const styles = {};

				const StyleProvider = React.createClass({
					childContextTypes:{
						styles:    React.PropTypes.array,
						insertCss: React.PropTypes.func
					},

					getChildContext () {
						return {
							styles,
							insertCss (style) { styles[style] = style._getCss(); }
						};
					},

					render () {
						return <ReactRouter.RouterContext {...this.props} />;
					}
				});

				Transmit.renderToString(StyleProvider, renderProps).then(({reactString, reactData}) => {
					let cssModules = "";

					Object.keys(styles).forEach((style) => { cssModules += styles[style]; });

					let template = (
						`<!doctype html>
						<html lang="en-us">
							<head>
								<meta charset="utf-8" />
								<title>Pandema | Web Application</title>
								<link rel="shortcut icon" href="${favicon}" />
								<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
								<style>${cssModules}</style>
								<style>
									.react-layout-components--box {
									  display: -webkit-box;
									  display: -moz-box;
									  display: -ms-flexbox;
									  display: -webkit-flex;
									  display: flex;
									}
									.wrapper {
										position : relative;
									}
									.praticaClass {
										font-family: 'Roboto', sans-serif;
										font-size : 15px;
										color : #666666;
										margin-left : 10px;
										margin-top : 20px;
										width : 100%;
										text-align : left;
										word-wrap: break-word;
									}
									.version {
										font-family: 'Roboto', sans-serif;
										font-size : 12px;
										color : #FFFFFF;
									}
								</style>
							</head>
							<body style="width:100%; height:100%;margin:0px;">
								<div id="react-root">${reactString}</div>
							</body>
						</html>`
					);

					this.type = "text/html";
					this.body = Transmit.injectIntoMarkup(template, reactData, [`${webserver}/dist/client.js`]);

					callback(null);
				}).catch(e => {
					callback(e);
				});
			});
		});
	});

	app.listen(port, () => {
		console.info("==> ✅  Server is listening");
		console.info("==> 🌎  Go to http://%s:%s", hostname, port);
	});

	if (__DEV__) {
		if (module.hot) {
			console.log("[HMR] Waiting for server-side updates");

			module.hot.accept("containers/routes", () => {
				routes = require("containers/routes");
			});

			module.hot.addStatusHandler((status) => {
				if (status === "abort") {
					setTimeout(() => process.exit(0), 0);
				}
			});
		}
	}
}
catch (error) {
	console.error(error.stack || error);

	throw error;
}
