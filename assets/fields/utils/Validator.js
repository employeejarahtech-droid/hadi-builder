/**
 * Validator - Validation rules for controls
 * Provides common validation patterns
 */
class Validator {
    /**
     * Validate required field
     */
    static required(message = 'This field is required') {
        return (value) => {
            const isValid = value !== null && value !== undefined && value !== '';
            return {
                valid: isValid,
                message: isValid ? '' : message
            };
        };
    }

    /**
     * Validate email format
     */
    static email(message = 'Please enter a valid email address') {
        return (value) => {
            if (!value) return { valid: true, message: '' };
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValid = emailRegex.test(value);
            return {
                valid: isValid,
                message: isValid ? '' : message
            };
        };
    }

    /**
     * Validate URL format
     */
    static url(message = 'Please enter a valid URL') {
        return (value) => {
            if (!value) return { valid: true, message: '' };
            try {
                new URL(value);
                return { valid: true, message: '' };
            } catch {
                return { valid: false, message };
            }
        };
    }

    /**
     * Validate number range
     */
    static range(min, max, message = null) {
        return (value) => {
            if (value === '' || value === null || value === undefined) {
                return { valid: true, message: '' };
            }
            const num = parseFloat(value);
            const isValid = !isNaN(num) && num >= min && num <= max;
            const defaultMessage = `Value must be between ${min} and ${max}`;
            return {
                valid: isValid,
                message: isValid ? '' : (message || defaultMessage)
            };
        };
    }

    /**
     * Validate minimum value
     */
    static min(minValue, message = null) {
        return (value) => {
            if (value === '' || value === null || value === undefined) {
                return { valid: true, message: '' };
            }
            const num = parseFloat(value);
            const isValid = !isNaN(num) && num >= minValue;
            const defaultMessage = `Value must be at least ${minValue}`;
            return {
                valid: isValid,
                message: isValid ? '' : (message || defaultMessage)
            };
        };
    }

    /**
     * Validate maximum value
     */
    static max(maxValue, message = null) {
        return (value) => {
            if (value === '' || value === null || value === undefined) {
                return { valid: true, message: '' };
            }
            const num = parseFloat(value);
            const isValid = !isNaN(num) && num <= maxValue;
            const defaultMessage = `Value must be at most ${maxValue}`;
            return {
                valid: isValid,
                message: isValid ? '' : (message || defaultMessage)
            };
        };
    }

    /**
     * Validate minimum length
     */
    static minLength(minLen, message = null) {
        return (value) => {
            if (!value) return { valid: true, message: '' };
            const isValid = value.length >= minLen;
            const defaultMessage = `Must be at least ${minLen} characters`;
            return {
                valid: isValid,
                message: isValid ? '' : (message || defaultMessage)
            };
        };
    }

    /**
     * Validate maximum length
     */
    static maxLength(maxLen, message = null) {
        return (value) => {
            if (!value) return { valid: true, message: '' };
            const isValid = value.length <= maxLen;
            const defaultMessage = `Must be at most ${maxLen} characters`;
            return {
                valid: isValid,
                message: isValid ? '' : (message || defaultMessage)
            };
        };
    }

    /**
     * Validate against regex pattern
     */
    static pattern(regex, message = 'Invalid format') {
        return (value) => {
            if (!value) return { valid: true, message: '' };
            const isValid = regex.test(value);
            return {
                valid: isValid,
                message: isValid ? '' : message
            };
        };
    }

    /**
     * Custom validator function
     */
    static custom(validatorFn, message = 'Validation failed') {
        return (value) => {
            try {
                const result = validatorFn(value);
                if (typeof result === 'boolean') {
                    return {
                        valid: result,
                        message: result ? '' : message
                    };
                }
                return result;
            } catch (error) {
                console.error('Custom validator error:', error);
                return { valid: false, message: 'Validation error' };
            }
        };
    }

    /**
     * Validate hex color
     */
    static hexColor(message = 'Please enter a valid hex color') {
        return (value) => {
            if (!value) return { valid: true, message: '' };
            const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/;
            const isValid = hexRegex.test(value);
            return {
                valid: isValid,
                message: isValid ? '' : message
            };
        };
    }

    /**
     * Validate number
     */
    static number(message = 'Please enter a valid number') {
        return (value) => {
            if (value === '' || value === null || value === undefined) {
                return { valid: true, message: '' };
            }
            const isValid = !isNaN(parseFloat(value)) && isFinite(value);
            return {
                valid: isValid,
                message: isValid ? '' : message
            };
        };
    }
}
