/**
 * Advanced Percentage Calculator
 * A comprehensive tool for all percentage calculations
 */

// Store calculation history
let calculationHistory = [];
const MAX_HISTORY = 10;

// Function to calculate percentages based on calculator type
function calculate(calculatorType) {
    let result, explanation;
    
    switch (calculatorType) {
        case 1:
            // What is X% of Y?
            const percent1 = parseFloat(document.getElementById('percent1').value);
            const value1 = parseFloat(document.getElementById('value1').value);
            
            if (isNaN(percent1) || isNaN(value1)) {
                showError('result1', 'Please enter valid numbers');
                return;
            }
            
            result = (percent1 / 100) * value1;
            document.getElementById('result1').value = formatNumber(result);
            explanation = `${percent1}% of ${value1} = ${formatNumber(result)}`;
            
            // Add calculation to history
            addToHistory({
                type: 'Percentage of Value',
                inputs: { percent: percent1, value: value1 },
                result: result,
                explanation: explanation
            });
            break;
            
        case 2:
            // X is what percent of Y?
            const value2 = parseFloat(document.getElementById('value2').value);
            const total2 = parseFloat(document.getElementById('total2').value);
            
            if (isNaN(value2) || isNaN(total2)) {
                showError('result2', 'Please enter valid numbers');
                return;
            }
            
            if (total2 === 0) {
                showError('result2', 'Cannot divide by zero');
                return;
            }
            
            result = (value2 / total2) * 100;
            document.getElementById('result2').value = formatNumber(result);
            explanation = `${value2} is ${formatNumber(result)}% of ${total2}`;
            
            // Add calculation to history
            addToHistory({
                type: 'Value as Percentage',
                inputs: { value: value2, total: total2 },
                result: result,
                explanation: explanation
            });
            break;
            
        case 3:
            // Percentage increase/decrease from X to Y
            const from3 = parseFloat(document.getElementById('from3').value);
            const to3 = parseFloat(document.getElementById('to3').value);
            
            if (isNaN(from3) || isNaN(to3)) {
                showError('result3', 'Please enter valid numbers');
                return;
            }
            
            if (from3 === 0) {
                // Handle special case where from value is 0
                if (to3 === 0) {
                    result = 0; // 0% change when both values are 0
                } else {
                    // Cannot calculate percentage increase from 0, show infinity or a very large number
                    showError('result3', 'Cannot calculate percentage change from zero');
                    return;
                }
            } else {
                result = ((to3 - from3) / Math.abs(from3)) * 100;
            }
            
            document.getElementById('result3').value = formatNumber(result);
            
            // Determine if it's an increase or decrease
            const changeType = result >= 0 ? 'increase' : 'decrease';
            explanation = `${Math.abs(formatNumber(result))}% ${changeType} from ${from3} to ${to3}`;
            
            // Add calculation to history
            addToHistory({
                type: 'Percentage Change',
                inputs: { from: from3, to: to3 },
                result: result,
                explanation: explanation
            });
            break;
    }
    
    // Update analytics for popular calculations
    updateAnalytics(calculatorType);
}

// Helper function to format numbers nicely
function formatNumber(num) {
    // Round to 2 decimal places
    const rounded = Math.round(num * 100) / 100;
    
    // Convert to string with fixed 2 decimal places if needed
    if (Number.isInteger(rounded)) {
        return rounded;
    } else {
        return rounded.toFixed(2);
    }
}

// Show error message
function showError(resultFieldId, message) {
    const field = document.getElementById(resultFieldId);
    field.value = 'Error';
    field.classList.add('error');
    
    // Create or update error tooltip
    let tooltip = document.getElementById(`${resultFieldId}-tooltip`);
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = `${resultFieldId}-tooltip`;
        tooltip.className = 'error-tooltip';
        field.parentNode.appendChild(tooltip);
    }
    
    tooltip.textContent = message;
    tooltip.style.display = 'block';
    
    // Hide error after 3 seconds
    setTimeout(() => {
        field.classList.remove('error');
        tooltip.style.display = 'none';
    }, 3000);
}

// Add calculation to history
function addToHistory(calculation) {
    // Add timestamp
    calculation.timestamp = new Date();
    
    // Add to beginning of array
    calculationHistory.unshift(calculation);
    
    // Limit history size
    if (calculationHistory.length > MAX_HISTORY) {
        calculationHistory.pop();
    }
    
    // Save to localStorage if available
    try {
        localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
    } catch (e) {
        console.log('Could not save to localStorage', e);
    }
}

// Track popular calculations for analytics
function updateAnalytics(calculatorType) {
    try {
        // Get existing analytics or initialize new ones
        let analytics = JSON.parse(localStorage.getItem('calculatorAnalytics')) || {
            type1Count: 0,
            type2Count: 0,
            type3Count: 0,
            totalCalculations: 0
        };
        
        // Update counts
        analytics.totalCalculations++;
        analytics[`type${calculatorType}Count`]++;
        
        // Save updated analytics
        localStorage.setItem('calculatorAnalytics', JSON.stringify(analytics));
        
        // If this were a real application, we might send analytics to a server
        // sendAnalyticsToServer(analytics);
    } catch (e) {
        console.log('Could not update analytics', e);
    }
}

// Initialize dynamic structured data for SEO
function initStructuredData() {
    // This function would generate and inject additional structured data
    // based on page content if needed beyond what's already in the HTML.
    
    // In a real-world scenario, this might include:
    // - Dynamically adding review markup if reviews exist
    // - Adding breadcrumb structured data
    // - Adding HowTo structured data for the calculator instructions
    // - Creating FAQ markup from dynamic content
    
    // For this static page, we already have the necessary JSON-LD in the HTML
    console.log('Structured data initialized');
}

// Add event listeners for keyboard navigation
document.addEventListener('DOMContentLoaded', function() {
    // Load calculation history from localStorage if available
    try {
        const savedHistory = localStorage.getItem('calculationHistory');
        if (savedHistory) {
            calculationHistory = JSON.parse(savedHistory);
        }
    } catch (e) {
        console.log('Could not load history from localStorage', e);
    }
    
    // Add enter key functionality to all inputs
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        // Add event listener for Enter key
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                // Find which calculator section this input belongs to
                const section = this.closest('.calculator-section');
                const calculatorIndex = Array.from(document.querySelectorAll('.calculator-section')).indexOf(section) + 1;
                
                // Calculate
                calculate(calculatorIndex);
            }
        });
        
        // Add event listener for input validation - only allow numbers
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9.-]/g, '');
        });
        
        // Clear error state when user starts typing
        input.addEventListener('focus', function() {
            const resultField = this.closest('.calculator-section').querySelector('.result-field');
            if (resultField) {
                resultField.classList.remove('error');
                
                // Hide error tooltip if exists
                const tooltip = document.getElementById(`${resultField.id}-tooltip`);
                if (tooltip) {
                    tooltip.style.display = 'none';
                }
            }
        });
    });
    
    // Add paste event listener to sanitize pasted content
    inputs.forEach(input => {
        input.addEventListener('paste', function(e) {
            // Get pasted data
            let pastedData = (e.clipboardData || window.clipboardData).getData('text');
            
            // Remove any non-numeric characters except decimal point and minus sign
            pastedData = pastedData.replace(/[^0-9.-]/g, '');
            
            // Update the input value with sanitized data
            setTimeout(() => {
                this.value = pastedData;
            }, 0);
            
            // Prevent default paste behavior
            e.preventDefault();
        });
    });
    
    // Initialize structured data dynamically based on the page
    initStructuredData();
}); 