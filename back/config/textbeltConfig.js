import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();


const TEXTBELT_API_URL = 'https://textbelt.com/text';
const TEXTBELT_API_KEY= process.env.TEXTBELT_API_KEY;

if (!TEXTBELT_API_KEY) {
  throw new Error('Missing TEXTBELT_API_KEY in environment variables.');
}


export const sendSMS = async (phone, message) => {
  try {
    console.log(`Attempting to send SMS to ${phone}`);

    const response = await axios.post(TEXTBELT_API_URL, {
      phone,
      message,
      key: TEXTBELT_API_KEY,
    });

    console.log('SMS API Response:', response.data);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to send SMS');
    }

    return {
      success: true,
      messageId: response.data.textId,
      quotaRemaining: response.data.quotaRemaining,
    };
  } catch (error) {
    console.error('SMS sending failed:', error.message);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};



export const checkSMSStatus = async()  => {
  try {
    const response = await axios.get(`https://textbelt.com/status/${textId}`, {
      params: { key: TEXTBELT_API_KEY },
    });
    return response.data;
  } catch (error) {
    console.error('Status check failed:', error.message);
    throw new Error('Failed to check SMS status');
  }
};

export default sendSMS;
