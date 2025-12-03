import 'dotenv/config';
import * as joi from 'joi';

// 1. Definimos la interfaz para las variables de entorno
interface IEnvironmentVars {
    HOST: string;
    PORT: number;

    DATABASE_URL: string;
}

// 2. Definimos el esquema de validación para las variables de entorno
const envsSchema = joi.object<IEnvironmentVars>({
    HOST: joi.string().required(),
    PORT: joi.number().required(),

    DATABASE_URL: joi.string().required(),
}).unknown(true)

// Validamos las variables de entorno
const { error, value } = envsSchema.validate(process.env);

// Si hay un error, lanzamos una excepción con el mensaje de error
if (error)
    throw new Error(`Error de validación de variables de entorno: ${error}`);

// Si pasa la validación capturamos los valores de process.env completo
const environmentVars: IEnvironmentVars = value;

// Exportamos solo las variables de entorno que necesitamos
export const envVars = {
    HOST: environmentVars.HOST,
    PORT: environmentVars.PORT,
    DATABASE_URL: environmentVars.DATABASE_URL,
}