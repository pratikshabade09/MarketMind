export function saveChat(chat) {
  const old = JSON.parse(localStorage.getItem("chats")) || [];
  old.unshift(chat);
  localStorage.setItem("chats", JSON.stringify(old));
}

export function getChats() {
  return JSON.parse(localStorage.getItem("chats")) || [];
}