/* eslint-env node, browser */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const esbuild = require('esbuild');
const {chromium} = require('playwright-core');

const root = path.resolve(__dirname, '../..');
const output = path.join(root, 'docs/screenshots');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'baila-previews-'));

async function capture() {
  fs.mkdirSync(output, {recursive: true});
  await esbuild.build({
    entryPoints: [path.join(__dirname, 'entry.jsx')],
    outdir: temporary,
    bundle: true,
    platform: 'browser',
    format: 'iife',
    define: {
      'process.env.NODE_ENV': '"development"',
      __DEV__: 'true',
      global: 'globalThis',
    },
    alias: {
      'react-native': path.dirname(
        require.resolve('react-native-web/package.json'),
      ),
      // One React instance is essential when the tooling has its own node_modules.
      react: path.join(root, 'node_modules/react'),
      'react-dom': path.dirname(require.resolve('react-dom/package.json')),
    },
    mainFields: ['browser', 'module', 'main'],
    resolveExtensions: [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
    ],
    loader: {'.js': 'jsx', '.png': 'file', '.jpg': 'file', '.gif': 'file'},
    assetNames: 'assets/[name]-[hash]',
    publicPath: '/',
  });
  fs.writeFileSync(
    path.join(temporary, 'index.html'),
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>BAILA UI preview</title><style>html,body,#root{height:100%;margin:0;overflow:hidden}#root{display:flex;flex-direction:column}*{box-sizing:border-box}</style></head><body><div id="root"></div><script src="entry.js"></script></body></html>`,
  );

  const server = http.createServer((request, response) => {
    const file = path.resolve(
      temporary,
      '.' +
        new URL(request.url, 'http://localhost').pathname.replace(
          /\/$/,
          '/index.html',
        ),
    );
    if (!file.startsWith(temporary + path.sep) || !fs.existsSync(file)) {
      response.writeHead(404).end();
      return;
    }
    const types = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
    };
    response.setHeader(
      'Content-Type',
      types[path.extname(file)] || 'application/octet-stream',
    );
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = `http://127.0.0.1:${server.address().port}`;
  const executable =
    process.env.CHROMIUM_EXECUTABLE ||
    (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
  let browser;
  try {
    browser = await chromium.launch({
      executablePath: executable,
      channel: executable ? undefined : 'chrome',
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });
    const page = await browser.newPage({
      viewport: {width: 360, height: 640},
      deviceScaleFactor: 2,
    });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const button = (name) => page.getByRole('button', {name, exact: true});
    const shot = async (name, fullContent = false) => {
      // Documentation captures expand scroll containers rather than cutting a
      // card or rule at the viewport boundary. Mobile app styles are unchanged.
      if (fullContent) {
        await page.setViewportSize({width: 360, height: 10000});
        await page.evaluate(() => {
          document.querySelectorAll('*').forEach((element) => {
            const {overflowY} = getComputedStyle(element);
            if (overflowY === 'auto' || overflowY === 'scroll') {
              element.style.flex = 'none';
              element.style.height = 'auto';
              let ancestor = element.parentElement;
              while (ancestor) {
                ancestor.style.flex = 'none';
                ancestor.style.height = 'auto';
                ancestor = ancestor.parentElement;
              }
              element.style.overflow = 'visible';
            }
          });
          for (const element of [
            document.documentElement,
            document.body,
            document.getElementById('root'),
          ]) {
            element.style.height = 'auto';
            element.style.overflow = 'visible';
          }
        });
      }
      if (fullContent) {
        // FlatList renders additional rows asynchronously after its bounds expand.
        await page.waitForFunction((screen) => {
          const selector =
            screen === 'deck' ? '[role="checkbox"]' : '[role="button"]';
          return (
            document.querySelectorAll(selector).length >=
            (screen === 'deck' ? 28 : 29)
          );
        }, name);
      }
      if (name === 'deck') {
        const lastCard = await page.getByRole('checkbox').last().boundingBox();
        const done = await button('Done · 112 cards').boundingBox();
        assert(
          done.y >= lastCard.y + lastCard.height,
          'Full-content capture must place Done below every card',
        );
      }
      await page.evaluate(() =>
        Promise.all(
          Array.from(document.images).map((image) =>
            image.complete
              ? Promise.resolve()
              : new Promise((resolve) => {
                  image.onload = resolve;
                  image.onerror = resolve;
                }),
          ),
        ),
      );
      await page.screenshot({
        path: path.join(output, name + '.png'),
        animations: 'disabled',
        ...(fullContent
          ? {clip: await page.locator('#root').boundingBox()}
          : {}),
      });
    };
    const checkHome = async () => {
      for (const name of ['Let’s play', 'Make it your deck', 'How to play']) {
        const box = await button(name).boundingBox();
        assert(
          box && box.y >= 0 && box.y + box.height <= page.viewportSize().height,
          `${name} must fit without scrolling`,
        );
      }
    };

    await page.goto(address);
    await button('Let’s play').waitFor();
    await checkHome();
    await shot('home');
    await button('Make it your deck').click();
    const barman = page.getByRole('checkbox', {name: 'Barman', exact: true});
    await barman.waitFor();
    const tile = await barman.locator('..').boundingBox();
    assert(
      Math.abs(tile.width / tile.height - 0.75) < 0.02,
      'Selection tiles must retain their 3:4 ratio',
    );
    await shot('deck', true);
    // Reload to restore normal viewport styling after the full-content capture.
    await page.setViewportSize({width: 360, height: 640});
    await page.goto(address);
    await button('Make it your deck').click();
    await button('Done · 112 cards').click();

    // A deterministic draw makes the gallery stable without changing app data.
    await page.evaluate(() => {
      window.savedRandom = Math.random;
      Math.random = () => 0.999999;
    });
    await button('Let’s play').click();
    await page.evaluate(() => {
      Math.random = window.savedRandom;
    });
    await button('Next card →').waitFor();
    await page.waitForFunction(
      () =>
        document
          .querySelector('[data-testid="next-card"]')
          ?.getAttribute('aria-disabled') !== 'true',
    );
    await shot('game');

    // A fresh app starts a separate session for the reference instructions capture.
    await page.goto(address);
    await button('How to play').click();
    await button('Barman').click();
    await page
      .getByText('The person drawing the card will share three sips', {
        exact: false,
      })
      .waitFor();
    await shot('instructions', true);

    for (const viewport of [
      {width: 320, height: 568},
      {width: 430, height: 932},
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(address);
      await button('Let’s play').waitFor();
      await checkHome();
    }
    assert.deepEqual(
      errors,
      [],
      'Preview must not have unhandled JavaScript errors',
    );
    console.log(
      'Captured four English actual-component previews; checked home controls at three viewport sizes and the 3:4 selection layout.',
    );
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

capture()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => fs.rmSync(temporary, {recursive: true, force: true}));
