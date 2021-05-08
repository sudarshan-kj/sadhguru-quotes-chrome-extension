import React from "react";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Toast.css";

const notify = (type, message) => toast[type](message);

export const notifySuccess = (message) => notify("success", message);

export const notifyError = (message) => notify("error", message);

export const notifyWarn = (message) => notify("warning", message);

export const Toast = () => (
  <ToastContainer
    transition={Slide}
    hideProgressBar
    position="bottom-center"
    autoClose={3000}
    pauseOnFocusLoss={false}
    limit={3}
    newestOnTop={true}
  />
);
