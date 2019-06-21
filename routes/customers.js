const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const {Customer, validate } = require('../models/customer')


//Json Parser
router.use(bodyParser.json());

//HTTP
//GET Customer
router.get("/", async (req, resp) => {
  let customers = await Customer.find();
  resp.send(customers);
});

router.get("/:id", async (req, resp) => {
  //Make sure customer exists by id:
  let customer = await Customer.findById(req.params.id);
  //If it doesnt exist, send an error:
  if (!customer) return resp.status(404).send(`Customer id: ${customer.id} doesn't exist`);
  resp.send(customer);
});

//Post Customers
router.post("/", async (req, resp) => {
  const customer = new Customer(req.body);
  //Make Sure doesnt exist by name:
  let customerExists = await Customer.findOne({name: customer.name});
  //If exists - send an error:
  if (customerExists)
    return resp.status(400).send(`Customer \"${customer.name}\" already exists`);
  //Validate:
  let { error } = validate(req.body);
  //if not valid return bad request 400:
  if (error) return resp.status(400).send(error.details);

  //if valid, add genre:
  await customer.save();

  return resp.send(customer);
});

//Put Customers
router.put("/:id", async (req, resp) => {
  let customer = req.body;
  //Validate
  let { error } = validate(customer);
  if (error) return resp.status(400).send(error.details.message);
  //Make sure genre exists by id:
  let customerCurrent = await Customer.findByIdAndUpdate(req.params.id, {name: customer.name, isGold: customer.isGold, phone: customer.phone}, {new: true});
  //If it doesnt exist, send an error:
  if (!customerCurrent)
    return resp.status(404).send(`Customer id: ${req.params.id} doesn't exist`);

  return resp.send(customerCurrent);
});

//Delete Customers
router.delete("/:id", async (req, resp) => {
  let customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer)
    return resp.status(404).send(`Customer with id ${req.params.id} not found.`);

  return resp.send(customer);
});



module.exports = router;
