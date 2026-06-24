/**
 * @fileoverview JSON cơ sởkiểuđịnh nghĩa
 * @description định nghĩa Record-Replay V3 noiDungTiengVietsử dụngnoiDungTiengViet JSON noiDungTiengVietkiểu
 */

/** JSON thôkiểu */
export type JsonPrimitive = string | number | boolean | null;

/** JSON đối tượngkiểu */
export interface JsonObject {
  [key: string]: JsonValue;
}

/** JSON mảngkiểu */
export type JsonArray = JsonValue[];

/** noiDungTiengViet JSON noiDungTiengVietkiểu */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/** ISO 8601 ngàythời gianchuỗi */
export type ISODateTimeString = string;

/** Unix mili giâythời giannoiDungTiengViet */
export type UnixMillis = number;
