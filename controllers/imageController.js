export function backgroundRemove(req, res) {
  return res.status(501).json({ success: false, coming_soon: true, message: 'Background Remover is coming soon.' });
}

export function cropImage(req, res) {
  return res.status(501).json({ success: false, coming_soon: true, message: 'Crop Image is coming soon.' });
}

export function resizeImage(req, res) {
  return res.status(501).json({ success: false, coming_soon: true, message: 'Image Resize is coming soon.' });
}

export function applyFilters(req, res) {
  return res.status(501).json({ success: false, coming_soon: true, message: 'Image Filters is coming soon.' });
}
