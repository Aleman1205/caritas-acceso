import type { Request } from "express";
import type { Validator } from "../../../handlers/base.js";

export default abstract class BaseValidadorRequest<T> implements Validator<T>{
    public abstract isBody(obj: Request["body"]): boolean;
    public abstract isQuery(obj: Request["query"]): boolean;
    public abstract getFiltrosQuery(obj: Request["query"]): Partial<T>;
    public abstract isParam(obj: Request["params"]): boolean;

    // Opcionales, dependiendo del contexto llave primaria simple o compuesta
    public isBodyIds?(obj: Request["body"]): boolean;
    public isBodyKeys?(obj: Request["body"]): boolean;
}