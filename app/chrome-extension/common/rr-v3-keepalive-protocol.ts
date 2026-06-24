/**
 * @fileoverview RR V3 Keepalive Protocol Constants
 * @description Shared protocol constants for Background-Offscreen keepalive communication
 */

/** Keepalive Port tên */
export const RR_V3_KEEPALIVE_PORT_NAME = 'rr_v3_keepalive' as const;

/** Keepalive tin nhắnkiểu */
export type KeepaliveMessageType =
  | 'keepalive.ping'
  | 'keepalive.pong'
  | 'keepalive.start'
  | 'keepalive.stop';

/** Keepalive tin nhắn */
export interface KeepaliveMessage {
  type: KeepaliveMessageType;
  timestamp: number;
}

/** mặc địnhheartbeatkhoảng cách（mili giây） - Offscreen noiDungTiengVietkhoảng cáchgửi ping */
export const DEFAULT_KEEPALIVE_PING_INTERVAL_MS = 20_000;

/** tối đaheartbeatkhoảng cách（mili giây）- Chrome MV3 SW noiDungTiengViet 30s noiDungTiengViet */
export const MAX_KEEPALIVE_PING_INTERVAL_MS = 25_000;
