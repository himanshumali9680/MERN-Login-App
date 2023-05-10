import UserModel from '../model/user.model.js'
import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';
import ENV from '../config.js';

/** middleware for verfiy user */
export async function verifyUser(req, res, next){
    try {
        
        const { username } = req.method == "GET" ? req.query: req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username }); 
        if(!exist) return res.status(404).send({ error: "Cant find User!"});
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"});
    }
}

/** POST: http://localhost:4001/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export async function register(req,res){
    try {
        const { username, password, profile, email } = req.body;      


        // check the existing user
        const existUsername = new Promise((resolve, reject) => {

            UserModel.findOne({ username }, function(err, user){
                if(err) reject(new Error(err))
                if(user) reject({ error : "Please use unique username"});

                resolve();
            })
        });

        // check for existing email
        const existEmail = new Promise((resolve, reject) => {
            UserModel.findOne({ email }, function(err, email){
                if(err) reject(new Error(err))
                if(email) reject({ error : "Please use unique Email"});

                resolve();
            })
        });


        Promise.all([existUsername, existEmail])
            .then(() => {
                if(password){
                    bcrypt.hash(password, 10)
                        .then( hashedPassword => {
                            
                            const user = new UserModel({
                                username,
                                password: hashedPassword,
                                profile: profile || '',
                                email
                            });

                            // return save result as a response
                            user.save()
                                .then(result => res.status(201).send({ msg: "User Register Successfully"}))
                                .catch(error1 => res.status(500).send({error1}))

                        }).catch(error2 => {
                            console.log("error2", error2)
                            return res.status(500).send({
                                error2 : "Enable to hashed password"
                            })
                        })
                }
            }).catch(error3 => {
                console.log("error3",error3)
                return res.status(500).send({ error3})
            })


    } catch (error4) {
        return res.status(500).send(error4);
    }

}

/** POST: http://localhost:4001/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req,res){
    const { username, password } = req.body;

    try {
        
        UserModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {

                        if(!passwordCheck) return res.status(400).send({ error: "Don't have Password"});

                        // create jwt token
                        const token = jwt.sign({
                                        userId: user._id,
                                        username : user.username
                                    }, ENV.JWT_SECRET , { expiresIn : "24h"});

                        return res.status(200).send({
                            msg: "Login Successful...!",
                            username: user.username,
                            token
                        });                                    

                    })
                    .catch(error1 =>{
                        console.log("error1",error1)
                        return res.status(400).send({ error1: "Password does not Match"})
                    })
            })
            .catch( error2 => {
                console.log("error2",error2)
                return res.status(404).send({ error2 : "Username not Found"});
            })

    } catch (error3) {
        console.log("error3",error3)
        return res.status(500).send({ error3});
    }
}

/** GET: http://localhost:4001/api/user/example123 */
export async function getUser(req,res){
    const { username } = req.params;

    try {
        
        if(!username) return res.status(501).send({ error: "Invalid Username"});

        UserModel.findOne({ username }, function(err, user){
            if(err) return res.status(500).send({ err });
            if(!user) return res.status(501).send({ error : "Couldn't Find the User"});

            /** remove password from user */
            // mongoose return unnecessary data with object so convert it into json
            const { password, ...rest } = Object.assign({}, user.toJSON());

            return res.status(201).send(rest);
        })

    } catch (error) {
        return res.status(404).send({ error : "Cannot Find User Data"});
    }
}

/** PUT: http://localhost:4001/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req,res){
    
    try {
        
     //const id = req.query.id;
    const { userId } = req.user;

    if(userId){
        const body = req.body;

        // update the data
        UserModel.updateOne({ _id : userId }, body, function(err, data){
            if(err) throw err;

            return res.status(201).send({ msg : "Record Updated...!"});
        })

    }else{
        return res.status(401).send({ error1 : "User Not Found...!"});
    }

} catch (error2) {
    console.log('error2' , error2)
    return res.status(401).send({ error2 });
    
}
}

export async function generateOTP(req,res){
    res.json('generateOTP route');
}

export async function verifyOTP(req,res){
    res.json('verifyOTP route');
}

export async function createResetSession(req,res){
    res.json('createResetSession route');
}

export async function resetPassword(req,res){
    res.json('resetPassword route');
}