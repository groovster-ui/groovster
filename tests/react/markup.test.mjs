import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const dist = new URL('../../packages/react/dist/index.js', import.meta.url);
if (!fs.existsSync(dist)) {
  throw new Error('Missing packages/react/dist. Run pnpm react:build.');
}
const ui = await import(dist);

function html(node) {
  return renderToStaticMarkup(node);
}

test('every exported component renders a real element', () => {
  const samples = {
    Alert: React.createElement(ui.Alert, { title: 'Hi' }, 'Body'),
    Avatar: React.createElement(ui.Avatar, { fallback: 'AL', 'aria-label': 'Ada' }),
    Breadcrumb: React.createElement(ui.Breadcrumb, null, React.createElement('li', { className: 'ew-breadcrumb__item' }, 'Home')),
    Button: React.createElement(ui.Button, null, 'Save'),
    Card: React.createElement(ui.Card, null, 'Body'),
    Checkbox: React.createElement(ui.Checkbox, { label: 'Accept', name: 'terms' }),
    Dialog: React.createElement(ui.Dialog, { title: 'Sign up' }, 'Fields'),
    IconButton: React.createElement(ui.IconButton, { 'aria-label': 'Close' }, '×'),
    Link: React.createElement(ui.Link, { href: '/pricing' }, 'Pricing'),
    Menu: React.createElement(ui.Menu, null, 'Menu'),
    OrnamentDivider: React.createElement(ui.OrnamentDivider, null),
    Popover: React.createElement(ui.Popover, null, 'Pop'),
    Radio: React.createElement(ui.Radio, { label: 'Basic', name: 'plan', value: 'basic' }),
    Select: React.createElement(ui.Select, { label: 'Country', name: 'country' }, React.createElement('option', { value: 'us' }, 'United States')),
    Slider: React.createElement(ui.Slider, { label: 'Volume', name: 'vol', defaultValue: 40 }),
    Switch: React.createElement(ui.Switch, { label: 'Notifications', name: 'notes' }),
    Tabs: React.createElement(ui.Tabs, null, 'Tabs'),
    TextField: React.createElement(ui.TextField, { label: 'Email', name: 'email' }),
    Textarea: React.createElement(ui.Textarea, { label: 'Bio', name: 'bio' }),
    Toast: React.createElement(ui.Toast, null),
    Tooltip: React.createElement(ui.Tooltip, null, 'Tip'),
    EraRoot: React.createElement(ui.EraRoot, { era: 'deco', fidelityBand: 'signature' }, 'Child'),
  };
  assert.equal(Object.keys(samples).length, 22);
  for (const [name, node] of Object.entries(samples)) {
    const markup = html(node);
    assert.doesNotMatch(markup, /input\[type/, name);
    assert.doesNotMatch(markup, /<article\|/, name);
    assert.doesNotMatch(markup, /<hr\|/, name);
    assert.match(markup, /class="[^"]*ew-/, name);
  }
});

test('choice controls expose native inputs inside labels', () => {
  const box = html(React.createElement(ui.Checkbox, { label: 'Accept', name: 'terms', value: 'yes', required: true }));
  assert.match(box, /<label class="ew-checkbox"/);
  assert.match(box, /<input[^>]*class="ew-checkbox__control"[^>]*type="checkbox"/);
  assert.match(box, /ew-checkbox__box/);
  assert.match(box, /ew-checkbox__label">Accept/);
  assert.match(box, /name="terms"/);
  assert.match(box, /required/);

  const radio = html(React.createElement(ui.Radio, { label: 'Pro', name: 'plan', value: 'pro' }));
  assert.match(radio, /type="radio"/);
  assert.match(radio, /ew-radio__disc/);

  const sw = html(React.createElement(ui.Switch, { label: 'On', defaultChecked: true }));
  assert.match(sw, /role="switch"/);
  assert.match(sw, /aria-checked="true"/);
  assert.match(sw, /ew-switch__track/);
  assert.match(sw, /ew-switch__thumb/);
});

test('fields associate labels and select keeps its options', () => {
  const field = html(React.createElement(ui.TextField, { label: 'Email', id: 'email', description: 'Work' }));
  assert.match(field, /<label class="ew-text-field__label" for="email">Email<\/label>/);
  assert.match(field, /<input[^>]*id="email"[^>]*class="ew-text-field__control"/);
  assert.match(field, /aria-describedby="email-description"/);

  const select = html(
    React.createElement(ui.Select, { label: 'Country', id: 'country' }, React.createElement('option', { value: 'us' }, 'United States'))
  );
  assert.match(select, /<ew-select class="ew-select"/);
  assert.match(select, /<select[^>]*id="country"[^>]*class="ew-select__control"/);
  assert.match(select, /<option value="us">United States<\/option>/);
});

test('EraRoot writes the band API and drops numeric fidelity', () => {
  const root = html(React.createElement(ui.EraRoot, { era: 'neon', fidelityBand: 'signature' }, 'x'));
  assert.match(root, /data-fidelity-band="standard"/);
  assert.doesNotMatch(root, /data-fidelity=/);
  const costume = html(React.createElement(ui.EraRoot, { era: 'deco' }, 'x'));
  assert.doesNotMatch(costume, /data-fidelity-band/);
  assert.match(costume, /data-era="deco"/);
});

test('variant and data attributes land on the component root', () => {
  const button = html(React.createElement(ui.Button, { variant: 'ghost', 'data-loading': 'true' }, 'Save'));
  assert.match(button, /^<button[^>]*class="ew-button"/);
  assert.match(button, /data-variant="ghost"/);
  assert.match(button, /data-loading="true"/);
  assert.match(button, /type="button"/);
});
