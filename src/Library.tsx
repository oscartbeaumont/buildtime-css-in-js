import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  HTMLProps,
  PropsWithChildren,
} from "react";

// TODO: Generic and pass through normal HTML element props
export interface GenericStyleProps<T = unknown> {
  w?: string;
  h?: string;
  p?: string;
  m?: string;
  style?: any; // TODO: Typescript
  bg?: string;
  c?: string;
  textAlign?: string;
  transform?: string;
  position?: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

// TODO: Runtime error if the build plugin was not run -> Use a constant which is modified by the build process

export function BaseComponent<T = unknown>(type: string) {
  const CustomTag = `${type}`;

  return ({
    children,
    style,
    ...props
  }: PropsWithChildren<GenericStyleProps & T>) => (
    <CustomTag {...props} style={style}>
      {children}
    </CustomTag>
  );
}

export const Box =
  BaseComponent<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  >("div");

export const Text =
  BaseComponent<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  >("h1");
