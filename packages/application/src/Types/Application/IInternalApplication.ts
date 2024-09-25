import { IGranularFunctionality } from '../IGranularFunctionality';
import { IApplication } from './IApplication';

export interface IInternalApplication extends IApplication {
    _granular_functionalities: IGranularFunctionality[];
}
