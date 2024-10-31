import { toast } from 'react-toastify';

const useToast = () => {
  const showToast = (type, message, options = {}) => {
    const defaultOptions = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    const mergedOptions = { ...defaultOptions, ...options };

    switch (type) {
      case 'success':
        return toast.success(message, mergedOptions);
      case 'error':
        return toast.error(message, mergedOptions);
      case 'warning':
        return toast.warn(message, mergedOptions);
      case 'info':
        return toast.info(message, mergedOptions);
      default:
        return toast(message, mergedOptions);
    }
  };

  const showCustomToast = (content, options = {}) => {
    return toast(content, options);
  };

  return { showToast, showCustomToast };
};

export default useToast;
