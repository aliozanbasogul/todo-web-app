class User {
  constructor(email, username, createdAt, lists) {
    this.email = email;
    this.username = username;
    this.createdAt = createdAt;
    this.lists = lists;
  }
}

export default User;