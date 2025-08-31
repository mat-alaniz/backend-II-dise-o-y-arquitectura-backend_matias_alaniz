//Objeto de transferencia de datos

export class UserDTO {
    constructor(user) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.age = user.age;
        this.role = user.role;
        this.createdAt = user.createdAt;
    }
}

export default UserDTO;