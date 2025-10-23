
class MockUser
{
    constructor(name, username, email, password )
    {
        this.name = name
        this.username = username
        this.email = email
        this.password = password

    }

    getName(){ return this.name; }
    getUsername(){ return this.username; }
    getEmail() {return this.email; }
    getPassword(){ return this.password; }
}

class MockPet //esto despues lo quito
{
    constructor(id, name, age, description)
    {
        this.id = id
        this.name = name
        this.age = age
        this.description = description

    }

    getName() {return this.name}
    getAge() {return this.age}
    getDescription() {return this. description}

    setName( newName ) { this.name = newName;}
    setAge( newAge ) { this.age = newAge;}
    setDescription( newDescription ) { this.description = newDescription;}
}

class MockPetModel //esto despues lo cambio por un modelo con consultas a una tabla mascotas
{
    constructor(pets)
    {
        this.pets = pets;
    }

     create(name, age, description)
    {
        let id = this.pets.length;

        let pet = new MockPet(id, name, age, description);
        this.pets.push(pet);
    }

    search(id)
    {
        for(let i = 0; i < this.pets.length; i++) 
        {
            if(this.pets[i].id == id)
            {
                return i;
            }
        }

        return null;
    }

    delete(id)
    {
        let petId = this.search(id)
        if(petId != null)
         {
            this.pets.splice(petId,1);    
         }
    }

    list()
    {
        for(let i = 0; i < this.pets.length; i++)
        {
            console.log(`${this.pets[i].name} - ${this.pets[i].age} años - ${this.pets[i].description}`);
        }
    }

    setPet(id, name, age, description)
    {
        let petId = this.search(id);
        if(petId != null)
        {
            this.pets[petId].setName(name)
            this.pets[petId].setAge(age) 
            this.pets[petId].setDescription(description)
        }
    }
    
}

class PetController
{
    constructor(petModel)
    {
        this.vista = null; //dashboard o register de mascotas 
        this.petModel = petModel
    }

    createPet(name, age, description)
    {
        this.petModel.create(name, age, description);
    }

    deletePet(id)
    {
        this.petModel.delete(id);
    }

    listPets()
    {
        this.petModel.list();
    }

    setPet(id, newName, newAge, newDescription)
    {
        this.petModel.setPet(newName, newAge, newDescription);
    }
}

 let UsersMock = [
  new MockUser("jose123456764", "nose", "email12345", "12345"),
  new MockUser("tomasssss", "nose", "email12345", "54321"),
  new MockUser("fabian", "nose", "email12345", "2468"),
  new MockUser("napoConFrita", "nose", "email12345", "7777"),
];

function main()
{

let petsMock = [
  new MockPet(0, "princesa", 300, "pitbull"),
  new MockPet(1, "tomasssss", 2, "salchicha"),
  new MockPet(2, "napoConFrita", 1, "caniche molesto"),
  new MockPet(3, "destornillador", 8, "gato"),
];

let mockModel = new MockPetModel(petsMock);
let petController = new PetController(mockModel);

petController.createPet("pizza", 9, "raton")
petController.listPets();
petController.deletePet(1)
petController.setPet(0, "nose", 2, "nose");
petController.listPets();
}

window.onload = main;