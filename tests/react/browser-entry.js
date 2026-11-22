import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Checkbox, Radio, Select, Slider, Switch, TextField, Textarea } from '../../packages/react/dist/index.js';

function Demo() {
  const [on, setOn] = useState(false);
  const refs = {};
  window.__refs = refs;
  return React.createElement(
    'form',
    { id: 'demo' },
    React.createElement(Checkbox, {
      ref: (node) => {
        refs.checkbox = node;
      },
      name: 'agree',
      value: 'yes',
      label: 'Accept',
    }),
    React.createElement(Checkbox, {
      name: 'controlled',
      label: 'Controlled',
      checked: on,
      onChange: (event) => setOn(event.target.checked),
    }),
    React.createElement(Switch, { name: 'notes', value: 'on', label: 'Notes' }),
    React.createElement(Radio, { name: 'plan', value: 'basic', label: 'Basic' }),
    React.createElement(Radio, { name: 'plan', value: 'pro', label: 'Pro', defaultChecked: true }),
    React.createElement(TextField, { name: 'email', label: 'Email', required: true, defaultValue: 'a@b.co' }),
    React.createElement(Textarea, { name: 'bio', label: 'Bio', defaultValue: 'Hello' }),
    React.createElement(
      Select,
      { name: 'country', label: 'Country', defaultValue: 'ca' },
      React.createElement('option', { value: 'us' }, 'United States'),
      React.createElement('option', { value: 'ca' }, 'Canada')
    ),
    React.createElement(Slider, { name: 'vol', label: 'Volume', defaultValue: 40, min: 0, max: 100 }),
    React.createElement(Button, { type: 'submit' }, 'Go'),
    React.createElement('output', { id: 'state' }, on ? 'on' : 'off')
  );
}

window.__render = () => {
  createRoot(document.getElementById('root')).render(React.createElement(Demo));
};
