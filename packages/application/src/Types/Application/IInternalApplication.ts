import { IGranularFunctionality } from '../Functionality';
import { IApplication } from './IApplication';

export interface IInternalApplication extends IApplication {
    _granular_functionalities: IGranularFunctionality[];
    _granular_application_priority?: number;
    _granular_application_identifier?: string;
}
