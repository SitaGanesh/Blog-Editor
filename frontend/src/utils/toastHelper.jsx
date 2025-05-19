import { toast } from 'react-toastify';

// Toast configuration options
const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
};

// Toast helper functions
export const showSuccessToast = (message) => {
  toast.dismiss(); // Dismiss any existing toasts first
  toast.success(message, toastConfig);
};

export const showErrorToast = (message) => {
  toast.dismiss(); // Dismiss any existing toasts first
  toast.error(message, toastConfig);
};

export const showInfoToast = (message) => {
  toast.dismiss(); // Dismiss any existing toasts first
  toast.info(message, toastConfig);
};

export const showWarningToast = (message) => {
  toast.dismiss(); // Dismiss any existing toasts first
  toast.warning(message, toastConfig);
};

// Function to dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

export default {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
  dismissAllToasts
};