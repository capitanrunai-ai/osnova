import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')
const serverDir = resolve(dist, 'server')
const metadataDir = resolve(dist, '.openai')

await mkdir(serverDir, { recursive: true })
await mkdir(metadataDir, { recursive: true })
await copyFile(resolve(root, '.openai', 'hosting.json'), resolve(metadataDir, 'hosting.json'))

const edgeAdapter = `const HTML_ROUTES = /^\\/(?:ru|en|de|uk)(?:\\/.*)?$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const assetResponse = await env.ASSETS.fetch(request);

    if (assetResponse.status !== 404 || request.method !== 'GET') {
      return assetResponse;
    }

    const acceptsHtml = request.headers.get('accept')?.includes('text/html');
    if (!acceptsHtml && !HTML_ROUTES.test(url.pathname)) {
      return assetResponse;
    }

    const indexUrl = new URL('/index.html', url);
    return env.ASSETS.fetch(new Request(indexUrl, request));
  },
};
`

await writeFile(resolve(serverDir, 'index.js'), edgeAdapter, 'utf8')
