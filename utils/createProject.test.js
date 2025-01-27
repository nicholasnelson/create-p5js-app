jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

jest.mock('fs', () => ({
  mkdirSync: jest.fn(),
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  copyFileSync: jest.fn(),
}));

const { execSync } = require('child_process');
const fs = require('fs');
const createProject = require('./createProject');

describe('createProject', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fs.readdirSync.mockReturnValue(['package.json', 'README.md']);
    fs.readFileSync.mockReturnValue(JSON.stringify({ name: 'placeholder' }));
  });

  it('creates project and installs dependencies', () => {
    createProject('/fake/project/path', 'my-app', { install: true });

    expect(fs.mkdirSync).toHaveBeenCalledWith('/fake/project/path', {
      recursive: true,
    });
    expect(execSync).toHaveBeenCalledWith('npm install', {
      cwd: '/fake/project/path',
      stdio: 'inherit',
    });
  });

  it('skips install when install=false', () => {
    createProject('/fake/project/path', 'my-app', { install: false });
    expect(execSync).not.toHaveBeenCalled();
  });
});
