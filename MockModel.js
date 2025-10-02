
export class MockUser
{
    constructor(name, username, email, password )
    {
        this.name = name
        this.username = username
        this.email = email
        this.password = password

    }

    getPassword()
    {
        return this.password
    }
}

let usermock1 = new MockUser("jose123456764", "nose", "email12345", "12345" );
let usermock2 = new MockUser("tomasssss", "nose", "email12345", "54321" );
let usermock3 = new MockUser("fabian", "nose", "email12345", "2468" );
let usermock4 = new MockUser("napoConFrita", "nose", "email12345", "7777" );

export let UsersMock = {usermock1, usermock2, usermock3, usermock4};