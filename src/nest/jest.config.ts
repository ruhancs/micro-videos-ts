export default {
    displayName: {
        name: 'nest',
        color: 'magentaBright'
      },
    moduleFileExtensions: ["js","json","ts"],
    rootDir: "src",
    testRegex: ".*\\.spec\\.ts$",
    transform: {
        "^.+\\.(t|j)s$": "@swc/jest"
    },
    collectCoverageFrom: [
        "**/*.(t|j)s"
    ],
    coverageDirectory: "../coverage",
    testEnvironment: "node",
    moduleNameMapper: {
        "@rc/micro\\-videos/(.*)$": "<rootDir>/../../../node_modules/@rc/micro-videos/dist/$1",
    }
};