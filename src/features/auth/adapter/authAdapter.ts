import type { LoginResponse } from '../types/loginTypes';
import type { UserInfo } from '../types/userInfoType';
import type {RegisterResponse} from "@/features/auth/types/registerTypes.ts";

export const authAdapter = {

    toUserInfo: (response: LoginResponse): UserInfo => {
        return {
            action: response.socio_info.acc,
            email: response.socio_info.correo,
            name: response.socio_info.nombre,
            occupation: response.socio_info.ocupacion
        };
    },

    toUserFromRegister: (response: RegisterResponse): UserInfo => ({
        action: response.member_details.acc,
        email: response.member_details.correo,
        name: response.member_details.nombre,
        occupation: response.member_details.ocupacion
    })
};