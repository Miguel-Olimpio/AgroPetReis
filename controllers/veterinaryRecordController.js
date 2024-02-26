import { Pet } from '../models/Pets.js';
import { VeterinaryRecord } from '../models/veterinaryRecord.js';
import { Scheduling } from '../models/request.js';
import { User } from '../models/user.js';
import moment from 'moment';
import fs from 'fs';
import officegen from 'officegen';
// import path from 'path';
import { formatarData } from '../helpers/helpers.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Obter o caminho do diretório atual do arquivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


class VeterinaryRecordController {

  static async showVeterinaryRecord(req, res) {
    const id = req.params.id;
    const userId = req.session.userid;

    try {
      // Encontra o usuário logado e seus pets associados
      const user = await User.findOne({
        where: { id: userId },
        include: {
          model: Pet,
          where: { id: id },
          include: {
            model: VeterinaryRecord,
            order: [['date', 'ASC']]
          }
        },
      });

      if (!user) {
        await req.flash('message', 'Este Pet não está cadastrado para este usuário...');
        return res.redirect(`/pets`);
      }

      const pet = user.Pets.map(result => result.dataValues);
      const petName = pet[0].PetName;

      res.render('records/veterinaryRecord', {
        user,
        petName,
        id,
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async showVeterinaryRecordDate(req, res) {
    const { id, date, petName } = req.params;
    const veterinaryRecord = await VeterinaryRecord.findOne({ where: { PetId: id, date: date } });
    const weight = veterinaryRecord.Weight;
    const report = veterinaryRecord.report;
    const revenue = veterinaryRecord.revenue;
    const convertDate = veterinaryRecord.date;
    res.render('records/veterinaryRecordDate', { weight, convertDate, report, revenue, petName });
  }

  static async registerVeterinaryRecord(req, res) {
    const requestId = req.params;
    const schedule = await Scheduling.findOne({
      where: { id: requestId.id },
      includes: User
    });

    const request = schedule.dataValues;
    const date = request.date;
    const petName = request.pet;
    const pet = await Pet.findOne({ where: { PetName: petName } });
    const petId = pet.dataValues.id;

    // Criar array com os valores dos dias (adicionando uma opção nula)
    const days = ['Dia', ...Array.from({ length: 31 }, (_, index) => index + 1)];

    // Criar array com os valores dos meses
    const months = ['Mês', ...moment.months()];

    const currentYear = moment().year();

    // Criar array com os valores dos anos (adicionando uma opção nula)
    const years = ['Ano', ...Array.from({ length: 6 }, (_, index) => currentYear + index)];

    res.render("records/registerVeterinaryRecord", {
      petId,
      date,
      petName,
      days,
      months,
      years,
    });
  }

  static async registerVeterinaryRecordPost(req, res) {
    const { date, month, day, year, weight, report, revenue, PetId, petName } = req.body;
    const Month = parseInt(month, 10);
    const realMonth = Month;
    const nextAppointment = `${year}-${realMonth}-${day}`;

    try {
      // Criar um novo registro veterinário para o pet
      await VeterinaryRecord.create({
        date,
        Weight: weight,
        report,
        revenue,
        nextAppointment,
        PetId,
      });

      await Scheduling.destroy({ where: { pet: petName, date: date } });
      await req.flash('message', 'Registro veterinário criado com sucesso!');
      return res.redirect(`/allchips`);
    } catch (error) {
      console.log(error);
      return res.redirect(`/pets`);
    }
  }

  static async editVeterinaryRecord(req, res) {
    const { id } = req.params;

    const veterinaryRecord = await VeterinaryRecord.findOne({ where: { id: id } });
    const resumeVeterinaryRecord = veterinaryRecord.dataValues;

    const pet = await Pet.findOne({ where: { id: resumeVeterinaryRecord.PetId } });
    const resumePet = pet.dataValues;

    // Criar array com os valores dos dias (adicionando uma opção nula)
    const days = ['Dia', ...Array.from({ length: 31 }, (_, index) => index + 1)];

    // Criar array com os valores dos meses
    const months = ['Mês', ...moment.months()];

    const currentYear = moment().year();

    // Criar array com os valores dos anos (adicionando uma opção nula)
    const years = ['Ano', ...Array.from({ length: 6 }, (_, index) => currentYear + index)];

    res.render('records/editVeterinaryRecord', {
      resumeVeterinaryRecord,
      resumePet,
      days,
      months,
      years,
      id,
    });
  }

  static async editVeterinaryRecordPost(req, res) {
    const id = req.body.id;
    const day = req.body.day;
    const month = req.body.month;
    const year = req.body.year;

    const nextAppointment = `${year}-${month}-${day}`;

    const veterinaryRecord = {
      Weight: req.body.Weight,
      report: req.body.report,
      revenue: req.body.revenue,
      nextAppointment: nextAppointment
    };
    try {
      await VeterinaryRecord.update(veterinaryRecord, { where: { id: id } });
      await req.flash('message', 'Registro veterinário editado com sucesso!');
      res.redirect('/allChips');
    } catch (error) { console.log(error) }
  }

  static async downloadRecipe(req, res) {
    const id = req.params.id;

    try {
      const veterinaryRecord = await VeterinaryRecord.findOne({ where: { id: id } });

      if (!veterinaryRecord) {
        return res.status(404).send('Registro veterinário não encontrado.');
      }

      const resumeVeterinaryRecord = veterinaryRecord.dataValues;
      const petId = resumeVeterinaryRecord.PetId;

      const InfoPet = await Pet.findOne({ where: { id: petId } });

      if (!InfoPet) {
        return res.status(404).send('Informações do pet não encontradas.');
      }

      const InfoUser = await User.findOne({ where: { id: InfoPet.UserId } });

      if (!InfoUser) {
        return res.status(404).send('Informações do usuário não encontradas.');
      }

      const dono = InfoUser.dataValues.name;
      const peso = resumeVeterinaryRecord.Weight;
      const nomePet = InfoPet.dataValues.PetName;
      const laudo = resumeVeterinaryRecord.report;
      const receita = resumeVeterinaryRecord.revenue;
      const data = resumeVeterinaryRecord.date;
      const dataCorreta = formatarData(data);

      // Crie um novo documento Word (.docx)
      const docx = officegen('docx');

      // Crie o conteúdo do documento com as informações
      const pObj = docx.createP();
      pObj.addText('Agro Pet Reis\n', { bold: true, underline: true });

      pObj.addText('\nInformações do Registro Veterinário', { bold: true, underline: true });

      pObj.addText('\n\nData: ');
      pObj.addText(dataCorreta);

      pObj.addText('\n\nDono: ');
      pObj.addText(dono);

      pObj.addText('\n\nPet: ');
      pObj.addText(nomePet);

      pObj.addText('\n\nPeso: ');
      pObj.addText(peso);

      pObj.addText('\n\nLaudo: ');
      pObj.addText(laudo);

      pObj.addText('\n\nReceita: ');
      pObj.addText(receita);

      // Gere o arquivo .docx em um buffer
      const buffer = await new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, '../public/docs', `veterinaryRecord.docx`); // Define o caminho do arquivo temporário
        const stream = fs.createWriteStream(filePath);

        docx.generate(stream);
        stream.on('finish', () => {
          const fileBuffer = fs.readFileSync(filePath);
          fs.unlinkSync(filePath); // Remova o arquivo temporário
          resolve(fileBuffer);
        });
        stream.on('error', reject);
      });

      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename=${dataCorreta}-${nomePet}.docx`,
      });

      // Envie o arquivo como resposta
      res.send(buffer);
    } catch (error) {
      console.error(error);
      return res.status(500).send('Ocorreu um erro ao criar o arquivo .docx.');
    }
  }
}

export { VeterinaryRecordController };
