/**
 * Generate React wrappers from component specs.
 * Distinguishes native tags, attributes, root classes, anatomy, and web components.
 * Do not hand-edit packages/react/src — change this generator or the specs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { getOutRoot } from './paths.js';
import { writeText, rel } from './io.js';

const TAG_RE = /^[a-z][a-z0-9-]*$/;

const ELEMENT_TYPES = {
  a: 'HTMLAnchorElement',
  button: 'HTMLButtonElement',
  dialog: 'HTMLDialogElement',
  div: 'HTMLDivElement',
  hr: 'HTMLHRElement',
  input: 'HTMLInputElement',
  label: 'HTMLLabelElement',
  nav: 'HTMLElement',
  article: 'HTMLElement',
  select: 'HTMLSelectElement',
  span: 'HTMLSpanElement',
  textarea: 'HTMLTextAreaElement',
};

function toPascal(id) {
  return id
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

function jsString(value) {
  return JSON.stringify(value);
}

/** Parse spec.nativeElement into a real tag plus literal attributes. */
export function parseNativeElement(raw) {
  const text = String(raw || 'div').trim();
  const later = text.match(/custom element later:\s*(ew-[\w-]+)/i);
  if (later) return { tag: later[1], attrs: {}, custom: true };
  const plus = text.match(/^(.*?)\s+\+\s+(ew-[\w-]+)\s*$/);
  if (plus) return { tag: plus[2], attrs: {}, custom: true };
  if (/^ew-[\w-]+$/.test(text)) return { tag: text, attrs: {}, custom: true };
  const choice = text.split('|')[0].trim();
  const match = choice.match(/^([a-zA-Z][\w-]*)(?:\[([a-zA-Z_:][\w:.-]*)=(?:"([^"]*)"|'([^']*)'|([^\]]+))\])?$/);
  if (!match) {
    throw new Error(`Cannot parse nativeElement ${jsString(raw)}`);
  }
  const tag = match[1].toLowerCase();
  const attrs = {};
  if (match[2]) attrs[match[2]] = match[3] ?? match[4] ?? match[5];
  if (!TAG_RE.test(tag)) {
    throw new Error(`Invalid HTML tag ${jsString(tag)} from nativeElement ${jsString(raw)}`);
  }
  return { tag, attrs, custom: tag.startsWith('ew-') };
}

function partClass(comp, part) {
  const found = (comp.anatomy || []).find((item) => item.part === part);
  const match = found?.selector?.match(/\.((?:ew-[\w-]+))/);
  if (!match) return null;
  return match[1];
}

function requiredPartClass(comp, part) {
  const value = partClass(comp, part);
  if (!value) throw new Error(`${comp.id} anatomy is missing a class for part "${part}"`);
  return value;
}

function variantFields(comp) {
  return Object.entries(comp.variants || {}).map(([key, def]) => ({
    key,
    attr: def.attribute || `data-${key}`,
    values: def.values || [],
  }));
}

function propTypeBlock(comp, extraLines) {
  const lines = [...extraLines];
  for (const field of variantFields(comp)) {
    lines.push(`  ${field.key}?: ${field.values.map((v) => jsString(v)).join(' | ')};`);
  }
  if (comp.sizes?.values) {
    lines.push(`  size?: ${comp.sizes.values.map((v) => jsString(v)).join(' | ')};`);
  }
  return lines.join('\n');
}

function destructureNames(comp, extras) {
  return [
    'className',
    ...variantFields(comp).map((field) => field.key),
    ...(comp.sizes ? ['size'] : []),
    ...extras,
    '...rest',
  ].join(', ');
}

function dataBindSource(comp, indent = '  ') {
  const lines = [`${indent}const dataProps: Record<string, string> = {};`];
  for (const field of variantFields(comp)) {
    lines.push(
      `${indent}if (${field.key} != null) dataProps[${jsString(field.attr)}] = ${field.key};`
    );
  }
  if (comp.sizes) {
    const attr = comp.sizes.attribute || 'data-size';
    lines.push(`${indent}if (size != null) dataProps[${jsString(attr)}] = size;`);
  }
  return lines.join('\n');
}

function splitSource(indent = '  ') {
  return `${indent}const rootExtra: Record<string, unknown> = {};
${indent}const controlProps: Record<string, unknown> = {};
${indent}for (const [key, value] of Object.entries(rest)) {
${indent}  if (key.startsWith('data-') || key === 'style') rootExtra[key] = value;
${indent}  else controlProps[key] = value;
${indent}}`;
}

function elementType(tag) {
  return ELEMENT_TYPES[tag] || 'HTMLElement';
}

function intrinsic(tag) {
  return ELEMENT_TYPES[tag] ? `'${tag}'` : null;
}

function patternOf(comp, native) {
  if (comp.id === 'checkbox' || comp.id === 'radio' || comp.id === 'switch') return 'choice';
  if (comp.id === 'text-field' || comp.id === 'textarea') return 'field';
  if (comp.id === 'select') return 'select';
  if (comp.id === 'slider') return 'slider';
  if (comp.id === 'dialog') return 'dialog';
  if (comp.id === 'alert') return 'alert';
  if (comp.id === 'breadcrumb') return 'breadcrumb';
  if (comp.id === 'icon-button') return 'icon-button';
  if (comp.id === 'avatar') return 'avatar';
  if (comp.id === 'ornament-divider') return 'void';
  if (native.custom || comp.behavior === 'web-component') return 'host';
  return 'leaf';
}

function choiceVisual(comp) {
  if (comp.id === 'switch') {
    return `React.createElement('span', { className: ${jsString(requiredPartClass(comp, 'track'))}, 'aria-hidden': true }, React.createElement('span', { className: ${jsString(requiredPartClass(comp, 'thumb'))} }))`;
  }
  const part = comp.id === 'radio' ? 'disc' : 'box';
  return `React.createElement('span', { className: ${jsString(requiredPartClass(comp, part))}, 'aria-hidden': true })`;
}

function emitChoice(comp, native) {
  const name = toPascal(comp.id);
  const controlType = 'HTMLInputElement';
  const inputType = native.attrs.type || 'checkbox';
  const isSwitch = comp.id === 'switch';
  const lines = [
    `import * as React from 'react';`,
    ``,
    `export type ${name}Props = Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'type'> & {`,
    propTypeBlock(comp, [`  label?: React.ReactNode;`]),
    `};`,
    ``,
    `/** ${comp.summary} */`,
    `export const ${name} = React.forwardRef<${controlType}, ${name}Props>(function ${name}(`,
    `  { ${destructureNames(comp, ['label', 'children', 'checked', 'defaultChecked', 'onChange'])} },`,
    `  ref`,
    `) {`,
    dataBindSource(comp),
    splitSource(),
  ];
  if (isSwitch) {
    lines.push(
      `  const inputRef = React.useRef<HTMLInputElement>(null);`,
      `  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);`,
      `  const [ariaOn, setAriaOn] = React.useState(checked !== undefined ? !!checked : !!defaultChecked);`,
      `  React.useLayoutEffect(() => {`,
      `    if (checked !== undefined) setAriaOn(!!checked);`,
      `  }, [checked]);`,
      `  React.useEffect(() => {`,
      `    const form = inputRef.current?.form;`,
      `    if (!form) return undefined;`,
      `    const onReset = () => {`,
      `      queueMicrotask(() => {`,
      `        if (inputRef.current) setAriaOn(inputRef.current.checked);`,
      `      });`,
      `    };`,
      `    form.addEventListener('reset', onReset);`,
      `    return () => form.removeEventListener('reset', onReset);`,
      `  }, []);`,
      `  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {`,
      `    setAriaOn(event.currentTarget.checked);`,
      `    onChange?.(event);`,
      `  };`
    );
  }
  const inputExtras = isSwitch
    ? `ref: inputRef, role: 'switch', 'aria-checked': ariaOn ? 'true' : 'false', onChange: handleChange, ...(checked !== undefined ? { checked } : {}), ...(checked === undefined && defaultChecked !== undefined ? { defaultChecked } : {})`
    : `ref, ...(checked !== undefined ? { checked } : {}), ...(defaultChecked !== undefined ? { defaultChecked } : {}), ...(onChange ? { onChange } : {})`;
  lines.push(
    `  const cls = [${jsString(comp.className)}, className].filter(Boolean).join(' ');`,
    `  return React.createElement(`,
    `    'label',`,
    `    { className: cls, ...dataProps, ...(rootExtra as React.LabelHTMLAttributes<HTMLLabelElement>) },`,
    `    React.createElement('input', {`,
    `      ...(controlProps as React.InputHTMLAttributes<HTMLInputElement>),`,
    `      ${inputExtras},`,
    `      className: ${jsString(requiredPartClass(comp, 'control'))},`,
    `      type: ${jsString(inputType)},`,
    `    }),`,
    `    ${choiceVisual(comp)},`,
    `    React.createElement('span', { className: ${jsString(requiredPartClass(comp, 'label'))} }, label ?? children)`,
    `  );`,
    `});`,
    `${name}.displayName = ${jsString(name)};`,
    ``
  );
  return lines.join('\n');
}

function emitField(comp, native) {
  const name = toPascal(comp.id);
  const tag = native.tag === 'textarea' ? 'textarea' : 'input';
  const controlType = elementType(tag);
  const descriptionClass = partClass(comp, 'description');
  const errorClass = partClass(comp, 'error');
  const lines = [
    `import * as React from 'react';`,
    ``,
    `export type ${name}Props = Omit<React.ComponentPropsWithoutRef<'${tag}'>, 'size'> & {`,
    propTypeBlock(comp, [
      `  label?: React.ReactNode;`,
      `  description?: React.ReactNode;`,
      `  error?: React.ReactNode;`,
    ]),
    `};`,
    ``,
    `/** ${comp.summary} */`,
    `export const ${name} = React.forwardRef<${controlType}, ${name}Props>(function ${name}(`,
    `  { ${destructureNames(comp, ['label', 'description', 'error', 'children', 'id', 'required'])} },`,
    `  ref`,
    `) {`,
    `  const autoId = React.useId();`,
    `  const controlId = id ?? autoId;`,
    `  const descriptionId = description ? \`\${controlId}-description\` : undefined;`,
    `  const errorId = error ? \`\${controlId}-error\` : undefined;`,
    `  const describedBy = [descriptionId, errorId, rest['aria-describedby']].filter(Boolean).join(' ') || undefined;`,
    dataBindSource(comp),
    splitSource(),
    `  const invalid = error != null && error !== false && error !== '';`,
    `  const cls = [${jsString(comp.className)}, className].filter(Boolean).join(' ');`,
    `  return React.createElement(`,
    `    'div',`,
    `    {`,
    `      className: cls,`,
    `      ...dataProps,`,
    `      ...(rootExtra as React.HTMLAttributes<HTMLDivElement>),`,
    `      ...(invalid ? { 'data-invalid': 'true' } : {}),`,
    `    },`,
    `    React.createElement('label', { className: ${jsString(requiredPartClass(comp, 'label'))}, htmlFor: controlId }, label ?? children),`,
    descriptionClass
      ? `    description ? React.createElement('div', { className: ${jsString(descriptionClass)}, id: descriptionId }, description) : null,`
      : `    null,`,
    `    React.createElement('${tag}', {`,
    `      ...(controlProps as React.${tag === 'textarea' ? 'TextareaHTMLAttributes<HTMLTextAreaElement>' : 'InputHTMLAttributes<HTMLInputElement>'}),`,
    `      ref,`,
    `      id: controlId,`,
    `      className: ${jsString(requiredPartClass(comp, 'control'))},`,
    `      required,`,
    `      'aria-invalid': invalid ? true : undefined,`,
    `      'aria-describedby': describedBy,`,
    tag === 'textarea' ? `      rows: (rest.rows as number | undefined) ?? 4,` : `      type: (rest.type as string | undefined) ?? 'text',`,
    `    }),`,
    errorClass
      ? `    error ? React.createElement('div', { className: ${jsString(errorClass)}, id: errorId }, error) : null`
      : `    null`,
    `  );`,
    `});`,
    `${name}.displayName = ${jsString(name)};`,
    ``,
  ];
  return lines.join('\n');
}

function emitSelect(comp) {
  const name = toPascal(comp.id);
  return `import * as React from 'react';

export type ${name}Props = Omit<React.ComponentPropsWithoutRef<'select'>, 'size'> & {
${propTypeBlock(comp, [`  label?: React.ReactNode;`])}
};

/** ${comp.summary} */
export const ${name} = React.forwardRef<HTMLSelectElement, ${name}Props>(function ${name}(
  { ${destructureNames(comp, ['label', 'children', 'id'])} },
  ref
) {
  const autoId = React.useId();
  const controlId = id ?? autoId;
${dataBindSource(comp)}
${splitSource()}
  const cls = [${jsString(comp.className)}, className].filter(Boolean).join(' ');
  return React.createElement(
    'ew-select',
    { className: cls, ...dataProps, ...(rootExtra as React.HTMLAttributes<HTMLElement>) },
    React.createElement('label', { className: ${jsString(requiredPartClass(comp, 'label'))}, htmlFor: controlId }, label),
    React.createElement(
      'select',
      {
        ...(controlProps as React.SelectHTMLAttributes<HTMLSelectElement>),
        ref,
        id: controlId,
        className: ${jsString(requiredPartClass(comp, 'control'))},
      },
      children
    )
  );
});
${name}.displayName = ${jsString(name)};
`;
}

function emitSlider(comp) {
  const name = toPascal(comp.id);
  return `import * as React from 'react';

export type ${name}Props = Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'type'> & {
${propTypeBlock(comp, [`  label?: React.ReactNode;`])}
};

/** ${comp.summary} */
export const ${name} = React.forwardRef<HTMLInputElement, ${name}Props>(function ${name}(
  { ${destructureNames(comp, ['label', 'children: _children', 'id', 'value', 'defaultValue'])} },
  ref
) {
  const autoId = React.useId();
  const controlId = id ?? autoId;
${dataBindSource(comp)}
${splitSource()}
  const cls = [${jsString(comp.className)}, className].filter(Boolean).join(' ');
  const shown = value ?? defaultValue ?? '';
  return React.createElement(
    'ew-slider',
    { className: cls, ...dataProps, ...(rootExtra as React.HTMLAttributes<HTMLElement>) },
    label != null ? React.createElement('label', { className: ${jsString(requiredPartClass(comp, 'label'))}, htmlFor: controlId }, label) : null,
    React.createElement('input', {
      ...(controlProps as React.InputHTMLAttributes<HTMLInputElement>),
      ref,
      id: controlId,
      className: ${jsString(requiredPartClass(comp, 'control'))},
      type: 'range',
      ...(value !== undefined ? { value } : {}),
      ...(defaultValue !== undefined ? { defaultValue } : {}),
    }),
    React.createElement('output', { className: ${jsString(requiredPartClass(comp, 'value'))}, htmlFor: controlId }, shown)
  );
});
${name}.displayName = ${jsString(name)};
`;
}

function emitDialog(comp) {
  const name = toPascal(comp.id);
  return `import * as React from 'react';

export type ${name}Props = Omit<React.ComponentPropsWithoutRef<'dialog'>, 'size' | 'title'> & {
${propTypeBlock(comp, [`  title?: React.ReactNode;`, `  footer?: React.ReactNode;`])}
};

/** ${comp.summary} */
export const ${name} = React.forwardRef<HTMLDialogElement, ${name}Props>(function ${name}(
  { ${destructureNames(comp, ['title', 'footer', 'children'])} },
  ref
) {
  const titleId = React.useId();
${dataBindSource(comp)}
  const cls = [${jsString(comp.className)}, className].filter(Boolean).join(' ');
  return React.createElement(
    'dialog',
    {
      ref,
      className: cls,
      ...dataProps,
      ...(title != null ? { 'aria-labelledby': titleId } : {}),
      ...rest,
    },
    title != null
      ? React.createElement('header', { className: ${jsString(requiredPartClass(comp, 'header'))} }, React.createElement('h2', { id: titleId }, title))
      : null,
    React.createElement('div', { className: ${jsString(requiredPartClass(comp, 'body'))} }, children),
    footer != null ? React.createElement('footer', { className: ${jsString(requiredPartClass(comp, 'footer'))} }, footer) : null
  );
});
${name}.displayName = ${jsString(name)};
`;
}

function emitAlert(comp) {
  const name = toPascal(comp.id);
  return `import * as React from 'react';

export type ${name}Props = Omit<React.ComponentPropsWithoutRef<'div'>, 'size' | 'title'> & {
${propTypeBlock(comp, [`  title?: React.ReactNode;`])}
};

/** ${comp.summary} */
export const ${name} = React.forwardRef<HTMLDivElement, ${name}Props>(function ${name}(
  { ${destructureNames(comp, ['title', 'children', 'role'])} },
  ref
) {
${dataBindSource(comp)}
  const cls = [${jsString(comp.className)}, className].filter(Boolean).join(' ');
  return React.createElement(
    'div',
    { ref, className: cls, role: role ?? 'status', ...dataProps, ...rest },
    title != null ? React.createElement('strong', { className: ${jsString(requiredPartClass(comp, 'title'))} }, title) : null,
    React.createElement('p', { className: ${jsString(requiredPartClass(comp, 'body'))} }, children)
  );
});
${name}.displayName = ${jsString(name)};
`;
}

function emitBreadcrumb(comp) {
  const name = toPascal(comp.id);
  return `import * as React from 'react';

export type ${name}Props = Omit<React.ComponentPropsWithoutRef<'nav'>, 'size'> & {
${propTypeBlock(comp, [])}
};

/** ${comp.summary} */
export const ${name} = React.forwardRef<HTMLElement, ${name}Props>(function ${name}(
  { ${destructureNames(comp, ['children'])} },
  ref
) {
${dataBindSource(comp)}
  const cls = [${jsString(comp.className)}, className].filter(Boolean).join(' ');
  return React.createElement(
    'nav',
    { ref, className: cls, ...dataProps, ...rest, 'aria-label': rest['aria-label'] ?? 'Breadcrumb' },
    React.createElement('ol', { className: ${jsString(requiredPartClass(comp, 'list'))} }, children)
  );
});
${name}.displayName = ${jsString(name)};
`;
}

function emitIconButton(comp) {
  const name = toPascal(comp.id);
  return `import * as React from 'react';

export type ${name}Props = Omit<React.ComponentPropsWithoutRef<'button'>, 'size'> & {
${propTypeBlock(comp, [])}
};

/** ${comp.summary} */
export const ${name} = React.forwardRef<HTMLButtonElement, ${name}Props>(function ${name}(
  { ${destructureNames(comp, ['children', 'type'])} },
  ref
) {
${dataBindSource(comp)}
  const cls = [${jsString(comp.className)}, className].filter(Boolean).join(' ');
  const label = typeof rest['aria-label'] === 'string' ? rest['aria-label'] : undefined;
  return React.createElement(
    'button',
    { ref, type: type ?? 'button', className: cls, ...dataProps, ...rest },
    React.createElement('span', {
      className: ${jsString(requiredPartClass(comp, 'icon'))},
      ...(label ? { 'aria-hidden': true } : {}),
    }, children)
  );
});
${name}.displayName = ${jsString(name)};
`;
}

function emitAvatar(comp) {
  const name = toPascal(comp.id);
  return `import * as React from 'react';

export type ${name}Props = Omit<React.ComponentPropsWithoutRef<'span'>, 'size'> & {
${propTypeBlock(comp, [`  fallback?: React.ReactNode;`])}
};

/** ${comp.summary} */
export const ${name} = React.forwardRef<HTMLSpanElement, ${name}Props>(function ${name}(
  { ${destructureNames(comp, ['fallback', 'children'])} },
  ref
) {
${dataBindSource(comp)}
  const cls = [${jsString(comp.className)}, className].filter(Boolean).join(' ');
  return React.createElement(
    'span',
    { ref, className: cls, ...dataProps, ...rest },
    fallback != null ? React.createElement('span', { className: ${jsString(requiredPartClass(comp, 'fallback'))} }, fallback) : null,
    children
  );
});
${name}.displayName = ${jsString(name)};
`;
}

function emitLeaf(comp, native, { voidElement = false, host = false } = {}) {
  const name = toPascal(comp.id);
  const tag = native.tag;
  const refType = host ? 'HTMLElement' : elementType(tag);
  const propsBase = intrinsic(tag) && !host
    ? `Omit<React.ComponentPropsWithoutRef<'${tag}'>, 'size'>`
    : `Omit<React.HTMLAttributes<HTMLElement>, 'size'>`;
  const fixedAttrs = Object.entries(native.attrs)
    .filter(([key]) => key !== 'type')
    .map(([key, value]) => `${key}: ${jsString(value)}`)
    .join(', ');
  const rootClasses = [comp.className];
  if (tag === 'ew-toast-region') rootClasses.push('ew-toast-region');
  const destructure = [
    'className',
    ...variantFields(comp).map((field) => field.key),
    ...(comp.sizes ? ['size'] : []),
    voidElement ? 'children: _children' : 'children',
    ...(tag === 'button' ? ["type = 'button'"] : []),
    '...rest',
  ].join(', ');
  const childArg = voidElement ? '' : ',\n    children';
  return `import * as React from 'react';

export type ${name}Props = ${propsBase} & {
${propTypeBlock(comp, [])}
};

/** ${comp.summary} */
export const ${name} = React.forwardRef<${refType}, ${name}Props>(function ${name}(
  { ${destructure} },
  ref
) {
${dataBindSource(comp)}
  const cls = [${rootClasses.map((item) => jsString(item)).join(', ')}, className].filter(Boolean).join(' ');
  return React.createElement(
    ${jsString(tag)},
    { ref, ...rest, className: cls, ${tag === 'button' ? 'type, ' : ''}${fixedAttrs ? `${fixedAttrs}, ` : ''}...dataProps }${childArg}
  );
});
${name}.displayName = ${jsString(name)};
`;
}

function assertRequiredAnatomy(comp, source) {
  if (!source.includes(comp.className)) {
    throw new Error(`${comp.id} generated source is missing root class ${comp.className}`);
  }
  if (/createElement\(\s*'[^']*\[/.test(source) || /createElement\(\s*'[^']*\|/.test(source)) {
    throw new Error(`${comp.id} generated an invalid tag`);
  }
}

export function componentSource(comp) {
  const native = parseNativeElement(comp.nativeElement);
  const pattern = patternOf(comp, native);
  let source;
  if (pattern === 'choice') source = emitChoice(comp, native);
  else if (pattern === 'field') source = emitField(comp, native);
  else if (pattern === 'select') source = emitSelect(comp);
  else if (pattern === 'slider') source = emitSlider(comp);
  else if (pattern === 'dialog') source = emitDialog(comp);
  else if (pattern === 'alert') source = emitAlert(comp);
  else if (pattern === 'breadcrumb') source = emitBreadcrumb(comp);
  else if (pattern === 'icon-button') source = emitIconButton(comp);
  else if (pattern === 'avatar') source = emitAvatar(comp);
  else if (pattern === 'void') source = emitLeaf(comp, native, { voidElement: true });
  else if (pattern === 'host') source = emitLeaf(comp, native, { host: true });
  else source = emitLeaf(comp, native);
  assertRequiredAnatomy(comp, source);
  return source;
}

function eraRootSource() {
  return `import * as React from 'react';

/** Public fidelity API. \`default\` and \`signature\` are deprecated aliases of \`standard\`. */
export type FidelityBand = 'whisper' | 'standard' | 'costume' | 'default' | 'signature';

export type EraRootProps = {
  era: string;
  mode?: 'light' | 'dark';
  /** whisper | standard | costume. Costume is the default when omitted. */
  fidelityBand?: FidelityBand;
  dialect?: string;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>;

const BAND_ALIAS: Record<string, string> = { default: 'standard', signature: 'standard' };

export const EraRoot = React.forwardRef<HTMLDivElement, EraRootProps>(function EraRoot(
  { era, mode = 'light', fidelityBand, dialect, className, children, ...rest },
  ref
) {
  const cls = ['ew-root', className].filter(Boolean).join(' ');
  const data: Record<string, string> = { 'data-era': era, 'data-mode': mode };
  if (fidelityBand) data['data-fidelity-band'] = BAND_ALIAS[fidelityBand] || fidelityBand;
  if (dialect) data['data-dialect'] = dialect;
  return React.createElement('div', { ref, className: cls, ...data, ...rest }, children);
});
EraRoot.displayName = 'EraRoot';
`;
}

function packageJsonSource() {
  return (
    JSON.stringify(
      {
        name: '@groovster/react',
        version: '0.1.0-alpha.0',
        description: 'React wrappers over Groovster HTML/CSS. Generated from spec/components. React is a peer dependency.',
        type: 'module',
        license: 'MIT',
        sideEffects: false,
        files: ['dist', 'README.md'],
        exports: {
          '.': {
            types: './dist/index.d.ts',
            import: './dist/index.js',
            default: './dist/index.js',
          },
          './package.json': './package.json',
        },
        scripts: {
          build: 'tsc -p tsconfig.json',
          typecheck: 'tsc -p tsconfig.json --noEmit',
        },
        peerDependencies: {
          react: '>=18',
        },
        devDependencies: {
          '@types/react': '^19.0.2',
          react: '^19.0.0',
          typescript: '^5.7.3',
        },
        publishConfig: { access: 'public' },
        keywords: ['groovster', 'react', 'design-systems'],
      },
      null,
      2
    ) + '\n'
  );
}

function readmeSource() {
  return `# @groovster/react

Generated React wrappers. The canonical Groovster API remains HTML + \`ew-*\` classes. Build before publishing:

\`\`\`bash
pnpm --filter @groovster/react build
\`\`\`

\`\`\`tsx
import { EraRoot, Button, Checkbox } from '@groovster/react';
import '@groovster/css/era-widgets.css';

export function Demo() {
  return (
    <EraRoot era="deco" mode="light" fidelityBand="costume">
      <Checkbox name="terms" value="yes" label="Accept terms" />
      <Button variant="primary">Save</Button>
    </EraRoot>
  );
}
\`\`\`

\`fidelityBand\` is \`whisper\`, \`standard\`, or \`costume\` (the default when omitted). \`default\` and \`signature\` are deprecated aliases of \`standard\`. Numeric fidelity is not part of this package.

Register \`@groovster/elements\` before using tabs, select, menu, popover, tooltip, toast, or slider behavior. The wrappers still render the custom-element markup without that script.
`;
}

export function generateReactPackage(components, outputs) {
  const root = path.join(getOutRoot(), 'packages/react');
  const src = path.join(root, 'src');
  fs.mkdirSync(src, { recursive: true });

  const indexLines = ['/** Generated React wrappers for Groovster — do not hand-edit. */', ''];
  for (const comp of components) {
    const name = toPascal(comp.id);
    const file = path.join(src, `${name}.tsx`);
    writeText(file, componentSource(comp));
    outputs.push(rel(getOutRoot(), file));
    indexLines.push(`export { ${name} } from './${name}.js';`);
    indexLines.push(`export type { ${name}Props } from './${name}.js';`);
  }

  writeText(path.join(src, 'EraRoot.tsx'), eraRootSource());
  outputs.push(rel(getOutRoot(), path.join(src, 'EraRoot.tsx')));
  indexLines.push(`export { EraRoot } from './EraRoot.js';`);
  indexLines.push(`export type { EraRootProps, FidelityBand } from './EraRoot.js';`);
  writeText(path.join(src, 'index.ts'), indexLines.join('\n') + '\n');
  outputs.push(rel(getOutRoot(), path.join(src, 'index.ts')));

  writeText(path.join(root, 'package.json'), packageJsonSource());
  outputs.push(rel(getOutRoot(), path.join(root, 'package.json')));
  writeText(path.join(root, 'README.md'), readmeSource());
  outputs.push(rel(getOutRoot(), path.join(root, 'README.md')));
  return components.map((comp) => toPascal(comp.id));
}
