declare const REDIRECT_KV: KVNamespace; // estlint-disable-line no-undef

export async function handleRequest(request: Request): Promise<Response> {
	const requestUrl = new URL(request.url);

	// Get the matching target URL by first checking against the full url then host and then the path
	const target = await getTargetfromKV(requestUrl);

	if (!target || target === '404') {
		// Optionally redirect to custom page on 404
		const errorRedirect =
			(await REDIRECT_KV.get(`${requestUrl.host}/404`)) ??
			(await REDIRECT_KV.get('404'));

		if (errorRedirect === 'pass') {
			// Pass the original request along
			return fetch(request);
		} else if (errorRedirect) {
			// Redirect to the specified error page
			return Response.redirect(errorRedirect, 301);
		}

		// Return normal 404 error
		return new Response('Sorry, page not found.', {
			status: 404,
			statusText: 'page not found',
		});
	}

	// Pass the original request along
	if (target === 'pass') {
		return fetch(request);
	}

	/*
		Combine source and target URL search parameters (target params overwrite source params)
		Note: CF worker does not support url.searchParams.forEach
	*/

	// Construct URL class from target (value from KV) so we can easily manipulate it
	const targetUrl = new URL(target);

	// Default to using targetUrl path
	let redirectPath = targetUrl.pathname;

	// Check if the request has a path though
	if (!emptyPath(requestUrl.pathname) && emptyPath(targetUrl.pathname)) {
		// Since request has a path but target does not, use requestPath
		redirectPath = requestUrl.pathname;
	}

	// Check if the target has variables to be swapped out
	if (redirectPath.includes('$')) {
		try {
			redirectPath = replaceVariables(redirectPath, requestUrl.pathname);
		} catch (error: any) {
			console.error('error', error.message);
			return new Response('Sorry, page not found.', {
				status: 404,
				statusText: 'page not found',
			});
		}
	}

	// Construct a redirect url using target host and redirect path
	const redirectUrl = new URL(
		`${targetUrl.protocol}//${targetUrl.host}${redirectPath}`,
	);
	Array.from(requestUrl.searchParams).forEach(([key, val]) => {
		if (redirectUrl.searchParams.has(key) === false) {
			redirectUrl.searchParams.set(key, val);
		}
	});

	// Redirect to the target URL
	return Response.redirect(redirectUrl, 301);
}

function emptyPath(path: string): boolean {
	return path === '/';
}

function replaceVariables(targetPath: string, requestPath: string): string {
	const requestPathParts = requestPath.split('/');
	const targetPathParts = targetPath.split('/');

	// Loop through the parts to replace variables
	for (let i = 0; i < targetPathParts.length; i++) {
		if (targetPathParts[i].includes('$')) {
			// Replace the variable with the actual value
			const index = parseInt(targetPathParts[i].replace('$', ''), 10);
			if (requestPathParts[index] !== undefined) {
				targetPathParts[i] = requestPathParts[index];
			} else {
				throw new Error(
					`Variable ${targetPathParts[i]} not found in request path`,
				);
			}
		}
	}

	// Join the parts back together
	return targetPathParts.join('/');
}

async function getTargetfromKV(requestUrl: URL): Promise<string> {
	const requestPath = requestUrl.pathname;
	const requestRootPath = `${requestUrl.host}/`;

	const splittedPath = requestPath.split('/');

	// construct an array of path
	const requestPaths = [`${requestUrl.host}${splittedPath[0]}`];
	for (let index = 1; index < splittedPath.length; index++) {
		requestPaths.push(`${requestPaths[index - 1]}/${splittedPath[index]}`);
	}

	// reverse the array so we can check from the most specific path
	requestPaths.reverse();

	// add the root paths to the array
	requestPaths.push(requestRootPath);
	requestPaths.push(requestPath);

	// test the route from the most specific path to the root path
	for (const path of requestPaths) {
		const target = await REDIRECT_KV.get(path);
		if (target) {
			// return then first target found (most specific)
			return target;
		}
	}

	return '404';
}
