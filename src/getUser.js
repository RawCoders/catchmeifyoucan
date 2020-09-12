export function getUser() {
  let username = localStorage.getItem("username");
  if (!username) {
    username = window.prompt("username");
    localStorage.setItem("username", username);
  }
  return username;
}
