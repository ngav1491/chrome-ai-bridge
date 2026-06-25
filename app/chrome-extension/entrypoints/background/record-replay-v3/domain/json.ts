/**
 * @fileoverview JSON cơ sởkiểuđịnh nghĩa
 * @description định nghĩa Record-Replay V3 sử dụng JSON kiểu
 */

/** JSON thôkiểu */
export type JsonPrimitive = string | number | boolean | null;

/** JSON đối tượngkiểu */
export interface JsonObject {
  [key: string]: JsonValue;
}

/** JSON mảngkiểu */
export type JsonArray = JsonValue[];

/**  JSON kiểu */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/** ISO 8601 ngàythời gianchuỗi */
export type ISODateTimeString = string;

/** Unix mili giâythời gian */
export type UnixMillis = number;
