document.documentElement.style.backgroundColor = {
  dark: "#333333",
  sepia: "#f4ecd8",
  light: "#ffffff",
}[
  localStorage.getItem("_txtpage_color_scheme") ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
];
