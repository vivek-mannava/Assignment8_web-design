const DbModel = require('../models/model');
const bcrypt = require('bcrypt');
const { json } = require('express/lib/response');


//Method to get all the data from DB //creating get
exports.controllerGet = (req, res) => {
    const posts = DbModel.find()
        .select("email password fullname")
        .then(posts => {
            res.json({ posts });
        })
        .catch(err => console.log(err));
};

//Method to Edit Data //Edit email, password by passing the id through request url
exports.controllerPut = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const fullname = req.body.fullname;

    console.log("email : ", email);
    console.log("password : ", password);
    console.log("password : ", fullname);

    let paramQuery = { _id: req.params.id }; // Reading Parameters to find out what to update

    DbModel.findOne(paramQuery).then(emailExist => { //Id Exists
        console.log({ emailExist });
        if (emailExist) {
            console.log("emailExist.email : " + emailExist.email + "emailExist.password: " + emailExist.password);
            const samePwd = bcrypt.compareSync(password, emailExist.password);
            if (emailExist.email === email) { var sameEmail = true }
            console.log("sameEmail : " + sameEmail + ", samePwd: " + samePwd);

            if (sameEmail && samePwd) {
                return res.json({ error: ["User with Same Details already Exists!"] });
            }
            else {
                DbModel.findOne({ email: req.body.email }).then(sameEmailExist => {
                    if (sameEmailExist) {
                        return res.json({ error: ["User with Same Email Id already Exists!"] });
                    }
                    else {
                        const salt = bcrypt.genSaltSync(10);
                        let password = bcrypt.hashSync(req.body.password, salt);
                        let detailsToUpdate = { email, password };

                        DbModel.findOneAndUpdate(paramQuery, detailsToUpdate).then(function (ps) {
                            DbModel.findOne(paramQuery).then(function (details) {
                                console.log("Put SuccessFul!");
                                res.json({ status: "User Edited Successfully!", details });
                            });
                        });
                    }
                });
            }

        }
        else {
            return res.json({ error: ["No Record found with the given Id!"] });
        }
    })
};

//Method to Delete by passing ID through request url
exports.controllerDelete = (req, res) => {
    let paramQuery = { _id: req.params.id } // Reading Parameters to find out what to if that record exists
    DbModel.findOne(paramQuery).then(emailExist => {
        if (emailExist) {
            DbModel.findOneAndDelete(paramQuery).then(function (ps) {
                res.json(ps);
            });
        }
        else {
            return res.json({ error: ["No Record found with the given Id!"] });
        }
    })
};


//Method to Delete by passing EmailId and Password as parameters passed in body
exports.controllerDeleteOne = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let paramQuery = { email: email }; // Reading Parameters to find out what to Delete

    DbModel.findOne(paramQuery).then(emailExist => { //Id Exists
        console.log({ emailExist });
        if (emailExist && emailExist != null) {
            console.log("emailExist.email : " + emailExist.email + "emailExist.password: " + emailExist.password);
            const samePwd = bcrypt.compareSync(password, emailExist.password);
            if (emailExist.email === email) { var sameEmail = true }
            console.log("sameEmail : " + sameEmail + ", samePwd: " + samePwd);

            if (sameEmail && samePwd) {
                DbModel.findOneAndDelete(paramQuery, function (err, _result) {
                    if (err) {
                        res.status(400).send(`Error deleting listing with id ${listingQuery}!`);
                    } else {
                        console.log(_result);
                        if (_result.deletedCount == 0) {
                            res.json({ status: "No Users Deleted!" })
                        }
                        else {
                            res.json({ status: "User Deleted Succesfully!" })
                        }
                    }
                });
            }
            else {
                return res.json({ error: ["User Not Deleted, Email and Password Combination doesn't match!"] });
            }
        }
        else {
            return res.json({ error: ["No User Found with the given Details!"] });
        }
    });
};


//Method to Insert Data //Creating DbModel 
exports.controllerPost = (req, res) => {

    const salt = bcrypt.genSaltSync(10);
    const encryptedPwd = bcrypt.hashSync(req.body.password, salt);

    const email = req.body.email;
    const password = encryptedPwd;
    const fullname = req.body.fullname;

    console.log("email : ", email);
    console.log("pwd : ", password);

    const post = new DbModel({ email, password,fullname });
    DbModel.findOne({ email: req.body.email }).then(emailExist => {
        if (emailExist) {
            return res.json({ error: ["User already exists with same Email Id!"] });
        }
        else {
            post.save((err, result) => {
                if (err) {
                    console.log("Post failed");
                    return res.status(400).send(err);
                }
                else {
                    console.log("Post Successful ");
                    return res.json({ status: "Post Executed, User Created Succesfully!" })
                }
            });
        }
    })

};