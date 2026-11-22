GENERATED FILE — do not edit. Source: spec/recipes/. Run: pnpm gen

# Component anatomy

Canonical HTML only. Load the section you are writing. Full notes stay in generated/llms/<id>.md.
Set data-era on a root. Fidelity bands: whisper, standard, costume.
Costume heroes: Neon and Atomic need .ew-hero__stage. Deco wraps copy in .ew-hero__panel.
Hard widgets need @groovster/elements/era-elements.js: ew-tabs, ew-select, ew-menu, ew-popover, ew-tooltip, ew-toast-region, ew-slider.

## alert

```html
<div class="ew-alert" data-variant="warning" role="status">
  <strong class="ew-alert__title">Check your email</strong>
  <p class="ew-alert__body">We sent a confirmation link.</p>
</div>
```
## avatar

```html
<span class="ew-avatar" data-variant="circle" aria-label="Ada Lovelace">
  <span class="ew-avatar__fallback">AL</span>
</span>
```
## breadcrumb

```html
<nav class="ew-breadcrumb" aria-label="Breadcrumb">
  <ol class="ew-breadcrumb__list">
    <li class="ew-breadcrumb__item"><a class="ew-link" href="/">Home</a></li>
    <li class="ew-breadcrumb__item"><a class="ew-link" href="/docs">Docs</a></li>
    <li class="ew-breadcrumb__item" aria-current="page">Button</li>
  </ol>
</nav>
```
## button

```html
<button type="button" class="ew-button">Save</button>
```
## card

```html
<article class="ew-card">
  <header class="ew-card__header"><h3>Plan</h3></header>
  <div class="ew-card__body"><p>Everything you need to ship.</p></div>
  <footer class="ew-card__footer"><button type="button" class="ew-button">Choose</button></footer>
</article>
```
## checkbox

```html
<label class="ew-checkbox">
  <input class="ew-checkbox__control" type="checkbox" />
  <span class="ew-checkbox__box" aria-hidden="true"></span>
  <span class="ew-checkbox__label">Accept terms</span>
</label>
```
## dialog

```html
<dialog class="ew-dialog" aria-labelledby="dlg-title">
  <header class="ew-dialog__header"><h2 id="dlg-title">Sign up</h2></header>
  <div class="ew-dialog__body"><!-- fields --></div>
  <footer class="ew-dialog__footer"><button type="button" class="ew-button" data-variant="ghost" onclick="this.closest('dialog').close()">Cancel</button><button type="submit" class="ew-button">Continue</button></footer>
</dialog>
```
## icon-button

```html
<button type="button" class="ew-icon-button" data-variant="ghost" aria-label="Close">
  <span class="ew-icon-button__icon" aria-hidden="true">×</span>
</button>
```
## link

```html
<a class="ew-link" href="/pricing">View pricing</a>
```
## menu

```html
<ew-menu class="ew-menu">
  <button type="button" class="ew-button ew-menu__trigger" aria-haspopup="menu">Actions</button>
  <div class="ew-menu__panel" role="menu">
    <button type="button" class="ew-menu__item" role="menuitem">Edit</button>
    <button type="button" class="ew-menu__item" role="menuitem">Delete</button>
  </div>
</ew-menu>
```
## ornament-divider

```html
<hr class="ew-ornament-divider" data-variant="ornament" />
```
## popover

```html
<ew-popover class="ew-popover">
  <button type="button" class="ew-button ew-popover__trigger" popovertarget="pop-1">Details</button>
  <div id="pop-1" class="ew-popover__panel" popover>
    <p>Popover content</p>
  </div>
</ew-popover>
```
## radio

```html
<fieldset class="ew-radio-group">
  <legend>Plan</legend>
  <label class="ew-radio"><input class="ew-radio__control" type="radio" name="plan" value="basic" /><span class="ew-radio__disc" aria-hidden="true"></span><span class="ew-radio__label">Basic</span></label>
  <label class="ew-radio"><input class="ew-radio__control" type="radio" name="plan" value="pro" /><span class="ew-radio__disc" aria-hidden="true"></span><span class="ew-radio__label">Pro</span></label>
</fieldset>
```
## select

```html
<ew-select class="ew-select">
  <label class="ew-select__label" for="country">Country</label>
  <select id="country" class="ew-select__control">
    <option value="us">United States</option>
    <option value="ca">Canada</option>
  </select>
</ew-select>
```
## slider

```html
<ew-slider class="ew-slider">
  <label class="ew-slider__label" for="vol">Volume</label>
  <input id="vol" class="ew-slider__control" type="range" min="0" max="100" value="40" />
  <output class="ew-slider__value">40</output>
</ew-slider>
```
## switch

```html
<label class="ew-switch">
  <input class="ew-switch__control" type="checkbox" role="switch" aria-checked="false" />
  <span class="ew-switch__track" aria-hidden="true"><span class="ew-switch__thumb"></span></span>
  <span class="ew-switch__label">Notifications</span>
</label>
```
## tabs

```html
<div class="ew-tabs">
  <div role="tablist" aria-label="Plans">
    <button type="button" role="tab" id="t-basic" aria-selected="true" aria-controls="p-basic">Basic</button>
    <button type="button" role="tab" id="t-pro" aria-selected="false" aria-controls="p-pro" tabindex="-1">Pro</button>
  </div>
  <div role="tabpanel" id="p-basic" aria-labelledby="t-basic">Basic plan</div>
  <div role="tabpanel" id="p-pro" aria-labelledby="t-pro" hidden>Pro plan</div>
</div>
```
## text-field

```html
<div class="ew-text-field">
  <label class="ew-text-field__label" for="email">Email</label>
  <input id="email" class="ew-text-field__control" type="email" autocomplete="email" />
</div>
```
## textarea

```html
<div class="ew-textarea">
  <label class="ew-textarea__label" for="bio">Bio</label>
  <textarea id="bio" class="ew-textarea__control" rows="4"></textarea>
</div>
```
## toast

```html
<ew-toast-region class="ew-toast-region" aria-live="polite"></ew-toast-region>
<!-- region.show({ title, body, variant }) -->
```
## tooltip

```html
<ew-tooltip class="ew-tooltip">
  <button type="button" class="ew-button" aria-describedby="tip-1">Info</button>
  <span id="tip-1" class="ew-tooltip__tip" role="tooltip">More detail</span>
</ew-tooltip>
```
