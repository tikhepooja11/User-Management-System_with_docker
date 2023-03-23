// import { UserRepository } from "../repository/user-repo";
const UserRepository = require("../repository/user-repo");
class UserService {
  constructor() {
    this.repository = new UserRepository();
  }
  register = async (user) => {
    console.log("inside registerUser() method");
    const newUser = await this.repository.register(user);
    return newUser;
  };

  findUser = async (email) => {
    console.log("inside findUser service", email);
    const user = await this.repository.findUser(email);
    return user;
  };

  userList = async () => {
    const userList = await this.repository.userList();
    return userList;
  };

  getUserDetails = async (id) => {
    const user = await this.repository.getUserDetails(id);
    return user;
  };
  getUserLocation = async (id) => {
    const locationCordinates = await this.repository.getUserLocation(id);
    return locationCordinates;
  };
  getNearByUsers = async (location) => {
    console.log("inside servie", location);
    const nearbyUsersList = await this.repository.getNearByUsers(location);
    return nearbyUsersList;
  };
}
module.exports = UserService;
