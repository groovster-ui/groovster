# Art Nouveau · design grammar (load on demand)

**Era:** \`art-nouveau\`; **dialects:** \`botanical\` (default), \`architectural\`; **modes:** light/dark; **fidelity:** whisper/standard/costume. Built from original deterministic vector masks, not copies of museum assets. CSS-first; no browser dependency, remote font, imported stylesheet, or runtime SVG generation.

## Historical visual research

The following studies establish visual principles rather than license the underlying artworks. Original museum images are **not** redistributed.

| Reference | Source | What we translate / what we avoid |
|---|---|---|
| Alphonse Mucha, Study for a Decorative Panel, c. 1900 | [The Met collection](https://www.metmuseum.org/art/collection/search/283253) | Organic line encloses content and creates a self-contained composition; avoid copying subjects or figures |
| Alphonse Mucha, Pavilion of Man design for 1900 Exposition | [Musée d'Orsay](https://www.musee-orsay.fr/en/artworks/projet-pour-le-pavillon-de-lhomme-lexposition-universelle-de-1900-177089) | Integrated architectural and botanical silhouette; avoid literal pavilion reconstruction |
| Alphonse Mucha, *Two Girls Reading* | [The Met collection](https://www.metmuseum.org/art/collection/search/753533) | Reserved text space is part of the illustration; maintain readable space around heroes |
| Eugène Grasset and contemporaries: Art Nouveau lettering | [Musée d'Orsay: Art Nouveau Script in France](https://www.musee-orsay.fr/en/program/whats-on/exhibitions/art-nouveau-script-france) | Graphic lettering interacts with ornament; keep routine forms in readable text |
| Posters of Mucha and other Parisian designers | [Musée d'Orsay: Art in the Street](https://www.musee-orsay.fr/en/program/whats-on/exhibitions/presentation/art-street) | Long vertical emphasis and lithographic palettes; no historic poster reproductions |
| Hector Guimard, Paris Métro entrance, c. 1900 | [MoMA collection](https://www.moma.org/collection/works/2393) | Repeated cast-iron stems form coherent structural supports, not random vines |
| Hector Guimard, Entrance to the Paris Métropolitain | [National Gallery of Art](https://www.nga.gov/artworks/108510-entrance-paris-metropolitain) | Curved supports and a central lettering canopy; preserve accessible functional signage |
| Hector Guimard station entrances | [RATP heritage](https://www.ratp.fr/en/discover/heritage/hector-guimard) | Plant-like support casting and modularity; derive reusable SVG stems |
| Victor Horta, Hôtel Tassel and Maison-Atelier | [Horta Museum](https://hortamuseum.be/maison-musee) | Whiplash curvature connects stairs, beams and metalwork; distinguish architecture from floral illustration |
| Victor Horta, Tassel House interior | [National Gallery of Art teaching collection](https://www.nga.gov/educational-resources/art-nouveau-1890-1914) | Continuity among line, room and fixture; avoid standalone decorative stickers |
| Henry van de Velde, *Tropon* (1898) | [Smarthistory: Art Nouveau](https://smarthistory.org/art-nouveau/) | Abstract whiplash form suggests organic movement without literal flowers |
| Tiffany Studios, *Dogwood* (c. 1900–1925) | [The Met collection](https://www.metmuseum.org/art/collection/search/15302) | Asymmetry, natural silhouette and nuanced color; translate using CSS surfaces rather than glass textures |

### Core distinctions
**Art Nouveau**: flowing and organic, structurally connected curves, lithographic surface tones. **Art Deco**: stepped geometry, axial symmetry, lacquer and brass. **Groovy**: 1970s pop/psychedelic flow with bolder cartoon-like forms. **Bauhaus**: industrial geometric construction.

## Eight deterministic ornamental primitives

Source: \`tools/gen/src/nouveau-decorators.js\`. Reusable masks compiled as data-URI SVG once per era CSS, tintable with CSS semantic tokens; no JavaScript needed in the browser.

| Primitive | Purpose | Controlled use |
|---|---|---|
| \`vine\` | tapering stem and spade leaves | Botanical story panel |
| \`whiplash\` | thick-to-thin ribbon that hooks and lashes | The line itself; section movement |
| \`spray\` | iris in line: standards, falls, sword leaf, bud | Botanical hero and featured illustration |
| \`arch\` | hooded iron gateway, overhanging crown, whipped feet | Architectural hero, not a roman arch |
| \`iron\` | three sinuous cast stems and a whip tie | Architectural hero or gallery feature |
| \`medallion\` | peacock eye: petal ring, rays, pupil | Costume halo behind the iris; never on fields |
| \`divider\` | tapered wave interrupted by a small eye | Major section transition, not every card |
| \`corner\` | one whip ending in a spade leaf | Optional raised card or hero corner |

Use a decorative element such as \`<span class="ew-nouveau-ornament" data-motif="iron" aria-hidden="true"></span>\` with a sizing context. The exact **same canonical Groovster HTML** can switch dialect with \`data-dialect="botanical|architectural"\`. Do not use a different button or card DOM per dialect.

## Visual grammar

**Botanical:** Cormorant Garamond (roman for the title, italic for the small line), Source Sans 3 for reading. The ground is warm parchment, not gray beige. Inks are separate lithographic plates: antique gold, olive, madder, peacock. The costume hero is a poster — a peacock-eye halo, a rose bloom behind it, and an iris drawn in olive line — with the words kept in a clear panel on the left. Cards carry a double hairline, brass then olive, like a plate mark.

**Architectural:** Bellefair, wide and unslanted, set as signage. The motifs are sinuous cast stems and a hooded arch (the canopy overhangs; the feet whip out). The field is a glass green, not a flower bed. Cards take a peacock edge. Josefin Sans is a geometric 1920s face and is not used here.

**Whisper:** practically plain controls; type and curvilinear border radii remain; hero ornament hidden, section footprint reduced.

**Standard:** one restrained structural arch, no medallion or dense floral stage; balanced copy and negative space.

**Costume:** the full poster. Botanical: gold halo, madder bloom, olive iris, and a brass whip, with type in the open panel. Architectural: iron stems in front of the hood, no flower. A clearly defined text zone stays clear of the masks.

**Functional UI:** Labels, controls, tables, selection and validation do not use organic masks. Focus/pressed/disabled states must be legible independently of ornament. Use reduced-motion and forced-colors fallbacks.

## Agent use

- Load \`generated/llms/era-art-nouveau.card.txt\` for selection; use this grammar only when composing a distinctive hero or choosing dialects.
- Recommended for botanical luxury, historic museums, jewelry, elegant tea houses, and Art Nouveau architectural studies.
- Default to \`botanical\`; switch to \`architectural\` for architecture/cultural institutions.
- Pair with existing \`commerce\` or \`hospitality\` recipes. The era changes styling, not component HTML.
- Keep the small generated catalog and existing MCP response budgets. Do not feed this research document to every code-generation query.

## Reviewer checklist

Compare both local reference sites at 320/375/768/1024/1440, two modes and three fidelity levels. Check that masks remain visually behind text and do not intercept pointer events; that cards/forms remain readable, the dark palette is coherent, and the two dialects are distinguishable in grayscale. Distinctiveness and historic authenticity remain subjective, even when browser tests pass.
