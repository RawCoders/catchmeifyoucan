export function getUser(force, message) {
  let username = localStorage.getItem("username");
  if (!username || username == "null" || force) {
    username = window.prompt(message || "username");
    localStorage.setItem("username", username);
  }
  return username;
}
