import { IResource } from '../api/api.interfaces';

export interface IProfile extends IResource {
    code: string;
    name: string;
    description: string;
    type: string;
}
