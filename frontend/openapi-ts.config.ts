import { defaultPlugins, defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  experimentalParser: true,
  input: "./openapi.json",
  output: "src/client",
  plugins: [
    ...defaultPlugins,
    // "@hey-api/schemas",
    {
      name: "@hey-api/client-fetch",
      baseUrl: false,
    },
    {
      name: "@hey-api/sdk",
      //! NOTE: this doesn't allow tree-shaking
      asClass: true,
      operationId: true,
      methodNameBuilder: (operation) => {
        // @ts-ignore
        return extractOperationName(operation.id, operation.path);
      },
      classNameBuilder: "{{name}}Service",
    },
  ],
});

/**
 * Skip the first segment ('api')
 * and return the third (e.g. 'jobs').
 */
function getSecondSegment(path: string): string | undefined {
  const segments = path.split("/").filter(Boolean);
  // 0 => 'api'
  // 1 => 'jobs'
  // ...
  return segments[1];
}

/** Lowercase the first character of a string. */
function lowercaseFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * Remove the 3rd segment from the beginning of the operation ID if present.
 * e.g. 'jobsGetJobs' => 'getJobs'
 */
function extractOperationName(opId: string, path: string): string {
  // e.g. 'jobs'
  const resourceName = getSecondSegment(path);
  if (!resourceName) {
    // If there's no 2nd segment, just return opId as-is
    return lowercaseFirst(opId);
  }

  // Compare case-insensitively
  const lcOpId = opId.toLowerCase();
  const lcResource = resourceName.toLowerCase();

  // If the opId starts with 'jobs', remove it
  if (lcOpId.startsWith(lcResource)) {
    const sliced = opId.slice(resourceName.length);
    return lowercaseFirst(sliced);
  }

  // Otherwise, just return the opId with a lowercase first letter
  return lowercaseFirst(opId);
}
