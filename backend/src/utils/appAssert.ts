import { HTTP } from "../constants/http";
import Apperror from "./Apperror";
import assert from "node:assert"
export function appAssert(
    condition: any,
    httpStatusCode: HTTP,
    msg: string,
    appErrorCode?: string
  ): asserts condition {
    assert(condition, new Apperror(httpStatusCode, msg));
  }
  