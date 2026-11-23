# Swiss International and Bauhaus — era design grammars

Two original web interpretations researched against historical design artifacts. References are studied, not copied into output. Both use **already-bundled OFL fonts**, pure CSS geometry, existing Groovster components, and no external runtime dependencies.

## Swiss International / Typographic Style (approximately 1950–70)
Primary research:
- [Poster House: The Swiss Grid](https://swissgrid.posterhouse.org/) — historical modular grids, objective information hierarchy, original Müller-Brockmann posters
- [Cooper Hewitt: Armin Hofmann and a harmony of contrasts](https://www.cooperhewitt.org/2018/08/05/aharmonyofcontrasts/) — asymmetry, photographic scale, type
- [The Cooper Union: Swiss Style Now](https://cooper.edu/index.php/art/news/inside-look-swiss-style-now-curators) — typographic discipline and modern interpretation
- [Poster House exhibition catalogue](https://posterhouse.org/exhibition/the-swiss-grid/) — regional variation within the movement

**Grammar:** twelve-column implied display grid, deliberate asymmetric content placement, editorial-scale sans, narrow signal rule, flat paper/ink planes, measured red accent, 0px corners. Spacing and alignment establish hierarchy; ornament does not. Use Source Sans 3 and Source Code Pro as bundled OFL alternatives, not claims of historic Akzidenz-Grotesk accuracy. Costume = monumental editorial scale, Standard = selective alignment and type scale, Whisper = readable restrained grid. Avoid generic centered SaaS cards and arbitrary red decoration.

## Bauhaus (1919–33)
Primary research:
- [MoMA: Herbert Bayer, Architektur Lichtbilder (1926)](https://www.moma.org/collection/works/5101) — asymmetry, new typography
- [MoMA: Bayer Bauhaus Exhibition proposal (1923)](https://www.moma.org/collection/works/220977) — constructive communication
- [Getty Research Collections: Bauhaus typography](https://www.getty.edu/research/collections/component/10Y679) — original Bayer and Joost Schmidt records
- [Resnick Center: Bauhaus Typography at 100](https://thebayercenter.org/exhibitions/bauhaus-typography-at-100/) — varied typography rather than one caricature
- [Bauhaus-Archiv: Poster collection](https://www.bauhaus.de/en/discover/article/our-history-part-4-a-statement-with-a-message-the-poster-collection/) — later interpretation versus historical originals

**Grammar:** circles, planar bars, diagonals and typography occupy an integrated constructive field; restrained red/yellow/blue colors organize major regions, not every button. Geometric League Spartan headings and readable Source Sans 3 body are locally packaged, interpretive substitutes. Costume = multi-plane display geometry, Standard = restrained plane, Whisper = functional structure. Never rotate form labels, use random Memphis-style confetti, or rely on primary colors alone for semantics.

## Evaluation and reproduction

Four static reference pages in \`demos/reference/{swiss-journal,swiss-console,bauhaus-museum,bauhaus-studio}\` show editorial, data-intensive, cultural, and commercial use cases. Their markup uses canonical Groovster components. Only a local stylesheet and dependency-free vanilla JS supply example layout and local interactions. Fidelity and light/dark are switchable without HTML rewrites.

Run \`pnpm gen && pnpm check && pnpm test:unit && pnpm test:modernist\`. Browser test covers five widths, two color modes, three bands and representative interactions. Contrast, keyboard and aesthetic critique remain important; automated checks cannot establish professional art direction. The demos contain fictional data and do not transact.

## Agent economy

Use the generated compact \`era-swiss.card.txt\` or \`era-bauhaus.card.txt\` for discovery. Load this full historical reference only when necessary. Recipes already select era candidates; don't load whole era catalogs into model context. Zero new runtime packages, fonts, image services or browser imports.
