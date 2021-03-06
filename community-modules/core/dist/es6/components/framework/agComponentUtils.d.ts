// Type definitions for @ag-grid-community/core v24.1.0
// Project: http://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { AgGridComponentFunctionInput, AgGridRegisteredComponentInput } from "./userComponentRegistry";
import { IComponent } from "../../interfaces/iComponent";
import { ComponentClassDef, ComponentSource } from "./userComponentFactory";
import { ICellRendererParams } from "../../rendering/cellRenderers/iCellRenderer";
import { BeanStub } from "../../context/beanStub";
export declare class AgComponentUtils extends BeanStub {
    private componentMetadataProvider;
    adaptFunction<A extends IComponent<any> & B, B, TParams>(propertyName: string, hardcodedJsFunction: AgGridComponentFunctionInput, componentFromFramework: boolean, source: ComponentSource): ComponentClassDef<A, B, TParams>;
    adaptCellRendererFunction(callback: AgGridComponentFunctionInput): {
        new (): IComponent<ICellRendererParams>;
    };
    doesImplementIComponent(candidate: AgGridRegisteredComponentInput<IComponent<any>>): boolean;
}
