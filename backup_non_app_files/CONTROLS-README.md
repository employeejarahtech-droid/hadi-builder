# Elementor-Style Control System

A comprehensive, production-ready control system inspired by Elementor's page builder architecture. This system provides a robust foundation for building dynamic, responsive page builder controls with live preview, conditional logic, validation, and proper state management.

## 🎯 Features

### Core Features
- ✅ **BaseControl Architecture** - All controls extend a common base class
- ✅ **Event System** - Built-in event emitter for reactive updates
- ✅ **Responsive Controls** - Desktop/Tablet/Mobile device switching
- ✅ **Conditional Logic** - Show/hide controls based on other values
- ✅ **Validation Framework** - Built-in validators (required, email, URL, range, etc.)
- ✅ **State Management** - Centralized control manager
- ✅ **Serialization** - Save/load control states
- ✅ **Live Preview** - Real-time preview updates

### Control Types (Available)
- ✅ TEXT - Single-line text input (refactored)
- ⏳ SELECT - Dropdown selection (pending refactor)
- ⏳ SLIDER - Range slider with units (pending refactor)
- ⏳ COLOR - Color picker (pending refactor)
- ⏳ MEDIA - Image/file upload (pending refactor)
- ⏳ ICON - Icon picker (pending refactor)
- ⏳ TEXTAREA - Multi-line text (pending refactor)
- ⏳ REPEATER - Repeatable field groups (pending refactor)

## 📁 File Structure

```
new-cms/
├── assets/
│   └── fields/
│       ├── utils/
│       │   ├── EventEmitter.js      # Event system
│       │   ├── Validator.js         # Validation rules
│       │   └── Conditions.js        # Conditional logic
│       ├── BaseControl.js           # Base control class
│       ├── ControlManager.js        # Control manager
│       ├── text-new.js              # Refactored TEXT control
│       └── [other controls...]      # Original controls
└── demo-controls.html               # Live demo
```

## 🚀 Quick Start

### 1. Include Required Files

```html
<!-- jQuery (required) -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- Utilities -->
<script src="assets/fields/utils/EventEmitter.js"></script>
<script src="assets/fields/utils/Validator.js"></script>
<script src="assets/fields/utils/Conditions.js"></script>

<!-- Core -->
<script src="assets/fields/BaseControl.js"></script>
<script src="assets/fields/ControlManager.js"></script>

<!-- Controls -->
<script src="assets/fields/text-new.js"></script>
<!-- Add more controls as needed -->
```

### 2. Initialize Control Manager

```javascript
const controlManager = window.elementorControlManager;
controlManager.init();
```

### 3. Define Controls

```javascript
const controlsConfig = [
    {
        id: 'heading_text',
        type: 'text',
        label: 'Heading Text',
        default_value: 'Welcome',
        placeholder: 'Enter heading...',
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
```

### 4. Render Controls

```javascript
controlManager.renderControls('#container', controlsConfig);
```

### 5. Listen to Changes

```javascript
controlManager.on('change', (id, newValue, oldValue, allValues) => {
    console.log(`Control ${id} changed:`, newValue);
    updatePreview(allValues);
});
```

## 📖 API Documentation

### BaseControl

Base class that all controls extend.

#### Constructor Options

```javascript
new BaseControl(id, {
    // Core
    label: 'Control Label',
    description: 'Help text',
    default_value: 'default',
    value: 'current value',
    
    // UI
    label_block: true,              // Block-level label
    show_label: true,               // Show/hide label
    separator: 'before',            // 'before', 'after', 'none', 'default'
    classes: ['custom-class'],      // Additional CSS classes
    
    // Conditional Logic
    condition: {
        name: 'other_control',
        operator: '===',
        value: 'show'
    },
    
    // Responsive
    responsive: true,               // Enable device switching
    tablet_value: 'tablet value',   // Tablet-specific value
    mobile_value: 'mobile value',   // Mobile-specific value
    
    // Validation
    required: true,
    validators: [
        Validator.required(),
        Validator.email()
    ],
    
    // Callbacks
    onChange: (newValue, oldValue) => {},
    onInit: () => {}
});
```

#### Methods

```javascript
// Get/Set Value
control.getValue()
control.setValue(newValue, silent = false)

// Validation
control.validate()                  // Returns boolean
control.errors                      // Array of error messages

// Visibility
control.setVisibility(true/false)
control.checkConditions(formValues)

// Responsive
control.switchDevice('desktop'|'tablet'|'mobile')
control.getDeviceValue('desktop')

// State
control.serialize()                 // Get serialized data
control.deserialize(data)           // Restore from data
control.destroy()                   // Cleanup

// Events
control.on('change', callback)
control.emit('custom-event', data)
```

### ControlManager

Manages all control instances.

