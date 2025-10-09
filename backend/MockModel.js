export class MockUser {
  constructor(name, username, email, password) {
    this.name = name;
    this.username = username;
    this.email = email;
    this.password = password;
  }

  getPassword() {
    return this.password;
  }
}

// Exportamos un array de usuarios
export let UsersMock = [
  new MockUser("jose123456764", "nose", "email12345", "12345"),
  new MockUser("tomasssss", "nose", "email12345", "54321"),
  new MockUser("fabian", "nose", "email12345", "2468"),
  new MockUser("Dante Baez", "Dantoxx", "email12345", "7777"),
  
];
