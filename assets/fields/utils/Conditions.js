/**
 * Conditions - Conditional logic evaluator
 * Handles show/hide logic based on other control values
 */
class Conditions {
    /**
     * Evaluate a condition
     * @param {object} condition - Condition object
     * @param {object} values - Current form values
     * @returns {boolean} Whether condition is met
     */
    static evaluate(condition, values) {
        if (!condition) return true;

        // Handle multiple conditions with 'relation'
        if (condition.relation) {
            return this.evaluateMultiple(condition, values);
        }

        // Single condition
        return this.evaluateSingle(condition, values);
    }

    /**
     * Evaluate multiple conditions
     * @param {object} conditions - Conditions object with 'relation' and 'terms'
     * @param {object} values - Current form values
     * @returns {boolean}
     */
    static evaluateMultiple(conditions, values) {
        const { relation = 'and', terms = [] } = conditions;

        if (terms.length === 0) return true;

        const results = terms.map(term => this.evaluateSingle(term, values));

        if (relation === 'or') {
            return results.some(result => result === true);
        }

        // Default to 'and'
        return results.every(result => result === true);
    }

    /**
     * Evaluate a single condition
     * @param {object} condition - Single condition object
     * @param {object} values - Current form values
     * @returns {boolean}
     */
    static evaluateSingle(condition, values) {
        const { name, operator, value: conditionValue } = condition;

        if (!name || !operator) {
            console.warn('Invalid condition:', condition);
            return true;
        }

        const fieldValue = values[name];

        switch (operator) {
            case '===':
            case 'is':
                return fieldValue === conditionValue;

            case '!==':
            case 'is_not':
                return fieldValue !== conditionValue;

            case 'contains':
                if (Array.isArray(fieldValue)) {
                    return fieldValue.includes(conditionValue);
                }
                if (typeof fieldValue === 'string') {
                    return fieldValue.includes(conditionValue);
                }
                return false;

            case 'not_contains':
                if (Array.isArray(fieldValue)) {
                    return !fieldValue.includes(conditionValue);
                }
                if (typeof fieldValue === 'string') {
                    return !fieldValue.includes(conditionValue);
                }
                return true;

            case 'in':
                if (!Array.isArray(conditionValue)) {
                    console.warn('Condition value must be array for "in" operator');
                    return false;
                }
                return conditionValue.includes(fieldValue);

            case 'not_in':
                if (!Array.isArray(conditionValue)) {
                    console.warn('Condition value must be array for "not_in" operator');
                    return true;
                }
                return !conditionValue.includes(fieldValue);

            case '>':
            case 'greater':
                return parseFloat(fieldValue) > parseFloat(conditionValue);

            case '>=':
            case 'greater_equal':
                return parseFloat(fieldValue) >= parseFloat(conditionValue);

            case '<':
            case 'less':
                return parseFloat(fieldValue) < parseFloat(conditionValue);

            case '<=':
            case 'less_equal':
                return parseFloat(fieldValue) <= parseFloat(conditionValue);

            case 'empty':
                return !fieldValue || fieldValue === '' ||
                    (Array.isArray(fieldValue) && fieldValue.length === 0);

            case 'not_empty':
                return !(!fieldValue || fieldValue === '' ||
                    (Array.isArray(fieldValue) && fieldValue.length === 0));

            case 'between':
                if (!Array.isArray(conditionValue) || conditionValue.length !== 2) {
                    console.warn('Condition value must be array of 2 for "between" operator');
                    return false;
                }
                const numValue = parseFloat(fieldValue);
                return numValue >= parseFloat(conditionValue[0]) &&
                    numValue <= parseFloat(conditionValue[1]);

            default:
                console.warn('Unknown operator:', operator);
                return true;
        }
    }

    /**
     * Create a condition object
     * @param {string} name - Field name
     * @param {string} operator - Comparison operator
     * @param {*} value - Value to compare against
     * @returns {object} Condition object
     */
    static create(name, operator, value) {
        return { name, operator, value };
    }

    /**
     * Create multiple conditions with relation
     * @param {string} relation - 'and' or 'or'
     * @param {array} terms - Array of condition objects
     * @returns {object} Conditions object
     */
    static createMultiple(relation, terms) {
        return { relation, terms };
    }
}
