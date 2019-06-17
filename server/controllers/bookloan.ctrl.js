'use strict'
let User = require('../models/user');
let Customer = require('../models/customer');
let Book = require('../models/book');
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
module.exports={
    createBookLoan,
    editBookLoan,
    getCustomerLoans,
    findSpecificBookLoan,
    deleteBookFromLoan,
    deleteBookLoan,
    completeLoan
}

function completeLoan(req, res, next){
  let customerID = req.params.customerID;
  let bookLoanID = req.params.bookLoanID;

  Customer.findOne({ID:customerID}, function(err, foundCustomer){
    if(err){
      console.log(err);
      res.sendStatus(500);
      return;
    }

    if(!foundCustomer){
      res.sendStatus(404);
      return;
    }
    let loanIndex = 0;
    for(let i = 0; i<foundCustomer.loans.length; i++){
      if(foundCustomer.loans[i]._id == bookLoanID){
        loanIndex = i;
      }
    }
    const start = async () => {
      await asyncForEach(foundCustomer.loans[loanIndex].books, async (book) => {
        await waitFor(50);
        Book.update({barCode:book.barCode},{ $inc: { qty: book.qty } }, function(err){
          if(err){
            console.log(err);
          }
          
        });
      })
      foundCustomer.loans.splice(loanIndex,1);
      foundCustomer.save(function(err){
        if(err){
          console.log(err);
          return res.sendStatus(500);
        }
  
        return res.sendStatus(200);
      })
    }
    
    start();

  })
}

function deleteBookLoan(req, res, next){
  let customerID = req.params.customerID;
  let bookLoanID = req.params.bookLoanID;

  Customer.findOne({ID:customerID}, function(err, foundCustomer){
    if(err){
      console.log(err);
      res.sendStatus(500);
      return;
    }

    if(!foundCustomer){
      res.sendStatus(404);
      return;
    }
    let loanIndex = 0;
    for(let i = 0; i<foundCustomer.loans.length; i++){
      if(foundCustomer.loans[i]._id == bookLoanID){
        loanIndex = i;
      }
    }
    const start = async () => {
      await asyncForEach(foundCustomer.loans[loanIndex].books, async (book) => {
        await waitFor(50);
        Book.update({barCode:book.barCode},{ $inc: { qty: book.qty } }, function(err){
          if(err){
            console.log(err);
          }
          
        });
      })
      foundCustomer.loans.splice(loanIndex,1);
      foundCustomer.save(function(err){
        if(err){
          console.log(err);
          return res.sendStatus(500);
        }
  
        return res.sendStatus(200);
      })
    }
    
    start();

  })
}

function deleteBookFromLoan(req, res, next){
  let customerID = req.params.customerID;
  let bookLoanID = req.params.bookLoanID;
  let bookBarCode = req.params.bookBarCode;

  Customer.findOne({ID:customerID}).populate({ 
    path: 'loans.books.bookRef',
    model:'book'
  }).exec(function(err, foundCustomer){
      if(err){
        console.log(err);
        res.sendStatus(500);
        return
      }

      console.log(foundCustomer);
      if(!foundCustomer){
        res.sendStatus(404);
        return;
      }
      let loanIndex = 0;
      let bookIndex = 0;
      for(let i = 0; i<foundCustomer.loans.length; i++){
        if(foundCustomer.loans[i]._id == bookLoanID){
          loanIndex = i;
          for(let j = 0; j<foundCustomer.loans[i].books.length; j++){
            if(foundCustomer.loans[i].books[j].barCode == bookBarCode){
              bookIndex = j;
            }
          }
        }
      }
      Book.update({barCode:bookBarCode},{ $inc: { qty: foundCustomer.loans[loanIndex].books[bookIndex].qty } },function(err){
        if(err){
          console.log(err);
          return res.sendStatus(500);
        }
        foundCustomer.loans[loanIndex].books.splice(bookIndex,1);
        if(foundCustomer.loans[loanIndex].books.length == 0){
          foundCustomer.loans.splice(loanIndex,1);
        }
        foundCustomer.save(function(err){
          if(err){
            console.log(err);
            return res.sendStatus(500);
          }

          res.sendStatus(200);
          return;
        });
      });
  });

}

