import moment from 'moment';
import querystring from 'querystring';
import { spawn } from 'child_process';
import util from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

// Obter o caminho do diretório atual do arquivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Pet } from '../models/Pets.js';
import { VeterinaryRecord } from '../models/veterinaryRecord.js';
import { Scheduling } from '../models/request.js';
import { User } from '../models/user.js';
import { formatarData, formatDate } from '../helpers/helpers.js';

function realDateFun() {
  let dataAtualMoment = moment();
  return dataAtualMoment;
}

// const setTimeoutPromise = util.promisify(setTimeout);
const caminhoPython = path.resolve(__dirname, 'whatsFunction.py');

function runPythonScript(caminho, link) {
  return new Promise((resolve, reject) => {
    const processoPython = spawn('python', [caminho, link]);

    processoPython.stdout.on('data', (dados) => {
      console.log(`Saída do script Python: ${dados}`);
    });

    processoPython.stderr.on('data', (erro) => {
      console.error(`Erro no script Python: ${erro}`);
      reject(erro);
    });

    processoPython.on('close', (codigo) => {
      console.log(`Script Python encerrado com código ${codigo}`);
      resolve();
    });
  });
}

class WhatsController {

  static async confirmDay(req, res) {
    const scheduling = await Scheduling.findAll({});
    const schedulingSize = scheduling.length;

    const realDate = formatarData(realDateFun());

    for (let i = 0; i < schedulingSize; i++) {
      const verificationDate = scheduling[i].date;
      const realVerificationDate = formatarData(verificationDate);
      const userId = scheduling[i].UserId;

      if (userId != null) {
        const user = await User.findOne({ where: { id: userId } });
        const name = await user.name;
        const hour = await scheduling[i].hour;
        const petName = await Pet.findOne({ where: { UserId: userId } });

        const telephone = user.telephone;
        const text = `Ola ${name} podemos confirmar a consulta do seu pet ${petName.PetName}, agendada para hoje as ${hour} ?
                caso a resposta seja afirmativa, não é necessário resposta, caso seja negativa,favor entrar no link e desmarcar sua 
                consulta, caso não seja possivel favor responder e justificar o motivo aqui no whatsApp, AgroPet Reis agradece.`;
        const formattedText = querystring.escape(text);

        const linkConfirmationWhats = `https://web.whatsapp.com/send?phone=55${telephone}&text=${formattedText}`;

        if (realVerificationDate === realDate) {
          try {

            await runPythonScript(caminhoPython, linkConfirmationWhats)

          } catch (e) {
            console.error(`--------------------------Erro ao chamar a função Python: ${e}------------------------`);
          }
        }
      }
    }
  }

  static async vaccineWarning(req, res) {
    const veterinaryRecord = await VeterinaryRecord.findAll({});
    const veterinaryRecordSize = veterinaryRecord.length;

    const realDate = formatarData(realDateFun());

    for (let i = 0; i < veterinaryRecordSize; i++) {
      const verificationNextAppointment = veterinaryRecord[i].nextAppointment;
      const nextAppointment = formatarData(verificationNextAppointment);
      const petId = veterinaryRecord[i].PetId

      const partes = nextAppointment.split("-");
      const valorDia = parseInt(partes[0], 10);
      const valorMes = parseInt(partes[1], 10);
      const valorMescorreto = valorMes - 1;
      const valorAno = parseInt(partes[2], 10);

      const realNextAppointment = `${valorDia}-0${valorMescorreto}-${valorAno}`

      if (realDate === realNextAppointment) {
        const pet = await Pet.findOne({ where: { id: petId } });
        const user = await User.findOne({ where: { id: pet.UserId } });
        const name = await user.name;
        const petName = await pet.PetName;
        const telephone = await user.telephone;
        const text = `Ola ${name}, somos da agro pet Reis e estamos entrando em contado pois esta na hora do seu pet ${petName} se vacinar novamente.
        Caso deseje entrar agendar a vacinação, basta acessar o link -> link...
        Para agendar a vacinação.`;
        const formattedText = querystring.escape(text);
        const linkConfirmationWhats = `https://web.whatsapp.com/send?phone=55${telephone}&text=${formattedText}`;

        try {

          await runPythonScript(caminhoPython, linkConfirmationWhats)

        } catch (e) {
          console.error(`--------------------------Erro ao chamar a função Python: ${e}------------------------`);
        }
      }
    }
  }
}

export { WhatsController };
