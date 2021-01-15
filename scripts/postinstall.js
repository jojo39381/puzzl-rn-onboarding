const fs = require("fs-extra");
const resolvePackagePath = require("resolve-package-path");
const semver = require("semver");
const chalk = require("chalk");

const ROOT_PACKAGE_JSON_PATH = "../../package.json";
const LIB_PACKAGE_JSON_PATH = "./package.json";

console.log(chalk.bold("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"));
console.log("puzzl-rn-onboarding - running postinstall");
try {
  const rootPackageJson = fs.readJsonSync(ROOT_PACKAGE_JSON_PATH);
  const libPackageJson = fs.readJsonSync(LIB_PACKAGE_JSON_PATH);

  const newPackageJson = { ...rootPackageJson };
  if (!Object.prototype.hasOwnProperty.call(newPackageJson, "dependencies")) {
    newPackageJson.dependencies = {};
  }

  const libNativeDependencies = libPackageJson.nativeDependencies;
  const libDependencies = {
    ...libPackageJson.dependencies,
    ...libPackageJson.peerDependencies,
  };
  const nativeDeps = libNativeDependencies.reduce(
    (o, dep) => ({ ...o, [dep]: libDependencies[dep] }),
    {}
  );

  const conflicts = {};
  const toInstall = {};
  Object.entries(nativeDeps).forEach(([packageName, libVersion]) => {
    if (
      Object.prototype.hasOwnProperty.call(
        newPackageJson.dependencies,
        packageName
      )
    ) {
      const installedVer = newPackageJson.dependencies[packageName];

      if (
        installedVer !== libVersion &&
        !semver.satisfies(installedVer, libVersion)
      ) {
        conflicts[packageName] = libVersion;
      } else {
        toInstall[packageName] = libVersion;
      }
    } else {
      toInstall[packageName] = libVersion;
    }
  });

  if (
    Object.prototype.hasOwnProperty.call(newPackageJson.dependencies, "expo")
  ) {
    try {
      const expoPackageJson = fs.readJsonSync(
        resolvePackagePath("expo", "../../")
      );
      const expoDependencies = expoPackageJson.dependencies;

      Object.keys(expoDependencies).forEach((expoDepName) => {
        if (Object.prototype.hasOwnProperty.call(toInstall, expoDepName)) {
          toInstall[expoDepName] = expoDependencies[expoDepName];
        }
      });
    } catch (error) {
      console.log(
        chalk.red("puzzl-rn-onboarding - failed to check expo conflicts")
      );
      console.error(chalk.red(error.message));
    }
  }

  console.log(
    "puzzl-rn-onboarding - adding the following native dependencies to package.json:"
  );
  console.log(JSON.stringify(toInstall, null, 2));

  if (Object.keys(conflicts).length > 0) {
    console.log(
      chalk.red(
        "puzzl-rn-onboarding - found the following package conflicts, please install these versions manually:"
      )
    );
    console.log(chalk.red(JSON.stringify(conflicts, null, 2)));
  }

  newPackageJson.dependencies = {
    ...newPackageJson.dependencies,
    ...toInstall,
  };

  fs.writeJsonSync(ROOT_PACKAGE_JSON_PATH, newPackageJson, {
    spaces: 2,
  });
  console.log(
    "puzzl-rn-onboarding - added native dependencies to package.json"
  );
} catch (error) {
  console.log(
    chalk.red("puzzl-rn-onboarding - failed to add native dependencies")
  );
  console.error(chalk.red(error.message));
}
console.log(chalk.bold("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"));
