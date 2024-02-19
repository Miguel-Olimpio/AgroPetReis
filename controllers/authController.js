import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { adminRouter } from '../routes/adminRoutes.js';
import { AdminUsers } from '../models/admin.js';
import { User } from '../models/user.js';

// criar admin com senha encriptada
// function criarAdmin(){

//     const admin = 'admin'
//     const password = '123'

//     const salt = bcrypt.genSaltSync(10)
//     const hashedpassword = bcrypt.hashSync(password, salt)

//     const user = {
//         name: admin,
//         password: hashedpassword
//     }

//     try{
//         AdminUsers.create(user)
//         console.log(`----------------------adm criado -----------------------------`)
//     }catch(err){
//         console.log(err)
//     }
// }

class AuthController {

    static async loginUser(req, res) {
        await res.render('auth/loginUser');
    }

    static async loginUserPost(req, res) {

        // criarAdmin()

        const { name, telephone } = req.body;

        // Validar se usuario existe
        const user = await User.findOne({ where: { name: name } });
        if (!user) {
            res.render('auth/loginUser', {
                message: 'Usuário não encontrado... Tente novamente',
            });
            return;
        }
        // Validar se o telefone esta correto

        if (!telephone) {
            res.render('auth/loginUser', { message: 'O telefone esta incorreto... Tente novamente' });
            return;
        }
        try {
            req.session.userid = user.id;
            console.log(req.session.userid);
            req.session.save(() => {
                res.redirect('/pets');
            });
        } catch (err) { console.log(err); }
    }

    static loginAdmin(req, res) {
        res.render('auth/loginAdm');
    }

    static async loginAdminPost(req, res) {
        const { name, password } = req.body;

        // Validar se usuario existe
        const user = await AdminUsers.findOne({ where: { name: name } });
        if (!user) {
            res.render('auth/loginAdm', { messages: 'Usuario não encontrado... Tente novamente' });
            return;
        }

        // Validar se a senha esta correta
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            res.render('auth/loginAdm', { message: 'A senha esta incorreta... Tente novamente' });
            return;
        }
        req.session.userid = user.id;
        req.session.save(() => {
            res.redirect('/allChips');
        });
    }

    static registerUser(req, res) {
        res.render('auth/registerUser');
    }

    static async registerUserPost(req, res) {
        const { name, petName, telephone, confirmTelephone } = req.body;
        // validação do telefone
        if (telephone != confirmTelephone) {
            res.render('auth/registerUser', { message: 'Os telefones não são iguais, tente novamente...' });
            return;
        }
        // checar se o usuario existe
        const checkIfUserExists = await User.findOne({ where: { [Op.or]: [{ name: name }, { telephone: telephone }] } });
        if (checkIfUserExists) {
            res.render('auth/registerUser', { message: 'Este usuario ja existe...Tente novamente...' });
            return;
        }

    // Caso nao queira iniciar com uma sql injection basta descomentar as duas linhas abaixo a primeira serve
    // para começar com o id = 50 e a segunda serve para criar o admin que será necessário descomentar a função acima
    // posteriormente basta registrar o primeiro usuario que será registrado o adm com as informações contidas na função
    // que esta fora da classe AuthController, após ambos serem criados basta comentar novamente as 2 linhas abaixo e o id do obj.

        // const id = 50
        // criarAdmin()
        
        const user = {
            name,
            petName,
            telephone: telephone,
            // id
        };
        try {
            const createdUser = await User.create(user);
            // iniciando a sessão
            req.session.userid = createdUser.id;
            req.session.save(() => {
                res.redirect('/registerPet');
            });
        } catch (err) { console.log(err); }
    }

    static async editUser(req, res) {
        const id = req.session.userid;;
        const user = await User.findOne({ where: { id: id } });
        const name = await user.name
        const telephone = await user.telephone

        res.render('auth/editUser', { name, telephone})
    }

    static async editUserPost(req, res) {
        const { name, telephone } = req.body;
        const id = req.session.userid

        const newUser = {
            name: name,
            telephone: telephone
        }

        try {
            await User.update(newUser, { where: { id: id } });
            req.flash('message', 'Dados do usuario alterados com sucesso');
            
            req.session.save(() => {
                res.redirect('/pets');
            })
            
        } catch (error) { console.log(error) }
    }

    static async logout(req, res) {
        req.session.destroy();
        res.redirect('/loginUser');
    }
}

export { AuthController };
