const User = require('../models/user');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = {

    async getAll(req, res, next) {
        try {
            const data = await User.getAll();    
            console.log(`Usuarios: ${data}`);
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los usuarios'
            });
        }
    },

    async login(req, res, next) {
        try {
            const email = req.body.email;
            const password = req.body.password;

            const myUser = await User.findByEmail(email);

            if (!myUser) {
                return res.status(401).json({
                    success: false,
                    message: 'El email no fue encontrado'
                });
            }

            if (User.isPasswordMatched(password, myUser.password)) {
                const token = jwt.sign({id: myUser.id, email: myUser.email}, keys.secretOrKey, {
                    // expiresIn: (60*60*24) // 1 HORA
                    // expiresIn: (60 * 3) // 2 MINUTO
                });
                const data = {
                    id: myUser.id,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`
                    // roles: myUser.roles
                }
                
                // await User.updateToken(myUser.id, `JWT ${token}`);

                console.log(`USUARIO ENVIADO ${data}`);

                return res.status(201).json({
                    success: true,
                    data: data,
                    message: 'El usuario ha sido autenticado'
                });
            }
            else {
                return res.status(401).json({
                    success: false,
                    message: 'La contrase??a es incorrecta'
                });
            }

        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al momento de hacer login',
                error: error
            });
        }
    },

    async register(req, res, next) {
        try {
            
            const user = req.body;
            const data = await User.create(user);

            // await Rol.create(data.id, 1); // ROL POR DEFECTO (CLIENTE)

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente, ahora inicia sesion',
                data: data.id
            });

        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro del usuario',
                error: error
            });
        }
    },
}