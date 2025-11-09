import * as fs from "fs";
import * as path from "path";

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

/**
 * Infer internal workspace packages from package.json
 */
export function inferInternalPackages(projectRoot: string): string[] {
  const packageJsonString = fs.readFileSync(
    path.resolve(projectRoot, "package.json"),
    "utf-8"
  );
  const packageJson: PackageJson = JSON.parse(packageJsonString);
  const internalPackages: string[] = [];
  const { dependencies, devDependencies, peerDependencies } = packageJson;
  
  for (const deps of [dependencies, devDependencies, peerDependencies]) {
    for (const [packageName, packageVersion] of Object.entries(deps ?? {})) {
      if (
        packageVersion.startsWith("workspace:") &&
        !internalPackages.includes(packageName)
      ) {
        internalPackages.push(packageName);
      }
    }
  }
  
  return internalPackages;
}