#### Methods

```javascript
// Control Management
controlManager.createControl(id, type, options)
controlManager.registerControl(controlInstance)
controlManager.getControl(id)
controlManager.removeControl(id)

// Values
controlManager.getValue(id)
controlManager.setValue(id, value, silent)
controlManager.getValues()          // Get all values
controlManager.setValues(values)    // Set multiple values

// Validation
controlManager.validateAll()        // Returns boolean
controlManager.getErrors()          // Get all errors

// Rendering
controlManager.renderControls(container, config)

// State
controlManager.serialize()
controlManager.deserialize(data)
controlManager.reset()              // Reset to defaults
controlManager.destroy()            // Cleanup all

// Events
controlManager.on('change', callback)
controlManager.on('change:control_id', callback)
```

### Validator

Built-in validation rules.

```javascript
// Available Validators
Validator.required(message)
Validator.email(message)
Validator.url(message)
Validator.number(message)
Validator.hexColor(message)
Validator.min(minValue, message)
Validator.max(maxValue, message)
Validator.range(min, max, message)
Validator.minLength(length, message)
Validator.maxLength(length, message)
Validator.pattern(regex, message)
Validator.custom(fn, message)

// Usage
validators: [
    Validator.required('This field is required'),
    Validator.email('Invalid email format'),
    Validator.minLength(3, 'Must be at least 3 characters')
]
```

### Conditions

Conditional logic operators.

```javascript
// Single Condition
condition: {
    name: 'field_name',
    operator: '===',        // or 'is'
    value: 'expected_value'
}

// Available Operators
'===', 'is'              // Equal
'!==', 'is_not'          // Not equal
'contains'               // Array/string contains
'not_contains'           // Array/string doesn't contain
'in'                     // Value in array
'not_in'                 // Value not in array
'>', 'greater'           // Greater than
'>=', 'greater_equal'    // Greater or equal
'<', 'less'              // Less than
'<=', 'less_equal'       // Less or equal
'empty'                  // Is empty
'not_empty'              // Is not empty
'between'                // Between two values

// Multiple Conditions
conditions: {
    relation: 'and',     // or 'or'
    terms: [
        { name: 'field1', operator: '===', value: 'yes' },
        { name: 'field2', operator: '>', value: 10 }
    ]
}
```

## 🎨 Creating Custom Controls

```javascript
class CUSTOM extends BaseControl {
    constructor(id, args = {}) {
        super(id, args);
        // Add custom properties
        this.customProp = args.custom_prop || 'default';
    }

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
            const newValue = e.target.value;
            this.setValue(newValue);
        });
    }

    getValue() {
        return $(`#${this.id}`).val() || this.value;
    }

    setValue(newValue, silent = false) {
        const oldValue = this.value;
        this.value = newValue;
        
        $(`#${this.id}`).val(newValue);
        
        if (!silent && oldValue !== newValue) {
            this.handleChange(newValue, oldValue);
        }
    }
}

// Register with control manager
controlManager.registerControlType('custom', CUSTOM);
```

## 🧪 Demo

Open `demo-controls.html` in your browser to see the control system in action:

- Live preview updates
- Conditional field visibility
- Responsive device switching
- Validation with error messages
- JSON serialization

## 🔧 Next Steps

### Immediate Tasks
1. Refactor remaining controls (SELECT, SLIDER, COLOR, etc.)
2. Fix TEXTAREA performance issue (remove setInterval)
3. Create control groups and tabs
4. Build widget base class

### Future Enhancements
- Undo/redo system
- Drag-and-drop for repeaters
- Dynamic tags support
- Global colors/fonts
- Import/export presets

## 📝 Migration Guide

### From Old Controls to New

**Old Way:**
```javascript
const html = TEXT.init(['my_text', {
    label: 'Text',
    value: 'Hello'
}]);
$('#container').append(html);
```

**New Way:**
```javascript
controlManager.renderControls('#container', [{
    id: 'my_text',
    type: 'text',
    label: 'Text',
    value: 'Hello',
    onChange: (newValue) => {
        // Handle change
    }
}]);
```

## 🐛 Known Issues

1. **TEXTAREA.js** - Global setInterval (lines 122-138) causes performance issues
2. **SLIDER.js** - Inconsistent init signature
3. **COLOR.js** - Appends to body instead of container
4. **MULTI-REPEATER.js** - Hardcoded field names, not generic

## 📄 License

This control system is part of the new-cms project.

## 🤝 Contributing

When creating new controls:
1. Extend `BaseControl`
2. Implement `render()`, `getValue()`, `setValue()`
3. Call `super.setupListeners()` in `setupListeners()`
4. Register with `controlManager.registerControlType()`

---

**Built with inspiration from Elementor's control architecture** 🚀
