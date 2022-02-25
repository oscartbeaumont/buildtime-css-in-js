import { Plugin } from "vite";
import * as ts from "typescript";

const stylePropToCssObjectMapping: Record<string, string> = {
  w: "width",
  h: "height",
  p: "padding",
  m: "margin",
  c: "color",
  bg: "background",
  textAlign: "textAlign",
  transform: "transform",
  position: "position",
  top: "top",
  bottom: "bottom",
  left: "left",
  right: "right",
  // TODO: Build this out to have a decent amount of properties
};

interface State {
  styles: Record<string, ts.PropertyAssignment>;
  stylesPassthroughIdentifier?: ts.PropertyName;
}

function recurseProps(
  factory: ts.NodeFactory,
  state: State,
  properties: ts.NodeArray<ts.ObjectLiteralElementLike>,
  alwaysAdd?: boolean
) {
  for (const property of properties) {
    if (
      ts.isPropertyAssignment(property) ||
      ts.isShorthandPropertyAssignment(property)
    ) {
      const propertyName = property.symbol.escapedName; // TODO: Typescript
      if (propertyName === "style") {
        if (!property.initializer) {
          state.stylesPassthroughIdentifier = property.name;
        } else if (ts.isObjectLiteralExpression(property.initializer)) {
          recurseProps(factory, state, property.initializer.properties, true); // TODO: Typescript
        } else if (ts.isIdentifier(property.initializer)) {
          recurseProps(
            factory,
            state,
            property.initializer.flowNode.node.initializer.properties,
            true
          ); // TODO: Typescript
        } else {
          throw new Error(
            `Property spread operator argument type '${
              ts.SyntaxKind[property.initializer.kind]
            }' is not supported by todo!`
          );
        }
      } else {
        if (alwaysAdd) {
          state.styles[propertyName] = property.initializer; // TODO: Typescript
        } else if (stylePropToCssObjectMapping[propertyName] !== undefined) {
          state.styles[stylePropToCssObjectMapping[propertyName]] =
            ts.isPropertyAssignment(property)
              ? property.initializer
              : property.name;
        }
      }
    } else if (ts.isSpreadAssignment(property)) {
      if (ts.isVariableDeclaration(property.expression.flowNode.node)) {
        recurseProps(
          factory,
          state,
          property.expression.flowNode.node.initializer.properties,
          false
        );
      } else if (ts.isArrowFunction(property.expression.flowNode.node)) {
        // TODO: This isn't very efficient but it is the best workaround I can find now
        for (const [key, value] of Object.entries(
          stylePropToCssObjectMapping
        )) {
          state.styles[value] = factory.createPropertyAccessExpression(
            property.expression,
            key
          );
        }
      } else {
        throw new Error(
          `Property spread operator argument type '${
            ts.SyntaxKind[property.expression.flowNode.node?.kind]
          }' is not supported by todo!`
        );
      }
    } else {
      throw new Error(
        `Property kind '${
          ts.SyntaxKind[property?.kind]
        }' is not supported by todo!`
      );
    }
  }
}

const styleTransformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
  return (sourceFile) => {
    const { factory } = context;
    const visitor = (node: ts.Node): ts.Node => {
      if (ts.isCallExpression(node)) {
        if (
          node.arguments.length >= 2 &&
          ts.isObjectLiteralExpression(node.arguments[1])
        ) {
          const args = [...node.arguments];
          let state: State = {
            styles: {},
          };
          recurseProps(factory, state, node.arguments[1].properties);

          // TODO: Strip style keys in spread operator object???
          if (Object.keys(state.styles).length !== 0)
            args[1] = factory.updateObjectLiteralExpression(node.arguments[1], [
              ...node.arguments[1].properties.filter(
                (property) =>
                  property.symbol?.escapedNamestyle !== undefined &&
                  PropToCssObjectMapping[property.symbol.escapedName] ===
                    undefined
              ),
              factory.createPropertyAssignment(
                factory.createIdentifier("style"),
                factory.createObjectLiteralExpression(
                  Object.entries(state.styles)
                    .map(([key, value]) =>
                      factory.createPropertyAssignment(
                        factory.createIdentifier(key),
                        value
                      )
                    )
                    .concat(
                      state.stylesPassthroughIdentifier
                        ? [
                            factory.createSpreadAssignment(
                              state.stylesPassthroughIdentifier
                            ),
                          ]
                        : []
                    )
                )
              ),
            ]);

          return factory.updateCallExpression(
            node,
            node.expression,
            node.typeArguments,
            args
          );
        }
      }

      return ts.visitEachChild(node, visitor, context);
    };

    return ts.visitNode(sourceFile, visitor);
  };
};

export default function todo(): Plugin {
  return {
    name: "buildtime-css-in-js",
    transform(code, id) {
      if (!id.endsWith("/src/Library.tsx"))
        return {
          code,
        };

      let result = ts.transpileModule(code, {
        compilerOptions: { module: ts.ModuleKind.ESNext },
        transformers: { before: [styleTransformer] },
      });

      console.log(result.outputText); // TODO

      return {
        code: result.outputText,
        map: result.sourceMapText,
      };
    },
  };
}
