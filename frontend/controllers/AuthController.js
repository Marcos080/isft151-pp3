export class AuthController {
  
  static async login({ name, username, email, password }) {
    try{
      const response = await fetch("../../backend/MockModel.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password })
      });
    

    const data = await response.json();
    return data;

    } catch (error){
      return { succes: false, message: "Error de conexión con el servidor"};
    }

  }
  
  static async register({ name, username, email, password }){
    try{
      const response = await fetch("../../backend/MockModel.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password })

      });

      const data = await response.json();
      return data;

    } catch (error){
      return { succes: false, message: "Error de conexión con el servidor" };
    }

  }
  


}


