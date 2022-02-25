*This project is a tech demo and isn't designed to be used.*

# Buildtime Css in Js


A little tech demo of achieving a [ChakraUI](https://chakra-ui.com/) like developer experience but without having a huge runtime.

# Mission:

[ChakraUI](https://chakra-ui.com) has a great developer experience for quickly building out a [React](https://reactjs.org) based frontend however it suffers from [huge bundle sizes](https://github.com/chakra-ui/chakra-ui/issues/4975) and performance issues when animation styles from Javascript (such as following a mouse cursor). This project aims to explore a possible solution to those issues. These are both due to the fact that [ChakraUI](https://chakra-ui.com) is implemented with a Javascript runtime. This demo creates a `src/Library.tsx` which has components you can import and style using the familiar style as props approach (Eg. `<Box bg="red" />` for a div with a red background). During the build process a [Vite](https://vitejs.dev) plugin (although could be ported to any build system) will go through the Javascript AST and transform your props into style calls. For example `<Box bg="red" />` will become `<Box style={{ background: "red" }} />`. With this approach even if you have `<Box bg={someJsBooleanVariable ? "blue" : "red"} />` everything would still work as expected after the transformation.

## Potential Future Goals:

I am currently don't intent to keep working on this but it was an interesting experiment. Some stuff that would have to be done to make this usable:

Features:
 - Theming support
 - Building standard library of prebuilt components like Chakra UI has
 - Dark/Light mode support

Cleanup:

 - Cleanup the code and fix AST parsing Typescript errors -> This was a "tech demo" so I was more about whether it was possible than if I can made a maintainable codebase
 - Move `src/Library.tsx` and `plugin/index.ts` into their own package from the example application
 - Split up the code plugin and the `vite` code so it can be ported to `webpack` or `rollup`
 - Make it work well with a Content-Security-Policy
 - Extract static styles into an external CSS file??
 - Unit tests -> Ensure props don't make it into final markup, check styles applied correctly, validate Typescript, etc
