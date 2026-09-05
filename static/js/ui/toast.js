export function bindToastButtons() {
  document.querySelectorAll("[data-toast]").forEach((button) => {
    button.addEventListener("click", () => window.alert(button.dataset.toast));
  });
}
