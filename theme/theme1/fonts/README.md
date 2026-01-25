# Basier Square Font Files

This directory should contain the Basier Square font files.

## Required Font Files

To use the Basier Square Regular font in this project, you need to add the following font files to this directory:

### Regular Weight (Required)
- `BasierSquare-Regular.woff2`
- `BasierSquare-Regular.woff`
- `BasierSquare-Regular.ttf`

### Medium Weight (Optional)
- `BasierSquare-Medium.woff2`
- `BasierSquare-Medium.woff`
- `BasierSquare-Medium.ttf`

### Bold Weight (Optional)
- `BasierSquare-Bold.woff2`
- `BasierSquare-Bold.woff`
- `BasierSquare-Bold.ttf`

## Where to Get the Font Files

Basier Square is a commercial font. You can obtain it from:

1. **Atipo Foundry** (official source): https://www.atipofoundry.com/fonts/basier
2. **MyFonts**: https://www.myfonts.com/collections/basier-font-atipo
3. **Adobe Fonts** (if you have a Creative Cloud subscription)

## Alternative: Using Google Fonts or Free Alternatives

If you don't have access to Basier Square, you can use similar free alternatives:

1. **Inter** - Very similar geometric sans-serif
2. **DM Sans** - Clean, modern sans-serif
3. **Manrope** - Geometric sans-serif with similar characteristics

To use a Google Font instead, update the CSS file to import from Google Fonts.

## Installation Instructions

1. Purchase or download the Basier Square font files
2. Place the font files (.woff2, .woff, .ttf) in this directory
3. The font is already configured in `../css/basier-square-font.css`
4. Use the class `basier-square` on any element to apply the font
5. Or set it as a CSS variable in your theme

## Usage Examples

### Using the CSS class:
```html
<h1 class="basier-square">This text uses Basier Square</h1>
```

### Using in custom CSS:
```css
.my-element {
  font-family: "Basier Square", sans-serif;
}
```

### Setting as a CSS variable (in theme1/index.php):
```css
:root {
  --body-font-family: "Basier Square", sans-serif;
  --title-font-family: "Basier Square", sans-serif;
}
```
