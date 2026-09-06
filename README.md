Our club name is "Club Friday". Our members are of different ages, from newborns to older people.
We are a community group that mainly plays sports and also carries out social work to support people and strengthen society.
We enjoy cricket, football (soccer), kabaddi (Ha-Du-Du), hockey, badminton, volleyball, local athletics, and other healthy sports.

## Club Values

The club promotes sportsmanship, empathy, harmony, justice, unity, and respect among people of different ages and backgrounds. The club's values are inspired by the principle of [Hilf al-Fudul](https://en.wikipedia.org/wiki/Hilf_al-Fudul): people joining together to defend justice and protect those who lack strong support or influence.

We are mainly a male club. Female members aged 0-10 and 60+ may join through their male guardians.

## Logo

The logo is a transparent vector emblem designed to remain recognizable in color, black and white, embroidery, stamps, signage, and hand-painted versions.

### Symbolism

- Three rounded membership badges represent younger, adult, and older members standing together without relying on human figures.
- The shared central ball is an abstract multi-sport symbol rather than a football. It represents cricket, football, kabaddi, hockey, badminton, volleyball, local athletics, and other healthy sports.
- The coral action marks beside the ball add energy and signal readiness to participate in sports, social work, and any other good deed.
- The upper navy arc represents justice, trust, protection, and responsibility.
- The lower teal arc connects the members and represents unity, empathy, harmony, mutual support, and social service.
- The side symbols represent shared responsibility and the club's willingness to stand together in both sport and social work.
- The motto follows the upper arc, while the club name follows the lower arc inside the badge.

### Motto

**JUSTICE • UNITY • RESPECT**

- Justice represents fairness and standing up for people who are treated unjustly.
- Unity represents collective action and harmony across ages and backgrounds.
- Respect represents dignity, empathy, fair play, and regard for every member.

Together, these values guide the club both on the playing field and in social work for the wellbeing of the wider community.

### Color System

- Navy `#17324D`: justice, trust, protection, and responsibility.
- Teal `#28705D`: unity, empathy, harmony, and community.
- Dark gold `#A86B00`: dignity, value, and moral courage.
- Yellow `#F2B544`: optimism, youth, and inclusion.
- Coral `#E96B50`: energy, confidence, and participation.
- Green `#4E9B83`: growth, balance, and continuity.
- Warm cream `#FFF4D6`: neutral support color for openness and shared space.

The logo uses six expressive colors plus warm cream as a neutral support color. Navy is used for both the main structure and the club name to keep the palette compact and consistent.

### Hand-Drawing Requirements

- Use clean, smooth edges and simple rounded shapes.
- Keep one consistent outline when color is unavailable.
- Use three rounded membership badges instead of human figures.
- Use three separated coral action-burst strokes on each side of the ball.
- Avoid detailed sport-specific equipment or tiny marks.
- Keep the background transparent.
- The logo should remain easy to draw by hand and clear at small sizes.

### Background Variants

- Use [club-friday-logo.svg](logo/club-friday-logo.svg) on white, cream, or other light backgrounds. This is the standard light-background version.
- Use [club-friday-logo.svg](logo/club-friday-logo.svg) on the `#FFF` white jersey. Its navy, teal, gold, yellow, coral, and green details are designed for light backgrounds.
- Use [club-friday-logo-dark.svg](logo/club-friday-logo-dark.svg) on black, navy, or other dark backgrounds. It replaces the dark structural colors with soft white and uses brighter teal and gold accents.
- Use [club-friday-logo-jersey.svg](logo/club-friday-logo-jersey.svg) on the `#DA291C` red jersey. It is a high-contrast white version with jersey-red cutouts inside the badges and ball.
- Use [club-friday-logo-one-color.svg](logo/club-friday-logo-one-color.svg) for stamps, embroidery, engraving, and very small applications. It uses one navy ink color and open substrate for the internal details.
- These variants have transparent backgrounds and identical geometry. Do not place either logo inside an additional white or colored box.

A fuller explanation is available in [LOGO-EXPLANATION.md](LOGO-EXPLANATION.md).
The Bangla version is available in [LOGO-EXPLANATION-BN.md](LOGO-EXPLANATION-BN.md).

Bangla logo files: [light SVG](logo/club-friday-logo-bn.svg), [dark SVG](logo/club-friday-logo-dark-bn.svg), [light PNG](logo/club-friday-logo-bn.png), and [dark PNG](logo/club-friday-logo-dark-bn.png).

### Export PNGs

The SVG variants are generated from [logo-template.svg](logo-template.svg). The template contains the shared geometry and SVG structure; [logo-variants.json](logo-variants.json) contains reusable artwork/text presets plus the small per-variant metadata. Regenerate all six SVGs and their transparent PNGs at 1024 x 1000 with:

```sh
./generate-logos.sh
```

To regenerate only the PNGs from the existing SVGs:

```sh
./export-pngs.sh
```

The command requires Inkscape, available on macOS with `brew install --cask inkscape`.

The generator requires Node.js and uses no external packages.

Both variants can be used in print and digital applications, including websites, social media, presentations, documents, stamps, embroidery, signage, and hand-painted reproductions. Choose the light or dark version according to the background.