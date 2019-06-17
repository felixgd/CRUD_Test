'use strict'
let Book = require('../models/book');
let User = require('../models/user');
let passport = require('passport');
//let mailer = require('../libs/mailer');

module.exports={
    addBook,
    editBook,
    findBook,
    getAllBooks,
    deleteBook,
    getAllBooksReadyToLoan
}

function getAllBooksReadyToLoan(req, res, next){
      Book.find({
        qty:{
          $gt:0
        }
      }, function(err, allBooks){
        if(err){
          console.log(err);
          res.sendStatus(500);
        }
        console.log(allBooks)
        res.send(allBooks);
        return;
      })
}

function getAllBooks(req, res, next){
  Book.find({}, function(err, allBooks){
    if(err){
      console.log(err);
      res.sendStatus(500);
    }
    console.log(allBooks)
    res.send(allBooks);
    return;
  })
}

function addBook(req, res, next){
    
        let book = {
            title : req.body.title,
            barCode : req.body.barCode,
            qty : req.body.qty,
            publisher : req.body.publisher,
            author : req.body.author,
            categories : req.body.categories
        };

        if(!book.title){
          return res.status(422).json({
            errors: {
              title: 'is required',
            },
          });
        }

        if(!book.barCode){
            return res.status(422).json({
              errors: {
                barCode: 'is required',
              },
            });
        }

        if(!book.qty){
            return res.status(422).json({
              errors: {
                qty: 'is required',
              },
            });
        }

        if(!book.publisher){
            return res.status(422).json({
              errors: {
                publisher: 'is required',
              },
            });
        }

        if(!book.author){
            return res.status(422).json({
              errors: {
                author: 'is required',
              },
            });
        }

        Book.findOne({barCode:book.barCode}, function(err, foundBook){
            if(err){
              console.log(err);
              return res.sendStatus(500);
            }
          
            if(foundBook){
              return res.sendStatus(400);
            }
            
            let newBook = new Book(book);

            newBook.save(function(err, savedBook){

                if(err){
                  console.log(err);
                  return res.sendStatus(500);
                }
            
                //mailer.confirmation_email(saved_user.email, token, saved_user.usertitle);
            
                return res.send(200);
        
            });
        })
}

function editBook(req, res, next){
       
        let title = req.body.title;
        let barCode = req.body.barCode;
        let qty = req.body.qty;
        let publisher = req.body.publisher;
        let author = req.body.author;
        let categories = req.body.categories;
        

        if(!title){
          return res.status(422).json({
            errors: {
              title: 'is required',
            },
          });
        }

        if(!barCode){
            return res.status(422).json({
              errors: {
                barCode: 'is required',
              },
            });
        }

        if(!qty){
            return res.status(422).json({
              errors: {
                qty: 'is required',
              },
            });
        }

        if(!publisher){
            return res.status(422).json({
              errors: {
                publisher: 'is required',
              },
            });
        }

        if(!author){
            return res.status(422).json({
              errors: {
                author: 'is required',
              },
            });
        }

        Book.findOne({barCode:barCode}, function(err, foundBook){
            if(err){
              console.log(err);
              return res.sendStatus(500);
            }
          
            if(!foundBook){
              return res.sendStatus(404);
            }

            foundBook.title = req.body.title;
            foundBook.qty = req.body.qty;
            foundBook.publisher = req.body.publisher;
            foundBook.author = req.body.author;
            foundBook.categories = req.body.categories;

            foundBook.save(function(err, savedBook){

                if(err){
                  console.log(err);
                  return res.sendStatus(500);
                }
            
                //mailer.confirmation_email(saved_user.email, token, saved_user.usertitle);
            
                return res.send(200);
        
            });
        })
}

function findBook(req, res, next){
    const { payload: { id } } = req;
    
    return User.findById(id)
      .then((user) => {
        if(!user) {
          return res.sendStatus(400);
        }

        let bookBarCode = req.params.barCode;

        Book.findOne({barCode:bookBarCode}, function(err, foundBook){

            if(err){
                console.log(err);
                res.sendStatus(500);
            }

            if(!foundBook){
                res.sendStatus(404);
            }

            res.send(foundBook);
        });

    });
}

function deleteBook(req, res, next){
  const { payload: { id } } = req;
  
  return User.findById(id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }

      let bookBarCode = req.params.barCode;

      Book.findOne({barCode:bookBarCode}, function(err, foundBook){

          if(err){
              console.log(err);
              res.sendStatus(500);
              return;
          }

          if(!foundBook){
              res.sendStatus(404);
              return;
          }

          foundBook.remove(function(err){
            if(err){
              console.log(err);
              res.sendStatus(500);
              return;
            }

            return res.sendStatus(200);
          })
      });

  });
}