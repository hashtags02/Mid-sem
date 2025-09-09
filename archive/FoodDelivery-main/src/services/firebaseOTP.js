import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { auth } from '../firebase';

class FirebaseOTPService {
  constructor() {
    this.recaptchaVerifier = null;
    this.confirmationResult = null;
  }

  // Initialize reCAPTCHA verifier
  initRecaptcha(containerId, callback) {
    try {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        'size': 'invisible',
        'callback': callback,
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        }
      });
      return true;
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      return false;
    }
  }

  // Send OTP to phone number
  async sendOTP(phoneNumber, containerId) {
    try {
      // Initialize reCAPTCHA if not already done
      if (!this.recaptchaVerifier) {
        const success = this.initRecaptcha(containerId, () => {
          console.log('reCAPTCHA solved');
        });
        if (!success) {
          throw new Error('Failed to initialize reCAPTCHA');
        }
      }

      // Render reCAPTCHA
      await this.recaptchaVerifier.render();
      
      // Send OTP
      this.confirmationResult = await signInWithPhoneNumber(
        auth, 
        phoneNumber, 
        this.recaptchaVerifier
      );
      
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send OTP' 
      };
    }
  }

  // Verify OTP
  async verifyOTP(otp) {
    try {
      if (!this.confirmationResult) {
        throw new Error('No OTP confirmation result found');
      }

      const credential = PhoneAuthProvider.credential(
        this.confirmationResult.verificationId, 
        otp
      );

      const result = await signInWithCredential(auth, credential);
      
      return { 
        success: true, 
        user: result.user,
        message: 'OTP verified successfully' 
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to verify OTP' 
      };
    }
  }

  // Clear reCAPTCHA
  clearRecaptcha() {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
    this.confirmationResult = null;
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Sign out
  async signOut() {
    try {
      await auth.signOut();
      this.clearRecaptcha();
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      return { success: false, error: error.message };
    }
  }
}

export const firebaseOTPService = new FirebaseOTPService();
export default firebaseOTPService;
