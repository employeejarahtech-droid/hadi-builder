# Footer Section Widgets

## Overview
This document outlines footer widgets for the CMS, including a comprehensive 4-column footer section widget and supporting footer components.

## 1. Footer Section Widget (4-Column Layout)

### Widget Name: `FooterSectionWidget`

A comprehensive footer section widget with 4 customizable columns, each supporting different content types.

### Controls Structure

#### Column 1 - First Column
- **Column Type**: Select (About, Menu, Contact, Custom HTML)
- **Column Title**: Text input
- **Column Content**: Textarea/Repeater (based on type)
  - If "About": Logo, Description, Social Links
  - If "Menu": Menu items repeater
  - If "Contact": Address, Phone, Email fields
  - If "Custom HTML": HTML editor

#### Column 2 - Second Column
- **Column Type**: Select (About, Menu, Contact, Custom HTML)
- **Column Title**: Text input
- **Column Content**: Textarea/Repeater (based on type)
  - If "About": Logo, Description, Social Links
  - If "Menu": Menu items repeater
  - If "Contact": Address, Phone, Email fields
  - If "Custom HTML": HTML editor

#### Column 3 - Third Column
- **Column Type**: Select (About, Menu, Contact, Custom HTML)
- **Column Title**: Text input
- **Column Content**: Textarea/Repeater (based on type)
  - If "About": Logo, Description, Social Links
  - If "Menu": Menu items repeater
  - If "Contact": Address, Phone, Email fields
  - If "Custom HTML": HTML editor

#### Column 4 - Fourth Column
- **Column Type**: Select (About, Menu, Contact, Custom HTML)
- **Column Title**: Text input
- **Column Content**: Textarea/Repeater (based on type)
  - If "About": Logo, Description, Social Links
  - If "Menu": Menu items repeater
  - If "Contact": Address, Phone, Email fields
  - If "Custom HTML": HTML editor

### Additional Controls
- **Background Color**: Color picker
- **Text Color**: Color picker
- **Column Gap**: Slider (spacing between columns)
- **Padding**: Dimensions control

---

## 2. Supporting Footer Widgets

### FooterCopyrightWidget
- Copyright text
- Year (auto or manual)
- Alignment (left, center, right)

### FooterMenuWidget
- Menu items repeater
- Menu style (horizontal, vertical)
- Separator character

### FooterSocialWidget
- Social icons repeater
- Icon size
- Icon spacing
- Icon style (circle, square, rounded)

### FooterNewsletterWidget
- Title
- Description
- Email placeholder
- Button text
- Privacy text

### FooterContactWidget
- Address
- Phone
- Email
- Working hours
- Map embed option

### FooterLogoWidget
- Logo image
- Logo size
- Link URL
- Alignment

### FooterPaymentMethodsWidget
- Payment icons repeater
- Icon size
- Layout (grid, row)

### FooterAccreditationWidget
- Badge/certification images repeater
- Badge size
- Layout

---

## Implementation Priority

1. **FooterSectionWidget** (4-column) - High Priority
2. **FooterCopyrightWidget** - High Priority
3. **FooterMenuWidget** - Medium Priority
4. **FooterSocialWidget** - Medium Priority
5. **FooterNewsletterWidget** - Medium Priority
6. **FooterContactWidget** - Low Priority
7. **FooterLogoWidget** - Low Priority
8. **FooterPaymentMethodsWidget** - Low Priority
9. **FooterAccreditationWidget** - Low Priority

---

## Example Footer Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Footer Section Widget                     │
├───────────────┬───────────────┬───────────────┬──────────────┤
│   Column 1    │   Column 2    │   Column 3    │   Column 4   │
│   (About)     │   (Menu)      │   (Menu)      │  (Contact)   │
│               │               │               │              │
│ Logo          │ Quick Links   │ Resources     │ Get in Touch │
│ Description   │ - Home        │ - Blog        │ Address      │
│ Social Icons  │ - About       │ - Help        │ Phone        │
│               │ - Services    │ - FAQ         │ Email        │
│               │ - Contact     │ - Support     │              │
└───────────────┴───────────────┴───────────────┴──────────────┘
│                    Footer Copyright Widget                    │
│              © 2026 Company Name. All rights reserved.        │
└─────────────────────────────────────────────────────────────┘
```

---

## Notes

- Each column should be independently configurable
- Responsive: 4 columns on desktop, 2 on tablet, 1 on mobile
- Support for dynamic content (menus from database)
- Accessibility: Proper heading hierarchy, ARIA labels
- SEO: Proper semantic HTML structure
