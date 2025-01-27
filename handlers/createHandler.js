const { input } = require('@inquirer/prompts');
const { resolve, basename } = require('path');
const { existsSync, readdirSync } = require('fs');
const validateName = require('validate-npm-package-name');
const createProject = require('../utils/createProject.js');

module.exports = async function createHandler(destination, options) {
  let projectPath = destination;

  // If no destination is provided, prompt the user for a project name
  if (!projectPath) {
    const projectName = await input({
      message: 'Enter a name for your project:',
      validate: (input) => {
        if (!input.trim()) return 'Project name cannot be empty!';
        const { validForNewPackages, errors } = validateName(input.trim());
        return validForNewPackages
          ? true
          : `Invalid project name: ${errors.join(', ')}`;
      },
    });

    projectPath = projectName;
  }

  // Resolve the absolute path and project name
  const resolvedPath = resolve(process.cwd(), projectPath);
  const projectName = basename(resolvedPath);

  // Validate the project name
  const { validForNewPackages, errors } = validateName(projectName);
  if (!validForNewPackages) {
    throw new Error(
      `Invalid project name '${projectName}'. ${errors.join(', ')}`
    );
  }

  // Check if the directory exists and is not empty
  if (existsSync(resolvedPath) && readdirSync(resolvedPath).length > 0) {
    throw new Error(`The directory '${resolvedPath}' is not empty. Aborting.`);
  }

  // Call createProject
  createProject(resolvedPath, projectName, options);
};
