let Customer = require('../models/customer');
let User = require('../models/user');
let passport = require('passport');
//let mailer = require('../libs/mailer');

module.exports={
    createCustomer,
    editCustomer,
    findCustomer,
    getAllCustomers,
    deleteCustomer
}

function getAllCustomers(req, res, next){
  Customer.find({},function(err, allCustomers){
    if(err){
      console.log(err);
      return res.sendStatus(500);
    }
    console.log(allCustomers);
    res.send(allCustomers);
    return;
  })
}

function createCustomer(req, res, next){
    const { payload: { id } } = req;
    
    return User.findById(id)
      .then((user) => {
        if(!user) {
          return res.sendStatus(400);
        }

        let customer = {
            firstName : req.body.firstName,
            secondName : req.body.secondName,
            lastName : req.body.lastName,
            email : req.body.email,
            ID : req.body.ID
        };

        if(!customer.firstName){
          return res.status(422).json({
            errors: {
              firstName: 'is required',
            },
          });
        }

        if(!customer.secondName){
            return res.status(422).json({
              errors: {
                secondName: 'is required',
              },
            });
        }

        if(!customer.lastName){
            return res.status(422).json({
              errors: {
                lastName: 'is required',
              },
            });
        }

        if(!customer.email){
            return res.status(422).json({
              errors: {
                email: 'is required',
              },
            });
        }

        if(!customer.ID){
            return res.status(422).json({
              errors: {
                ID: 'is required',
              },
            });
        }

        Customer.findOne({ID:customer.ID}, function(err, foundCustomer){
            if(err){
              console.log(err);
              return res.sendStatus(500);
            }
          
            if(foundCustomer){
              return res.sendStatus(400);
            }
            
            newCustomer = new Customer(customer);

            newCustomer.save(function(err, savedCustomer){

                if(err){
                  console.log(err);
                  return res.sendStatus(500);
                }
            
                //mailer.confirmation_email(saved_user.email, token, saved_user.username);
            
                return res.send(200);
        
            });
        })
    })
}

function editCustomer(req, res, next){
    const { payload: { id } } = req;
    
    return User.findById(id)
      .then((user) => {
        if(!user) {
          return res.sendStatus(400);
        }

        
        let firstName = req.body.firstName;
        let secondName = req.body.secondName;
        let lastName = req.body.lastName;
        let email = req.body.email;
        let ID = req.body.ID;
        

        if(!firstName){
          return res.status(422).json({
            errors: {
              firstName: 'is required',
            },
          });
        }

        if(!secondName){
            return res.status(422).json({
              errors: {
                secondName: 'is required',
              },
            });
        }

        if(!lastName){
            return res.status(422).json({
              errors: {
                lastName: 'is required',
              },
            });
        }

        if(!email){
            return res.status(422).json({
              errors: {
                email: 'is required',
              },
            });
        }

        if(!ID){
            return res.status(422).json({
              errors: {
                ID: 'is required',
              },
            });
        }

        Customer.findOne({ID:ID}, function(err, foundCustomer){
            if(err){
              console.log(err);
              return res.sendStatus(500);
            }
          
            if(!foundCustomer){
              return res.sendStatus(404);
            }
            
            foundCustomer.firstName = req.body.firstName;
            foundCustomer.secondName = req.body.secondName;
            foundCustomer.lastName = req.body.lastName;
            foundCustomer.email = req.body.email;
            foundCustomer.ID = req.body.ID;

            foundCustomer.save(function(err, savedCustomer){

                if(err){
                  console.log(err);
                  return res.sendStatus(500);
                }
            
                //mailer.confirmation_email(saved_user.email, token, saved_user.username);
            
                return res.send(200);
        
            });
        })
    })
}

function findCustomer(req, res, next){
    const { payload: { id } } = req;
    
    return User.findById(id)
      .then((user) => {
        if(!user) {
          return res.sendStatus(400);
        }

        let ID = req.params.ID;

        Customer.findOne({ID:ID}, function(err, foundCustomer){

            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            }

            if(!foundCustomer){
                res.sendStatus(404);
                return;
            }

            res.send(foundCustomer);
            return;
        });

    });
}

function deleteCustomer(req, res, next){
  const { payload: { id } } = req;
  
  return User.findById(id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }

      let ID = req.params.ID;

      Customer.findOne({ID:ID}, function(err, foundCustomer){

          if(err){
              console.log(err);
              res.sendStatus(500);
              return;
          }

          if(!foundCustomer){
              res.sendStatus(404);
              return;
          }

          foundCustomer.remove(function(err){
            if(err){
              console.log(err);
              return res.sendStatus(500);
            }

            res.sendStatus(200);
            return;

          })
      });

  });
}