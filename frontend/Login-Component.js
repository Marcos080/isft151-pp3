class LoginComponent extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback(){
        this.render();

        const form = this.shadowRoot.querySelector("form");
        form.addEventListener("submit", (e) => this.handleLogin(e));   
     }

     async handleLogin(event) {
        event.preventDefault();

        //se toman los valores del form
        const name = this.shadowRoot.querySelector("#name").value;
        const username = this.shadowRoot.querySelector("#username").value;
        const email = this.shadowRoot.querySelector("#email").value;
        const password = this.shadowRoot.querySelector("#password").value;

        try {
            //se llama al JSON con fetch
            const res = await fetch("User.json");
            const User = await res.json();

            //se verfica si se coincide
            const user = User.find(
                (u) => u.name === name && u.username === username && u.email === email && u.password === password
            );

            if(user){
                alert(`Bienvenido, ${user.name}`);
            } else{
                alert(`Usuario o Contraseña incorrectos`);
            } 
        } catch (error){
          console.error("Error al cargar o procesar User.json", error);
          alert("Ocurrio un error al intentar iniciar sesion. Intenta nuevamente")
        }
     }

  
    render() {
    this.shadowRoot.innerHTML = `
      <style>
        form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 250px;
        }
        input, button {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        button {
          background: #4CAF50;
          color: white;
          cursor: pointer;
        }
      </style>
      <form>
        <input type="text" id="name" placeholder="Ingrese Nombre y Apellido" required>
        <input type="text" id="username" placeholder="Ingrese usuario" required>
        <input type="text" id="email" placeholder="Ingrese Email" required>
        <input type="password" id="password" placeholder="Ingrese contraseña" required>
        <button type="submit">Ingresar</button>
      </form>
    `;
  }



}

customElements.define("login-component", LoginComponent);