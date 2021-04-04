export default (id: number|string) => {
    return window.document.getElementById(String(id))
}