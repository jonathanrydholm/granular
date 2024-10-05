import { IGranularFunctionality } from '@granular/functionality';
import { IApplication } from './IApplication';

// Private interface for decorated applications
export interface IInternalApplication extends IApplication {
    _granular_functionalities: IGranularFunctionality[];
    _granular_application_priority?: number;
    _granular_application_identifier?: string;
}
