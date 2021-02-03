import { environment } from '../../environments/environment';

const url = environment.url;
export class Usuario {

    constructor(
        public nombre: string,
        public email: string,
        public password?: string,
        public img?: string,
        public google?: boolean,
        public role?: string,
        public uid?: string,
    ) {}

    get imagenUrl(): string {
        // /upload/usuarios/cno-image
        if (!this.img) {
            return `${url}/upload/usuarios/no-image`;
        } else if (this.img?.includes('https')) {
            return this.img;
        } else if (this.img) {
            return `${url}/upload/usuarios/${this.img}`;
        } else {
            return `${url}/upload/usuarios/no-image`;
        }
    }
}
