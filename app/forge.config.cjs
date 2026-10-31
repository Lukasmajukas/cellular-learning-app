module.exports = {
  packagerConfig: { asar: true, ignore: [/^\/src/, /^\/tests/, /^\/test-results/, /^\/\.vite/] },
  makers: [
    { name: '@electron-forge/maker-squirrel', config: { name: 'CellLearning', authors: 'Lukas' } },
    { name: '@electron-forge/maker-zip', platforms: ['win32', 'darwin', 'linux'] },
  ],
};
