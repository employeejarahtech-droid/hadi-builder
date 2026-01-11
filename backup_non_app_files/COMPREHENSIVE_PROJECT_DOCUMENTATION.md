# New CMS - Comprehensive Project Documentation

## Executive Summary

New CMS is a modern, lightweight Content Management System inspired by Elementor-style page builders. It provides a comprehensive drag-and-drop interface for creating dynamic web pages with a modular, component-based architecture. The system supports pages, blog posts, global headers/footers, and includes a sophisticated widget system with extensive customization options.

**Version:** 1.0  
**Last Updated:** December 2024  
**Technology Stack:** PHP 7.0+, MySQL/MariaDB 5.7+, Apache, jQuery, Vanilla JavaScript

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Directory Structure](#directory-structure)
4. [Database Design](#database-design)
5. [Core Systems](#core-systems)
6. [Frontend Architecture](#frontend-architecture)
7. [Admin Panel](#admin-panel)
8. [API Documentation](#api-documentation)
9. [Widget System](#widget-system)
10. [Control System](#control-system)
11. [Theme System](#theme-system)
12. [Security Implementation](#security-implementation)
13. [Installation & Setup](#installation--setup)
14. [Development Guidelines](#development-guidelines)
15. [Troubleshooting](#troubleshooting)
16. [Future Roadmap](#future-roadmap)

---

## Project Overview

### Key Features

- **Visual Page Builder**: Drag-and-drop interface with real-time preview
- **Widget-Based Architecture**: Modular components for content creation
- **Responsive Design**: Multi-device preview and editing (Desktop/Tablet/Mobile)
- **Content Management**: Separate pages and blog posts with draft/publish workflow
- **Global Templates**: Reusable headers and footers
- **Media Management**: File upload system with gallery functionality
- **Theme System**: Multiple theme support with CSS-based styling
- **Advanced Controls**: Elementor-style control system with validation
- **SEO-Friendly URLs**: Clean URL structure with slug-based routing

### Target Use Cases

- Small to medium business websites
- Blog platforms
- Portfolio sites
- Landing pages
- Corporate websites
- Personal websites

---

## Architecture & Technology Stack

### Backend Technologies

#### PHP Core
- **Version**: PHP 7.0+
- **Architecture**: Procedural with object-oriented components
- **Database**: PDO with prepared statements
- **Sessions**: File-based session management
- **Error Handling**: Exception-based error management

#### Database
- **System**: MySQL/MariaDB 5.7+
- **Character Set**: utf8mb4 with utf8mb4_unicode_ci collation
- **Engine**: InnoDB for transactional support
- **Connection**: PDO with persistent connections

#### Web Server
- **Server**: Apache HTTP Server
- **Modules**: mod_rewrite for clean URLs
- **Configuration**: .htaccess for routing and security

### Frontend Technologies

#### Core Libraries
- **jQuery 3.6.0**: DOM manipulation and AJAX
- **Font Awesome 6.4.0**: Icon library
- **Vanilla JavaScript (ES6+)**: Custom components and interactions

#### Architecture Patterns
- **Event-Driven**: Custom EventEmitter implementation
- **Component-Based**: Widget and control inheritance
- **Modular Design**: Separate concerns with clear interfaces
- **Responsive Design**: Mobile-first approach with device switching

---

## Directory Structure

```
new-cms/
├── Root Configuration
│   ├── .env                    # Environment configuration
│   ├── .htaccess               # Apache rewrite rules & security
│   ├── index.php               # Main frontend router
│   ├── setup_database.php      # Database initialization
│   ├── update_database.php     # Schema updates
│   └── setup_gallery.php       # Media gallery setup
│
├── Core Systems
│   ├── includes/
│   │   └── db.php             # Database connection utility
│   │
│   ├── assets/
│   │   ├── core/              # Core JavaScript components
│   │   │   ├── EventEmitter.js     # Event system
│   │   │   ├── WidgetManager.js   # Widget registration
│   │   │   ├── ElementManager.js  # Element hierarchy
│   │   │   ├── DragDropManager.js # Drag-and-drop
│   │   │   ├── PublicRenderer.js  # Frontend renderer
│   │   │   └── Toast.js           # Notifications
│   │   │
│   │   ├── fields/            # Form control system
│   │   │   ├── BaseControl.js      # Control base class
│   │   │   ├── ControlManager.js   # Control lifecycle
│   │   │   ├── text-new.js        # Text input control
│   │   │   ├── textarea.js        # Textarea control
│   │   │   ├── select.js          # Select dropdown
│   │   │   ├── slider.js          # Range slider
│   │   │   ├── color.js           # Color picker
│   │   │   ├── media.js           # Media uploader
│   │   │   ├── dimension.js       # Dimension control
│   │   │   └── utils/            # Control utilities
│   │   │
│   │   ├── widgets/           # Widget components
│   │   │   ├── WidgetBase.js      # Base widget class
│   │   │   ├── HeadingWidget.js   # Heading widget
│   │   │   ├── TextWidget.js      # Text content widget
│   │   │   ├── ButtonWidget.js    # Button widget
│   │   │   ├── ImageWidget.js     # Image widget
│   │   │   ├── VideoWidget.js     # Video widget
│   │   │   ├── ColumnsWidget.js   # Multi-column layout
│   │   │   ├── FlexWidget.js      # Flexbox container
│   │   │   ├── DividerWidget.js   # Divider/separator
│   │   │   └── LogoWidget.js      # Logo display widget
│   │   │
│   │   ├── css/               # Stylesheets
│   │   │   ├── page-builder.css    # Page builder styles
│   │   │   └── toast.css           # Toast notifications
│   │   │
│   │   └── uploads/           # File upload directory
│
├── Administration Panel
│   ├── admin/
│   │   ├── index.php               # Admin dashboard
│   │   ├── login.php               # Authentication
│   │   ├── page-builder.php        # Visual editor
│   │   ├── header-builder.php      # Header template editor
│   │   ├── footer-builder.php      # Footer template editor
│   │   │
│   │   ├── api/                   # Admin API endpoints
│   │   │   ├── save-page.php       # Save content
│   │   │   ├── save-header.php     # Save headers
│   │   │   └── save-footer.php     # Save footers
│   │   │
│   │   ├── pages/                 # Page management
│   │   ├── posts/                 # Blog post management
│   │   ├── headers/               # Header templates
│   │   ├── footers/               # Footer templates
│   │   ├── settings/              # System configuration
│   │   └── includes/              # Admin templates
│
├── Public API
│   └── api/
│       └── media/                 # Media management
│           ├── list.php            # List media files
│           ├── upload.php          # Upload files
│           └── delete.php          # Delete files
│
├── Theme System
│   └── theme/
│       ├── theme1/                # Default theme
│       └── theme-2/               # Alternative theme
│
├── Media Storage
│   └── images/                   # Uploaded images
│
└── Documentation
    ├── PROJECT_DOCUMENTATION.md    # Existing documentation
    ├── CONTROLS-README.md        # Control system docs
    └── COMPREHENSIVE_PROJECT_DOCUMENTATION.md # This file
```

---

## Database Design

### Core Tables

#### users
Administrative user accounts with role-based access.

```sql
CREATE TABLE `users` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL, -- bcrypt hash
    `role` VARCHAR(20) DEFAULT 'admin',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### pages
Static page content with JSON-based widget storage.

```sql
CREATE TABLE `pages` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `content` LONGTEXT, -- JSON array of widget elements
    `status` ENUM('draft', 'published') DEFAULT 'draft',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### posts
Blog post content with similar structure to pages.

```sql
CREATE TABLE `posts` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `content` LONGTEXT, -- JSON array of widget elements
    `status` ENUM('draft', 'published') DEFAULT 'draft',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### headers
Global header templates reusable across pages.

```sql
CREATE TABLE `headers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) UNIQUE NOT NULL,
    `status` VARCHAR(50) DEFAULT 'draft',
    `content` LONGTEXT, -- JSON array of widget elements
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### footers
Global footer templates reusable across pages.

```sql
CREATE TABLE `footers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) UNIQUE NOT NULL,
    `status` VARCHAR(50) DEFAULT 'draft',
    `content` LONGTEXT, -- JSON array of widget elements
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### settings
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

#### gallery
Media file management and metadata.

```sql
CREATE TABLE `gallery` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `file_name` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Content Storage Format

Page, post, header, and footer content is stored as JSON arrays:

```json
[
    {
        "id": "element_1",
        "type": "heading",
        "settings": {
            "title": "Welcome to Our Site",
            "html_tag": "h1",
            "align": "center",
            "color": "#333333",
            "font_size": {"size": 48, "unit": "px"}
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
                    "content": "Column 1 content"
                },
                "children": []
            }
        ]
    }
]
```

---

## Core Systems

### 1. Routing System

#### Frontend Router (index.php)
Handles all incoming requests and routes them appropriately:

- **Home Page**: Empty slug or index.php → loads home page from settings
- **Blog Posts**: `/blog/{slug}` → matches posts table
- **Pages**: `/{slug}` → matches pages table
- **Preview Mode**: `?page_id={id}` or `?post_id={id}` → draft preview
- **Admin**: `/admin/` → redirects to admin panel
- **404**: No matching content → error page

#### .htaccess Configuration
```apache
# Blog routing
RewriteRule ^blog/(.*)$ index.php [L]

# All other routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
```

### 2. Database Connection

#### Connection Management
- **Singleton Pattern**: Single PDO instance per request
- **Environment Configuration**: Loaded from .env file
- **Error Handling**: Exception-based with proper error messages
- **Security**: Prepared statements for all queries

#### Connection Utility (includes/db.php)
```php
function getDBConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }
    // Load environment and create connection
    // Returns PDO instance with proper configuration
}
```

### 3. Session Management

#### Authentication System
- **Session-Based**: File-based sessions with secure configuration
- **Password Hashing**: bcrypt for secure password storage
- **Route Protection**: Admin routes require authenticated session
- **Timeout Handling**: Configurable session lifetime

#### Session Flow
1. User submits login form
2. Credentials validated against database
3. Session created with `admin_logged_in = true`
4. Subsequent requests validate session
5. Logout destroys session

### 4. Configuration Management

#### Environment Configuration (.env)
```ini
APP_NAME="New CMS"
APP_ENV=local
APP_URL=http://localhost/new-cms

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=new_cms
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=file
SESSION_LIFETIME=120
```

#### Dynamic Settings
Site-wide settings stored in database and cached per request:
- Theme selection
- Global header/footer assignments
- Home page configuration
- Site metadata

---

## Frontend Architecture

### 1. Core Components

#### EventEmitter System
Custom pub/sub implementation for component communication:

```javascript
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
}
```

#### WidgetManager
Central widget registration and management:

```javascript
class WidgetManager {
    constructor() {
        this.widgets = new Map();
        this.categories = new Map();
    }
    
    registerWidget(widgetClass) {
        const widget = new widgetClass();
        this.widgets.set(widget.getName(), widget);
        // Register by categories
    }
    
    createWidget(name, settings) {
        const WidgetClass = this.widgets.get(name);
        return WidgetClass ? new WidgetClass(settings) : null;
    }
}
```

#### ElementManager
Manages DOM element hierarchy and state:

```javascript
class ElementManager {
    constructor() {
        this.elements = new Map();
        this.rootElements = [];
    }
    
    addElement(element) {
        this.elements.set(element.id, element);
        if (!element.parentId) {
            this.rootElements.push(element.id);
        }
    }
    
    serialize() {
        // Export element tree as JSON
    }
    
    deserialize(data) {
        // Import element tree from JSON
    }
}
```

#### DragDropManager
Handles drag-and-drop functionality:

```javascript
class DragDropManager {
    constructor() {
        this.draggedWidget = null;
        this.dropZones = [];
    }
    
    init() {
        this.setupDragListeners();
        this.initDropZones();
    }
    
    onDrop(callback) {
        this.dropCallback = callback;
    }
}
```

### 2. Control System

#### BaseControl Architecture
All controls extend a common base class:

```javascript
class BaseControl {
    constructor(id, args = {}) {
        this.id = id;
        this.args = args;
        this.value = args.value || args.default_value;
        this.events = new EventEmitter();
    }
    
    render() {
        // Override in subclasses
    }
    
    getValue() {
        return this.value;
    }
    
    setValue(value, silent = false) {
        const oldValue = this.value;
        this.value = value;
        if (!silent && oldValue !== value) {
            this.events.emit('change', value, oldValue);
        }
    }
}
```

#### ControlManager
Centralized control lifecycle management:

```javascript
class ControlManager {
    constructor() {
        this.controls = new Map();
        this.events = new EventEmitter();
    }
    
    createControl(id, type, options) {
        const ControlClass = this.controlTypes.get(type);
        const control = new ControlClass(id, options);
        this.controls.set(id, control);
        return control;
    }
    
    renderControls(container, config) {
        // Render multiple controls
    }
}
```

### 3. Widget Architecture

#### WidgetBase
All widgets extend the base widget class:

```javascript
class WidgetBase {
    constructor(settings = {}) {
        this.settings = { ...this.getDefaultSettings(), ...settings };
        this.controls = [];
    }
    
    getName() {
        throw new Error('getName() must be implemented');
    }
    
    getTitle() {
        throw new Error('getTitle() must be implemented');
    }
    
    registerControls() {
        // Define widget controls
    }
    
    render() {
        throw new Error('render() must be implemented');
    }
}
```

#### Widget Categories
- **Basic**: Heading, Text, Button, Image
- **Layout**: Columns, Container, Divider, Flex
- **Media**: Image, Video, Gallery
- **Forms**: (Future implementation)

---

## Admin Panel

### 1. Dashboard (admin/index.php)

Main administrative interface providing access to:

- **Page Management**: Create, edit, delete pages
- **Post Management**: Blog post creation and management
- **Settings**: Site configuration
- **Global Templates**: Header/footer builders
- **Controls Demo**: Component library showcase

### 2. Authentication System

#### Login Flow
1. User accesses admin panel
2. Redirected to login if not authenticated
3. Credentials validated against database
4. Session created with authentication flag
5. Redirected to dashboard

#### Security Features
- **Password Hashing**: bcrypt encryption
- **Session Protection**: Secure session configuration
- **Route Guards**: Admin routes require authentication
- **Timeout Handling**: Configurable session lifetime

### 3. Page Builder Interface

#### Three-Panel Layout
1. **Left Panel**: Widget library organized by categories
2. **Center Canvas**: Visual editing area with drag-and-drop
3. **Right Panel**: Widget settings and configuration

#### Key Features
- **Drag-and-Drop**: Intuitive widget placement
- **Real-Time Preview**: Instant visual feedback
- **Device Switching**: Desktop/Tablet/Mobile views
- **Undo/Redo**: History management
- **Widget Search**: Quick widget discovery
- **Responsive Controls**: Device-specific settings

#### Widget Management
- **Registration**: Widgets registered with WidgetManager
- **Categorization**: Organized by functionality
- **Search**: Filterable widget list
- **Drag Handling**: Visual feedback during drag operations

### 4. Content Management

#### Pages (admin/pages/)
- **index.php**: List all pages with status
- **create.php**: Create new page with slug generation
- **delete.php**: Delete page with confirmation

#### Posts (admin/posts/)
- **index.php**: List all blog posts
- **create.php**: Create new blog post
- **delete.php**: Delete post with confirmation

#### Global Templates
- **Headers**: Reusable header templates
- **Footers**: Reusable footer templates
- **Assignment**: Select active templates in settings

### 5. Settings Configuration

#### Site Settings
- **Basic Information**: Site name, description, email
- **Theme Selection**: Choose active theme
- **Home Page**: Set homepage from existing pages
- **Global Templates**: Assign header/footer templates

#### System Configuration
- **Database**: Connection settings (via .env)
- **Session**: Lifetime and security settings
- **Media**: Upload limits and allowed types

---

## API Documentation

### 1. Media API

#### Upload Endpoint
**POST** `/api/media/upload.php`

Uploads media files to the server.

**Request:** `multipart/form-data`
- `file`: Image file (JPG, PNG, GIF, WebP)

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 123,
        "url": "/images/img_456.jpg",
        "name": "uploaded.jpg"
    }
}
```

**Security Features:**
- File type validation
- Size limits
- Unique filename generation
- Database tracking

#### List Endpoint
**GET** `/api/media/list.php`

Retrieves list of all uploaded media files.

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

#### Delete Endpoint
**DELETE** `/api/media/delete.php`

Deletes a media file from server and database.

**Request:** JSON body
```json
{
    "id": 123
}
```

### 2. Admin API

#### Save Content Endpoint
**POST** `/admin/api/save-page.php`

Saves page or post content to database.

**Authentication:** Requires admin session

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
                "title": "Hello World",
                "html_tag": "h1"
            }
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

#### Save Header/Footer
Similar endpoints for global templates:
- `POST /admin/api/save-header.php`
- `POST /admin/api/save-footer.php`

### 3. Security Implementation

#### Authentication Checks
All admin endpoints require valid session:
```php
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}
```

#### Input Validation
- JSON input validation
- Type checking
- Required field validation
- SQL injection prevention via prepared statements

---

## Widget System

### 1. Available Widgets

#### HeadingWidget
Displays customizable headings with extensive styling options.

**Features:**
- HTML tag selection (H1-H6, div, span, p)
- Text alignment and color
- Font size and weight controls
- Link functionality
- Responsive font sizes
- Animation support
- CSS classes and ID

**Controls:**
- Content: Title text, HTML tag, link
- Style: Alignment, color, font size, font weight
- Advanced: CSS classes, ID, animation, responsive display

#### TextWidget
Rich text content widget with HTML support.

**Features:**
- Rich text editing
- HTML support
- Typography controls
- Responsive text settings

#### ButtonWidget
Interactive button widget with styling options.

**Features:**
- Text and link configuration
- Button styles and sizes
- Icon support
- Hover effects
- Alignment options

#### ImageWidget
Image display widget with comprehensive options.

**Features:**
- Image selection from media library
- Alt text and captions
- Size and alignment controls
- Link functionality
- Responsive image settings

#### VideoWidget
Video embedding widget for multiple platforms.

**Features:**
- YouTube/Vimeo embedding
- Self-hosted video support
- Responsive sizing
- Autoplay and controls
- Poster images

#### ColumnsWidget
Multi-column layout widget.

**Features:**
- Configurable column count
- Responsive column behavior
- Gap and spacing controls
- Column width management

#### FlexWidget
Flexbox container for advanced layouts.

**Features:**
- Flex direction control
- Alignment and justification
- Gap and spacing
- Responsive behavior

#### DividerWidget
Visual separator widget.

**Features:**
- Line style selection
- Thickness and color
- Spacing controls
- Responsive behavior

#### LogoWidget
Site logo display widget.

**Features:**
- Logo image selection
- Size controls
- Link to home page
- Alignment options
- Responsive sizing

### 2. Widget Development

#### Creating Custom Widgets

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

3. **Include in Page Builder:**
Add script tag in `admin/page-builder.php`:
```html
<script src="../assets/widgets/CustomWidget.js"></script>
```

#### Widget Lifecycle
1. **Registration**: Widget class registered with manager
2. **Instantiation**: Widget created when dragged to canvas
3. **Configuration**: Settings applied through controls
4. **Rendering**: HTML generated based on settings
5. **Serialization**: Settings saved to database as JSON

---

## Control System

### 1. Control Types

#### Text Control
Single-line text input with validation.

**Features:**
- Placeholder text
- Validation rules
- Responsive values
- Event handling

#### Textarea Control
Multi-line text input.

**Features:**
- Resizable textarea
- Rich text support
- Character counting
- Validation

#### Select Control
Dropdown selection control.

**Features:**
- Option groups
- Search functionality
- Multi-select support
- Conditional options

#### Slider Control
Range slider for numeric values.

**Features:**
- Min/max configuration
- Step values
- Unit support
- Responsive values
- Real-time preview

#### Color Control
Color picker with various formats.

**Features:**
- HEX, RGB, HSL support
- Preset colors
- Alpha channel
- Color history

#### Media Control
File upload and media library integration.

**Features:**
- Image upload
- Media library browsing
- File type validation
- Preview functionality
- Metadata storage

#### Dimension Control
Spacing and sizing control.

**Features:**
- Linked/unlinked values
- Multiple units (px, em, %, etc.)
- Responsive values
- Quick presets
- Visual interface

### 2. Control Features

#### Validation Framework
Built-in validation system with multiple validators:

```javascript
const validators = [
    Validator.required('This field is required'),
    Validator.email('Invalid email format'),
    Validator.minLength(3, 'Minimum 3 characters'),
    Validator.pattern(/^[a-z]+$/, 'Only lowercase letters')
];
```

#### Conditional Logic
Show/hide controls based on other values:

```javascript
condition: {
    terms: [
        { name: 'show_subtitle', operator: '===', value: 'yes' },
        { name: 'content_type', operator: 'in', value: ['post', 'page'] }
    ],
    relation: 'and'
}
```

#### Responsive Controls
Device-specific values for responsive design:

```javascript
responsive: true,
tablet_value: 'Tablet text',
mobile_value: 'Mobile text'
```

#### Event System
Reactive control updates with event handling:

```javascript
control.on('change', (newValue, oldValue, allValues) => {
    console.log('Control changed:', newValue);
    updatePreview(allValues);
});
```

### 3. Control Development

#### Creating Custom Controls

1. **Extend BaseControl:**
```javascript
class CustomControl extends BaseControl {
    render() {
        return `
            <div class="custom-control">
                <input id="${this.id}" value="${this.value}" />
            </div>
        `;
    }
    
    setupListeners() {
        super.setupListeners();
        $(`#${this.id}`).on('input', (e) => {
            this.setValue(e.target.value);
        });
    }
}
```

2. **Register with ControlManager:**
```javascript
controlManager.registerControlType('custom', CustomControl);
```

---

## Theme System

### 1. Theme Structure

Each theme resides in `/theme/{theme-name}/`:

```
theme/my-theme/
├── style.css              # Main stylesheet
├── assets/               # Theme assets (optional)
│   ├── images/          # Theme images
│   ├── fonts/           # Custom fonts
│   └── js/              # Theme-specific JavaScript
└── config.json          # Theme configuration (optional)
```

### 2. Available Themes

#### theme1 (Default)
Modern, clean theme with:
- Responsive design
- Modern typography
- Component-based styling
- Widget-specific styles

#### theme-2
Alternative theme variant with:
- Different color scheme
- Alternative typography
- Unique layout styles

### 3. Theme Development

#### Creating a New Theme

1. **Create Theme Directory:**
```bash
mkdir theme/my-theme
```

2. **Create Main Stylesheet:**
```css
/* theme/my-theme/style.css */

/* Base styles */
body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
}

/* Widget styles */
.heading-widget {
    margin-bottom: 1rem;
}

.text-widget {
    font-size: 1rem;
    line-height: 1.8;
}

/* Responsive design */
@media (max-width: 768px) {
    .heading-widget {
        font-size: 0.9em;
    }
}
```

3. **Optional Configuration File:**
```json
{
    "name": "My Theme",
    "version": "1.0.0",
    "author": "Your Name",
    "description": "A custom theme for New CMS",
    "supports": {
        "responsive": true,
        "custom_colors": true,
        "custom_fonts": true
    }
}
```

#### Theme Selection
Themes are selectable via admin settings and stored in database:

```php
// Update active theme
$stmt = $pdo->prepare("UPDATE settings SET value = ? WHERE key_name = 'active_theme'");
$stmt->execute(['my-theme']);
```

#### Theme Loading
Themes are loaded dynamically based on settings:

```php
$activeTheme = $settings['active_theme'] ?? 'theme1';
if (!empty($activeTheme)) {
    echo '<link rel="stylesheet" href="/theme/' . $activeTheme . '/style.css">';
}
```

---

## Security Implementation

### 1. Authentication Security

#### Password Management
- **Hashing**: bcrypt with cost factor 12
- **Salting**: Automatic salt generation
- **Validation**: Secure password requirements

#### Session Security
- **Secure Configuration**: HttpOnly, Secure flags
- **Lifetime**: Configurable timeout
- **Regeneration**: Session ID regeneration on login
- **Destruction**: Proper cleanup on logout

### 2. Input Validation

#### SQL Injection Prevention
- **Prepared Statements**: All queries use PDO prepared statements
- **Parameter Binding**: Type-safe parameter binding
- **Table Validation**: Whitelist for table names

#### File Upload Security
- **Type Validation**: MIME type and extension checking
- **Size Limits**: Configurable file size restrictions
- **Filename Sanitization**: Unique filename generation
- **Path Validation**: Prevent directory traversal

#### Input Sanitization
- **HTML Escaping**: Output encoding for XSS prevention
- **JSON Validation**: Proper JSON parsing with error handling
- **Type Checking**: Strict type validation
- **Length Limits**: Input length restrictions

### 3. Access Control

#### Route Protection
- **Admin Routes**: Session-based authentication
- **API Endpoints**: Token-based authentication
- **File Access**: .htaccess protection for sensitive files

#### Permission System
- **Role-Based**: User role management
- **Resource Access**: Granular permissions
- **Action Logging**: Audit trail for admin actions

### 4. Data Protection

#### Environment Security
- **.env Protection**: .htaccess prevents access
- **Secret Management**: Secure configuration storage
- **Database Credentials**: Encrypted connection strings

#### Error Handling
- **Production Mode**: Disable error display
- **Logging**: Secure error logging
- **Generic Messages**: User-friendly error pages

### 5. Security Headers

#### HTTP Headers
```apache
# .htaccess security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
```

#### File Protection
```apache
# Protect sensitive files
<Files ".env">
    Order allow,deny
    Deny from all
</Files>

<Files "*.log">
    Order allow,deny
    Deny from all
</Files>
```

---

## Installation & Setup

### 1. System Requirements

#### Server Requirements
- **PHP**: Version 7.0 or higher
- **Database**: MySQL 5.7+ or MariaDB 10.2+
- **Web Server**: Apache with mod_rewrite enabled
- **Memory**: Minimum 128MB PHP memory limit
- **Disk Space**: 100MB minimum, more for media

#### PHP Extensions
- **PDO**: Database connectivity
- **PDO MySQL**: MySQL driver
- **JSON**: JSON manipulation
- **GD**: Image processing
- **Fileinfo**: File type detection
- **mbstring**: Multibyte string support

### 2. Installation Steps

#### Step 1: Download and Extract
```bash
# Clone repository or download ZIP
cd /var/www/html
git clone <repository-url> new-cms
cd new-cms
```

#### Step 2: Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env
```

#### Step 3: Set Permissions
```bash
# Set proper permissions
chmod 755 images/
chmod 755 assets/uploads/
chmod 644 .env
```

#### Step 4: Create Database
```bash
# Run database setup
php setup_database.php

# Update schema
php update_database.php

# Setup media gallery
php setup_gallery.php

# Setup headers/footers
php admin/setup_tables.php
```

#### Step 5: Configure Web Server

##### Apache Configuration
```apache
<VirtualHost *:80>
    DocumentRoot /var/www/html/new-cms
    ServerName your-domain.com
    
    <Directory /var/www/html/new-cms>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

##### Enable .htaccess
```bash
# Enable mod_rewrite
a2enmod rewrite

# Restart Apache
systemctl restart apache2
```

### 3. Verification Steps

#### Database Verification
```sql
-- Check tables exist
SHOW TABLES;

-- Verify admin user
SELECT * FROM users;

-- Check settings
SELECT * FROM settings;
```

#### Functionality Testing
1. **Admin Access**: Navigate to `/admin/`
2. **Login**: Use default credentials (admin/password)
3. **Create Page**: Test page creation
4. **Page Builder**: Verify drag-and-drop functionality
5. **Frontend**: Check page rendering
6. **Media Upload**: Test file upload

### 4. Post-Installation Configuration

#### Security Configuration
1. **Change Default Password**: Update admin credentials
2. **Configure HTTPS**: Install SSL certificate
3. **Update .env**: Set production values
4. **File Permissions**: Verify secure permissions

#### Performance Optimization
1. **Enable Caching**: Configure PHP OPcache
2. **Database Optimization**: Add indexes
3. **Asset Compression**: Enable gzip compression
4. **CDN Setup**: Configure static asset CDN

---

## Development Guidelines

### 1. Coding Standards

#### PHP Standards
- **PSR-12**: Follow PSR-12 coding standards
- **Documentation**: PHPDoc blocks for all functions
- **Error Handling**: Exception-based error management
- **Security**: Always use prepared statements

#### JavaScript Standards
- **ES6+**: Use modern JavaScript features
- **Classes**: Use ES6 classes for components
- **Events**: Implement event-driven patterns
- **Documentation**: JSDoc comments for functions

#### CSS Standards
- **BEM Methodology**: Block-Element-Modifier naming
- **Mobile-First**: Responsive design approach
- **CSS Variables**: Use custom properties for theming
- **Performance**: Optimize for critical rendering path

### 2. Best Practices

#### Database Operations
```php
// Good: Prepared statements
$stmt = $pdo->prepare("SELECT * FROM pages WHERE id = ?");
$stmt->execute([$pageId]);

// Bad: Direct interpolation (SQL injection risk)
$sql = "SELECT * FROM pages WHERE id = " . $pageId;
```

#### File Handling
```php
// Good: Validate and sanitize
$allowedTypes = ['image/jpeg', 'image/png'];
if (in_array($file['type'], $allowedTypes)) {
    // Process file
}

// Bad: No validation
move_uploaded_file($file['tmp_name'], $uploadPath);
```

#### Frontend Development
```javascript
// Good: Event delegation
$(document).on('click', '.widget-card', function() {
    // Handle click
});

// Bad: Direct binding (doesn't work for dynamic content)
$('.widget-card').on('click', function() {
    // Handle click
});
```

### 3. Extension Development

#### Creating Widgets
1. **Extend WidgetBase**: Inherit from base class
2. **Implement Required Methods**: getName(), getTitle(), render()
3. **Register Controls**: Define widget settings
4. **Add to Page Builder**: Include script and register

#### Creating Controls
1. **Extend BaseControl**: Inherit from base class
2. **Implement Rendering**: Create HTML output
3. **Setup Listeners**: Handle user interactions
4. **Register Type**: Add to control manager

#### Theme Development
1. **Create Directory**: `/theme/theme-name/`
2. **Add Stylesheet**: Create `style.css`
3. **Test Responsiveness**: Ensure mobile compatibility
4. **Document Features**: Provide usage instructions

### 4. Testing Guidelines

#### Development Testing
1. **Local Environment**: Use XAMPP/MAMP for local testing
2. **Browser Testing**: Test in multiple browsers
3. **Device Testing**: Test on mobile devices
4. **Performance Testing**: Monitor load times

#### Quality Assurance
1. **Code Review**: Peer review for all changes
2. **Security Testing**: Check for vulnerabilities
3. **Accessibility**: Ensure WCAG compliance
4. **User Testing**: Get feedback from users

---

## Troubleshooting

### 1. Common Issues

#### Database Connection Errors
**Symptoms**: "Database connection failed" errors

**Solutions**:
1. Check `.env` file exists and is readable
2. Verify database credentials are correct
3. Ensure database server is running
4. Check database exists and user has permissions

```bash
# Test database connection
mysql -h localhost -u root -p new_cms
```

#### Page Not Found (404)
**Symptoms**: Pages return 404 errors

**Solutions**:
1. Verify `.htaccess` is being processed
2. Check mod_rewrite is enabled
3. Confirm slug exists in database
4. Ensure page status is 'published'

```bash
# Check Apache modules
apache2ctl -M | grep rewrite
```

#### Widget Loading Issues
**Symptoms**: Widgets not appearing in page builder

**Solutions**:
1. Check browser console for JavaScript errors
2. Verify widget script paths are correct
3. Ensure widgets are properly registered
4. Check for conflicting JavaScript

#### Media Upload Failures
**Symptoms**: File uploads not working

**Solutions**:
1. Check directory permissions (755)
2. Verify PHP upload limits
3. Confirm file type is allowed
4. Check available disk space

```php
// Check PHP upload settings
echo ini_get('upload_max_filesize');
echo ini_get('post_max_size');
```

### 2. Debugging Tools

#### PHP Debugging
```php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log errors to file
ini_set('log_errors', 1);
ini_set('error_log', '/path/to/error.log');
```

#### JavaScript Debugging
```javascript
// Enable debug mode
window.DEBUG = true;

// Console logging
if (window.DEBUG) {
    console.log('Debug info:', data);
}
```

#### Database Debugging
```php
// Enable query logging
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Log queries
$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
```

### 3. Performance Issues

#### Slow Page Loads
**Causes**: Large images, unoptimized database queries

**Solutions**:
1. Optimize images (compress, proper dimensions)
2. Add database indexes
3. Enable caching
4. Minify CSS/JavaScript

#### Memory Issues
**Causes**: Large file uploads, memory leaks

**Solutions**:
1. Increase PHP memory limit
2. Optimize image processing
3. Implement file streaming
4. Monitor memory usage

---

## Future Roadmap

### 1. Planned Features

#### Enhanced User Management
- [ ] Multi-user support with roles
- [ ] User registration system
- [ ] Permission-based access control
- [ ] User profiles and preferences

#### Advanced Content Features
- [ ] Form builder with submissions
- [ ] E-commerce integration
- [ ] Membership system
- [ ] Content scheduling

#### Design System Improvements
- [ ] Global colors and fonts
- [ ] Design system library
- [ ] Template library
- [ ] Advanced typography controls

#### Performance Enhancements
- [ ] Caching system implementation
- [ ] CDN integration
- [ ] Image optimization
- [ ] Lazy loading

#### SEO and Marketing
- [ ] SEO optimization tools
- [ ] Analytics integration
- [ ] Social media integration
- [ ] Email marketing system

### 2. Technical Improvements

#### Code Quality
- [ ] Unit testing implementation
- [ ] Continuous integration
- [ ] Code quality tools
- [ ] Performance monitoring

#### Security Enhancements
- [ ] Two-factor authentication
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Security audit

#### API Development
- [ ] RESTful API expansion
- [ ] GraphQL support
- [ ] API documentation
- [ ] Third-party integrations

### 3. Community Features

#### Documentation
- [ ] Video tutorials
- [ ] Interactive demos
- [ ] Developer documentation
- [ ] Community forum

#### Extensions
- [ ] Plugin system
- [ ] Theme marketplace
- [ ] Third-party integrations
- [ ] Developer tools

---

## Conclusion

New CMS represents a comprehensive, modern approach to content management with its visual page builder, flexible widget system, and robust architecture. The system provides an excellent balance between ease of use for content creators and extensibility for developers.

### Key Strengths

1. **User-Friendly Interface**: Intuitive drag-and-drop page builder
2. **Flexible Architecture**: Modular widget and control systems
3. **Modern Technology**: Current web standards and best practices
4. **Security Focus**: Comprehensive security implementation
5. **Extensible Design**: Easy to extend with custom widgets and themes

### Ideal Use Cases

- Small to medium business websites
- Blog platforms and content sites
- Portfolio and personal websites
- Landing pages and marketing sites
- Corporate and institutional websites

### Next Steps

1. **Implementation**: Follow installation guide for deployment
2. **Customization**: Develop custom widgets and themes
3. **Integration**: Connect with existing systems
4. **Optimization**: Fine-tune for specific use cases
5. **Expansion**: Leverage extensibility for growth

New CMS provides a solid foundation for building modern, dynamic websites with the flexibility to grow and adapt to changing requirements.

---

**Documentation Version:** 1.0  
**Last Updated:** December 2024  
**Maintained By:** New CMS Development Team

For additional information, updates, and community support, please refer to the project repository and documentation files.
#### File Upload Security
- **Type Validation**: MIME type and extension checking
- **Size Limits**: Configurable file size restrictions
- **Filename Sanitization**: Unique filename generation
- **Path Validation**: Prevent directory traversal

#### Input Sanitization
- **HTML Escaping**: Output encoding for XSS prevention
- **JSON Validation**: Proper JSON parsing with error handling
- **Type Checking**: Strict type validation
- **Length Limits**: Input length restrictions

### 3. Access Control

#### Route Protection
- **Admin Routes**: Session-based authentication
- **API Endpoints**: Token-based authentication
- **File Access**: .htaccess protection for sensitive files

#### Permission System
- **Role-Based**: User role management
- **Resource Access**: Granular permissions
- **Action Logging**: Audit trail for admin actions

### 4. Data Protection

#### Environment Security
- **.env Protection**: .htaccess prevents access
- **Secret Management**: Secure configuration storage
- **Database Credentials**: Encrypted connection strings

#### Error Handling
- **Production Mode**: Disable error display
- **Logging**: Secure error logging
- **Generic Messages**: User-friendly error pages

### 5. Security Headers

#### HTTP Headers
```apache
# .htaccess security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
```

#### File Protection
```apache
# Protect sensitive files
<Files ".env">
    Order allow,deny
    Deny from all
</Files>

<Files "*.log">
    Order allow,deny
    Deny from all
</Files>
```

---

## Installation & Setup

### 1. System Requirements

#### Server Requirements
- **PHP**: Version 7.0 or higher
- **Database**: MySQL 5.7+ or MariaDB 10.2+
- **Web Server**: Apache with mod_rewrite enabled
- **Memory**: Minimum 128MB PHP memory limit
- **Disk Space**: 100MB minimum, more for media

#### PHP Extensions
- **PDO**: Database connectivity
- **PDO MySQL**: MySQL driver
- **JSON**: JSON manipulation
- **GD**: Image processing
- **Fileinfo**: File type detection
- **mbstring**: Multibyte string support

### 2. Installation Steps

#### Step 1: Download and Extract
```bash
# Clone repository or download ZIP
cd /var/www/html
git clone <repository-url> new-cms
cd new-cms
```

#### Step 2: Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env
```

#### Step 3: Set Permissions
```bash
# Set proper permissions
chmod 755 images/
chmod 755 assets/uploads/
chmod 644 .env
```

#### Step 4: Create Database
```bash
# Run database setup
php setup_database.php

# Update schema
php update_database.php

# Setup media gallery
php setup_gallery.php

# Setup headers/footers
php admin/setup_tables.php
```

#### Step 5: Configure Web Server

##### Apache Configuration
```apache
<VirtualHost *:80>
    DocumentRoot /var/www/html/new-cms
    ServerName your-domain.com
    
    <Directory /var/www/html/new-cms>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

##### Enable .htaccess
```bash
# Enable mod_rewrite
a2enmod rewrite

# Restart Apache
systemctl restart apache2
```

### 3. Verification Steps

#### Database Verification
```sql
-- Check tables exist
SHOW TABLES;

-- Verify admin user
SELECT * FROM users;

-- Check settings
SELECT * FROM settings;
```

#### Functionality Testing
1. **Admin Access**: Navigate to `/admin/`
2. **Login**: Use default credentials (admin/password)
3. **Create Page**: Test page creation
4. **Page Builder**: Verify drag-and-drop functionality
5. **Frontend**: Check page rendering
6. **Media Upload**: Test file upload

### 4. Post-Installation Configuration

#### Security Configuration
1. **Change Default Password**: Update admin credentials
2. **Configure HTTPS**: Install SSL certificate
3. **Update .env**: Set production values
4. **File Permissions**: Verify secure permissions

#### Performance Optimization
1. **Enable Caching**: Configure PHP OPcache
2. **Database Optimization**: Add indexes
3. **Asset Compression**: Enable gzip compression
4. **CDN Setup**: Configure static asset CDN

---

## Development Guidelines

### 1. Coding Standards

#### PHP Standards
- **PSR-12**: Follow PSR-12 coding standards
- **Documentation**: PHPDoc blocks for all functions
- **Error Handling**: Exception-based error management
- **Security**: Always use prepared statements

#### JavaScript Standards
- **ES6+**: Use modern JavaScript features
- **Classes**: Use ES6 classes for components
- **Events**: Implement event-driven patterns
- **Documentation**: JSDoc comments for functions

#### CSS Standards
- **BEM Methodology**: Block-Element-Modifier naming
- **Mobile-First**: Responsive design approach
- **CSS Variables**: Use custom properties for theming
- **Performance**: Optimize for critical rendering path

### 2. Best Practices

#### Database Operations
```php
// Good: Prepared statements
$stmt = $pdo->prepare("SELECT * FROM pages WHERE id = ?");
$stmt->execute([$pageId]);

// Bad: Direct interpolation (SQL injection risk)
$sql = "SELECT * FROM pages WHERE id = " . $pageId;
```

#### File Handling
```php
// Good: Validate and sanitize
$allowedTypes = ['image/jpeg', 'image/png'];
if (in_array($file['type'], $allowedTypes)) {
    // Process file
}

// Bad: No validation
move_uploaded_file($file['tmp_name'], $uploadPath);
```

#### Frontend Development
```javascript
// Good: Event delegation
$(document).on('click', '.widget-card', function() {
    // Handle click
});

// Bad: Direct binding (doesn't work for dynamic content)
$('.widget-card').on('click', function() {
    // Handle click
});
```

### 3. Extension Development

#### Creating Widgets
1. **Extend WidgetBase**: Inherit from base class
2. **Implement Required Methods**: getName(), getTitle(), render()
3. **Register Controls**: Define widget settings
4. **Add to Page Builder**: Include script and register

#### Creating Controls
1. **Extend BaseControl**: Inherit from base class
2. **Implement Rendering**: Create HTML output
3. **Setup Listeners**: Handle user interactions
4. **Register Type**: Add to control manager

#### Theme Development
1. **Create Directory**: `/theme/theme-name/`
2. **Add Stylesheet**: Create `style.css`
3. **Test Responsiveness**: Ensure mobile compatibility
4. **Document Features**: Provide usage instructions

### 4. Testing Guidelines

#### Development Testing
1. **Local Environment**: Use XAMPP/MAMP for local testing
2. **Browser Testing**: Test in multiple browsers
3. **Device Testing**: Test on mobile devices
4. **Performance Testing**: Monitor load times

#### Quality Assurance
1. **Code Review**: Peer review for all changes
2. **Security Testing**: Check for vulnerabilities
3. **Accessibility**: Ensure WCAG compliance
4. **User Testing**: Get feedback from users

---

## Troubleshooting

### 1. Common Issues

#### Database Connection Errors
**Symptoms**: "Database connection failed" errors

**Solutions**:
1. Check `.env` file exists and is readable
2. Verify database credentials are correct
3. Ensure database server is running
4. Check database exists and user has permissions

```bash
# Test database connection
mysql -h localhost -u root -p new_cms
```

#### Page Not Found (404)
**Symptoms**: Pages return 404 errors

**Solutions**:
1. Verify `.htaccess` is being processed
2. Check mod_rewrite is enabled
3. Confirm slug exists in database
4. Ensure page status is 'published'

```bash
# Check Apache modules
apache2ctl -M | grep rewrite
```

#### Widget Loading Issues
**Symptoms**: Widgets not appearing in page builder

**Solutions**:
1. Check browser console for JavaScript errors
2. Verify widget script paths are correct
3. Ensure widgets are properly registered
4. Check for conflicting JavaScript

#### Media Upload Failures
**Symptoms**: File uploads not working

**Solutions**:
1. Check directory permissions (755)
2. Verify PHP upload limits
3. Confirm file type is allowed
4. Check available disk space

```php
// Check PHP upload settings
echo ini_get('upload_max_filesize');
echo ini_get('post_max_size');
```

### 2. Debugging Tools

#### PHP Debugging
```php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log errors to file
ini_set('log_errors', 1);
ini_set('error_log', '/path/to/error.log');
```

#### JavaScript Debugging
```javascript
// Enable debug mode
window.DEBUG = true;

// Console logging
if (window.DEBUG) {
    console.log('Debug info:', data);
}
```

#### Database Debugging
```php
// Enable query logging
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Log queries
$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
```

### 3. Performance Issues

#### Slow Page Loads
**Causes**: Large images, unoptimized database queries

**Solutions**:
1. Optimize images (compress, proper dimensions)
2. Add database indexes
3. Enable caching
4. Minify CSS/JavaScript

#### Memory Issues
**Causes**: Large file uploads, memory leaks

**Solutions**:
1. Increase PHP memory limit
2. Optimize image processing
3. Implement file streaming
4. Monitor memory usage

---

## Future Roadmap

### 1. Planned Features

#### Enhanced User Management
- [ ] Multi-user support with roles
- [ ] User registration system
- [ ] Permission-based access control
- [ ] User profiles and preferences

#### Advanced Content Features
- [ ] Form builder with submissions
- [ ] E-commerce integration
- [ ] Membership system
- [ ] Content scheduling

#### Design System Improvements
- [ ] Global colors and fonts
- [ ] Design system library
- [ ] Template library
- [ ] Advanced typography controls

#### Performance Enhancements
- [ ] Caching system implementation
- [ ] CDN integration
- [ ] Image optimization
- [ ] Lazy loading

#### SEO and Marketing
- [ ] SEO optimization tools
- [ ] Analytics integration
- [ ] Social media integration
- [ ] Email marketing system

### 2. Technical Improvements

#### Code Quality
- [ ] Unit testing implementation
- [ ] Continuous integration
- [ ] Code quality tools
- [ ] Performance monitoring

#### Security Enhancements
- [ ] Two-factor authentication
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Security audit

#### API Development
- [ ] RESTful API expansion
- [ ] GraphQL support
- [ ] API documentation
- [ ] Third-party integrations

### 3. Community Features

#### Documentation
- [ ] Video tutorials
- [ ] Interactive demos
- [ ] Developer documentation
- [ ] Community forum

#### Extensions
- [ ] Plugin system
- [ ] Theme marketplace
- [ ] Third-party integrations
- [ ] Developer tools

---

## Conclusion

New CMS represents a comprehensive, modern approach to content management with its visual page builder, flexible widget system, and robust architecture. The system provides an excellent balance between ease of use for content creators and extensibility for developers.

### Key Strengths

1. **User-Friendly Interface**: Intuitive drag-and-drop page builder
2. **Flexible Architecture**: Modular widget and control systems
3. **Modern Technology**: Current web standards and best practices
4. **Security Focus**: Comprehensive security implementation
5. **Extensible Design**: Easy to extend with custom widgets and themes

### Ideal Use Cases

- Small to medium business websites
- Blog platforms and content sites
- Portfolio and personal websites
- Landing pages and marketing sites
- Corporate and institutional websites

### Next Steps

1. **Implementation**: Follow installation guide for deployment
2. **Customization**: Develop custom widgets and themes
3. **Integration**: Connect with existing systems
4. **Optimization**: Fine-tune for specific use cases
5. **Expansion**: Leverage extensibility for growth

New CMS provides a solid foundation for building modern, dynamic websites with the flexibility to grow and adapt to changing requirements.

---

**Documentation Version:** 1.0  
**Last Updated:** December 2024  
**Maintained By:** New CMS Development Team

For additional information, updates, and community support, please refer to the project repository and documentation files.
