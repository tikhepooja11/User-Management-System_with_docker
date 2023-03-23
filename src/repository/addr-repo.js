const AddressModel = require("../models/address");
export class AddressRepository {
  constructor() {
    this.model = new AddressModel();
  }
  createAddress = async (address) => {};
  getAddress = async (id) => {};
  updateAddress = async (id) => {};
  deleteAddress = async (id) => {};
}
