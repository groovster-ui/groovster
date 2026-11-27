GENERATED FILE — do not edit. Source: spec/recipes/. Run: pnpm gen

# Component anatomy

Canonical HTML only. Load the section you are writing. Full notes are in references/llms/<id>.md.
Set data-era on a root. Fidelity bands: whisper, standard, costume.
One hero tree for every era. Era CSS places the backdrop, stage, and panel.
Hard widgets need @groovster/elements/era-elements.js: ew-tabs, ew-select, ew-menu, ew-popover, ew-tooltip, ew-toast-region, ew-slider.

## hero

```html
<section class="ew-hero">
  <div class="ew-hero__backdrop" aria-hidden="true"></div>
  <div class="ew-hero__stage" aria-hidden="true"></div>
  <div class="ew-hero__panel">
    <div class="ew-hero__rays" aria-hidden="true"></div>
    <div class="ew-hero__content">
      <div class="ew-hero__fan" aria-hidden="true"></div>
      <p class="ew-script">Kicker</p>
      <h1 class="ew-hero__title">Title</h1>
      <p class="ew-hero__subtitle">Subtitle</p>
    </div>
  </div>
</section>
```

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
## badge

```html
<span class="ew-badge">3</span>
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
## chip

```html
<button type="button" class="ew-chip" aria-pressed="false">Unread</button>
```
## code

```html
<pre class="ew-code"><code>npm test</code><button type="button" class="ew-button ew-code__copy">Copy</button></pre>
```
## density

```html
<div class="ew-density" data-density="compact"><h1 class="ew-title ew-title--page">Inbox</h1></div>
```
## dialog

```html
<dialog class="ew-dialog" aria-labelledby="dlg-title">
  <header class="ew-dialog__header"><h2 id="dlg-title">Sign up</h2></header>
  <div class="ew-dialog__body"><!-- fields --></div>
  <footer class="ew-dialog__footer"><button type="button" class="ew-button" data-variant="ghost" onclick="this.closest('dialog').close()">Cancel</button><button type="submit" class="ew-button">Continue</button></footer>
</dialog>
```
## empty-state

```html
<div class="ew-empty-state"><h2 class="ew-empty-state__title ew-title--panel">Nothing here</h2><p class="ew-empty-state__body">No messages match.</p></div>
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
## list

```html
<ul class="ew-list" role="listbox" aria-label="Messages"><li><button type="button" class="ew-list-item is-unread" role="option" aria-selected="false" tabindex="0"><span class="ew-list-item__main"><span class="ew-list-item__primary">Maya Okafor</span><span class="ew-list-item__secondary">The kiln fired clean</span></span><span class="ew-list-item__meta">9:40</span></button></li></ul>
```
## media-card

```html
<a class="ew-media-card" data-ratio="poster" href="#title"><span class="ew-media-card__title">Night Market</span><span class="ew-media-card__progress" style="width:40%"></span></a>
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
## meter

```html
<div class="ew-meter"><span class="ew-meter__label" id="m1">Storage</span><meter class="ew-meter__bar" min="0" max="100" value="18" aria-labelledby="m1">18%</meter></div>
```
## nav-rail

```html
<nav class="ew-nav-rail" aria-label="Mail"><a class="ew-nav-rail__item" href="#inbox" aria-current="page"><span class="ew-nav-rail__label">Inbox</span><span class="ew-badge">8</span></a></nav>
```
## ornament-divider

```html
<hr class="ew-ornament-divider" data-variant="ornament" />
```
## pagination

```html
<nav class="ew-pagination" aria-label="Pages"><a class="ew-pagination__prev" href="#p1">Prev</a><a class="ew-pagination__page" href="#p2" aria-current="page">2</a><a class="ew-pagination__next" href="#p3">Next</a></nav>
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
## search

```html
<search class="ew-search" role="search"><input class="ew-text-field__control ew-search__control" type="search" aria-label="Search mail"><button type="button" class="ew-icon-button ew-search__clear" aria-label="Clear search">×</button></search>
```
## segmented

```html
<div class="ew-segmented" role="radiogroup" aria-label="View"><button type="button" class="ew-segmented__item" role="radio" aria-checked="true">List</button><button type="button" class="ew-segmented__item" role="radio" aria-checked="false">Grid</button></div>
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
## sheet

```html
<div class="ew-sheet"><div class="ew-sheet__head"></div><div class="ew-sheet__body"></div></div>
```
## shelf

```html
<section class="ew-shelf" aria-label="Continue"><h2 class="ew-shelf__title ew-title--section">Continue</h2><div class="ew-shelf__row" tabindex="0"></div></section>
```
## skeleton

```html
<div class="ew-skeleton" data-variant="block" aria-hidden="true"></div>
```
## slider

```html
<ew-slider class="ew-slider">
  <label class="ew-slider__label" for="vol">Volume</label>
  <input id="vol" class="ew-slider__control" type="range" min="0" max="100" value="40" />
  <output class="ew-slider__value">40</output>
</ew-slider>
```
## split

```html
<div class="ew-split"><div class="ew-split__side"></div><div class="ew-split__main"></div></div>
```
## stat

```html
<div class="ew-stat"><p class="ew-stat__label">Watched</p><p class="ew-stat__value">128</p><p class="ew-stat__delta" data-dir="up">12%</p></div>
```
## switch

```html
<label class="ew-switch">
  <input class="ew-switch__control" type="checkbox" role="switch" aria-checked="false" />
  <span class="ew-switch__track" aria-hidden="true"><span class="ew-switch__thumb"></span></span>
  <span class="ew-switch__label">Notifications</span>
</label>
```
## table

```html
<table class="ew-table" data-responsive="stack"><caption>Specifics</caption><thead><tr><th aria-sort="ascending">Lot</th></tr></thead><tbody><tr class="is-selected" aria-selected="true"><td data-label="Lot">Bowl</td></tr></tbody></table>
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
## toolbar

```html
<header><div class="ew-toolbar" role="toolbar" aria-label="Mailbox" data-sticky="true"><div class="ew-toolbar__start"></div><div class="ew-toolbar__center"></div><div class="ew-toolbar__end"></div></div></header>
```
## tooltip

```html
<ew-tooltip class="ew-tooltip">
  <button type="button" class="ew-button" aria-describedby="tip-1">Info</button>
  <span id="tip-1" class="ew-tooltip__tip" role="tooltip">More detail</span>
</ew-tooltip>
```
## typing-indicator

```html
<span class="ew-typing-indicator" role="status" aria-label="Maya is typing"><i></i><i></i><i></i></span>
```
