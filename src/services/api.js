// API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
const API_KEY = process.env.REACT_APP_API_KEY;

/**
 * Generate a travel report using the AI service
 * @param {Object} data - The form data
 * @returns {Promise} - The AI generated report
 */
export const generateAIReport = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

/**
 * API Response structure:
 * {
 *   success: boolean,
 *   data: {
 *     title: string,
 *     introduction: string,
 *     sections: Array<{
 *       title: string,
 *       content: string
 *     }>
 *   },
 *   error?: string
 * }
 */ 