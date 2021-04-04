import successIcon from "@/utils/lightToast/icons/success.svg";
import errorIcon from "@/utils/lightToast/icons/error.svg";
import infoIcon from "@/utils/lightToast/icons/info.svg";
import "./toastStyle.css";

export const showToast = (message, status = "success", duration = 2000) => {
    let toastNode = window.document.querySelector(".toast-margin")
    let innerIcon
    if (toastNode) return
    status === "success" ? innerIcon = successIcon :
        (status === "error") ? innerIcon = errorIcon :
            innerIcon = infoIcon
    const toastMarginFrame = `<div class="toast-margin">
        <img src=${innerIcon} alt="success"/>
        <span>${message}</span>
    </div>`
    window.document.body.insertAdjacentHTML("beforeend", toastMarginFrame)
    toastNode = window.document.querySelector(".toast-margin")
    toastNode.style.marginTop = `${Math.round(toastNode.offsetHeight / 2)}px`
    setTimeout(() => {
        const toastNode = window.document.querySelector(".toast-margin")
        toastNode.parentNode.removeChild(toastNode || null)
    }, duration)
}