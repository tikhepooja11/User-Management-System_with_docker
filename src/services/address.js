import { AddressRepository } from "../repository/addr-repo";

export class AddressService {
  constructor() {
    this.repository = new AddressRepository();
  }
  createAddress = async (address) => {};
  getAddress = async (id) => {};
  updateAddress = async (id) => {};
  deleteAddress = async (id) => {};
}
