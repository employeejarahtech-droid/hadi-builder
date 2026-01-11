# New CMS - Complete Project Documentation

## Overview

New CMS is a lightweight, custom-built Content Management System inspired by Elementor-style page builders. It provides a drag-and-drop interface for creating dynamic web pages with a modular, component-based architecture. The system supports pages, blog posts, global headers/footers, and a comprehensive widget system.

**Version:** 1.0  
**Last Updated:** December 2024

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Configuration](#configuration)
4. [Database Architecture](#database-architecture)
5. [Core Features](#core-features)
6. [API Documentation](#api-documentation)
7. [Frontend Architecture](#frontend-architecture)
8. [Admin Panel](#admin-panel)
9. [Page Builder System](#page-builder-system)
10. [Widget System](#widget-system)
11. [Control System](#control-system)
12. [Theme System](#theme-system)
13. [Routing System](#routing-system)
14. [Installation & Setup](#installation--setup)
15. [Security Considerations](#security-considerations)
16. [Development Guidelines](#development-guidelines)
17. [File Reference](#file-reference)

---

## Technology Stack

### Backend
- **PHP 7.0+** - Core programming language
- **MySQL/MariaDB 5.7+** - Database system
- **PDO** - Database abstraction layer with prepared statements
- **Apache HTTP Server** - Web server with mod_rewrite
- **File-based sessions** - Session management for authentication

### Frontend
- **jQuery 3.6.0** - JavaScript library for DOM manipulation
- **Font Awesome 6.4.0** - Icon library
- **Vanilla JavaScript (ES6+)** - Custom components (no framework dependencies)
- **CSS3** - Modern styling with flexbox/grid support

### Key Libraries & Tools
- Custom Elementor-style control system
- Event-driven architecture (EventEmitter pattern)
- Drag-and-drop functionality
- Media management system
- JSON-based content storage

---

## Project Structure

```
new-cms/
├── Root Files
│   ├── .env                    # Environment configuration (not in repo)
│   ├── .htaccess               # Apache rewrite rules & security
│   ├── index.php               # Main frontend entry point & router
│   ├── setup_database.php      # Initial database setup
│   ├── update_database.php     # Database schema updates
│   ├── setup_gallery.php       # Gallery table setup
│   └── publish_pages.php       # Publishing utility
│
├── includes/
│   └── db.php                  # Database connection utility
│
├── admin/                      # Administration panel
│   ├── index.php               # Admin dashboard
│   ├── login.php               # Admin authentication
│   ├── page-builder.php        # Page builder interface
│   ├── header-builder.php      # Header builder
│   ├── footer-builder.php      # Footer builder
│   ├── api/                    # Admin API endpoints
│   │   ├── save-page.php       # Save page/post content
│   │   ├── save-header.php     # Save header content
│   │   └── save-footer.php     # Save footer content
│   ├── pages/                  # Page management
│   │   ├── index.php           # List all pages
│   │   ├── create.php          # Create new page
│   │   └── delete.php          # Delete page
│   ├── posts/                  # Blog post management
│   │   ├── index.php           # List all posts
│   │   ├── create.php          # Create new post
│   │   └── delete.php          # Delete post
│   ├── headers/                # Header template management
│   │   ├── index.php           # List headers
│   │   ├── create.php          # Create header
│   │   └── delete.php          # Delete header
│   ├── footers/                # Footer template management
│   │   ├── index.php           # List footers
│   │   ├── create.php          # Create footer
│   │   └── delete.php          # Delete footer
│   ├── settings/               # System settings
│   │   └── index.php           # Settings page
│   ├── includes/               # Admin includes
│   │   ├── header.php          # Admin header template
│   │   └── footer.php          # Admin footer template
│   └── setup_tables.php        # Header/footer table creation
│
├── api/                        # Public API endpoints
│   └── media/                  # Media management
│       ├── list.php            # List media files
│       ├── upload.php          # Upload media files
│       └── delete.php          # Delete media files
│
├── assets/                     # Frontend assets
│   ├── core/                   # Core JavaScript components
│   │   ├── DragDropManager.js  # Drag-and-drop functionality
│   │   ├── ElementManager.js   # Element hierarchy management
│   │   ├── EventEmitter.js     # Event system
│   │   ├── PublicRenderer.js   # Frontend content renderer
│   │   ├── Toast.js            # Notification system
│   │   └── WidgetManager.js   # Widget registration & management
│   ├── css/                    # CSS files
│   │   ├── page-builder.css    # Page builder styles
│   │   └── toast.css           # Toast notification styles
│   ├── fields/                 # Form field controls
│   │   ├── BaseControl.js      # Base control class
│   │   ├── ControlManager.js   # Control lifecycle management
│   │   ├── text-new.js         # Refactored text control
│   │   ├── text.js             # Text input control
│   │   ├── textarea.js         # Textarea control
│   │   ├── select.js           # Select dropdown
│   │   ├── slider.js           # Range slider
│   │   ├── color.js            # Color picker
│   │   ├── media.js            # Media uploader
│   │   ├── icon.js             # Icon picker
│   │   ├── checkbox.js         # Checkbox control
│   │   ├── number.js           # Number input
│   │   ├── url.js              # URL input
│   │   ├── date.js             # Date picker
│   │   ├── time.js             # Time picker
│   │   ├── dimension.js        # Dimension control
│   │   ├── padding.js          # Padding control
│   │   ├── gallery.js          # Gallery selector
│   │   ├── repeater.js         # Repeater field
│   │   ├── multi-repeater.js   # Multi-repeater
│   │   ├── code.js             # Code editor
│   │   ├── css.js              # CSS editor
│   │   ├── html.js             # HTML editor
│   │   ├── heading.js          # Heading control
│   │   ├── tag.js              # Tag selector
│   │   ├── svg.js              # SVG upload
│   │   ├── notice.js           # Notice/alert control
│   │   ├── hidden.js           # Hidden field
│   │   └── utils/              # Control utilities
│   │       ├── EventEmitter.js # Event system for controls
│   │       ├── Validator.js    # Validation framework
│   │       └── Conditions.js   # Conditional logic
│   ├── widgets/                # Widget components
│   │   ├── WidgetBase.js       # Base widget class
│   │   ├── widget-base.js      # Legacy base (deprecated)
│   │   ├── HeadingWidget.js    # Heading widget
│   │   ├── TextWidget.js       # Text content widget
│   │   ├── ButtonWidget.js     # Button widget
│   │   ├── ImageWidget.js      # Image widget
│   │   ├── VideoWidget.js      # Video widget
│   │   ├── ColumnsWidget.js    # Multi-column layout
│   │   ├── FlexWidget.js       # Flexbox container
│   │   ├── DividerWidget.js    # Divider/separator
│   │   ├── LogoWidget.js       # Logo display widget
│   │   └── fields/             # Widget-specific fields
│   └── uploads/                # File upload directory
│
├── theme/                      # Theme system
│   ├── theme1/                 # Default theme
│   │   └── style.css
│   └── theme-2/                # Alternative theme
│       └── style.css
│
├── images/                     # Image uploads directory
│
└── Documentation
    ├── PROJECT_DOCUMENTATION.md # This file
    └── CONTROLS-README.md      # Control system documentation
```

---

## Configuration

### Environment Configuration (.env)

Create a `.env` file in the project root with the following structure:

```ini
# Application
APP_NAME="New CMS"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost/new-cms

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=new_cms
DB_USERNAME=root
DB_PASSWORD=

# Session
SESSION_DRIVER=file
SESSION_LIFETIME=120

# Cache
CACHE_DRIVER=file

# Admin (for initial setup)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password
```

**Note:** The `.env` file is protected by `.htaccess` and should not be committed to version control.

### Apache Configuration (.htaccess)

The `.htaccess` file provides:

- **Clean URL rewriting** - Routes all requests through `index.php`
- **Blog routing** - Handles `/blog/{slug}` URLs for blog posts
- **Security headers** - Protects `.env` and hidden files
- **Directory listing prevention** - Prevents directory browsing
- **UTF-8 charset** - Sets default character encoding

Key rewrite rules:
- `/blog/{slug}` → `index.php` (blog post routing)
- All other non-file requests → `index.php` (page routing)

---

## Database Architecture

### Core Tables

#### 1. `users`
Administrative user accounts for the CMS.

```sql
CREATE TABLE `users` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(20) DEFAULT 'admin',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. `pages`
Static page content with JSON-based storage.

```sql
CREATE TABLE `pages` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `content` LONGTEXT,
    `status` ENUM('draft', 'published') DEFAULT 'draft',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Content Format:** JSON array of widget/element objects.

#### 3. `posts`
Blog post content with similar structure to pages.

```sql
CREATE TABLE `posts` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `content` LONGTEXT,
    `status` ENUM('draft', 'published') DEFAULT 'draft',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Routing:** Posts are accessible via `/blog/{slug}` URL pattern.

#### 4. `headers`
Global header templates reusable across pages.

```sql
CREATE TABLE `headers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) UNIQUE NOT NULL,
    `status` VARCHAR(50) DEFAULT 'draft',
    `content` LONGTEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 5. `footers`
Global footer templates reusable across pages.

```sql
CREATE TABLE `footers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) UNIQUE NOT NULL,
    `status` VARCHAR(50) DEFAULT 'draft',
    `content` LONGTEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 6. `settings`
Site-wide configuration storage.

```sql
CREATE TABLE `settings` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `key_name` VARCHAR(100) NOT NULL UNIQUE,
    `value` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Key Settings:**
- `site_name` - Site name
- `site_description` - Site description
- `admin_email` - Administrator email
- `active_theme` - Currently active theme
- `home_page` - ID of the home page
- `global_header` - ID of active header template
- `global_footer` - ID of active footer template

#### 7. `gallery`
Media file management and metadata.

```sql
CREATE TABLE `gallery` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `file_name` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Database Setup Scripts

1. **`setup_database.php`** - Initial database creation and admin user setup
   - Creates database if it doesn't exist
   - Creates `users` table
   - Creates default admin user (admin/password)

2. **`update_database.php`** - Schema updates and default data
   - Creates `pages`, `posts`, `settings` tables
   - Inserts default settings
   - Creates sample blog post

3. **`admin/setup_tables.php`** - Header/footer table creation
   - Creates `headers` and `footers` tables

4. **`setup_gallery.php`** - Gallery table setup
   - Creates `gallery` table for media management

---

## Core Features

### 1. Page Builder System
- **Drag-and-drop interface** - Intuitive widget placement
- **Real-time preview** - Instant visual feedback
- **Widget-based content creation** - Modular component system
- **Responsive design controls** - Device-specific settings
- **Multi-device preview** - Desktop, tablet, mobile views
- **Undo/Redo functionality** - History management
- **Widget search** - Quick widget discovery

### 2. Widget System
- **Modular widget architecture** - Extensible component system
- **Category-based organization** - Basic, Media, Layout, Forms
- **Custom widget development** - Easy to create new widgets
- **Widget inheritance** - Base class for consistency
- **Settings management** - Per-widget configuration

### 3. Control System
- **Elementor-style controls** - Familiar interface
- **Responsive controls** - Device-specific values
- **Conditional logic** - Show/hide based on conditions
- **Validation framework** - Built-in validators
- **Event-driven updates** - Reactive control changes
- **Control sections/tabs** - Organized settings panels

### 4. Media Management
- **File upload system** - Image uploads (JPG, PNG, GIF, WebP)
- **Media library** - Browse uploaded files
- **File metadata storage** - Database tracking
- **File type validation** - Security checks
- **Unique filename generation** - Prevents conflicts

### 5. Theme System
- **Multiple theme support** - Switchable themes
- **CSS-based theming** - Simple styling approach
- **Theme selection** - Admin-configurable
- **Customizable appearance** - Per-theme styles

### 6. Content Management
- **Pages and posts separation** - Different content types
- **Blog functionality** - `/blog/{slug}` routing
- **Draft/publish workflow** - Content status management
- **Global header/footer** - Reusable templates
- **Slug-based routing** - SEO-friendly URLs

### 7. Authentication System
- **Session-based authentication** - Secure login
- **Password hashing** - bcrypt encryption
- **Admin panel protection** - Route guards
- **Configurable credentials** - Via database

---

## API Documentation

### Media API

#### GET `/api/media/list.php`
Retrieves list of all media files.

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "url": "images/img_123.jpg",
            "name": "example.jpg",
            "created_at": "2024-01-01 12:00:00"
        }
    ]
}
```

#### POST `/api/media/upload.php`
Uploads a new media file.

**Request:** `multipart/form-data`
- `file`: Image file (JPG, PNG, GIF, WebP)

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 123,
        "url": "/new-cms/images/img_456.jpg",
        "name": "uploaded.jpg"
    }
}
```

**Error Response:**
```json
{
    "success": false,
    "message": "Invalid file type. Only JPG, PNG, GIF, and WebP are allowed."
}
```

#### DELETE `/api/media/delete.php`
Deletes a media file.

**Request:** JSON body
```json
{
    "id": 123
}
```

**Response:**
```json
{
    "success": true,
    "message": "File deleted successfully"
}
```

### Admin API

All admin endpoints require session authentication (`admin_logged_in` session variable).

#### POST `/admin/api/save-page.php`
Saves page or post content.

**Request Body:**
```json
{
    "id": 1,
    "type": "page",
    "content": [
        {
            "id": "element_1",
            "type": "heading",
            "settings": {
                "text": "Hello World",
                "tag": "h1"
            },
            "children": []
        }
    ]
}
```

**Response:**
```json
{
    "success": true
}
```

**Error Response:**
```json
{
    "success": false,
    "message": "Missing data"
}
```

#### POST `/admin/api/save-header.php`
Saves header template content.

**Request Body:**
```json
{
    "id": 1,
    "content": [...]
}
```

#### POST `/admin/api/save-footer.php`
Saves footer template content.

**Request Body:**
```json
{
    "id": 1,
    "content": [...]
}
```

---

## Frontend Architecture

### Core Components

#### 1. EventEmitter (`assets/core/EventEmitter.js`)
Custom event system implementing pub/sub pattern.

**Usage:**
```javascript
const emitter = new EventEmitter();
emitter.on('event', (data) => console.log(data));
emitter.emit('event', { message: 'Hello' });
```

#### 2. WidgetManager (`assets/core/WidgetManager.js`)
Manages widget registration, creation, and discovery.

**Key Methods:**
- `registerWidget(widgetClass)` - Register a widget type
- `createWidget(name, settings)` - Create widget instance
- `getWidgets()` - Get all registered widgets
- `getWidgetsByCategory(category)` - Filter by category
- `searchWidgets(query)` - Search widgets

#### 3. ElementManager (`assets/core/ElementManager.js`)
Manages DOM element hierarchy and state.

**Key Methods:**
- `addElement(element)` - Add element to hierarchy
- `getElement(id)` - Get element by ID
- `removeElement(id)` - Remove element
- `serialize()` - Export element tree as JSON
- `deserialize(data)` - Import element tree

#### 4. DragDropManager (`assets/core/DragDropManager.js`)
Handles drag-and-drop functionality for widget placement.

**Features:**
- Drag widgets from library
- Drop zones for placement
- Visual feedback during drag
- Nested element support

#### 5. PublicRenderer (`assets/core/PublicRenderer.js`)
Renders page builder content on the frontend.

**Key Methods:**
- `renderSection(containerSelector, data)` - Render a section
- `renderElementRecursive(element, container)` - Recursive rendering

### Control System

Located in `assets/fields/`, provides form controls similar to Elementor:

- **BaseControl.js** - Base class for all controls
- **ControlManager.js** - Control lifecycle management
- **Field Types:**
  - `text` - Single-line text input
  - `textarea` - Multi-line text
  - `select` - Dropdown selection
  - `slider` - Range slider
  - `color` - Color picker
  - `media` - Image/file upload
  - `icon` - Icon picker
  - `checkbox` - Checkbox
  - `number` - Number input
  - `url` - URL input
  - `date` - Date picker
  - `time` - Time picker
  - `dimension` - Dimension control
  - `padding` - Padding control
  - `gallery` - Gallery selector
  - `repeater` - Repeatable fields
  - `code` - Code editor
  - `css` - CSS editor
  - `html` - HTML editor

**See `CONTROLS-README.md` for detailed control system documentation.**

### Widget Architecture

Each widget extends `WidgetBase` and implements:

- `getName()` - Unique widget identifier
- `getTitle()` - Display name
- `getIcon()` - Font Awesome icon class
- `getCategories()` - Widget categories
- `getKeywords()` - Search keywords
- `registerControls()` - Define settings controls
- `render()` - Generate HTML output
- `getDefaultSettings()` - Default values

---

## Admin Panel

### Dashboard (`admin/index.php`)
Main admin interface providing access to:
- Page management
- Post management
- Settings configuration
- Global header/footer builders
- Controls demo

### Authentication (`admin/login.php`)
- Session-based authentication
- Password verification via bcrypt
- Secure logout functionality
- Session timeout handling

**Default Credentials:**
- Username: `admin`
- Password: `password`

**⚠️ Change these in production!**

### Page Builder (`admin/page-builder.php`)
Full-featured visual editor with:
- Three-panel layout (widgets, canvas, settings)
- Widget library organized by categories
- Real-time preview
- Device switching (desktop/tablet/mobile)
- Undo/redo functionality
- Widget search
- Drag-and-drop placement

**Access:** `/admin/page-builder.php?id={page_id}&type={page|post}`

### Header/Footer Builders
Specialized builders for global templates:
- `admin/header-builder.php` - Header template editor
- `admin/footer-builder.php` - Footer template editor

### Content Management

#### Pages (`admin/pages/`)
- `index.php` - List all pages
- `create.php` - Create new page
- `delete.php` - Delete page

#### Posts (`admin/posts/`)
- `index.php` - List all posts
- `create.php` - Create new post
- `delete.php` - Delete post

#### Headers (`admin/headers/`)
- `index.php` - List all headers
- `create.php` - Create new header
- `delete.php` - Delete header

#### Footers (`admin/footers/`)
- `index.php` - List all footers
- `create.php` - Create new footer
- `delete.php` - Delete footer

### Settings (`admin/settings/index.php`)
Configure:
- Site name and description
- Active theme
- Home page selection
- Global header/footer
- Other site-wide settings

---

## Page Builder System

### Architecture
The page builder uses a three-panel layout:

1. **Left Panel** - Widget library organized by categories
2. **Center Canvas** - Visual editing area with drag-and-drop
3. **Right Panel** - Widget settings and configuration

### Key Features
- **Drag-and-drop** widget placement
- **Multi-device preview** (desktop, tablet, mobile)
- **Real-time editing** with instant visual feedback
- **Undo/Redo** functionality
- **Widget search** and filtering
- **Hierarchical element structure** with parent-child relationships
- **Inline editing** for text content
- **Context menus** for element actions

### Widget Categories
- **Basic** - Heading, text, button, image
- **Layout** - Columns, container, divider, flex
- **Media** - Image, video, gallery
- **Forms** - (Future implementation)

### Data Structure
Page content is stored as JSON array of element objects:

```json
[
    {
        "id": "element_1",
        "type": "heading",
        "settings": {
            "text": "Welcome",
            "tag": "h1",
            "alignment": "center"
        },
        "children": []
    },
    {
        "id": "element_2",
        "type": "columns",
        "settings": {
            "columns": 3
        },
        "children": [
            {
                "id": "element_3",
                "type": "text",
                "settings": {
                    "text": "Column 1 content"
                },
                "children": []
            }
        ]
    }
]
```

---

## Widget System

### Available Widgets

#### Core Widgets

1. **HeadingWidget** (`HeadingWidget.js`)
   - Text headings (h1-h6)
   - Alignment, color, size controls
   - Typography settings

2. **TextWidget** (`TextWidget.js`)
   - Rich text content
   - HTML support
   - Styling options

3. **ButtonWidget** (`ButtonWidget.js`)
   - Interactive buttons
   - Link/URL support
   - Style customization

4. **ImageWidget** (`ImageWidget.js`)
   - Image display
   - Alt text, caption
   - Size and alignment

5. **VideoWidget** (`VideoWidget.js`)
   - Video embedding
   - YouTube/Vimeo support
   - Responsive sizing

6. **DividerWidget** (`DividerWidget.js`)
   - Visual separators
   - Line styles
   - Spacing controls

7. **ColumnsWidget** (`ColumnsWidget.js`)
   - Multi-column layouts
   - Responsive column counts
   - Column width controls

8. **FlexWidget** (`FlexWidget.js`)
   - Flexbox containers
   - Direction, alignment
   - Gap controls

9. **LogoWidget** (`LogoWidget.js`)
   - Site logo display
   - Size and alignment
   - Link support

### Widget Development

To create a new widget:

1. **Extend WidgetBase:**
```javascript
class CustomWidget extends WidgetBase {
    getName() {
        return 'custom';
    }

    getTitle() {
        return 'Custom Widget';
    }

    getIcon() {
        return 'fa fa-star';
    }

    getCategories() {
        return ['basic'];
    }

    registerControls() {
        this.addControl('content', {
            type: 'textarea',
            label: 'Content',
            default_value: ''
        });
    }

    render() {
        const content = this.getSetting('content', '');
        return `<div class="custom-widget">${content}</div>`;
    }
}
```

2. **Register with WidgetManager:**
```javascript
const widgetManager = window.elementorWidgetManager;
widgetManager.registerWidget(CustomWidget);
```

3. **Include in page builder:**
Add script tag in `admin/page-builder.php`:
```html
<script src="../assets/widgets/CustomWidget.js"></script>
```

4. **Register in initialization:**
```javascript
if (typeof CustomWidget !== 'undefined') {
    widgetManager.registerWidget(CustomWidget);
}
```

---

## Control System

The control system provides Elementor-style form controls for widget settings.

### Features
- **BaseControl Architecture** - All controls extend a common base
- **Event System** - Built-in event emitter for reactive updates
- **Responsive Controls** - Desktop/Tablet/Mobile device switching
- **Conditional Logic** - Show/hide controls based on other values
- **Validation Framework** - Built-in validators (required, email, URL, etc.)
- **State Management** - Centralized control manager
- **Serialization** - Save/load control states

### Usage Example

```javascript
const controlManager = window.elementorControlManager;
controlManager.init();

const controlsConfig = [
    {
        id: 'heading_text',
        type: 'text',
        label: 'Heading Text',
        default_value: 'Welcome',
        required: true,
        validators: [
            Validator.required('Heading is required'),
            Validator.minLength(3)
        ]
    },
    {
        id: 'subtitle_text',
        type: 'text',
        label: 'Subtitle',
        condition: {
            name: 'show_subtitle',
            operator: '===',
            value: 'yes'
        }
    }
];

controlManager.renderControls('#container', controlsConfig);

controlManager.on('change', (id, newValue, oldValue, allValues) => {
    console.log(`Control ${id} changed:`, newValue);
});
```

**See `CONTROLS-README.md` for complete control system documentation.**

---

## Theme System

### Theme Structure
Each theme resides in `/theme/{theme-name}/`:
- `style.css` - Main stylesheet
- Optional assets (images, fonts, etc.)

### Active Themes
- **theme1** - Default modern theme
- **theme-2** - Alternative theme variant

### Theme Selection
Themes are selectable via the admin settings panel and stored in the `settings` table with key `active_theme`.

### Creating a Theme

1. Create directory: `/theme/my-theme/`
2. Create `style.css`:
```css
/* My Theme Styles */
body {
    font-family: Arial, sans-serif;
    color: #333;
}

.elementor-element {
    margin-bottom: 20px;
}
```

3. Select theme in admin settings

---

## Routing System

### Frontend Routing (`index.php`)

The main router handles:

1. **Home Page** - Empty slug or `index.php`
   - Loads page with ID from `settings.home_page`

2. **Blog Posts** - `/blog/{slug}`
   - Matches slug in `posts` table
   - Only published posts are accessible

3. **Pages** - `/{slug}`
   - Matches slug in `pages` table
   - Only published pages are accessible

4. **Preview Mode** - `?page_id={id}` or `?post_id={id}`
   - Allows preview of draft content
   - Requires admin session (optional)

5. **404 Handling** - No matching content
   - Returns 404 status code
   - Displays error message

### URL Structure

- **Home:** `/` or `/index.php`
- **Page:** `/about-us`
- **Blog Post:** `/blog/my-first-post`
- **Admin:** `/admin/`
- **Page Builder:** `/admin/page-builder.php?id=1&type=page`

### .htaccess Rules

```apache
# Blog routing
RewriteRule ^blog/(.*)$ index.php [L]

# All other routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
```

---

## Installation & Setup

### Prerequisites
- PHP 7.0 or higher
- MySQL/MariaDB 5.7 or higher
- Apache web server with mod_rewrite
- File write permissions for uploads

### Setup Steps

1. **Clone/Download** the project to your web directory
   ```bash
   cd /path/to/web/directory
   git clone <repository-url> new-cms
   ```

2. **Create `.env` file** in project root:
   ```ini
   APP_NAME="New CMS"
   APP_URL=http://localhost/new-cms
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=new_cms
   DB_USERNAME=root
   DB_PASSWORD=
   ```

3. **Set Permissions:**
   ```bash
   chmod 755 images/
   chmod 755 assets/uploads/
   ```

4. **Create Database:**
   ```bash
   php setup_database.php
   ```

5. **Update Schema:**
   ```bash
   php update_database.php
   ```

6. **Setup Gallery:**
   ```bash
   php setup_gallery.php
   ```

7. **Setup Headers/Footers:**
   ```bash
   php admin/setup_tables.php
   ```

8. **Configure Web Server:**
   - Point document root to project directory
   - Ensure mod_rewrite is enabled
   - Verify `.htaccess` is being processed

9. **Access Admin Panel:**
   - URL: `http://localhost/new-cms/admin/`
   - Username: `admin`
   - Password: `password`

### Verification

1. Check database tables are created
2. Verify admin login works
3. Create a test page
4. Check frontend routing works
5. Test media upload

---

## Security Considerations

### Implemented Security

1. **SQL Injection Prevention**
   - All queries use PDO prepared statements
   - Table names are validated before use

2. **File Upload Security**
   - File type validation (MIME type checking)
   - Allowed extensions: JPG, PNG, GIF, WebP
   - Unique filename generation
   - Upload directory isolation

3. **Authentication**
   - Session-based authentication
   - Password hashing with bcrypt
   - Session timeout handling
   - Admin route protection

4. **File Protection**
   - `.env` file protection via `.htaccess`
   - Directory listing prevention
   - Hidden file protection

5. **Input Validation**
   - JSON input validation
   - Type checking
   - Required field validation

### Security Recommendations

1. **Change Default Credentials**
   - Update admin username/password immediately
   - Use strong passwords

2. **Enable HTTPS**
   - Use SSL/TLS in production
   - Force HTTPS redirects

3. **File Size Limits**
   - Configure `upload_max_filesize` in PHP
   - Set `post_max_size` appropriately
   - Add server-level limits

4. **CSRF Protection**
   - Implement CSRF tokens for forms
   - Validate tokens on POST requests

5. **Regular Updates**
   - Keep PHP and MySQL updated
   - Monitor security advisories
   - Update dependencies

6. **Backup Strategy**
   - Regular database backups
   - File system backups
   - Test restore procedures

7. **Error Handling**
   - Disable error display in production
   - Log errors securely
   - Don't expose sensitive information

8. **Access Control**
   - Implement role-based permissions
   - Limit admin access by IP (optional)
   - Use strong session configuration

---

## Development Guidelines

### Code Standards

1. **PHP**
   - Use PSR-12 coding standards (where applicable)
   - Always use prepared statements
   - Validate and sanitize inputs
   - Use type hints where possible

2. **JavaScript**
   - ES6+ syntax
   - Use classes for components
   - Follow event-driven patterns
   - Comment complex logic

3. **CSS**
   - Use meaningful class names
   - Follow BEM methodology (optional)
   - Use CSS variables for theming
   - Mobile-first responsive design

### Best Practices

1. **Database Operations**
   - Always use prepared statements
   - Handle exceptions properly
   - Use transactions for multiple operations
   - Index frequently queried columns

2. **File Handling**
   - Validate all uploads
   - Check file sizes
   - Sanitize filenames
   - Store files outside web root when possible

3. **Frontend**
   - Use event delegation for dynamic content
   - Minimize DOM manipulation
   - Cache jQuery selectors
   - Use debouncing for frequent events

4. **API Design**
   - Consistent response format
   - Proper HTTP status codes
   - Error handling and messages
   - Input validation

5. **Security**
   - Sanitize all user inputs
   - Escape output
   - Validate on both client and server
   - Use HTTPS in production

### Extension Points

1. **Custom Widgets**
   - Add to `/assets/widgets/`
   - Extend `WidgetBase`
   - Register with `WidgetManager`

2. **Custom Controls**
   - Add to `/assets/fields/`
   - Extend `BaseControl`
   - Register with `ControlManager`

3. **Themes**
   - Create in `/theme/` directory
   - Add CSS files
   - Select via admin settings

4. **API Endpoints**
   - Add to `/api/` directory
   - Follow existing patterns
   - Include authentication checks

5. **Database Tables**
   - Use migration scripts
   - Follow naming conventions
   - Include timestamps

### Testing

1. **Development Environment**
   - Test in isolated environment
   - Use version control
   - Test all features before deployment

2. **Backup Before Changes**
   - Database backups
   - File backups
   - Test restore procedures

3. **Verification Checklist**
   - File permissions
   - Database connectivity
   - Widget functionality
   - API endpoints
   - Frontend rendering
   - Admin panel access

---

## File Reference

### Key Files

#### Backend
- `index.php` - Main router and frontend entry point
- `includes/db.php` - Database connection utility
- `setup_database.php` - Initial database setup
- `update_database.php` - Schema updates
- `admin/login.php` - Authentication
- `admin/page-builder.php` - Page builder interface
- `admin/api/save-page.php` - Save content API

#### Frontend Core
- `assets/core/EventEmitter.js` - Event system
- `assets/core/WidgetManager.js` - Widget management
- `assets/core/ElementManager.js` - Element hierarchy
- `assets/core/DragDropManager.js` - Drag-and-drop
- `assets/core/PublicRenderer.js` - Frontend renderer

#### Widgets
- `assets/widgets/WidgetBase.js` - Base widget class
- `assets/widgets/HeadingWidget.js` - Heading widget
- `assets/widgets/TextWidget.js` - Text widget
- `assets/widgets/ButtonWidget.js` - Button widget
- `assets/widgets/ImageWidget.js` - Image widget
- `assets/widgets/VideoWidget.js` - Video widget
- `assets/widgets/ColumnsWidget.js` - Columns widget
- `assets/widgets/FlexWidget.js` - Flexbox widget
- `assets/widgets/DividerWidget.js` - Divider widget
- `assets/widgets/LogoWidget.js` - Logo widget

#### Controls
- `assets/fields/BaseControl.js` - Base control class
- `assets/fields/ControlManager.js` - Control manager
- `assets/fields/text-new.js` - Refactored text control
- `assets/fields/utils/Validator.js` - Validation framework
- `assets/fields/utils/Conditions.js` - Conditional logic

#### Styles
- `assets/css/page-builder.css` - Page builder styles
- `assets/css/toast.css` - Toast notifications
- `theme/theme1/style.css` - Default theme
- `theme/theme-2/style.css` - Alternative theme

#### Configuration
- `.env` - Environment configuration (not in repo)
- `.htaccess` - Apache configuration

---

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check `.env` file exists and is correct
   - Verify database credentials
   - Ensure database exists
   - Check MySQL service is running

2. **Page Not Found (404)**
   - Verify `.htaccess` is working
   - Check mod_rewrite is enabled
   - Verify slug exists in database
   - Check page status is 'published'

3. **Widgets Not Loading**
   - Check browser console for errors
   - Verify script paths are correct
   - Ensure widgets are registered
   - Check file permissions

4. **Media Upload Fails**
   - Check file permissions on `images/` directory
   - Verify PHP upload limits
   - Check file type is allowed
   - Verify database connection

5. **Admin Login Issues**
   - Verify admin user exists in database
   - Check session configuration
   - Clear browser cookies
   - Verify password hash is correct

6. **Styles Not Loading**
   - Check CSS file paths
   - Verify theme is selected in settings
   - Check browser cache
   - Verify file permissions

---

## Future Enhancements

### Planned Features
- [ ] User roles and permissions
- [ ] Form builder widgets
- [ ] Advanced typography controls
- [ ] Global colors and fonts
- [ ] Template library
- [ ] Import/export functionality
- [ ] Multi-language support
- [ ] SEO optimization tools
- [ ] Analytics integration
- [ ] E-commerce widgets

### Known Limitations
- Single admin user (no multi-user support yet)
- No built-in caching
- Limited widget library
- No version control for content
- No scheduled publishing
- Limited SEO features

---

## Support & Contributing

### Getting Help
- Review this documentation
- Check `CONTROLS-README.md` for control system details
- Review code comments
- Check browser console for errors

### Contributing
When contributing:
1. Follow coding standards
2. Test thoroughly
3. Update documentation
4. Use meaningful commit messages
5. Test in multiple browsers

---

## License

This project is part of the New CMS system. See project license for details.

---

## Changelog

### Version 1.0 (December 2024)
- Initial release
- Page builder system
- Widget system
- Control system
- Media management
- Theme system
- Blog functionality
- Admin panel

---

*Documentation last updated: December 2024*
