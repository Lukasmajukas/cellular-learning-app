module.exports = {
  packagerConfig: { asar: true, ignore: [/^\/src/, /^\/tests/, /^\/test-results/, /^\/\.vite/] },
  makers: [
    // T76: setupExe gives the installer one name that never changes (before, the version was part of it), so the
    // docs can name it. noDelta: only whole packages are made, no "just the changed parts" ones: the Releases page
    // keeps one build, and the app updates from whichever version it has straight to the newest.
    { name: '@electron-forge/maker-squirrel', config: { name: 'CellLearning', authors: 'Lukas', setupExe: 'Cell-Learning-Setup.exe', noDelta: true } },
    { name: '@electron-forge/maker-zip', platforms: ['win32', 'darwin', 'linux'] },
  ],
};
