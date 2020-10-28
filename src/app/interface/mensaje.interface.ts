
export interface Mensaje{
    nombre: string;
    mensaje: string;
    fecha?: number;//Opcional por eso se agrega signo de interrogación
    uid?: string; //Opcional llave del usuario(campo nombre) que mandó el mensaje
}