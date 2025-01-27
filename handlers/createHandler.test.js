// createHandler.test.js
jest.mock('@inquirer/prompts', () => ({
  input: jest.fn(),
}));

jest.mock('validate-npm-package-name', () => {
  return jest.fn().mockReturnValue({ validForNewPackages: true, errors: [] });
});

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readdirSync: jest.fn(),
}));

jest.mock('../utils/createProject.js', () => jest.fn());

const { input } = require('@inquirer/prompts');
const validateName = require('validate-npm-package-name');
const { existsSync, readdirSync } = require('fs');
const createProject = require('../utils/createProject.js');
const createHandler = require('./createHandler');

describe('createHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('prompts for a project name when none is provided', async () => {
    input.mockResolvedValue('my-app');
    await createHandler(undefined, { install: true });
    expect(input).toHaveBeenCalled();
    expect(createProject).toHaveBeenCalledWith(
      expect.stringContaining('my-app'),
      'my-app',
      { install: true }
    );
  });

  it('uses provided destination and skips prompt', async () => {
    await createHandler('test-project', {});
    expect(input).not.toHaveBeenCalled();
    expect(createProject).toHaveBeenCalledWith(
      expect.stringContaining('test-project'),
      'test-project',
      {}
    );
  });

  it('throws if project name is invalid', async () => {
    validateName.mockReturnValueOnce({
      validForNewPackages: false,
      errors: ['some error'],
    });
    await expect(createHandler('invalid name', {})).rejects.toThrow(
      /Invalid project name/
    );
    expect(createProject).not.toHaveBeenCalled();
  });

  it('throws if directory is not empty', async () => {
    existsSync.mockReturnValueOnce(true);
    readdirSync.mockReturnValueOnce(['some-file']);
    await expect(createHandler('not-empty', {})).rejects.toThrow(
      /is not empty/
    );
    expect(createProject).not.toHaveBeenCalled();
  });
});
