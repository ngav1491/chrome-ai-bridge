import { createManifestContent } from './utils';

const LEGACY_ORIGIN = 'chrome-extension://hbdgbgagpkpjffpklnamcljpakneikee/';
const UNPACKED_ORIGIN = 'chrome-extension://jldpoegmnhhdnfahaombbppmpnjfdkki/';

describe('Native Messaging manifest origins', () => {
  it('includes the legacy extension origin by default', async () => {
    const manifest = await createManifestContent();

    expect(manifest.allowed_origins).toContain(LEGACY_ORIGIN);
  });

  it('adds an unpacked extension ID without removing the legacy origin', async () => {
    const manifest = await createManifestContent({
      extensionId: 'jldpoegmnhhdnfahaombbppmpnjfdkki',
    });

    expect(manifest.allowed_origins).toEqual([LEGACY_ORIGIN, UNPACKED_ORIGIN]);
  });
});
