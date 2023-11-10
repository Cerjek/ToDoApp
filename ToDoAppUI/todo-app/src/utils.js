// utils.js
export const setMessage = (message) => {
    sessionStorage.setItem("message", message);
};

export const removeMessage = () => {
  sessionStorage.removeItem("message");
}