function findSpecificBookLoan(req, res, next){
  let customerID = req.params.customerID;
  let bookLoanID = req.params.bookLoanID;
  Customer.findOne({ID:customerID}).populate({ 
    path: 'loans.books.bookRef',
    model:'book'
 }).exec(function(err, foundCustomer){
    if(err){
      console.log(err);
      res.sendStatus(500);
      return
    }

    console.log(foundCustomer);
    if(!foundCustomer){
      res.sendStatus(404);
      return;
    }
    console.log(foundCustomer.loans);
    let booksOnLoan = [];
    let loan;
    for(let i = 0;i<foundCustomer.loans.length;i++){
      if(bookLoanID == foundCustomer.loans[i]._id){
        booksOnLoan = foundCustomer.loans[i].books;
        loan = foundCustomer.loans[i];
      }
    }

    if(booksOnLoan.length == 0){
      res.sendStatus(404);
      return;
    }
    console.log(booksOnLoan);
    let booksData = [];
    const start = async () => {
      await asyncForEach(booksOnLoan, async (book) => {
        await waitFor(50);
        Book.findOne({barCode:book.barCode}, function(err, foundBook){
          if(err){
              console.log(err);
              return res.sendStatus(500);
          }

          if(!foundBook){
              return res.sendStatus(404);
          }

          return booksData.push(foundBook);
      })
      });
      
      res.send(loan);
      return;
    }
    let aux = start();
  })
}

function getCustomerLoans(req, res, next){
  let customerID = req.params.customerID;

  Customer.findOne({ID:customerID}, function(err, foundCustomer){
    if(err){
      console.log(err);
      res.sendStatus(500);
      return
    }

    if(!foundCustomer){
      res.sendStatus(404);
      return;
    }
    
    res.send(foundCustomer.loans);
    return;
  })

}

function createBookLoan(req, res, next){
    const { payload: { id } } = req;
    
    return User.findById(id)
      .then((user) => {
        if(!user) {
          return res.sendStatus(400);
        }
  
        let customerID = req.body.customerID;
        let bookLoan = {
            shouldReturnAt : req.body.shouldReturnAt,
            books : req.body.books
        };
        
        if(!bookLoan.shouldReturnAt){
          console.log("here");
          return res.status(422).json({
            errors: {
              shouldReturnAt: 'is required',
            },
          });
        }

        if(!customerID){
            return res.status(422).json({
              errors: {
                customerID: 'is required',
              },
            });
          }

        Customer.findOne({ID:customerID}, function(err, foundCustomer){
            if(err){
              console.log(err);
              return res.sendStatus(500);
            }
          
            if(!foundCustomer){
              return res.sendStatus(404);
            }
            
            const start = async () => {
              await asyncForEach(bookLoan.books, async (book) => {
                await waitFor(50);
                Book.findOne({barCode:book.barCode}, function(err, foundBook){
                  if(err){
                      console.log(err);
                      return res.sendStatus(500);
                  }

                  if(!foundBook){
                      return res.sendStatus(404);
                  }
                  
                  if(((foundBook.qty - book.qty) < 0)){
                      return res.sendStatus(400);
                  }

                  foundBook.qty -= book.qty;

                  foundBook.save(function(err){
                    if(err){
                      console.log(err);
                      res.sendStatus(500);
                      return;
                    }
                  })
              })
              });

              
              let bookAux = [];
              for(let i = 0;i<bookLoan.books.length; i++){              
                    bookAux.push({
                      barCode:bookLoan.books[i].barCode,
                      qty:bookLoan.books[i].qty,
                      bookRef:bookLoan.books[i].bookRef
                    })
              } 
              foundCustomer.loans.push({
                books:bookAux,
                shouldReturnAt:bookLoan.shouldReturnAt
              });

              foundCustomer.save(function(err){
                  if(err){
                      console.log(err);
                      return res.sendStatus(500);
                  }

                  res.sendStatus(200);
              })
            }
            start();

        })
    })
}

function editBookLoan(req, res, next){
    const { payload: { id } } = req;
    
    return User.findById(id)
      .then((user) => {
        if(!user) {
          return res.sendStatus(400);
        }

        let customerID = req.params.customerID;
        let bookLoanID = req.params.bookLoanID
        let shouldReturnAt = req.body.shouldReturnAt

        if(!shouldReturnAt){
          return res.status(422).json({
            errors: {
              shouldReturnAt: 'is required',
            },
          });
        }

        Customer.findOne({ID:customerID}, function(err, foundCustomer){
            if(err){
              console.log(err);
              return res.sendStatus(500);
            }
          
            if(!foundCustomer){
              return res.sendStatus(404);
            }

            for(let i = 0; i<foundCustomer.loans.length;i++){
              if(foundCustomer.loans[i]._id == bookLoanID){
                foundCustomer.loans[i].shouldReturnAt = new Date(shouldReturnAt);
                break;
              }
            }

            foundCustomer.save(function(err){
                if(err){
                    console.log(err);
                    return res.sendStatus(500);
                }
                return res.sendStatus(200)
            })
        })
    })
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function returnBooksFromDeletion(array, item_ref){
  Book.update({barCode:book.barCode},{ $inc: { qty: book.qty } });
}