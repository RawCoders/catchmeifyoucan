export function getUser(force, message) {
  let username = localStorage.getItem("username");
  if (!username || force) {
    username = window.prompt(message || "username");
    localStorage.setItem("username", username);
  }
  return username;
}
