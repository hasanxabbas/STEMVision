import API_BASE_URL from './api';

/**
 * Uploads a STEM screenshot and category to request AI analysis from the backend.
 * @param {File} imageFile - The file object from the file input/drop zone.
 * @param {string} category - STEM category: 'diagram', 'equation', 'graph', 'code', 'whiteboard'.
 * @returns {Promise<Object>} - The JSON response payload with parsed analysis.
 */
export async function analyzeSTEMContent(imageFile, category) {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('category', category);

  const response = await fetch(`${API_BASE_URL}/ai/analyze`, {
    method: 'POST',
    body: formData,
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to complete STEM analysis.');
  }

  return responseData;
}
