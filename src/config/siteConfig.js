// Dhanam Organics - Central Site Configuration
// All brand information and owner WhatsApp details are managed here.
// To change the WhatsApp order recipient, simply edit the phoneNumber below.

export const SITE_CONFIG = {
  brandName: 'Dhanam Organics',
  brandNameTamil: 'தனம் ஆர்கானிக்ஸ்',
  tagline: 'பாரம்பரிய ஆரோக்கியம் • Pure Organic Heritage',
  subTagline: 'Authentic stone-milled traditional podis and pure organic foods from Tamil Nadu.',
  
  // OWNER WHATSAPP CONFIGURATION (Single source of truth)
  whatsapp: {
    phoneNumber: '918072727394', // Store owner WhatsApp number (Country code + 10 digits)
    displayNumber: '+91 918072727394',
    greetingPrefix: 'Hi, I would like to order:',
    supportHours: '9:00 AM - 8:00 PM (Mon - Sat)'
  },

  contact: {
    phone: '+91 8072727394',
    email: 'orders@dhanamorganics.com',
    location: 'Tamil Nadu, India',
    shippingNote: 'Fast shipping across Tamil Nadu, Bangalore & all over India'
  },

  socials: {
    instagram: '#',
    facebook: '#',
    youtube: '#'
  }
};

/**
 * Generate a pre-filled WhatsApp ordering URL
 * Format requested:
 * Hi, I would like to order:
 * Product: [PRODUCT NAME]
 * Quantity: [QUANTITY]
 */
export const getWhatsAppOrderUrl = (productName, quantity = 1, options = {}) => {
  const number = SITE_CONFIG.whatsapp.phoneNumber;
  const packInfo = options.weight ? ' (' + options.weight + ')' : '';
  const priceInfo = options.price ? ' - ₹' + (options.price * quantity) : '';
  
  const text = SITE_CONFIG.whatsapp.greetingPrefix + '\n\n' +
               'Product: ' + productName + packInfo + '\n' +
               'Quantity: ' + quantity + priceInfo + '\n\n' +
               'Please confirm availability and payment details. Thank you!';
  
  return 'https://wa.me/' + number + '?text=' + encodeURIComponent(text);
};

/**
 * Generate a multi-item WhatsApp order message
 */
export const getWhatsAppMultiOrderUrl = (items) => {
  const number = SITE_CONFIG.whatsapp.phoneNumber;
  if (!items || items.length === 0) {
    return 'https://wa.me/' + number + '?text=' + encodeURIComponent('Hi, I would like to inquire about Dhanam Organics products.');
  }

  let text = SITE_CONFIG.whatsapp.greetingPrefix + '\n';
  let grandTotal = 0;

  items.forEach((item, index) => {
    const qty = item.quantity || 1;
    const itemTotal = (item.price || 0) * qty;
    grandTotal += itemTotal;
    const weight = item.weight ? ' (' + item.weight + ')' : '';
    text += '\n' + (index + 1) + '. Product: ' + item.name + weight + '\n   Quantity: ' + qty + (item.price ? ' - ₹' + itemTotal : '');
  });

  if (grandTotal > 0) {
    text += '\n\nTotal Estimated Amount: ₹' + grandTotal;
  }
  text += '\n\nPlease let me know the payment and delivery procedure. Thank you!';

  return 'https://wa.me/' + number + '?text=' + encodeURIComponent(text);
};
