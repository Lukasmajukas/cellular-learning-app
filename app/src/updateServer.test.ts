import { describe, it, expect } from 'vitest';
// The Worker is plain JavaScript outside src/ (it is put online from update-server/), so it's loaded without types.
const { handle, looksLikeList, PACKAGE, RELEASE_FILES } = await import('../../update-server/src/worker.js' as string);

// T76: the update "front door" (a Cloudflare Worker). These tests run its code here with a pretend GitHub.
const LIST = '\uFEFF94689FEDE03FED7AB59C24337673A27837F0C3EC CellLearning-0.1.177-full.nupkg 158990336\r\n';
const ask = (path: string, init?: RequestInit) => new Request(`https://cell-learning-updates.example.workers.dev${path}`, init);
// A pretend GitHub: remembers what was asked and answers with what the test hands it.
function github(answer: () => Response | Promise<Response>) {
  const asked: string[] = [];
  return { asked, fetchFn: async (url: string) => { asked.push(url); return answer(); } };
}

describe('the update front door', () => {
  it('says it is alive at /', async () => {
    const r = await handle(ask('/'));
    expect(r.status).toBe(200);
    expect(await r.text()).toContain('Cell Learning update server: OK');
  });

  it('hands over the list file from the GitHub release, unchanged and never cached', async () => {
    const g = github(() => new Response(LIST));
    const r = await handle(ask('/win/RELEASES?id=CellLearning&localVersion=0.1.170&arch=amd64'), { fetchFn: g.fetchFn });
    expect(g.asked).toEqual([`${RELEASE_FILES}RELEASES`]);
    expect(RELEASE_FILES).toBe('https://github.com/Lukasmajukas/cellular-learning-app/releases/download/latest-build/');
    expect(r.status).toBe(200);
    expect(r.headers.get('cache-control')).toBe('no-store');
    expect(new Uint8Array(await r.arrayBuffer())).toEqual(new TextEncoder().encode(LIST)); // byte for byte
  });

  it('points at GitHub for the package (the big download never runs through the Worker)', async () => {
    const g = github(() => new Response('never asked'));
    const r = await handle(ask('/win/CellLearning-0.1.177-full.nupkg'), { fetchFn: g.fetchFn });
    expect(r.status).toBe(302);
    expect(r.headers.get('location')).toBe(`${RELEASE_FILES}CellLearning-0.1.177-full.nupkg`);
    expect(g.asked).toEqual([]);
  });

  it('passes on nothing but the list and our own package names', async () => {
    const g = github(() => new Response(LIST));
    for (const path of ['/win/Cell-Learning-Setup.exe', '/win/CellLearning-0.1.177-delta.nupkg', '/win/Other-1.0.0-full.nupkg', '/win/CellLearning-1.2-full.nupkg',
      '/win/..%2F..%2Fsecrets', '/win/a/RELEASES', '/RELEASES', '/win/', '/win', '/mac/RELEASES', '/win/releases', '/win/CellLearning-0.1.177-full.nupkg.exe']) {
      const r = await handle(ask(path), { fetchFn: g.fetchFn });
      expect(r.status, path).toBe(404);
    }
    expect(g.asked).toEqual([]);
    expect(PACKAGE.test('CellLearning-0.1.177-full.nupkg')).toBe(true);
    expect(PACKAGE.test('CellLearning-0.1.177-full.nupkg\n')).toBe(false);
  });

  it('only reading works: no POST, PUT or DELETE', async () => {
    for (const method of ['POST', 'PUT', 'DELETE', 'PATCH']) expect((await handle(ask('/win/RELEASES', { method }))).status, method).toBe(405);
    const head = await handle(ask('/win/RELEASES', { method: 'HEAD' }), { fetchFn: github(() => new Response(LIST)).fetchFn });
    expect(head.status).toBe(200);
    expect(await head.text()).toBe('');
  });

  it('no release there right now (a build is swapping the files): says "not found", so the app just asks again later', async () => {
    const r = await handle(ask('/win/RELEASES'), { fetchFn: github(() => new Response('Not Found', { status: 404 })).fetchFn });
    expect(r.status).toBe(404);
  });

  it('GitHub in trouble, unreachable, or answering with a web page: an error answer, never a made-up list', async () => {
    const down = await handle(ask('/win/RELEASES'), { fetchFn: github(() => new Response('oops', { status: 503 })).fetchFn });
    expect(down.status).toBe(502);
    const gone = await handle(ask('/win/RELEASES'), { fetchFn: github(() => { throw new Error('no network'); }).fetchFn });
    expect(gone.status).toBe(502);
    const page = await handle(ask('/win/RELEASES'), { fetchFn: github(() => new Response('<!DOCTYPE html><html>Sign in</html>')).fetchFn });
    expect(page.status).toBe(502);
  });

  it('knows what a list file looks like', () => {
    expect(looksLikeList(LIST)).toBe(true);
    expect(looksLikeList('94689FEDE03FED7AB59C24337673A27837F0C3EC CellLearning-0.1.176-full.nupkg 1\n94689FEDE03FED7AB59C24337673A27837F0C3EC CellLearning-0.1.177-full.nupkg 2\n')).toBe(true);
    expect(looksLikeList('')).toBe(false);
    expect(looksLikeList('hello')).toBe(false);
    expect(looksLikeList('94689FEDE03FED7AB59C24337673A27837F0C3EC http://evil.example/CellLearning-0.1.177-full.nupkg 2')).toBe(false); // no outside addresses
    expect(looksLikeList('94689FEDE03FED7AB59C24337673A27837F0C3EC Other-0.1.177-full.nupkg 2')).toBe(false);
  });

  it('the files\' place can be swapped (the update test points it at a pretend GitHub on the build computer)', async () => {
    const g = github(() => new Response(LIST));
    const files = 'http://127.0.0.1:8123/files/';
    await handle(ask('/win/RELEASES'), { files, fetchFn: g.fetchFn });
    expect(g.asked).toEqual([`${files}RELEASES`]);
    const r = await handle(ask('/win/CellLearning-0.1.177-full.nupkg'), { files });
    expect(r.headers.get('location')).toBe(`${files}CellLearning-0.1.177-full.nupkg`);
  });
});
