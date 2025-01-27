const {
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
} = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');

/**
 * Creates a new project directory and sets up the template.
 *
 * @param {string} projectPath - The absolute path where the project will be created.
 * @param {string} projectName - The name of the project.
 * @param {Object} options - Options for creating the project.
 * @param {boolean} [options.install=true] - Whether to run npm install.
 */
module.exports = function createProject(projectPath, projectName, options) {
  // Create the project directory
  mkdirSync(projectPath, { recursive: true });
  console.log(`Creating project '${projectName}' at ${projectPath}...`);

  // Copy template files
  const templateDir = join(__dirname, '../template').replace('file://', '');
  readdirSync(templateDir).forEach((file) => {
    const srcPath = join(templateDir, file);
    const destPath = join(projectPath, file);

    if (file === 'package.json') {
      // Customize the package.json template
      const packageJson = JSON.parse(readFileSync(srcPath, 'utf8'));
      packageJson.name = projectName; // Replace the placeholder with the actual project name

      writeFileSync(destPath, JSON.stringify(packageJson, null, 2));
    } else {
      // Copy other files as-is
      copyFileSync(srcPath, destPath);
    }
  });

  // Run npm install (if not skipped)
  if (options.install !== false) {
    console.log('Installing dependencies...');
    execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
  }

  console.log(`Project '${projectName}' created successfully!`);
  console.log(`Navigate to '${projectName}' and run 'npm start' to begin.`);
};
