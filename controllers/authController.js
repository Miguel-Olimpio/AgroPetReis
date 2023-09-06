const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const AdminUsers = require('../models/admin.js').AdminUsers;
const User = require('../models/user.js').User;

class AuthController {

    static async loginUser(req, res) {
        await res.render('auth/loginUser')
    }

    static async loginUserPost(req, res) {
                
        const { name, telephone } = req.body

        // Validar se usuario existe
        const user = await User.findOne({ where: { name: name } })
        if (!user) {
            res.render('auth/loginUser', {
                message: 'Usuário não encontrado... Tente novamente',
              })
            return;
        }
        // Validar se o telefone esta correto
        const telephoneMatch = bcrypt.compareSync(telephone, user.telephone)
        if (!telephoneMatch) {
            res.render('auth/loginUser', { message: 'O telefone esta incorreto... Tente novamente' });
            return;
        }
        try{
            req.session.userid = user.id
            console.log(req.session.userid)
            req.session.save(() => {
                res.redirect('/pets')
            })
        }catch(err){console.log(err)}
    }

    static loginAdmin(req, res) {
        res.render('auth/loginAdm')
    }

    static async loginAdminPost(req, res) {
        const { name, password } = req.body

        // Validar se usuario existe
        const user = await AdminUsers.findOne({ where: { name: name } });
        if (!user) {
            res.render('auth/loginAdm', { messages: 'Usuario não encontrado... Tente novamente' });
            return;
        }

        // Validar se a senha esta correta
        const passwordMatch = bcrypt.compareSync(password, user.password)
        if (!passwordMatch) {
            res.render('auth/loginAdm', { message: 'A senha esta incorreta... Tente novamente' });
            return;
        }
        req.session.userid = user.id
        req.session.save(() => {
            res.redirect('/allChips')
        })
    }

    static registerUser(req, res) {
        res.render('auth/registerUser')
    }

    static async registerUserPost(req, res) {
        const { name, petName, telephone, confirmTelephone } = req.body
        // validação do telefone
        if (telephone != confirmTelephone) {
            res.render('auth/registerUser', { message: 'Os telefones não são iguais, tente novamente...' });
            return;
        }
        // checar se o usuario existe
        const checkIfUserExists = await User.findOne({ where: { [Op.or]: [{ name: name }, { telephone: telephone }] } });
        if (checkIfUserExists) {
            res.render('auth/registerUser', { message: 'Este usuario ja existe...Tente novamente...' });
            return
        }
        // criptografar telefone
        const salt = bcrypt.genSaltSync(10)
        const hashedPhone = bcrypt.hashSync(telephone, salt)

        // Começar com o id = 50
        // const id = 50

        const user = {
            name,
            petName,
            telephone: hashedPhone,
            // id
        }
        try {
            const createdUser = await User.create(user)
            // iniciando a sessão
            req.session.userid = createdUser.id
            req.session.save(() => {
                res.redirect('/registerPet')
            })
        } catch (err) { console.log(err) }
    }

    static async logout(req, res) {
        req.session.destroy();
        res.redirect('/loginUser');
    }
}

module.exports = { AuthController }