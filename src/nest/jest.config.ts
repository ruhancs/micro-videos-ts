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
        //"#seedwork/domain": "<rootDir>/../../../node_modules/@rc/micro-videos/dist/@seedwork/domain/index.js",
        "#seedwork/(.*)$": "<rootDir>/../../../node_modules/@rc/micro-videos/dist/@seedwork/$1",
        //"#catgeory/domain": "<rootDir>/../../../node_modules/@rc/micro-videos/dist/category/domain/index.js",
        "#category/(.*)$": "<rootDir>/../../../node_modules/@rc/micro-videos/dist/category/$1",
    }
};