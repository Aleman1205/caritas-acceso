import type { Request } from "express";

export default abstract class BaseValidadorRequest<T> {
    public abstract isBody(obj: Request["body"]): boolean;
    public abstract isQuery(obj: Request["query"]): boolean;
    public abstract getFiltrosQuery(obj: Request["query"]): Partial<T>;
    public abstract isParam(obj: Request["params"]): boolean;
    public abstract isBodyIds(obj: Request["body"]): boolean;
}